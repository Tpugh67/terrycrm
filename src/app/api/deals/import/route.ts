import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type DealRow = Record<string, string | number | boolean | null>;

export async function POST(req: NextRequest) {
  try {
    // Previously trusted a client-supplied user_id directly, with no
    // verification the caller actually owned that id — anyone could
    // insert deals into any other user's account by simply passing a
    // different user_id in the request body. Fixed by deriving user_id
    // from a verified session token instead of trusting the request body.
    //
    // Also: this route currently has no caller anywhere in the app — the
    // real CSV import feature inserts directly via the authenticated
    // client SDK in pipeline/page.tsx, which is correctly scoped by RLS.
    // Left in place (rather than removed) as a real, secured endpoint in
    // case a future integration/API use case needs server-side import,
    // but flagging that it's currently unused.
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { deals } = await req.json();
    if (!deals || !Array.isArray(deals)) {
      return NextResponse.json({ error: "Missing or invalid deals array" }, { status: 400 });
    }

    const rows = (deals as DealRow[]).map((d) => ({ ...d, user_id: userData.user.id }));
    const { data, error } = await supabase.from("deals").insert(rows).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ imported: data?.length || 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
