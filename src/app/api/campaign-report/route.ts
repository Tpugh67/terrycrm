import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { canSeeCampaignReports } from "../../../lib/campaignAdmin";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CAMPAIGN = "skylink";
const PAGE = 1000;

// PostgREST caps each response at 1000 rows, so page through.
async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    // Only the listed accounts. Being an admin is not enough.
    if (!canSeeCampaignReports(userData.user.email)) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const { data: reps, error: repErr } = await supabase
      .from("profiles").select("id, email").eq("campaign_access", true);
    if (repErr) throw new Error(repErr.message);
    const repIds = (reps || []).map((r) => r.id);
    if (!repIds.length) return NextResponse.json({ reps: [], deals: [], notes: [], calls: [] });

    const deals = await fetchAll((from, to) =>
      supabase.from("deals")
        .select("id, user_id, title, stage, lead_source, package_preference, deal_value, recurring_revenue, closed_revenue, opted_out_at, next_follow_up, created_at, updated_at")
        .eq("campaign", CAMPAIGN).in("user_id", repIds).order("id").range(from, to));
    const dealIds = new Set(deals.map((d) => d.id));

    const since = new Date(Date.now() - 120 * 86400 * 1000).toISOString();
    const allNotes = await fetchAll((from, to) =>
      supabase.from("notes")
        .select("id, deal_id, user_id, content, created_at, channel, outcome")
        .in("user_id", repIds).gte("created_at", since).order("id").range(from, to));
    const notes = allNotes.filter((n) => dealIds.has(n.deal_id));

    const calls = await fetchAll((from, to) =>
      supabase.from("call_logs")
        .select("id, user_id, deal_id, direction, other_number, status, duration_secs, outcome, created_at")
        .in("user_id", repIds).gte("created_at", since).order("id").range(from, to));

    return NextResponse.json({ reps, deals, notes, calls });
  } catch (e) {
    console.error("campaign-report error:", e);
    return NextResponse.json({ error: "Could not load report" }, { status: 500 });
  }
}
