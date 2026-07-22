import Link from "next/link";

const SECTIONS = [
  { href: "/sales-marketing/scripts", icon: "📞", title: "Sales Scripts", desc: "Cold call, voicemail, and objection-handling scripts ready to use on your next call." },
  { href: "/sales-marketing/email-templates", icon: "✉️", title: "Email Templates", desc: "Cold outreach, follow-up, and breakup emails you can copy and send today." },
  { href: "/sales-marketing/social-media", icon: "📱", title: "Social Media", desc: "Ready-to-post captions and content ideas across Facebook, LinkedIn, and X." },
  { href: "/sales-marketing/battle-cards", icon: "⚔️", title: "Battle Cards", desc: "How PipeDesk stacks up against HubSpot, Salesforce, and other competitors." },
  { href: "/sales-marketing/objections", icon: "💬", title: "Objection Library", desc: "Confident, short responses to the objections you'll hear most often." },
  { href: "/sales-marketing/demo-guide", icon: "🖥️", title: "Demo Guide", desc: "A step-by-step walkthrough for giving a demo that actually closes." },
  { href: "/sales-marketing/downloads", icon: "📥", title: "Downloads", desc: "Brochures, pricing sheets, and brand assets to share with prospects." },
  { href: "/sales-marketing/faq", icon: "❓", title: "FAQ", desc: "Answers to common questions about the rep and affiliate program." },
];

export default function SalesMarketingCenterPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🚀 Sales & Marketing Center</h1>
        <p className="text-slate-600 mt-1">
          Everything you need to start selling PipeDesk today — scripts, templates,
          battle cards, and training, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition block"
          >
            <div className="text-3xl mb-3">{section.icon}</div>
            <h2 className="text-lg font-semibold mb-1">{section.title}</h2>
            <p className="text-sm text-slate-600">{section.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
