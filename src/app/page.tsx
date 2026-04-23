import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Nav */}
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white text-xs font-bold">TC</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">TerryCRM</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#industries" className="hover:text-slate-900 transition">Industries</a>
          <a href="#features" className="hover:text-slate-900 transition">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition font-medium">
            Log in
          </Link>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-200">
          🚀 Built for Real Professionals · 3 Industries · 1 Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          The CRM built for<br />
          <span className="text-blue-600">your industry</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          TerryCRM gives real estate investors, insurance agents, and mortgage professionals a purpose-built pipeline — not a generic tool you have to configure yourself.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition w-full sm:w-auto text-center">
            Start your free 14-day trial
          </Link>
          <a href="#industries" className="text-slate-600 hover:text-slate-900 font-medium text-base px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 transition w-full sm:w-auto text-center">
            See the industries →
          </a>
        </div>
        <p className="text-xs text-slate-400 mt-4">No credit card required · Cancel anytime</p>

        {/* Hero stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-16 border-t border-slate-100">
          {[
            { value: "3", label: "Industries supported" },
            { value: "$29", label: "Per month to start" },
            { value: "14", label: "Day free trial" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for your industry</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Each pipeline uses the terminology, stages, and workflows that match how you actually work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real Estate */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg mb-6">RE</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real Estate</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Track wholesale deals, calculate ARV and spread, log seller activity, and move deals from New Lead to Closed with one click.
              </p>
              <div className="space-y-2 mb-8">
                {["ARV & spread calculator", "Hot deal alerts ($50K+ spread)", "5-stage pipeline", "Seller contact timeline", "Follow-up reminders"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-blue-500 font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition">
                Try Real Estate CRM →
              </Link>
            </div>

            {/* Insurance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg mb-6">IN</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Insurance</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Manage policies from first quote to closed, track renewal dates, and never miss a follow-up with automated reminders.
              </p>
              <div className="space-y-2 mb-8">
                {["Policy pipeline tracking", "Renewal date reminders", "6-stage pipeline", "Premium & coverage tracking", "Conversion rate dashboard"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-xl transition">
                Try Insurance CRM →
              </Link>
            </div>

            {/* Mortgage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg mb-6">ML</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mortgage & Lending</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Track loan applications from inquiry to funding, calculate LTV automatically, and manage your entire borrower pipeline in one place.
              </p>
              <div className="space-y-2 mb-8">
                {["LTV calculator built in", "6-stage loan pipeline", "Jumbo loan flagging", "Document request tracking", "Close date reminders"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-violet-500 font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" className="block text-center bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm py-3 rounded-xl transition">
                Try Mortgage CRM →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to close more deals</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Powerful features that work out of the box — no setup, no configuration, no consultants needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📋", title: "Visual Kanban Pipeline", desc: "Drag deals through stages with a clean board view. See your entire pipeline at a glance." },
              { icon: "📅", title: "Follow-up Reminders", desc: "Set follow-up dates on every deal. Overdue deals are flagged in red so nothing falls through." },
              { icon: "📝", title: "Activity Timeline", desc: "Every call, text, note, and stage change is logged automatically with a timestamp." },
              { icon: "⚡", title: "Quick Actions", desc: "Log a call, text, or offer with one click. No forms, no friction, just fast activity logging." },
              { icon: "🔥", title: "Hot Deal Alerts", desc: "High-value opportunities are automatically highlighted so you never miss a big deal." },
              { icon: "📊", title: "Pipeline Dashboard", desc: "See total pipeline value, spread, fees earned, and overdue follow-ups at the top of every page." },
              { icon: "👥", title: "Contact Management", desc: "Link contacts to deals and see their full history, phone, email, and company in one place." },
              { icon: "🔍", title: "Smart Filters", desc: "Filter by hot deals, overdue follow-ups, or stale deals with one click." },
              { icon: "🔒", title: "Secure & Private", desc: "Your data is yours. Every record is tied to your account — no one else can see your pipeline." },
            ].map((f) => (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, honest pricing</h2>
            <p className="text-slate-500 text-lg">Start free for 14 days. No credit card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Solo */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Solo</div>
              <div className="text-4xl font-bold text-slate-900 mb-1">$29<span className="text-lg font-normal text-slate-400">/mo</span></div>
              <div className="text-sm text-slate-400 mb-8">Perfect for independent professionals</div>
              <div className="space-y-3 mb-8">
                {[
                  "1 user",
                  "All 3 industry pipelines",
                  "Unlimited deals & contacts",
                  "Activity timeline",
                  "Follow-up reminders",
                  "Email support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" className="block text-center border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm py-3 rounded-xl transition">
                Start free trial
              </Link>
            </div>

            {/* Team */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Team</div>
              <div className="text-4xl font-bold text-white mb-1">$59<span className="text-lg font-normal text-slate-400">/mo</span></div>
              <div className="text-sm text-slate-400 mb-8">For growing teams and agencies</div>
              <div className="space-y-3 mb-8">
                {[
                  "Up to 5 users",
                  "All 3 industry pipelines",
                  "Unlimited deals & contacts",
                  "Activity timeline",
                  "Follow-up reminders",
                  "Priority support",
                  "Team activity feed",
                  "Admin controls",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition">
                Start free trial
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            Both plans include a 14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to close more deals?</h2>
          <p className="text-xl text-slate-500 mb-10">Join professionals using TerryCRM to manage their pipeline and never miss a follow-up.</p>
          <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-5 rounded-xl transition">
            Start your free 14-day trial →
          </Link>
          <p className="text-sm text-slate-400 mt-4">No credit card required · Set up in under 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center text-white text-[10px] font-bold">TC</div>
            <span className="font-bold text-slate-900">TerryCRM</span>
            <span className="text-slate-400 text-sm">· Multi-Industry CRM Platform</span>
          </div>
          <div className="text-sm text-slate-400">
            © 2026 TerryCRM · Real Estate · Insurance · Mortgage
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#industries" className="hover:text-slate-900 transition">Industries</a>
            <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
            <Link href="/login" className="hover:text-slate-900 transition">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
