import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { repId, name, email, refCode } = await req.json();

  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Create profile with role = rep
  await supabaseAdmin.from("profiles").upsert({
    id: authData.user.id,
    email,
    role: "rep",
  });

  // Update rep status to approved
  await supabaseAdmin.from("reps").update({
    status: "approved",
    approved_at: new Date().toISOString(),
  }).eq("id", repId);

  // Send email via Supabase (magic link with temp password info)
  await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: "https://pipedesk.app/rep-portal",
    },
  });

  return NextResponse.json({ success: true, tempPassword });
}
