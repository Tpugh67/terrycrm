import { Resend } from "resend";

const ADMIN_EMAIL = "hello@pipedesk.app";
// Must be an address on a domain verified in Resend. Using a subdomain
// keeps this separate from hello@ so replies don't get mixed up with
// normal customer-facing mail.
const FROM_ADDRESS = "PipeDesk Alerts <notifications@pipedesk.app>";

export async function sendAdminNotification(subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      // Not configured yet — skip silently rather than crash. The Resend
      // constructor throws on a missing key, and constructing it at module
      // scope would take down the entire build (Next.js evaluates route
      // modules during "collect page data"), not just this one feature.
      console.error("sendAdminNotification skipped: RESEND_API_KEY not set");
      return;
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    // Never let a notification failure break the calling flow (signup,
    // rep application, payment, etc.) — just log it.
    console.error("sendAdminNotification failed:", err);
  }
}
