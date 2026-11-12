import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readTwilioRequest } from "../../../../lib/voiceTwilio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Twilio reports the final status and length of each call here (set this
// URL as the "Status Callback URL" on the TwiML App and on the phone number).
export async function POST(req: NextRequest) {
  try {
    const p = await readTwilioRequest(req, "/api/voice/status");
    if (!p) return new NextResponse("Forbidden", { status: 403 });
    const sid = p.CallSid;
    if (!sid) return new NextResponse("ok");

    const map: Record<string, string> = {
      completed: "completed", busy: "busy", "no-answer": "no_answer", failed: "failed", canceled: "canceled",
    };
    const status = map[p.CallStatus] || p.CallStatus || "completed";
    const duration = Number(p.CallDuration);
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (Number.isFinite(duration)) patch.duration_secs = duration;
    await supabase.from("call_logs").update(patch).eq("call_sid", sid);
    return new NextResponse("ok");
  } catch (e) {
    console.error("voice status error:", e);
    return new NextResponse("error", { status: 500 });
  }
}
