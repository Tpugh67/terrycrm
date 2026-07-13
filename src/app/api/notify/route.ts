import { NextRequest, NextResponse } from "next/server";
import { sendAdminNotification } from "../../../lib/email";

type NotifyType = "signup" | "rep_application" | "affiliate_application";

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json() as { type: NotifyType; data: Record<string, string> };

    let subject = "";
    let html = "";

    switch (type) {
      case "signup":
        subject = `🎉 New PipeDesk signup: ${data.email}`;
        html = `
          <h2>New trial signup</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Industry:</strong> ${data.industry || "not specified"}</p>
          <p><strong>Referred by:</strong> ${data.referredBy || "none — organic signup"}</p>
        `;
        break;

      case "rep_application":
        subject = `🤝 New sales rep application: ${data.name}`;
        html = `
          <h2>New sales rep application</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "not provided"}</p>
          <p><strong>LinkedIn:</strong> ${data.linkedin || "not provided"}</p>
          <p>Review at <a href="https://pipedesk.app/admin/reps">pipedesk.app/admin/reps</a></p>
        `;
        break;

      case "affiliate_application":
        subject = `📣 New affiliate application: ${data.name}`;
        html = `
          <h2>New affiliate application</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Platform:</strong> ${data.platform || "not provided"}</p>
          <p><strong>Audience:</strong> ${data.audience || "not provided"}</p>
        `;
        break;

      default:
        return NextResponse.json({ error: "Unknown notification type" }, { status: 400 });
    }

    await sendAdminNotification(subject, html);
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("notify route error:", err);
    // Notifications are non-critical — don't fail the caller's flow.
    return NextResponse.json({ sent: false });
  }
}
