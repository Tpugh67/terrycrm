import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "hello@pipedesk.app";
// Must be an address on a domain verified in Resend. Using a subdomain
// keeps this separate from hello@ so replies don't get mixed up with
// normal customer-facing mail.
const FROM_ADDRESS = "PipeDesk Alerts <notifications@pipedesk.app>";

export async function sendAdminNotification(subject: string, html: string) {
  try {
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
