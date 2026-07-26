import Link from "next/link";

const SECTIONS = [
  {
    href: "/sales-marketing/scripts",
    icon: "📞",
    title: "Sales Scripts",
    description: "Real call scripts for cold outreach, gatekeepers, voicemail, referrals, and closing.",
  },
  {
    href: "/sales-marketing/email-templates",
    icon: "✉️",
    title: "Email Templates",
    description: "Ready-to-send outreach, follow-up, and re-engagement email templates.",
  },
  {
    href: "/sales-marketing/social-media",
    icon: "📱",
    title: "Social Media",
    description: "Post copy and content ideas for promoting PipeDesk across social channels.",
  },
  {
    href: "/sales-marketing/battle-cards",
    icon: "⚔️",
    title: "Battle Cards",
    description: "Head-to-head comparisons against competitors, with talking points that win deals.",
  },
  {
    href: "/sales-marketing/objections",
    icon: "💬",
    title: "Objection Library",
    description: "Common objections prospects raise, and proven responses to handle them.",
  },
  {
    href: "/sales-marketing/demo-guide",
    icon: "🖥️",
    title: "Demo Guide",
    description: "A step-by-step walkthrough for running a great PipeDesk product demo.",
  },
  {
    href: "/sales-marketing/downloads",
    icon: "📥",
    title: "Downloads",
    description: "Brochures, one-pagers, and other assets to share with prospects.",
  },
  {
    href: "/sales-marketing/faq",
    icon: "❓",
    title: "FAQ",
    description: "Answers to the questions prospects and customers ask most often.",
  },
];

export default function SalesMarketingOverviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🚀 Sales & Marketing Center</h1>
        <p className="text-slate-600 mt-1">
          Everything you need to sell PipeDesk — scripts, templates, competitive intel, and answers, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md hover:-translate-y-0.5 transition block"
          >
            <div className="text-3xl mb-3">{section.icon}</div>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
