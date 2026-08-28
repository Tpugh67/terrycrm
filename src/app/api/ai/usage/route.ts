import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Deliberately returns only a count and a limit -- never raw usage
// rows, per-action detail, or cost figures. Customers should see
// "how much do I have left", not a cost breakdown (see PIPE-AI-001
// Phase 3: "Do not constantly display cost information to
// customers"). This is also the only read path to ai_usage_events
// for a non-admin user, since the table itself has no RLS policy
// granting them direct access.
const MONTHLY_ALLOWANCE = 150;

function startOfCurrentMonthISO(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { count, error: countError } = await supabase
      .from("ai_usage_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userData.user.id)
      .gte("created_at", startOfCurrentMonthISO());

    if (countError) {
      console.error("Usage lookup failed:", countError);
      return NextResponse.json({ error: "Failed to load usage" }, { status: 500 });
    }

    return NextResponse.json({ used: count ?? 0, limit: MONTHLY_ALLOWANCE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load usage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
