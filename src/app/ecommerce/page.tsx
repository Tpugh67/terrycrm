"use client";
import Link from "next/link";
import { useState } from "react";

const DEMO_DEALS = [
  { id: 1, title: "Wholesale Electronics Deal", client: "TechBuyer Inc", val: "$12,500", cost: "$8,000", stage: "New Lead", hot: true, follow: "Overdue" },
  { id: 2, title: "Clothing Brand Partnership", client: "Fashion Forward Co", val: "$8,200", cost: "$5,500", stage: "Contacted", hot: true, follow: "Today" },
  { id: 3, title: "Home Goods Bulk Order", client: "Home Essentials LLC", val: "$15,000", cost: "$9,500", stage: "Sample Sent", hot: false, follow: "Tomorrow" },
  { id: 4, title: "Sports Equipment Deal", client: "Active Life Store", val: "$22,000", cost: "$14,000", stage: "Negotiating", hot: true, follow: "Next week" },
  { id: 5, title: "Beauty Products Launch", client: "Glow Beauty Brand", val: "$9,800", cost: "$6,200", stage: "Fulfilled", hot: false, follow: "Done" },
];

const STAGES = ["New Lead", "Contacted", "Sample Sent", "Negotiating", "Fulfilled"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-slate-100 text-slate-700",
  "Contacted": "bg-blue-100 text-blue-700",
  "Sample Sent": "bg-yellow-100 text-yellow-700",
  "Negotiating": "bg-orange-100 text-orange-700",
  "Fulfilled": "bg-emerald-100 text-emerald-700",
};

export default function EcommerceDemoPage() {
  const [activeStage, setActiveStage] = useState("All");
  const filtered = activeStage === "All" ? DEMO_DEALS : DEMO_DEALS.filter(d => d.stage === activeStage);
  const totalVal = DEMO_DEALS.reduce((s, d) => s + Number(d.val.replace(/[^0-9]/g, "")), 0);
  const totalProfit = DEMO_DEALS.reduce((s, d) => s + Number(d.val.replace(/[^0-9]/g, "")) - Number(d.cost.replace(/[^0-9]/g, "")), 0);
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
          <Link href="/login?mode=signup&industry=ecommerce" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-600/20 text-pink-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-pink-600/30">🛒 E-Commerce Stores & Brands</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your sales pipeline,<br />built for e-commerce</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Track wholesale deals, manage buyer relationships, and grow your e-commerce revenue. Built for online stores and brands — not generic tools.</p>
          <Link href="/login?mode=signup&industry=ecommerce" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-500 mt-4">No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LIVE DEMO — INTERACTIVE</div>
            <h2 className="text-2xl font-bold text-slate-900">This is what your pipeline looks like</h2>
            <p className="text-slate-500 mt-2">Click the stage filters — fully interactive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Deals", value: String(DEMO_DEALS.length), icon: "🛒", color: "text-slate-900" },
              { label: "Pipeline Revenue", value: `$${(totalVal/1000).toFixed(0)}K`, icon: "💰", color: "text-pink-600" },
              { label: "Total Profit", value: `$${(totalProfit/1000).toFixed(0)}K`, icon: "📈", color: "text-emerald-600" },
              { label: "Hot Deals", value: String(hotDeals), icon: "🔥", color: "text-red-500" },
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
                      {deal.hot && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔥 HOT DEAL</span>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage]}`}>{deal.stage}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{deal.title}</div>
                    <div className="text-sm text-slate-500">Buyer: {deal.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Order Value</div>
                    <div className="text-2xl font-bold text-pink-600">{deal.val}</div>
                    <div className="text-xs text-emerald-600 mt-1">Profit: ${Number(deal.val.replace(/[^0-9]/g,"")) - Number(deal.cost.replace(/[^0-9]/g,""))}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className={`text-xs font-medium ${deal.follow === "Overdue" ? "text-red-500" : "text-slate-400"}`}>
                    {deal.follow === "Overdue" ? "⚠️ Follow-up overdue" : `📅 Follow-up: ${deal.follow}`}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition">📞 Log Call</button>
                    <button className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-600 px-3 py-1.5 rounded-lg transition">📦 Send Sample</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Built for e-commerce, not generic tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🛒", title: "Sales Pipeline", desc: "Track every deal from first contact to fulfilled order with e-commerce stages." },
              { icon: "💰", title: "Profit Tracking", desc: "See order value, product cost, and profit margin on every single deal." },
              { icon: "📦", title: "Sample Tracking", desc: "Log when samples are sent and follow up when buyers go quiet." },
              { icon: "📊", title: "Revenue Dashboard", desc: "See total pipeline revenue, profit, and deals closed this month." },
              { icon: "🔥", title: "Hot Buyer Alerts", desc: "High-value orders get flagged so you prioritize the biggest opportunities." },
              { icon: "📞", title: "Buyer Activity Log", desc: "Log every call, email, and negotiation with one click." },
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your e-commerce revenue?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No credit card required.</p>
          <Link href="/login?mode=signup&industry=ecommerce" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
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
