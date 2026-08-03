"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import Link from "next/link";

type Deal = { id: number; title: string; stage: string; arv?: string; amount?: string; next_follow_up?: string; updated_at?: string; created_at?: string; };
type DemoDeal = { id: number; title: string; stage: string; arv: string; created_offset_days: number; follow_up_offset_days: number | null; };
type DemoTask = { id: number; title: string; due_offset_days: number; status: string; };

function parseMoney(v?: string) { return Number((v || "").replace(/[^0-9.-]+/g, "")) || 0; }
function fmtShort(n: number) { if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`; if (n >= 1_000) return `$${Math.round(n / 1_000)}K`; return `$${n}`; }
function fmtFull(n: number) { return `$${Math.round(n).toLocaleString("en-US")}`; }
function isOverdue(d?: string) { if (!d) return false; return new Date(d) < new Date(new Date().toDateString()); }
function isToday(d?: string) { if (!d) return false; return new Date(d).toDateString() === new Date().toDateString(); }
function fmtDate(d?: string) { if (!d) return ""; return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function offsetFromToday(offsetDays: number) { const d = new Date(); d.setDate(d.getDate() + offsetDays); return d.toISOString(); }

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);
  const [demoTasksDueToday, setDemoTasksDueToday] = useState(0);
  const [demoTotalDeals, setDemoTotalDeals] = useState(0);
  const [toggling, setToggling] = useState(false);

  const useDemo = demoModeEnabled && isAdmin;

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserEmail(user.email || "");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const admin = profile?.role === "admin";
    setIsAdmin(admin);

    let demoOn = false;
    if (admin) {
      const { data: settings } = await supabase.from("demo_mode_settings").select("enabled").eq("id", 1).single();
      demoOn = settings?.enabled || false;
    }
    setDemoModeEnabled(demoOn);

    if (admin && demoOn) {
      const [{ data: demoDeals }, { data: demoTasks }] = await Promise.all([
        supabase.from("demo_deals").select("*"),
        supabase.from("demo_tasks").select("*").eq("status", "open"),
      ]);
      const mapped: Deal[] = (demoDeals || []).map((d: DemoDeal) => ({
        id: d.id,
        title: d.title,
        stage: d.stage,
        arv: d.arv,
        next_follow_up: d.follow_up_offset_days !== null ? offsetFromToday(d.follow_up_offset_days) : undefined,
        created_at: offsetFromToday(-d.created_offset_days),
      }));
      setDeals(mapped);
      setDemoTotalDeals(mapped.length);
      setDemoTasksDueToday((demoTasks || []).filter((t: DemoTask) => t.due_offset_days === 0).length);
    } else {
      const { data } = await supabase.from("deals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setDeals(data || []);
    }
    setLoading(false);
  }

  async function toggleDemoMode() {
    setToggling(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("demo_mode_settings")
      .update({ enabled: !demoModeEnabled, updated_by: user?.id, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) { alert(error.message); setToggling(false); return; }
    await load();
    setToggling(false);
  }

  useEffect(() => { load(); }, []);

  const totalPipeline = deals.reduce((s, d) => s + (d.stage?.toLowerCase().includes("closed") ? 0 : parseMoney(d.arv)), 0);
  const closedDeals = deals.filter(d => d.stage?.toLowerCase().includes("closed won") || d.stage?.toLowerCase().includes("completed") || d.stage?.toLowerCase().includes("placed") || d.stage?.toLowerCase().includes("invoiced"));
  const closedRevenue = closedDeals.reduce((s, d) => s + parseMoney(d.arv), 0);
  const overdueDeals = deals.filter(d => isOverdue(d.next_follow_up));
  const recentDeals = deals.slice(0, 5);
  const firstName = userEmail.split("@")[0].split(".")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const openOpportunities = useDemo ? demoTotalDeals - closedDeals.length : deals.length - closedDeals.length;
  const tasksDueToday = useDemo ? demoTasksDueToday : deals.filter(d => isToday(d.next_follow_up)).length;
  const totalDealsCount = useDemo ? demoTotalDeals : deals.length;
  const conversionRate = totalDealsCount > 0 ? Math.round((closedDeals.length / totalDealsCount) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading your dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {useDemo && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-800">✨ Demo Mode is active — this dashboard is showing sample data, not your real pipeline.</span>
        </div>
      )}

      {isAdmin && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">Demo Mode</div>
            <div className="text-xs text-slate-400">Shows realistic sample data for screenshots, videos, and demos instead of your real pipeline.</div>
          </div>
          <button
            onClick={toggleDemoMode}
            disabled={toggling}
            className={"relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-50 " + (demoModeEnabled ? "bg-amber-500" : "bg-slate-300")}
          >
            <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition " + (demoModeEnabled ? "translate-x-6" : "translate-x-1")} />
          </button>
        </div>
      )}

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
          { label: "Total Deals", value: String(totalDealsCount), sub: "across all pipelines", icon: "🔀", color: "blue" },
          { label: "Pipeline Value", value: useDemo ? fmtFull(totalPipeline) : fmtShort(totalPipeline), sub: "active deals", icon: "💰", color: "green" },
          { label: "Closed Revenue", value: useDemo ? fmtFull(closedRevenue) : fmtShort(closedRevenue), sub: "won deals", icon: "✅", color: "emerald" },
          { label: "Overdue", value: String(overdueDeals.length), sub: "need attention", icon: "⚠️", color: "red" },
          { label: "Tasks Due Today", value: String(tasksDueToday), sub: "need action today", icon: "📌", color: "blue" },
          { label: "Open Opportunities", value: String(openOpportunities), sub: "in active stages", icon: "📂", color: "blue" },
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: "closed vs. total", icon: "📈", color: "emerald" },
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
                  <div className="text-xs font-bold text-slate-700">{useDemo ? fmtFull(parseMoney(d.arv)) : fmtShort(parseMoney(d.arv))}</div>
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
      {deals.length === 0 && !useDemo && (
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
