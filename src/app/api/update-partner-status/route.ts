import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateRefCode(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return slug + Math.floor(Math.random() * 900 + 100);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    const { data: callerProfile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (callerProfile?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { partnerType, status, repId, applicationId, name, email } = await req.json() as {
      partnerType: "rep" | "affiliate";
      status: "approved" | "rejected" | "pending";
      repId?: string;
      applicationId?: string;
      name?: string;
      email?: string;
    };

    let finalRepId = repId;

    if (partnerType === "rep") {
      if (!repId) return NextResponse.json({ error: "repId required for rep updates" }, { status: 400 });
      await supabase.from("reps").update({ status, approved_at: status === "approved" ? new Date().toISOString() : null }).eq("id", repId);
    } else {
      if (!applicationId || !name || !email) {
        return NextResponse.json({ error: "applicationId, name, and email required for affiliate updates" }, { status: 400 });
      }
      await supabase.from("affiliate_applications").update({ status }).eq("id", applicationId);

      if (status === "approved") {
        const { data: existing } = await supabase.from("reps").select("id").eq("email", email).maybeSingle();
        if (existing) {
          finalRepId = existing.id;
          await supabase.from("reps").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", existing.id);
        } else {
          const { data: created } = await supabase.from("reps").insert({
            name, email,
            ref_code: generateRefCode(name),
            status: "approved",
            partner_type: "affiliate",
            approved_at: new Date().toISOString(),
          }).select("id").single();
          finalRepId = created?.id;
        }
      }
    }

    if (status === "approved" && email) {
      await supabase.from("profiles").update({ role: partnerType }).eq("email", email);
    } else if ((status === "rejected" || status === "pending") && email) {
      await supabase.from("profiles").update({ role: "user" }).eq("email", email);
    }

    return NextResponse.json({ success: true, repId: finalRepId });
  } catch (err) {
    console.error("update-partner-status error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
