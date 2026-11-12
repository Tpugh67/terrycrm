import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";
import { toE164 } from "../../../../lib/phone";
import {
  validateDestination, DEFAULT_DAILY_CALL_LIMIT, DEFAULT_DAILY_MINUTE_LIMIT,
} from "../../../../lib/voiceRules";
import { readTwilioRequest } from "../../../../lib/voiceTwilio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CAMPAIGN = "skylink";

function xml(body: string) {
  return new NextResponse(body, { status: 200, headers: { "Content-Type": "text/xml" } });
}
function refuse(message: string) {
  const r = new twilio.twiml.VoiceResponse();
  r.say(message);
  r.hangup();
  return xml(r.toString());
}

// Twilio calls this when a browser starts an outbound call. Before
// connecting we check that:
//  1. the request really came from Twilio (signature),
//  2. the caller is an authorized campaign user,
//  3. the number is a valid, approved US number,
//  4. a lead call dials only that lead's own saved number,
//  5. the number does not belong to an opted-out lead,
//  6. the user is under the daily call and minute limits.
// Every attempt, allowed or refused, is written to call_logs.
export async function POST(req: NextRequest) {
  try {
    const callerId = process.env.TWILIO_CALLER_ID;
    const p = await readTwilioRequest(req, "/api/voice/twiml");
    if (!p) return new NextResponse("Forbidden", { status: 403 });
    if (!callerId) return refuse("Calling is not set up.");

    const identity = (p.From || "").replace(/^client:/, "");
    const callSid = p.CallSid || null;
    if (!identity) return refuse("This call is not allowed.");

    const { data: profile } = await supabase
      .from("profiles").select("campaign_access").eq("id", identity).maybeSingle();
    if (!profile?.campaign_access) return refuse("This call is not allowed.");

    const dest = validateDestination(p.To);
    const log = async (status: string, dealId: number | null, number: string) => {
      await supabase.from("call_logs").insert({
        user_id: identity, deal_id: dealId, direction: "outbound",
        other_number: number, call_sid: callSid, status,
      });
    };
    if (!dest.ok) { await log("refused_number", null, (p.To || "").slice(0, 20)); return refuse("That number is not allowed."); }
    const to = dest.e164;

    // Find the lead this number belongs to (the caller's own campaign leads).
    const { data: leads } = await supabase
      .from("deals").select("id, phone, opted_out_at")
      .eq("user_id", identity).eq("campaign", CAMPAIGN).not("phone", "is", null);
    const match = (leads || []).find((l) => toE164(l.phone) === to) || null;

    const dealIdParam = p.dealId ? Number(p.dealId) : null;
    if (dealIdParam !== null) {
      // A lead call must dial that exact lead's own number.
      if (!match || match.id !== dealIdParam) { await log("refused_mismatch", null, to); return refuse("This call is not allowed."); }
    }
    if (match?.opted_out_at) { await log("refused_opted_out", match.id, to); return refuse("This contact has opted out."); }

    // Spending safeguards: rolling 24 hours.
    const callLimit = Number(process.env.VOICE_DAILY_CALL_LIMIT) || DEFAULT_DAILY_CALL_LIMIT;
    const minuteLimit = Number(process.env.VOICE_DAILY_MINUTE_LIMIT) || DEFAULT_DAILY_MINUTE_LIMIT;
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("call_logs").select("duration_secs, status")
      .eq("user_id", identity).eq("direction", "outbound").gte("created_at", since);
    const placed = (recent || []).filter((r) => !String(r.status).startsWith("refused"));
    const secs = placed.reduce((s, r) => s + (r.duration_secs || 0), 0);
    if (placed.length >= callLimit || secs / 60 >= minuteLimit) {
      await log("refused_limit", match?.id ?? null, to);
      return refuse("The daily calling limit has been reached.");
    }

    await log("initiated", match?.id ?? null, to);

    const r = new twilio.twiml.VoiceResponse();
    const dial = r.dial({ callerId, answerOnBridge: true, timeout: 30 });
    dial.number(to);
    return xml(r.toString());
  } catch (e) {
    console.error("voice twiml error:", e);
    return refuse("Sorry, the call could not be placed.");
  }
}
