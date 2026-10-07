import { NextResponse } from "next/server";

// Short branded link for sales outreach: pipedesk.app/demo
// To change where it points, edit the one address below.
const DEMO_URL = "https://your-awesome-crm-showcase.lovable.app/tour";

export function GET() {
  return NextResponse.redirect(DEMO_URL, 307);
}
