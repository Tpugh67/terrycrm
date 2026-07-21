import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Previously had no authentication at all — anyone who found this URL
  // could create a real Supabase account with an approved "rep" role for
  // any email address, and the response handed back the generated
  // temporary password directly. Fixed by requiring a valid admin
  // session, same pattern as /api/admin-stats.
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { repId, name, email } = await req.json();
  if (!repId || !email) {
    return NextResponse.json({ error: "repId and email are required" }, { status: 400 });
  }

  const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 });
  }

  await supabaseAdmin.from("profiles").upsert({
    id: authData.user.id,
    email,
    role: "rep",
  });

  await supabaseAdmin.from("reps").update({
    status: "approved",
    approved_at: new Date().toISOString(),
  }).eq("id", repId);

  // Previously generated a magic link and discarded it without ever
  // sending it anywhere — the rep had no real way to receive access.
  // Also no longer returns tempPassword in the API response; the rep
  // gets in via the magic link, not a password handed back over HTTP.
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://pipedesk.app/rep-portal" },
  });

  if (!linkError && linkData?.properties?.action_link) {
    await sendEmail(
      email,
      "You're approved as a PipeDesk sales rep",
      `<h2>Welcome to the PipeDesk rep program${name ? `, ${name}` : ""}!</h2>
       <p>Your application has been approved. Click below to access your rep portal:</p>
       <p><a href="${linkData.properties.action_link}">Access your rep portal</a></p>`
    );
  } else {
    console.error("approve-rep: failed to generate/send magic link", linkError);
  }

  return NextResponse.json({ success: true });
}
