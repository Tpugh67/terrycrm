import { Resend } from "resend";

const ADMIN_EMAIL = "hello@pipedesk.app";
// Must be an address on a domain verified in Resend. Using a subdomain
// keeps this separate from hello@ so replies don't get mixed up with
// normal customer-facing mail.
const FROM_ADDRESS = "PipeDesk Alerts <notifications@pipedesk.app>";

export async function sendAdminNotification(subject: string, html: string) {
  return sendEmail(ADMIN_EMAIL, subject, html);
}

/**
 * Generic send — used wherever an email needs to go to someone other
 * than the PipeDesk team (e.g. a rep's approval magic link). Shares the
 * same lazy-construction and error-swallowing behavior as
 * sendAdminNotification for the same reasons documented there.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("sendEmail skipped: RESEND_API_KEY not set");
      return;
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("sendEmail failed:", err);
  }
}
