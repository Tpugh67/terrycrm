import twilio from "twilio";
import { NextRequest } from "next/server";

// Verifies that a webhook really came from Twilio (signed with the
// subaccount's Auth Token) and returns its form fields.
export async function readTwilioRequest(req: NextRequest, path: string): Promise<Record<string, string> | null> {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return null;
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k] = String(v); });
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://pipedesk.app";
  const signature = req.headers.get("x-twilio-signature") || "";
  return twilio.validateRequest(authToken, signature, `${base}${path}`, params) ? params : null;
}
