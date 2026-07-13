"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Signup = {
  email: string;
  industry: string;
  subscription_status: string;
  referred_by: string | null;
  created_at: string;
};

type RepStat = {
  name: string;
  email: string;
  status: string;
  leadCount: number;
  totalEarned: number;
};

type AffiliateApp = {
  name: string;
  email: string;
  platform: string;
  status: string;
  created_at: string;
};

type Stats = {
  counts: { total: number; active: number; trial: number; pastDue: number; cancelled: number };
  mrr: number;
  activeSubCount: number;
  recentSignups: Signup[];
  repStats: RepStat[];
  pendingReps: number;
  affiliateApps: AffiliateApp[];
  affiliateCounts: { pending: number; approved: number };
  health: { supabase: boolean; stripe: boolean; resendConfigured: boolean; customersMissingStripeId: number };
};

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    trial: "bg-blue-100 text-blue-700",
    past_due: "bg-amber-100 text-amber-700",
    cancelled: "bg-slate-200 text-slate-600",
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
  };
  return map[status] || "bg-slate-200 text-slate-600";
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/admin-stats", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          const body = await res.json();
          setError(body.error || "Failed to load stats.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch {
        setError("Failed to connect to server.");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading command center...</div>;
  if (error) return (
    <div className="max-w-2xl mx-auto mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-2xl mb-2">🚫</div>
      <div className="font-semibold text-red-800">{error}</div>
      <p className="text-sm text-red-500 mt-1">This page is only available to admin accounts.</p>
    </div>
  );
  if (!stats) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📈 Admin Command Center</h1>
        <p className="text-slate-500 mt-1">Real-time business metrics across PipeDesk.</p>
      </div>

      {/* Top-line stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: String(stats.counts.total), icon: "👥", color: "text-blue-600" },
          { label: "Active (Paying)", value: String(stats.counts.active), icon: "✅", color: "text-emerald-600" },
          { label: "On Trial", value: String(stats.counts.trial), icon: "⏳", color: "text-amber-600" },
          { label: "MRR", value: `$${stats.mrr.toFixed(2)}`, icon: "💰", color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Past Due", value: String(stats.counts.pastDue), color: "text-amber-600" },
          { label: "Cancelled", value: String(stats.counts.cancelled), color: "text-slate-500" },
          { label: "Active Subscriptions (Stripe)", value: String(stats.activeSubCount), color: "text-slate-700" },
          { label: "Conversion Rate", value: stats.counts.total > 0 ? `${((stats.counts.active / stats.counts.total) * 100).toFixed(0)}%` : "—", color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className={"text-lg font-bold " + s.color}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">🩺 System Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Supabase", ok: stats.health.supabase },
            { label: "Stripe API", ok: stats.health.stripe },
            { label: "Resend (Email)", ok: stats.health.resendConfigured },
            { label: "No Billing Gaps", ok: stats.health.customersMissingStripeId === 0 },
          ].map((h) => (
            <div key={h.label} className={"rounded-lg p-3 border flex items-center gap-2 " + (h.ok ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200")}>
              <span>{h.ok ? "🟢" : "🔴"}</span>
              <span className="text-xs font-semibold text-slate-700">{h.label}</span>
            </div>
          ))}
        </div>
        {stats.health.customersMissingStripeId > 0 && (
          <p className="text-xs text-amber-600 mt-3">⚠️ {stats.health.customersMissingStripeId} active customer(s) have no Stripe customer ID on file — worth investigating.</p>
        )}
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">🆕 Recent Signups</h2>
        {stats.recentSignups.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No signups yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentSignups.map((s) => (
              <div key={s.email} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{s.email}</div>
                  <div className="text-xs text-slate-400">
                    {s.industry || "no industry"} · {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {s.referred_by && ` · referred by ${s.referred_by}`}
                  </div>
                </div>
                <span className={"text-xs font-bold px-2 py-1 rounded-full " + statusBadge(s.subscription_status)}>
                  {s.subscription_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rep Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">🤝 Rep Performance</h2>
          {stats.pendingReps > 0 && (
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{stats.pendingReps} pending review</span>
          )}
        </div>
        {stats.repStats.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No reps yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.repStats.map((r) => (
              <div key={r.email} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.leadCount} lead{r.leadCount !== 1 ? "s" : ""} · {r.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">${r.totalEarned.toFixed(2)}</div>
                  <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " + statusBadge(r.status)}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Affiliate Performance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">📣 Affiliate Applications</h2>
          <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{stats.affiliateCounts.pending} pending</span>
        </div>
        {stats.affiliateApps.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No affiliate applications yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.affiliateApps.map((a) => (
              <div key={a.email} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{a.name}</div>
                  <div className="text-xs text-slate-400">{a.platform || "no platform"} · {a.email}</div>
                </div>
                <span className={"text-xs font-bold px-2 py-1 rounded-full " + statusBadge(a.status)}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
