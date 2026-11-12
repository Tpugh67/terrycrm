import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";
import { toE164 } from "../../../../lib/phone";

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

// Twilio calls this when a browser starts a call. Before connecting we
// check that (1) the request really came from Twilio, (2) the caller owns
// the lead, (3) the lead has not opted out, and (4) the number dialed is
// the lead's own saved number. Anything else is refused.
export async function POST(req: NextRequest) {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const callerId = process.env.TWILIO_CALLER_ID;
    if (!authToken || !callerId) return refuse("Calling is not set up.");

    const form = await req.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => { params[k] = String(v); });

    const base = process.env.NEXT_PUBLIC_APP_URL || "https://pipedesk.app";
    const signature = req.headers.get("x-twilio-signature") || "";
    if (!twilio.validateRequest(authToken, signature, `${base}/api/voice/twiml`, params)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const identity = (params.From || "").replace(/^client:/, "");
    const dealId = Number(params.dealId);
    const to = toE164(params.To);
    if (!identity || !Number.isFinite(dealId) || !to) return refuse("This call is not allowed.");

    const { data: profile } = await supabase
      .from("profiles").select("campaign_access").eq("id", identity).maybeSingle();
    if (!profile?.campaign_access) return refuse("This call is not allowed.");

    const { data: deal } = await supabase
      .from("deals").select("phone, opted_out_at, user_id, campaign").eq("id", dealId).maybeSingle();
    if (!deal || deal.user_id !== identity || deal.campaign !== CAMPAIGN) return refuse("This call is not allowed.");
    if (deal.opted_out_at) return refuse("This contact has opted out.");
    if (toE164(deal.phone) !== to) return refuse("This call is not allowed.");

    const r = new twilio.twiml.VoiceResponse();
    const dial = r.dial({ callerId, answerOnBridge: true, timeout: 30 });
    dial.number(to);
    return xml(r.toString());
  } catch (e) {
    console.error("voice twiml error:", e);
    return refuse("Sorry, the call could not be placed.");
  }
}
