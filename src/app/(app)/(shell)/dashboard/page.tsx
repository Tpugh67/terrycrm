"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import Link from "next/link";

type Deal = { id: number; title: string; stage: string; arv?: string; amount?: string; next_follow_up?: string; updated_at?: string; created_at?: string; };

function parseMoney(v?: string) { return Number((v || "").replace(/[^0-9.-]+/g, "")) || 0; }
function fmtShort(n: number) { if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`; if (n >= 1_000) return `$${Math.round(n / 1_000)}K`; return `$${n}`; }
function isOverdue(d?: string) { if (!d) return false; return new Date(d) < new Date(new Date().toDateString()); }
function fmtDate(d?: string) { if (!d) return ""; return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

const INDUSTRIES = [
  { href: "/real-estate", code: "RE", label: "Real Estate", color: "bg-blue-600" },
  { href: "/insurance", code: "IN", label: "Insurance", color: "bg-emerald-600" },
  { href: "/mortgage", code: "ML", label: "Mortgage", color: "bg-violet-600" },
  { href: "/auto", code: "AU", label: "Automotive", color: "bg-red-600" },
  { href: "/solar", code: "SO", label: "Solar", color: "bg-yellow-500" },
  { href: "/financial", code: "FI", label: "Financial", color: "bg-blue-700" },
  { href: "/legal", code: "LG", label: "Legal", color: "bg-slate-700" },
  { href: "/recruiting", code: "RC", label: "Recruiting", color: "bg-indigo-600" },
  { href: "/healthcare", code: "HC", label: "Healthcare", color: "bg-cyan-600" },
  { href: "/construction", code: "CO", label: "Construction", color: "bg-orange-600" },
  { href: "/consulting", code: "CN", label: "Consulting", color: "bg-purple-600" },
  { href: "/ecommerce", code: "EC", label: "E-Commerce", color: "bg-pink-600" },
  { href: "/property-management", code: "PM", label: "Property Mgmt", color: "bg-teal-600" },
  { href: "/trucking", code: "TR", label: "Trucking", color: "bg-blue-800" },
  { href: "/dental", code: "DT", label: "Dental", color: "bg-sky-500" },
  { href: "/fitness", code: "FW", label: "Fitness", color: "bg-green-600" },
  { href: "/nonprofit", code: "NP", label: "Nonprofit", color: "bg-rose-600" },
  { href: "/education", code: "ED", label: "Education", color: "bg-indigo-600" },
];

export default function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserEmail(user.email || "");
      const { data } = await supabase.from("deals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setDeals(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalPipeline = deals.reduce((s, d) => s + parseMoney(d.arv), 0);
  const closedDeals = deals.filter(d => d.stage?.toLowerCase().includes("closed won") || d.stage?.toLowerCase().includes("completed") || d.stage?.toLowerCase().includes("placed") || d.stage?.toLowerCase().includes("invoiced"));
  const closedRevenue = closedDeals.reduce((s, d) => s + parseMoney(d.arv), 0);
  const overdueDeals = deals.filter(d => isOverdue(d.next_follow_up));
  const recentDeals = deals.slice(0, 5);
  const firstName = userEmail.split("@")[0].split(".")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading your dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, {displayName} 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your pipeline today.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Deals", value: String(deals.length), sub: "across all pipelines", icon: "🔀", color: "blue" },
          { label: "Pipeline Value", value: fmtShort(totalPipeline), sub: "active deals", icon: "💰", color: "green" },
          { label: "Closed Revenue", value: fmtShort(closedRevenue), sub: "won deals", icon: "✅", color: "emerald" },
          { label: "Overdue", value: String(overdueDeals.length), sub: "need attention", icon: "⚠️", color: "red" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color === "red" ? "bg-red-50 text-red-600" : s.color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{s.label}</span>
            </div>
            <div className={`text-3xl font-bold ${s.color === "red" && overdueDeals.length > 0 ? "text-red-500" : s.color === "emerald" ? "text-emerald-600" : "text-slate-900"}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Overdue follow-ups */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-2"><span>⚠️</span> Overdue Follow-ups</div>
            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">{overdueDeals.length}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {overdueDeals.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                <div className="text-3xl mb-2">✅</div>
                All caught up — no overdue follow-ups!
              </div>
            ) : overdueDeals.slice(0, 5).map((d) => (
              <div key={d.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{d.title}</div>
                  <div className="text-xs text-red-500 mt-0.5">Due {fmtDate(d.next_follow_up)}</div>
                </div>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-medium">{d.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent deals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-2"><span>🕐</span> Recent Deals</div>
            <Link href="/pipeline" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDeals.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                <div className="text-3xl mb-2">📋</div>
                No deals yet — add your first deal!
              </div>
            ) : recentDeals.map((d) => (
              <div key={d.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{d.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{fmtDate(d.created_at)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700">{fmtShort(parseMoney(d.arv))}</div>
                  <div className="text-[10px] text-slate-400">{d.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry quick access */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="font-bold text-slate-900">🏭 Your 18 Industry Pipelines</div>
          <div className="text-xs text-slate-400 mt-0.5">Click any industry to open its pipeline</div>
        </div>
        <div className="p-4 grid grid-cols-3 md:grid-cols-6 gap-2">
          {INDUSTRIES.map((ind) => (
            <Link key={ind.href} href={ind.href} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition group">
              <div className={`w-10 h-10 rounded-xl ${ind.color} flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition`}>{ind.code}</div>
              <span className="text-[10px] text-slate-500 text-center leading-tight group-hover:text-slate-800">{ind.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      {deals.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
          <span className="text-3xl">🚀</span>
          <div>
            <div className="font-bold text-blue-900">Welcome to PipeDesk!</div>
            <div className="text-sm text-blue-700 mt-1">Get started by clicking any industry pipeline above and adding your first deal. It takes less than 30 seconds.</div>
            <Link href="/real-estate" className="inline-block mt-3 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add your first deal →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
