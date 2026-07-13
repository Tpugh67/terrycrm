"use client";
import Link from "next/link";
import { useState } from "react";

const DEMO_DEALS = [
  { id: 1, title: "Johnson 2024 F-150 XLT", client: "Mike Johnson", value: "Listed: $48,500", commission: "$2,400", stage: "New Lead", hot: true, followUp: "Overdue" },
  { id: 2, title: "Garcia Honda Accord Trade-In", client: "Rosa Garcia", value: "Listed: $31,200", commission: "$1,560", stage: "Test Drive", hot: true, followUp: "Today" },
  { id: 3, title: "Lee BMW X5 Fleet Order", client: "Corporate Lee", value: "Listed: $62,800", commission: "$3,140", stage: "Negotiating", hot: false, followUp: "Tomorrow" },
  { id: 4, title: "Williams Used Camry", client: "Tom Williams", value: "Listed: $24,500", commission: "$1,225", stage: "Finance", hot: true, followUp: "Next week" },
  { id: 5, title: "Brown Tesla Model 3", client: "Sandra Brown", value: "Listed: $42,000", commission: "$2,100", stage: "Delivered", hot: false, followUp: "Done" },
];

const STAGES = ["New Lead", "Test Drive", "Negotiating", "Finance", "Delivered"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-slate-100 text-slate-700",
  "Test Drive": "bg-blue-100 text-blue-700",
  "Negotiating": "bg-yellow-100 text-yellow-700",
  "Finance": "bg-purple-100 text-purple-700",
  "Delivered": "bg-emerald-100 text-emerald-700",
};

export default function AutoDemoPage() {
  const [activeStage, setActiveStage] = useState("All");
  const filtered = activeStage === "All" ? DEMO_DEALS : DEMO_DEALS.filter(d => d.stage === activeStage);
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
          <Link href="/login?mode=signup&industry=auto" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-600/30">🚗 Automotive Dealers & Sales Reps</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your auto sales pipeline,\nbuilt for car pros</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Track every buyer from test drive to delivery. Log every call and follow-up. Built for auto sales — not generic salespeople.</p>
          <Link href="/login?mode=signup&industry=auto" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-500 mt-4">Free 14-day trial · Set up in 2 minutes</p>
        </div>
      </section>
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LIVE DEMO — INTERACTIVE</div>
            <h2 className="text-2xl font-bold text-slate-900">This is what your dashboard looks like</h2>
            <p className="text-slate-500 mt-2">Click the stage filters — it is fully interactive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Deals", value: String(DEMO_DEALS.length), icon: "🚗", color: "text-slate-900" },
              { label: "Hot Prospects", value: String(hotDeals), icon: "🔥", color: "text-red-500" },
              { label: "Overdue Follow-ups", value: "1", icon: "⚠️", color: "text-red-500" },
              { label: "Closed This Month", value: "1", icon: "✅", color: "text-emerald-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={"text-3xl font-bold " + s.color}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...STAGES].map((stage) => (
              <button key={stage} onClick={() => setActiveStage(stage)} className={"px-4 py-2 rounded-lg text-sm font-semibold transition " + (activeStage === stage ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>{stage}</button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {deal.hot && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔥 HOT</span>}
                      <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + STAGE_COLORS[deal.stage]}>{deal.stage}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{deal.title}</div>
                    <div className="text-sm text-slate-500">{deal.client} · {deal.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Value</div>
                    <div className="text-xl font-bold text-blue-600">{deal.commission}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className={"text-xs font-medium " + (deal.followUp === "Overdue" ? "text-red-500" : "text-slate-400")}>
                    {deal.followUp === "Overdue" ? "⚠️ Follow-up overdue" : "📅 Follow-up: " + deal.followUp}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition">📞 Log Call</button>
                    <button className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition">📝 Add Note</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to sell more vehicles?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No charge until it ends.</p>
          <Link href="/login?mode=signup&industry=auto" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>✓ 14 days free</span><span>✓ No charge for 14 days</span><span>✓ Cancel anytime</span>
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
