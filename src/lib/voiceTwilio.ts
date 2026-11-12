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
  const signature = req.headers.get("x-twilio-signature") || "";
  // Twilio signs the exact URL it called. The site is served at www, and the bare
  // domain redirects there, so accept either host (plus any configured base URL).
  const bases = Array.from(new Set([
    process.env.NEXT_PUBLIC_APP_URL,
    "https://www.pipedesk.app",
    "https://pipedesk.app",
  ].filter((b): b is string => !!b).map((b) => b.replace(/\/+$/, ""))));
  const ok = bases.some((b) => twilio.validateRequest(authToken, signature, `${b}${path}`, params));
  return ok ? params : null;
}
