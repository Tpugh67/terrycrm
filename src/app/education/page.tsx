"use client";
import Link from "next/link";
import { useState } from "react";

const DEMO_DEALS = [
  { id: 1, title: "MBA Program - Johnson", client: "Bob Johnson", val: "$45,000", val2: "Scholarship: $5,000", stage: "Inquiry", hot: true, follow: "Overdue" },
  { id: 2, title: "Coding Bootcamp - Smith", client: "Sarah Smith", val: "$12,000", val2: "No scholarship", stage: "Consultation", hot: true, follow: "Today" },
  { id: 3, title: "Online Certificate - Davis", client: "Mike Davis", val: "$2,500", val2: "Scholarship: $500", stage: "Enrolled", hot: false, follow: "Tomorrow" },
  { id: 4, title: "Executive Training - Chen", client: "Lisa Chen Corp", val: "$8,500", val2: "Corporate sponsor", stage: "Active", hot: true, follow: "Next week" },
  { id: 5, title: "Language Program - Wilson", client: "Tom Wilson", val: "$3,200", val2: "No scholarship", stage: "Completed", hot: false, follow: "Done" },

];

const STAGES = ["Inquiry", "Consultation", "Enrolled", "Active", "Completed"];
const STAGE_COLORS: Record<string, string> = {
  "Inquiry": "bg-slate-100 text-slate-700",
  "Consultation": "bg-blue-100 text-blue-700",
  "Enrolled": "bg-yellow-100 text-yellow-700",
  "Active": "bg-orange-100 text-orange-700",
  "Completed": "bg-emerald-100 text-emerald-700",
};

export default function EducationDemoPage() {
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
          <Link href="/login?mode=signup&industry=education" className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">🎓 Schools, Tutors & Training Programs</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your student pipeline,
built for educators</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">Track students from inquiry to enrolled, manage tuition, and grow your education business.</p>
          <Link href="/login?mode=signup&industry=education" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-500 mt-4">No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LIVE DEMO — INTERACTIVE</div>
            <h2 className="text-2xl font-bold text-slate-900">This is what your pipeline looks like</h2>
            <p className="text-slate-500 mt-2">Click the stage filters — fully interactive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Students", value: String(DEMO_DEALS.length), icon: "🎓", color: "text-slate-900" },
              { label: "Pipeline Value", value: `$${(totalVal/1000).toFixed(0)}K`, icon: "💰", color: "text-indigo-600" },
              { label: "Hot Prospects", value: String(hotDeals), icon: "🔥", color: "text-red-500" },
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
                      {deal.hot && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔥 HOT</span>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage]}`}>{deal.stage}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{deal.title}</div>
                    <div className="text-sm text-slate-500">Student: {deal.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Tuition</div>
                    <div className={`text-2xl font-bold text-indigo-600`}>{deal.val}</div>
                    <div className="text-xs text-slate-400 mt-1">{deal.val2}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className={`text-xs font-medium ${deal.follow === "Overdue" ? "text-red-500" : "text-slate-400"}`}>
                    {deal.follow === "Overdue" ? "⚠️ Follow-up overdue" : `📅 Follow-up: ${deal.follow}`}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition">📞 Log Call</button>
                    <button className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg transition">💬 Log Note</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Built for your industry, not generic tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">🎓</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Student Pipeline</div>
                <div className="text-sm text-slate-500 leading-relaxed">Track every student from inquiry to completed with education-specific stages.</div>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">💰</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Tuition Tracking</div>
                <div className="text-sm text-slate-500 leading-relaxed">Track tuition value, scholarship amounts, and revenue per student.</div>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">📅</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Start Date Reminders</div>
                <div className="text-sm text-slate-500 leading-relaxed">Set enrollment deadlines and get alerts so no prospect goes cold.</div>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">📊</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Enrollment Dashboard</div>
                <div className="text-sm text-slate-500 leading-relaxed">See total students, revenue, and completion rates at a glance.</div>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">High-Value Program Alerts</div>
                <div className="text-sm text-slate-500 leading-relaxed">Large tuition programs get flagged so you prioritize the right prospects.</div>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl">📞</div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Student Activity Log</div>
                <div className="text-sm text-slate-500 leading-relaxed">Log every call, application, and note with one click.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your enrollment?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No credit card required.</p>
          <Link href="/login?mode=signup&industry=education" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
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
