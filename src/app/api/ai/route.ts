import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Previously completely unauthenticated and unmetered -- anyone on the
// internet could POST arbitrary prompts and this would forward every
// one of them to Anthropic on PipeDesk's own API key, with no session
// check and no cost controls. Fixed with a dual mode:
//   - A valid session (DealAI, Rep Portal, Affiliate dashboard, all
//     real in-app authenticated surfaces) gets normal access, subject
//     to a monthly allowance and a short-term rate limit (below).
//   - No session (the Help Center's public AI search, a genuinely
//     public marketing feature that can't require login without
//     defeating its purpose) gets a strict per-IP rate limit instead
//     of being authenticated or metered at all.
const ANONYMOUS_LIMIT = 5;
const ANONYMOUS_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const anonymousRequestLog = new Map<string, number[]>();

function checkAnonymousRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (anonymousRequestLog.get(ip) || []).filter((t) => now - t < ANONYMOUS_WINDOW_MS);
  if (timestamps.length >= ANONYMOUS_LIMIT) {
    anonymousRequestLog.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  anonymousRequestLog.set(ip, timestamps);
  return true;
}

// PIPE-AI-001 Phase 1/2/5: safety circuit breakers for authenticated
// usage. There is currently no team/account/tenant table in the
// schema (confirmed by direct inspection) -- every profiles.id is its
// own billing account -- so user_id IS the correct ownership key for
// both the monthly allowance and the usage log below. If a real
// multi-seat account model is added later, this should be revisited
// to attribute usage to the account rather than the individual user.
const MONTHLY_ALLOWANCE = 150;
const VALID_FEATURES = ["deal_assistant", "help_center", "rep_portal", "affiliate"];

// Short-term abuse guard, separate from the monthly allowance above
// and from the anonymous IP limiter. This isn't about cost -- it's
// about catching a runaway frontend retry loop or a scripted hammer
// before it burns through a user's whole monthly allowance in
// seconds. 10 requests/minute is well above any realistic human click
// rate on this UI (every action requires an explicit button click and
// a wait for a response) but low enough to stop a tight loop fast.
// Same in-memory-Map caveat as the anonymous limiter: resets on cold
// start and isn't shared across serverless instances -- a real but
// acceptable limitation for a circuit breaker, not a precise
// enforcement tool.
const AUTH_RATE_LIMIT = 10;
const AUTH_RATE_WINDOW_MS = 60 * 1000; // 1 minute
const authRequestLog = new Map<string, number[]>();

function checkAuthRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = (authRequestLog.get(userId) || []).filter((t) => now - t < AUTH_RATE_WINDOW_MS);
  if (timestamps.length >= AUTH_RATE_LIMIT) {
    authRequestLog.set(userId, timestamps);
    return false;
  }
  timestamps.push(now);
  authRequestLog.set(userId, timestamps);
  return true;
}

// Confirmed current -- and per Anthropic's own pricing page, now
// permanent -- Claude Sonnet 5 API pricing as of Aug 2026: $2/M input
// tokens, $10/M output tokens. Revisit if Anthropic changes pricing.
const INPUT_COST_PER_TOKEN = 2 / 1_000_000;
const OUTPUT_COST_PER_TOKEN = 10 / 1_000_000;

function startOfCurrentMonthISO(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    let userId: string | null = null;

    if (token) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
      userId = userData.user.id;
    } else {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      if (!checkAnonymousRateLimit(ip)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later, or sign up for full access." },
          { status: 429 }
        );
      }
    }

    const { prompt, feature, action_id } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "A prompt is required" }, { status: 400 });
    }

    if (userId) {
      if (!feature || !VALID_FEATURES.includes(feature)) {
        return NextResponse.json({ error: "A valid feature is required" }, { status: 400 });
      }

      if (!checkAuthRateLimit(userId)) {
        return NextResponse.json(
          { error: "You're sending requests too quickly. Please wait a moment and try again." },
          { status: 429 }
        );
      }

      const { count, error: countError } = await supabase
        .from("ai_usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfCurrentMonthISO());

      if (countError) {
        // Fail open on a metering-infrastructure error rather than
        // blocking a paying customer's AI feature because our own
        // usage table had a transient issue.
        console.error("Usage count check failed:", countError);
      } else if ((count ?? 0) >= MONTHLY_ALLOWANCE) {
        return NextResponse.json(
          {
            error: "You've reached your included AI usage for this month. Your allowance resets next month. Additional AI capacity is coming soon.",
            usageLimitReached: true,
          },
          { status: 403 }
        );
      }
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return NextResponse.json({ error: "AI request failed" }, { status: 502 });
    }
    const text = data.content?.[0]?.text || "No response generated.";

    // Only log usage for a request that actually reached and was
    // processed by the model -- auth failures, rate-limit rejections,
    // monthly-cap rejections, and Anthropic errors never reach here.
    if (userId) {
      const inputTokens = data.usage?.input_tokens ?? null;
      const outputTokens = data.usage?.output_tokens ?? null;
      const estimatedCost =
        inputTokens != null && outputTokens != null
          ? inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN
          : null;

      const { error: insertError } = await supabase.from("ai_usage_events").insert({
        user_id: userId,
        feature,
        action_id: action_id || null,
        provider: "anthropic",
        model: "claude-sonnet-5",
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        estimated_cost_usd: estimatedCost,
      });
      if (insertError) {
        console.error("Failed to log AI usage:", insertError);
      }
    }

    return NextResponse.json({ result: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
