"use client";
import Link from "next/link";

const PARTNER_TYPES = [
  {
    color: "border-blue-500 hover:bg-blue-50",
    badge: "bg-blue-600",
    icon: "🤝",
    title: "Sales Representative",
    subtitle: "I Want To Sell PipeDesk",
    description: "Earn 30% recurring commission on every customer you close. Work remotely, set your own schedule, and build a growing monthly income.",
    perks: ["30% recurring monthly commission", "Free CRM access", "Sales training provided", "Unique referral link"],
    cta: "Apply as Sales Rep",
    href: "/reps",
    ctaColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    color: "border-emerald-500 hover:bg-emerald-50",
    badge: "bg-emerald-600",
    icon: "📣",
    title: "Affiliate Partner",
    subtitle: "I Want To Promote PipeDesk",
    description: "Share your referral link with your audience and earn recurring commissions. Perfect for bloggers, influencers, consultants, and content creators.",
    perks: ["20% recurring commission", "Marketing assets provided", "AI content assistant", "Real-time analytics"],
    cta: "Join Affiliate Program",
    href: "/affiliate/apply",
    ctaColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    color: "border-amber-500 hover:bg-amber-50",
    badge: "bg-amber-500",
    icon: "🏢",
    title: "Agency Partner",
    subtitle: "I Have Clients",
    description: "Resell PipeDesk to your clients under your agency brand. White-label options available. Earn revenue share on every client you manage.",
    perks: ["25% revenue share", "White-label options", "Dedicated account manager", "Priority support"],
    cta: "Apply as Agency Partner",
    href: "/agency/apply",
    ctaColor: "bg-amber-500 hover:bg-amber-600",
  },
  {
    color: "border-purple-500 hover:bg-purple-50",
    badge: "bg-purple-600",
    icon: "⚙️",
    title: "Technology Partner",
    subtitle: "I Want To Integrate My Software",
    description: "Build integrations, plugins, and workflows on top of PipeDesk. Join our technology ecosystem and reach thousands of businesses.",
    perks: ["API access", "Co-marketing opportunities", "Partner badge", "Early feature access"],
    cta: "Coming Soon",
    href: "#",
    ctaColor: "bg-purple-400 cursor-not-allowed",
    disabled: true,
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition">← Back to home</Link>
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
          <Link href="/login?mode=signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-600/30">
            🤝 PipeDesk Partner Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Grow with PipeDesk.<br />Earn recurring income.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-6">
            Join hundreds of partners earning monthly recurring commissions by selling, promoting, or integrating PipeDesk — the multi-industry CRM built for 18 business types.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
            <span>✓ Free to join</span>
            <span>✓ Recurring commissions</span>
            <span>✓ Real-time tracking</span>
            <span>✓ Monthly payouts</span>
          </div>
        </div>
      </section>

      {/* Partner type cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose your partnership type</h2>
            <p className="text-slate-500 text-lg">Select the option that best describes how you want to work with PipeDesk.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PARTNER_TYPES.map((p) => (
              <div key={p.title} className={"border-2 rounded-2xl p-8 transition cursor-pointer " + p.color}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-3xl">{p.icon}</span>
                    <div className={"inline-block ml-3 text-xs font-bold text-white px-3 py-1 rounded-full " + p.badge}>
                      {p.subtitle}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{p.description}</p>
                <ul className="space-y-2 mb-8">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                {p.disabled ? (
                  <button disabled className={"w-full text-white font-bold py-3 rounded-xl text-sm " + p.ctaColor}>
                    {p.cta}
                  </button>
                ) : (
                  <Link href={p.href} className={"block w-full text-center text-white font-bold py-3 rounded-xl text-sm transition " + p.ctaColor}>
                    {p.cta} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "18", label: "Industries Served" },
              { value: "30%", label: "Max Commission Rate" },
              { value: "$29+", label: "Starting Plan Price" },
              { value: "Monthly", label: "Payout Schedule" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Partner FAQ</h2>
          <div className="space-y-6">
            {[
              { q: "Is it free to join?", a: "Yes — all partner programs are completely free to join. No upfront costs, no monthly fees." },
              { q: "When do I get paid?", a: "Commissions are paid monthly. You need to reach the minimum payout threshold of $50 before receiving payment." },
              { q: "Can I be both a Sales Rep and an Affiliate?", a: "Yes. You can apply for multiple partner types and earn commissions from each program." },
              { q: "How is my referral tracked?", a: "Each partner receives a unique referral link. When someone signs up through your link, the referral is automatically tracked and attributed to you." },
              { q: "What happens if a customer cancels?", a: "Commissions are recurring — meaning if a customer cancels their subscription, you stop earning commission for that customer." },
            ].map((item) => (
              <div key={item.q} className="border border-slate-200 rounded-xl p-6">
                <div className="font-bold text-slate-900 mb-2">{item.q}</div>
                <div className="text-slate-500 text-sm leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start earning?</h2>
          <p className="text-slate-400 text-lg mb-8">Join the PipeDesk Partner Program today — free to join, no commitment required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reps" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition">
              Become a Sales Rep →
            </Link>
            <Link href="/affiliate/apply" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition">
              Join as Affiliate →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-white">PipeDesk</span>
          </div>
          <span className="text-sm text-slate-500">Questions? Email hello@pipedesk.app</span>
        </div>
      </footer>
    </div>
  );
}
