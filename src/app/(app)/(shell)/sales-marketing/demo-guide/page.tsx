type Step = {
  number: number;
  title: string;
  talkTrack: string;
  whatToShow: string;
};

const STEPS: Step[] = [
  {
    number: 1,
    title: "Dashboard",
    talkTrack: "Start here so they see the big picture first. \"This is your Dashboard — at a glance you can see total pipeline value, deals by stage, and what needs attention today.\"",
    whatToShow: "Point out the KPI cards (Win Rate, Avg Deal Size, New This Week) and the AI insight card.",
  },
  {
    number: 2,
    title: "Contacts",
    talkTrack: "\"Every lead and customer lives here. You can import your existing list with a CSV — nothing manual.\"",
    whatToShow: "Show the contact list view and, if relevant, do a quick live CSV import if they've brought their own list.",
  },
  {
    number: 3,
    title: "Pipeline",
    talkTrack: "\"This is where the real work happens — your deals, organized by stage, specific to how [their industry] actually sells.\"",
    whatToShow: "Click into one deal card. Point out the stage-specific fields (e.g. ARV/Offer for real estate, Policy Type for insurance) that a generic CRM wouldn't have out of the box.",
  },
  {
    number: 4,
    title: "Tasks",
    talkTrack: "\"Nothing falls through the cracks — every follow-up is tracked here, tied back to the actual deal.\"",
    whatToShow: "Show a task tied to a deal, and how completing it updates the timeline.",
  },
  {
    number: 5,
    title: "AI Assistant",
    talkTrack: "\"This is the part people usually get most excited about.\" Open a deal card, click AI Assistant. \"It can draft a follow-up email, suggest the next best action, or give you an honest read on deal health — all grounded in the real notes and numbers on this specific deal, not generic guesses.\"",
    whatToShow: "Actually run one action live — \"Suggest next action\" tends to land well because it's fast and clearly specific to the deal.",
  },
  {
    number: 6,
    title: "Reports",
    talkTrack: "\"For anyone managing a team, this is where you see real performance — win rates, rep activity, pipeline health, without needing to build a spreadsheet yourself.\"",
    whatToShow: "Show the Analytics page, especially anything relevant to their team size (solo vs. multi-user).",
  },
  {
    number: 7,
    title: "Pricing",
    talkTrack: "\"Plans start at $29/month, every feature included — no add-ons, no 'contact sales' surprises. There's also a 14-day free trial, so there's no risk starting today.\"",
    whatToShow: "Have the pricing page open in a tab, ready to go.",
  },
  {
    number: 8,
    title: "Close",
    talkTrack: "\"Based on everything we walked through, does this feel like something that'd actually help [specific pain point they mentioned earlier]? If so, there's no reason not to start the free trial today — want me to get you set up right now?\"",
    whatToShow: "Have the signup flow ready to go if they say yes — don't make them wait or follow up later to start.",
  },
];

export default function DemoGuidePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🖥️ Demo Guide</h1>
        <p className="text-slate-600 mt-1">A step-by-step walkthrough for giving a demo that actually closes.</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => (
          <div key={step.number} className="bg-white rounded-2xl shadow p-6 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
              {step.number}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">{step.title}</h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-2">{step.talkTrack}</p>
              <p className="text-xs text-slate-500">
                <span className="font-semibold">What to show:</span> {step.whatToShow}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
