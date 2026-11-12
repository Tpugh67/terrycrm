"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { estimateCost } from "../../../../../lib/voiceRules";

// Management view of the SkyLinkStarLink outbound campaign. Data comes from
// /api/campaign-report, which only answers to one specific account.

const STAGES = [
  "Identified", "Contacted", "Responded", "Qualified", "Meeting Scheduled",
  "Proposal Sent", "Negotiation", "Won", "Lost",
];
const OPEN_STAGES = STAGES.slice(0, 7);
const CHANNELS = ["email", "phone", "linkedin", "text", "other"];
const CHANNEL_LABEL: Record<string, string> = { email: "Email", phone: "Phone", linkedin: "LinkedIn", text: "Text", other: "Other" };
const SOURCE_LABEL: Record<string, string> = {
  google_maps: "Google Maps", linkedin: "LinkedIn", referral: "Referral", cold_email: "Cold email", other: "Other",
};
const PACKAGE_LABEL: Record<string, string> = {
  managed_99: "$99/month managed", purchase: "Outright purchase", undecided: "Undecided",
};
const RESPONSE_OUTCOMES = ["replied", "interested", "meeting_booked"];

type Deal = {
  id: number; user_id: string; title: string; stage: string;
  lead_source: string | null; package_preference: string | null;
  deal_value: number | null; recurring_revenue: number | null; closed_revenue: number | null;
  opted_out_at: string | null; next_follow_up: string | null; created_at: string; updated_at: string | null;
};
type Note = {
  id: number; deal_id: number; user_id: string; content: string; created_at: string;
  channel: string | null; outcome: string | null;
};
type CallRow = { id: number; user_id: string; status: string; duration_secs: number; created_at: string };
type Report = { reps: { id: string; email: string }[]; deals: Deal[]; notes: Note[]; calls: CallRow[] };

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function mondayOf(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

export default function CampaignReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/campaign-report", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!active) return;
      if (res.status === 403 || res.status === 401) { router.push("/dashboard"); return; }
      if (!res.ok) { setError("Could not load the report. Try refreshing."); return; }
      setReport(await res.json());
    })();
    return () => { active = false; };
  }, [router]);

  const m = useMemo(() => {
    if (!report) return null;
    const { deals, notes } = report;
    const touches = notes.filter((n) => n.channel);
    const isResponse = (n: Note) => RESPONSE_OUTCOMES.includes(n.outcome || "");
    const todayKey = dayKey(new Date());

    // Daily (last 14 days)
    const days: { key: string; label: string; touches: number; byChannel: Record<string, number>; responses: number; meetings: number; newLeads: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push({
        key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        touches: 0, byChannel: {}, responses: 0, meetings: 0, newLeads: 0,
      });
    }
    const dayIdx = Object.fromEntries(days.map((d, i) => [d.key, i]));
    for (const n of touches) {
      const i = dayIdx[dayKey(new Date(n.created_at))];
      if (i === undefined) continue;
      days[i].touches++;
      days[i].byChannel[n.channel!] = (days[i].byChannel[n.channel!] || 0) + 1;
      if (isResponse(n)) days[i].responses++;
      if (n.outcome === "meeting_booked") days[i].meetings++;
    }
    for (const d of deals) {
      const i = dayIdx[dayKey(new Date(d.created_at))];
      if (i !== undefined) days[i].newLeads++;
    }

    // Calling: last 14 days (blocked attempts are counted separately and cost nothing)
    const callDays = days.map((d) => ({ key: d.key, label: d.label, calls: 0, connected: 0, secs: 0, cost: 0, blocked: 0 }));
    const callIdx = Object.fromEntries(callDays.map((d, i) => [d.key, i]));
    for (const c of report.calls || []) {
      const i = callIdx[dayKey(new Date(c.created_at))];
      if (i === undefined) continue;
      if (String(c.status).startsWith("refused")) { callDays[i].blocked++; continue; }
      callDays[i].calls++;
      if (c.duration_secs >= 5) callDays[i].connected++;
      callDays[i].secs += c.duration_secs || 0;
      callDays[i].cost += estimateCost(c.duration_secs || 0);
    }
    const callTotals = callDays.reduce((a, d) => ({ calls: a.calls + d.calls, secs: a.secs + d.secs, cost: a.cost + d.cost, blocked: a.blocked + d.blocked }), { calls: 0, secs: 0, cost: 0, blocked: 0 });

    // Weekly (last 8 weeks, Monday start)
    const thisMonday = mondayOf(new Date());
    const weeks: { start: Date; label: string; newLeads: number; touches: number; responses: number; meetings: number; won: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const s = new Date(thisMonday); s.setDate(s.getDate() - 7 * i);
      weeks.push({ start: s, label: "Week of " + s.toLocaleDateString("en-US", { month: "short", day: "numeric" }), newLeads: 0, touches: 0, responses: 0, meetings: 0, won: 0 });
    }
    const weekIdx = Object.fromEntries(weeks.map((w, i) => [dayKey(w.start), i]));
    const wk = (iso: string) => weekIdx[dayKey(mondayOf(new Date(iso)))];
    for (const n of touches) {
      const i = wk(n.created_at); if (i === undefined) continue;
      weeks[i].touches++;
      if (isResponse(n)) weeks[i].responses++;
      if (n.outcome === "meeting_booked") weeks[i].meetings++;
    }
    for (const n of notes) {
      if (n.content === "📋 Moved to Won") { const i = wk(n.created_at); if (i !== undefined) weeks[i].won++; }
    }
    for (const d of deals) { const i = wk(d.created_at); if (i !== undefined) weeks[i].newLeads++; }

    // Funnel, revenue, sources
    const stageCount = Object.fromEntries(STAGES.map((s) => [s, deals.filter((d) => d.stage === s).length]));
    const open = deals.filter((d) => OPEN_STAGES.includes(d.stage));
    const won = deals.filter((d) => d.stage === "Won");
    const respondedDeals = new Set(notes.filter((n) => n.channel && isResponse(n)).map((n) => n.deal_id));
    const touchedDeals = new Set(touches.map((n) => n.deal_id));
    const today = todayKey;

    const sources = Object.keys(SOURCE_LABEL).map((k) => {
      const ds = deals.filter((d) => (d.lead_source || "other") === k);
      return {
        key: k, leads: ds.length,
        contacted: ds.filter((d) => touchedDeals.has(d.id)).length,
        responded: ds.filter((d) => respondedDeals.has(d.id)).length,
        won: ds.filter((d) => d.stage === "Won").length,
      };
    }).filter((s) => s.leads > 0);

    const packages = Object.keys(PACKAGE_LABEL).map((k) => ({
      key: k, count: deals.filter((d) => (d.package_preference || "undecided") === k).length,
    }));

    return {
      days, weeks, stageCount, sources, packages, callDays, callTotals,
      total: deals.length,
      pipelineValue: open.reduce((s, d) => s + (d.deal_value || 0), 0),
      recurring: won.reduce((s, d) => s + (d.recurring_revenue || 0), 0),
      closed: won.reduce((s, d) => s + (d.closed_revenue || 0), 0),
      wonCount: won.length,
      optedOut: deals.filter((d) => d.opted_out_at).length,
      overdue: open.filter((d) => !d.opted_out_at && d.next_follow_up && d.next_follow_up < today).length,
      neverContacted: open.filter((d) => !touchedDeals.has(d.id)).length,
      contactedLeads: touchedDeals.size,
      respondedLeads: respondedDeals.size,
    };
  }, [report]);

  if (error) return <div className="p-8 text-sm text-red-700">{error}</div>;
  if (!report || !m) return <div className="p-8 text-sm text-slate-500">Loading campaign reports…</div>;

  const today = m.days[0];
  const maxStage = Math.max(1, ...Object.values(m.stageCount));
  const card = "bg-white rounded-xl border border-slate-200 p-4";
  const th = "text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 py-2 pr-3";
  const td = "py-2 pr-3 text-sm text-slate-700";

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campaign Reports</h1>
        <p className="text-sm text-slate-500">
          SkyLinkStarLink outbound · {report.reps.map((r) => r.email).join(", ") || "no reps set up"}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { l: "Total leads", v: String(m.total), s: `${m.contactedLeads} contacted · ${m.respondedLeads} responded` },
          { l: "Open pipeline (est.)", v: money(m.pipelineValue) },
          { l: "Recurring revenue", v: money(m.recurring) + "/mo", s: `${m.wonCount} won` },
          { l: "Closed revenue", v: money(m.closed) },
          { l: "Follow-ups overdue", v: String(m.overdue), s: `${m.neverContacted} never contacted` },
          { l: "Opted out", v: String(m.optedOut) },
        ].map((k) => (
          <div key={k.l} className={card}>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{k.l}</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{k.v}</div>
            {k.s ? <div className="text-xs text-slate-400 mt-0.5">{k.s}</div> : null}
          </div>
        ))}
      </div>

      {/* Today */}
      <div className={card}>
        <h2 className="font-semibold text-slate-900 mb-2">Today</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-700">
          <span><b className="text-lg text-slate-900">{today.touches}</b> outreach attempts</span>
          <span><b className="text-lg text-slate-900">{today.responses}</b> responses</span>
          <span><b className="text-lg text-slate-900">{today.meetings}</b> meetings booked</span>
          <span><b className="text-lg text-slate-900">{today.newLeads}</b> new leads added</span>
        </div>
      </div>

      {/* Daily */}
      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold text-slate-900 mb-2">Daily activity (last 14 days)</h2>
        <table className="w-full min-w-[640px]">
          <thead><tr>
            <th className={th}>Day</th><th className={th}>Outreach</th>
            {CHANNELS.map((c) => <th key={c} className={th}>{CHANNEL_LABEL[c]}</th>)}
            <th className={th}>Responses</th><th className={th}>Meetings</th><th className={th}>New leads</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {m.days.map((d) => (
              <tr key={d.key}>
                <td className={td + " font-medium"}>{d.label}</td>
                <td className={td + " font-semibold"}>{d.touches}</td>
                {CHANNELS.map((c) => <td key={c} className={td}>{d.byChannel[c] || 0}</td>)}
                <td className={td}>{d.responses}</td><td className={td}>{d.meetings}</td><td className={td}>{d.newLeads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calling */}
      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold text-slate-900 mb-1">Calling (last 14 days)</h2>
        <p className="text-xs text-slate-500 mb-2">
          {m.callTotals.calls} calls · {Math.round(m.callTotals.secs / 60)} minutes · about ${m.callTotals.cost.toFixed(2)} estimated Twilio cost
          {m.callTotals.blocked ? ` · ${m.callTotals.blocked} blocked attempts` : ""}. Estimate uses US rates of $0.018 per started minute; check Twilio for the real charge.
        </p>
        <table className="w-full min-w-[520px]">
          <thead><tr>
            <th className={th}>Day</th><th className={th}>Calls</th><th className={th}>Connected</th>
            <th className={th}>Minutes</th><th className={th}>Est. cost</th><th className={th}>Blocked</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {m.callDays.map((d) => (
              <tr key={d.key}>
                <td className={td + " font-medium"}>{d.label}</td><td className={td + " font-semibold"}>{d.calls}</td>
                <td className={td}>{d.connected}</td><td className={td}>{(d.secs / 60).toFixed(1)}</td>
                <td className={td}>${d.cost.toFixed(2)}</td><td className={td}>{d.blocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly */}
      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold text-slate-900 mb-2">Weekly performance (last 8 weeks)</h2>
        <table className="w-full min-w-[560px]">
          <thead><tr>
            <th className={th}>Week</th><th className={th}>New leads</th><th className={th}>Outreach</th>
            <th className={th}>Responses</th><th className={th}>Response rate</th><th className={th}>Meetings</th><th className={th}>Deals won</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {m.weeks.map((w) => (
              <tr key={w.label}>
                <td className={td + " font-medium"}>{w.label}</td>
                <td className={td}>{w.newLeads}</td><td className={td + " font-semibold"}>{w.touches}</td>
                <td className={td}>{w.responses}</td><td className={td}>{pct(w.responses, w.touches)}</td>
                <td className={td}>{w.meetings}</td><td className={td}>{w.won}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className={card}>
          <h2 className="font-semibold text-slate-900 mb-3">Pipeline by stage</h2>
          <div className="space-y-2">
            {STAGES.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-36 text-sm text-slate-600">{s}</div>
                <div className="flex-1 bg-slate-100 rounded h-5 overflow-hidden">
                  <div className={"h-5 " + (s === "Won" ? "bg-emerald-500" : s === "Lost" ? "bg-red-400" : "bg-blue-500")}
                    style={{ width: `${(m.stageCount[s] / maxStage) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-sm font-semibold text-slate-800">{m.stageCount[s]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources + packages */}
        <div className={card}>
          <h2 className="font-semibold text-slate-900 mb-2">Lead sources</h2>
          <table className="w-full">
            <thead><tr><th className={th}>Source</th><th className={th}>Leads</th><th className={th}>Contacted</th><th className={th}>Responded</th><th className={th}>Won</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {m.sources.length === 0 && <tr><td className={td} colSpan={5}>No leads yet.</td></tr>}
              {m.sources.map((s) => (
                <tr key={s.key}><td className={td + " font-medium"}>{SOURCE_LABEL[s.key]}</td><td className={td}>{s.leads}</td><td className={td}>{s.contacted}</td><td className={td}>{s.responded}</td><td className={td}>{s.won}</td></tr>
              ))}
            </tbody>
          </table>
          <h2 className="font-semibold text-slate-900 mt-5 mb-2">Package preference</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
            {m.packages.map((p) => <span key={p.key}><b>{p.count}</b> {PACKAGE_LABEL[p.key]}</span>)}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Responses count outreach logged as Replied, Interested or Meeting booked. Deals won counts the week a lead was moved to Won.
        Revenue figures include leads in the Won stage only. History shown covers the last 120 days.
      </p>
    </div>
  );
}
