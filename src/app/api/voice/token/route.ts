import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hands the signed-in campaign user a short-lived token that lets their
// browser place calls through Twilio. Nobody else gets one.
export async function GET(req: NextRequest) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles").select("campaign_access").eq("id", userData.user.id).maybeSingle();
    if (!profile?.campaign_access) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;
    if (!accountSid || !apiKeySid || !apiKeySecret || !appSid || !process.env.TWILIO_CALLER_ID) {
      return NextResponse.json({ error: "Calling is not set up yet." }, { status: 503 });
    }

    const AccessToken = twilio.jwt.AccessToken;
    const at = new AccessToken(accountSid, apiKeySid, apiKeySecret, { identity: userData.user.id, ttl: 3600 });
    at.addGrant(new AccessToken.VoiceGrant({ outgoingApplicationSid: appSid, incomingAllow: false }));
    return NextResponse.json({ token: at.toJwt() });
  } catch (e) {
    console.error("voice token error:", e);
    return NextResponse.json({ error: "Could not start calling" }, { status: 500 });
  }
}
