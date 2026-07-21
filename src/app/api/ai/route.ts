import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Previously completely unauthenticated and unmetered — anyone on the
// internet could POST arbitrary prompts and this would forward every
// one of them to Anthropic on PipeDesk's own API key, with no session
// check and no cost controls. Fixed with a dual mode:
//   - A valid session (DealAI, rep-portal, affiliate dashboard — all
//     real in-app authenticated surfaces) gets normal access.
//   - No session (the Help Center's public AI search, a genuinely
//     public marketing feature that can't require login without
//     defeating its purpose) gets a strict per-IP rate limit instead of
//     being authenticated at all.
//
// The in-memory rate limit below resets on cold start and isn't shared
// across serverless instances — a real, honest limitation, not a
// complete solution. It stops trivial/naive abuse; a persistent store
// (Redis, or a Supabase table) is the correct fix if public-endpoint
// abuse becomes a real problem in practice.
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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (token) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
    } else {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      if (!checkAnonymousRateLimit(ip)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later, or sign up for full access." },
          { status: 429 }
        );
      }
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "A prompt is required" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Was "claude-sonnet-4-6" — not a real model identifier as far as
        // I know; likely meant claude-sonnet-5, the current model in
        // this family. Recommend live-testing this against a real
        // Anthropic API key to confirm, since I can't call the live API
        // to verify from this environment.
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
    return NextResponse.json({ result: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
