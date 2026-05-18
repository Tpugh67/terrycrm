"use client";
import Link from "next/link";
import { useState } from "react";

const DEMO_DEALS = [
  { id: 1, title: "Martinez Refinance", client: "Carlos Martinez", val: "$450,000", ltv: "LTV: 78%", stage: "Inquiry", hot: true, follow: "Overdue" },
  { id: 2, title: "Thompson Purchase", client: "Amy Thompson", val: "$320,000", ltv: "LTV: 85%", stage: "Pre-Qualified", hot: true, follow: "Today" },
  { id: 3, title: "Garcia VA Loan", client: "Robert Garcia", val: "$285,000", ltv: "LTV: 100%", stage: "Application", hot: false, follow: "Tomorrow" },
  { id: 4, title: "Chen Jumbo Loan", client: "Lisa Chen", val: "$1,200,000", ltv: "LTV: 70%", stage: "Underwriting", hot: true, follow: "Next week" },
  { id: 5, title: "Wilson FHA Purchase", client: "Tom Wilson", val: "$195,000", ltv: "LTV: 96%", stage: "Funded", hot: false, follow: "Done" },
];

const STAGES = ["Inquiry", "Pre-Qualified", "Application", "Underwriting", "Funded"];
const STAGE_COLORS: Record<string, string> = {
  "Inquiry": "bg-slate-100 text-slate-700",
  "Pre-Qualified": "bg-blue-100 text-blue-700",
  "Application": "bg-indigo-100 text-indigo-700",
  "Underwriting": "bg-yellow-100 text-yellow-700",
  "Funded": "bg-emerald-100 text-emerald-700",
};

export default function MortgageDemoPage() {
  const [activeStage, setActiveStage] = useState("All");
  const filtered = activeStage === "All" ? DEMO_DEALS : DEMO_DEALS.filter(d => d.stage === activeStage);
  const totalVal = DEMO_DEALS.reduce((s, d) => s + Number(d.val.replace(/[^0-9]/g, "")), 0);
  const hotDeals = DEMO_DEALS.filter(d => d.hot).length;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition">← All industries</Link>
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
          <Link href="/login?mode=signup&industry=mortgage" className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-600/20 text-violet-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-violet-600/30">🏦 Mortgage & Lending Professionals</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your loan pipeline,<br />built for closers</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Track applications from inquiry to funding, manage LTV, and close more loans every month. Built for loan officers — not generic tools.</p>
          <Link href="/login?mode=signup&industry=mortgage" className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-500 mt-4">No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LIVE DEMO — INTERACTIVE</div>
            <h2 className="text-2xl font-bold text-slate-900">This is what your pipeline looks like</h2>
            <p className="text-slate-500 mt-2">Click the stage filters — fully interactive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Loans", value: String(DEMO_DEALS.length), icon: "🏦", color: "text-slate-900" },
              { label: "Pipeline Volume", value: `$${(totalVal/1000000).toFixed(1)}M`, icon: "💰", color: "text-violet-600" },
              { label: "Hot Files", value: String(hotDeals), icon: "🔥", color: "text-red-500" },
              { label: "Overdue Follow-ups", value: "1", icon: "⚠️", color: "text-red-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...STAGES].map((stage) => (
              <button key={stage} onClick={() => setActiveStage(stage)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeStage === stage ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>{stage}</button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {deal.hot && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔥 PRIORITY</span>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage]}`}>{deal.stage}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{deal.title}</div>
                    <div className="text-sm text-slate-500">Borrower: {deal.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Loan Amount</div>
                    <div className="text-2xl font-bold text-violet-600">{deal.val}</div>
                    <div className="text-xs text-slate-400 mt-1">{deal.ltv}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className={`text-xs font-medium ${deal.follow === "Overdue" ? "text-red-500" : "text-slate-400"}`}>
                    {deal.follow === "Overdue" ? "⚠️ Follow-up overdue" : `📅 Follow-up: ${deal.follow}`}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition">📞 Log Call</button>
                    <button className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-600 px-3 py-1.5 rounded-lg transition">📋 Request Docs</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Built for loan officers, not generic tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🏦", title: "Loan Pipeline", desc: "Track every loan from inquiry to funding with mortgage-specific stages." },
              { icon: "📊", title: "LTV Calculator", desc: "Loan-to-value ratio tracked automatically on every application." },
              { icon: "📅", title: "Close Date Tracking", desc: "Set target close dates and get alerts when loans are at risk." },
              { icon: "📋", title: "Document Tracking", desc: "Track which documents have been received and what's still needed." },
              { icon: "🔥", title: "Jumbo Loan Alerts", desc: "High-value loans get flagged so you prioritize the right files." },
              { icon: "💰", title: "Pipeline Volume", desc: "See total loan volume and origination fees at a glance." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl">{f.icon}</div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">{f.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to close more loans?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No credit card required.</p>
          <Link href="/login?mode=signup&industry=mortgage" className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>✓ 14 days free</span><span>✓ No credit card</span><span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-white">PipeDesk</span>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition">← See all 18 industries</Link>
        </div>
      </footer>
    </div>
  );
}
