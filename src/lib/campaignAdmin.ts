// The only accounts allowed to see the cross-account campaign management
// view. Enforced on the server in /api/campaign-report; the nav link in
// AppLayout is a convenience only.
export const CAMPAIGN_ADMIN_EMAILS = [
  "terry.sagittariusafunding@gmail.com",
  "moishyzeiger@gmail.com",
];

export function canSeeCampaignReports(email?: string | null) {
  return CAMPAIGN_ADMIN_EMAILS.includes((email || "").toLowerCase());
}
