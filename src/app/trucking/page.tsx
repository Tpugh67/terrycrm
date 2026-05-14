"use client";
import Link from "next/link";
import { useState } from "react";

const DEMO_DEALS = [
  { id: 1, title: "Chicago to Dallas Load", client: "ABC Shipping Co", val: "$3,500", cost: "$2,800", stage: "Available Load", hot: true, follow: "Overdue" },
  { id: 2, title: "Miami to Atlanta Freight", client: "XYZ Logistics", val: "$2,800", cost: "$2,200", stage: "Booked", hot: false, follow: "Today" },
  { id: 3, title: "LA to Phoenix Haul", client: "West Coast Goods", val: "$1,900", cost: "$1,500", stage: "Dispatched", hot: true, follow: "Tomorrow" },
  { id: 4, title: "NYC to Boston Express", client: "East Coast Supply", val: "$1,200", cost: "$900", stage: "In Transit", hot: false, follow: "Next week" },
  { id: 5, title: "Houston to Denver Load", client: "Southern Freight", val: "$4,200", cost: "$3,300", stage: "Invoiced", hot: false, follow: "Done" },
];

const STAGES = ["Available Load", "Booked", "Dispatched", "In Transit", "Invoiced"];
const STAGE_COLORS: Record<string, string> = {
  "Available Load": "bg-slate-100 text-slate-700",
  "Booked": "bg-blue-100 text-blue-700",
  "Dispatched": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-orange-100 text-orange-700",
  "Invoiced": "bg-emerald-100 text-emerald-700",
};

export default function TruckingDemoPage() {
  const [activeStage, setActiveStage] = useState("All");
  const filtered = activeStage === "All" ? DEMO_DEALS : DEMO_DEALS.filter(d => d.stage === activeStage);
  const totalVal = DEMO_DEALS.reduce((s, d) => s + Number(d.val.replace(/[^0-9]/g, "")), 0);
  const totalProfit = DEMO_DEALS.reduce((s, d) => s + Number(d.val.replace(/[^0-9]/g, "")) - Number(d.cost.replace(/[^0-9]/g, "")), 0);

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
          <Link href="/login?mode=signup&industry=trucking" className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-800/30 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-800/40">🚛 Trucking & Logistics Companies</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your load pipeline,<br />built for carriers</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Track loads from available to invoiced, manage shippers, and maximize your profit per mile. Built for trucking companies — not generic tools.</p>
          <Link href="/login?mode=signup&industry=trucking" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-500 mt-4">No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LIVE DEMO — INTERACTIVE</div>
            <h2 className="text-2xl font-bold text-slate-900">This is what your load board looks like</h2>
            <p className="text-slate-500 mt-2">Click the stage filters — fully interactive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Loads", value: String(DEMO_DEALS.length), icon: "🚛", color: "text-slate-900" },
              { label: "Total Revenue", value: `$${(totalVal/1000).toFixed(1)}K`, icon: "💰", color: "text-blue-700" },
              { label: "Total Profit", value: `$${(totalProfit/1000).toFixed(1)}K`, icon: "📈", color: "text-emerald-600" },
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
                      {deal.hot && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔥 HOT LOAD</span>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage]}`}>{deal.stage}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{deal.title}</div>
                    <div className="text-sm text-slate-500">Shipper: {deal.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Load Rate</div>
                    <div className="text-2xl font-bold text-blue-700">{deal.val}</div>
                    <div className="text-xs text-emerald-600 mt-1">Profit: ${Number(deal.val.replace(/[^0-9]/g,"")) - Number(deal.cost.replace(/[^0-9]/g,""))}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className={`text-xs font-medium ${deal.follow === "Overdue" ? "text-red-500" : "text-slate-400"}`}>
                    {deal.follow === "Overdue" ? "⚠️ Follow-up overdue" : `📅 Follow-up: ${deal.follow}`}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition">📞 Call Shipper</button>
                    <button className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition">🚛 Update Status</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Built for carriers, not generic tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🚛", title: "Load Pipeline", desc: "Track every load from available to invoiced with trucking-specific stages." },
              { icon: "💰", title: "Profit Tracking", desc: "See load rate, carrier cost, and profit margin on every single load." },
              { icon: "📅", title: "Delivery Tracking", desc: "Set delivery dates and get alerts when loads are running behind." },
              { icon: "📊", title: "Revenue Dashboard", desc: "See total revenue, profit, and loads delivered this month at a glance." },
              { icon: "🔥", title: "High-Value Load Alerts", desc: "Loads with the best margins get flagged so you prioritize the right freight." },
              { icon: "📞", title: "Shipper Log", desc: "Log every call, email, and update with one click. Full history on every shipper." },
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to maximize your load profits?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No credit card required.</p>
          <Link href="/login?mode=signup&industry=trucking" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
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
