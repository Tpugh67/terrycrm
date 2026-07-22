"use client";
import { useState } from "react";

type EmailTemplate = {
  id: string;
  category: string;
  subject: string;
  body: string;
};

const TEMPLATES: EmailTemplate[] = [
  {
    id: "cold-email",
    category: "Cold Outreach",
    subject: "Quick question about your CRM setup",
    body: `Hi {{first_name}},

I work with {{industry}} businesses on how they track leads and follow-ups — most either use spreadsheets or a generic CRM that doesn't quite fit how {{industry}} companies actually sell.

Quick question: how's your team currently keeping track of your pipeline?

If it feels like more admin work than it should, worth a 15-minute look at PipeDesk — it's built specifically around {{industry}} workflows, not a one-size-fits-all pipeline.

Open to a quick call this week?

Best,
{{your_name}}`,
  },
  {
    id: "first-follow-up",
    category: "Follow-Up",
    subject: "Following up — {{company_name}}",
    body: `Hi {{first_name}},

Wanted to follow up on my note last week about PipeDesk. No worries if the timing isn't right — just didn't want it to get buried.

If it's helpful, here's a quick 2-minute overview of how it works for {{industry}} teams: [link]

Happy to answer any questions whenever it's convenient.

Best,
{{your_name}}`,
  },
  {
    id: "second-follow-up",
    category: "Follow-Up",
    subject: "One more try — {{company_name}}",
    body: `Hi {{first_name}},

I know inboxes get busy, so I'll keep this short. Still think PipeDesk could genuinely help {{company_name}} keep better track of leads and follow-ups.

If now isn't the right time, totally understand — just let me know and I won't keep following up. If it is, happy to find 15 minutes whenever works.

Best,
{{your_name}}`,
  },
  {
    id: "breakup-email",
    category: "Follow-Up",
    subject: "Should I close your file?",
    body: `Hi {{first_name}},

I've reached out a few times about PipeDesk and haven't heard back, so I don't want to keep cluttering your inbox.

If the timing's just not right, no problem at all — I'll close things out on my end. But if you're still interested and things have just been busy, just reply "later" and I'll check back in a couple months instead.

Either way, wishing you and {{company_name}} the best.

Best,
{{your_name}}`,
  },
  {
    id: "appointment-confirmation",
    category: "Scheduling",
    subject: "Confirmed: Our call on {{date}}",
    body: `Hi {{first_name}},

Great — confirming our call for {{date}} at {{time}}. Here's the link: {{meeting_link}}

I'll walk through how PipeDesk works specifically for {{industry}} teams and answer any questions you've got. Should take about 15-20 minutes.

See you then,
{{your_name}}`,
  },
  {
    id: "demo-reminder",
    category: "Scheduling",
    subject: "Reminder: Your PipeDesk demo is tomorrow",
    body: `Hi {{first_name}},

Quick reminder — our call is set for tomorrow at {{time}}. Here's the link again: {{meeting_link}}

If anything's come up and you need to reschedule, just let me know and we'll find another time that works.

Talk soon,
{{your_name}}`,
  },
  {
    id: "thank-you",
    category: "Post-Sale",
    subject: "Welcome to PipeDesk, {{first_name}}!",
    body: `Hi {{first_name}},

Thanks so much for signing up — really excited to have {{company_name}} on board.

A few quick things to get you started:
- Your login: {{login_link}}
- Quick setup guide: {{setup_guide_link}}
- If you ever need help, just reach out to {{help_email}}

Looking forward to seeing how PipeDesk helps your team.

Best,
{{your_name}}`,
  },
  {
    id: "customer-referral",
    category: "Referral",
    subject: "Quick favor?",
    body: `Hi {{first_name}},

Glad to hear PipeDesk's been working well for {{company_name}}! Quick favor to ask — do you know anyone else in {{industry}} who might benefit from a tool like this?

If you send someone our way and they sign up, there's a referral bonus in it for you. No pressure at all, just thought I'd ask.

Best,
{{your_name}}`,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

export default function EmailTemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  function copyTemplate(template: EmailTemplate) {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">✉️ Email Templates</h1>
        <p className="text-slate-600 mt-1">
          Copy, replace the <span className="font-mono bg-slate-200 px-1 rounded text-xs">{"{{merge_fields}}"}</span>, and send.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={"px-4 py-1.5 rounded-full text-sm font-semibold transition " + (activeCategory === cat ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-200")}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((template) => (
          <div key={template.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{template.category}</span>
                <h2 className="text-lg font-semibold">{template.subject}</h2>
              </div>
              <button
                onClick={() => copyTemplate(template)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                {copiedId === template.id ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {template.body}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
