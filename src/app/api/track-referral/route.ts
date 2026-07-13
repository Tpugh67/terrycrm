import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS. Never expose this key to the browser.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, refCode } = await req.json();

    if (!userId || !refCode) {
      return NextResponse.json({ error: "userId and refCode required" }, { status: 400 });
    }

    // Only attribute to approved reps.
    const { data: rep, error: repError } = await supabase
      .from("reps")
      .select("id")
      .eq("ref_code", refCode)
      .eq("status", "approved")
      .maybeSingle();

    if (repError || !rep) {
      // Not a valid/approved ref code — no attribution, not an error state
      // for the signup flow itself.
      return NextResponse.json({ attributed: false });
    }

    await supabase.from("profiles").update({ referred_by: refCode }).eq("id", userId);

    const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // Avoid duplicate pending rows if this route is ever called twice for
    // the same user (e.g. retry).
    const { data: existing } = await supabase
      .from("rep_commissions")
      .select("id")
      .eq("user_id", userId)
      .eq("rep_id", rep.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("rep_commissions").insert({
        rep_id: rep.id,
        user_id: userId,
        month,
        status: "pending",
      });
    }

    return NextResponse.json({ attributed: true, repId: rep.id });
  } catch (err) {
    console.error("track-referral error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
