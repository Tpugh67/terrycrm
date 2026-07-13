import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ role: "user" });
    }

    // If this email was already approved as a rep/affiliate/agency before
    // they ever created a login, give them the right role immediately
    // instead of the default "user" — otherwise they'd land in the
    // customer dashboard instead of their partner portal.
    const { data: partner } = await supabase
      .from("reps")
      .select("partner_type")
      .eq("email", email)
      .eq("status", "approved")
      .maybeSingle();

    return NextResponse.json({ role: partner?.partner_type || "user" });
  } catch (err) {
    console.error("resolve-signup-role error:", err);
    return NextResponse.json({ role: "user" });
  }
}
