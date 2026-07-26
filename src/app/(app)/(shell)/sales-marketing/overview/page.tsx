import { redirect } from "next/navigation";

// The nav's "Overview" link points at /sales-marketing itself, not this
// subfolder — this route only exists so an old/typed link to
// /sales-marketing/overview doesn't 404. Redirect to the real page.
export default function SalesMarketingOverviewRedirect() {
  redirect("/sales-marketing");
}
