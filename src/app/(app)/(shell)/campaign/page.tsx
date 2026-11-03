"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

// ─── Constants ────────────────────────────────────────────────────────────────

const CAMPAIGN = "skylink";

const STAGES = [
  "Identified", "Contacted", "Responded", "Qualified", "Meeting Scheduled",
  "Proposal Sent", "Negotiation", "Won", "Lost",
];
const OPEN_STAGES = STAGES.slice(0, 7);

const STAGE_DOT: Record<string, string> = {
  "Identified": "bg-slate-400", "Contacted": "bg-blue-500", "Responded": "bg-violet-500",
  "Qualified": "bg-indigo-500", "Meeting Scheduled": "bg-amber-500", "Proposal Sent": "bg-orange-500",
  "Negotiation": "bg-pink-500", "Won": "bg-emerald-500", "Lost": "bg-red-500",
};

const LEAD_SOURCES = [
  { v: "google_maps", l: "Google Maps" }, { v: "linkedin", l: "LinkedIn" },
  { v: "referral", l: "Referral" }, { v: "cold_email", l: "Cold email" }, { v: "other", l: "Other" },
];
const PACKAGES = [
  { v: "undecided", l: "Undecided" }, { v: "managed_99", l: "$99/month managed website" },
  { v: "purchase", l: "Outright purchase" },
];
const CHANNELS = [
  { v: "email", l: "Email" }, { v: "phone", l: "Phone" }, { v: "linkedin", l: "LinkedIn" },
  { v: "text", l: "Text" }, { v: "other", l: "Other" },
];
const OUTCOMES = [
  { v: "no_response", l: "No response" }, { v: "replied", l: "Replied" },
  { v: "interested", l: "Interested" }, { v: "not_interested", l: "Not interested" },
  { v: "wrong_contact", l: "Wrong contact" }, { v: "meeting_booked", l: "Meeting booked" },
  { v: "opted_out", l: "Opted out / do not contact" },
];

const label = (list: { v: string; l: string }[], v?: string | null) =>
  list.find((x) => x.v === v)?.l || v || "—";

// ─── Types ────────────────────────────────────────────────────────────────────

type Deal = {
  id: number;
  user_id: string;
  title: string;
  seller: string;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  industry?: string | null;
  website?: string | null;
  lead_source?: string | null;
  package_preference?: string | null;
  deal_value?: number | null;
  recurring_revenue?: number | null;
  closed_revenue?: number | null;
  next_follow_up?: string | null;
  opted_out_at?: string | null;
  stage: string;
  campaign?: string | null;
  created_at?: string;
};

type Note = {
  id: number;
  deal_id: number;
  content: string;
  created_at: string;
  channel?: string | null;
  outcome?: string | null;
};

const EMPTY_FORM = {
  title: "", website: "", seller: "", contact_email: "", phone: "", address: "",
  industry: "", lead_source: "google_maps", package_preference: "undecided",
  deal_value: "", recurring_revenue: "", next_follow_up: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const money = (n?: number | null) =>
  (n || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function normWebsite(v: string) {
  return v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}
function normEmail(v: string) { return v.trim().toLowerCase(); }
function toNum(v: string) { const n = Number(v.replace(/[^0-9.-]+/g, "")); return Number.isFinite(n) && v.trim() !== "" ? n : null; }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}
function fmtTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const btnPrimary = "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const btnGhost = "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50";

// ─── CSV import helpers ───────────────────────────────────────────────────────

type ImportRow = {
  line: number;
  data: Record<string, string>;
  status: "new" | "dup_existing" | "dup_file" | "opted_out" | "invalid";
  reason: string;
};

const MAX_IMPORT_ROWS = 1000;

const CSV_TEMPLATE =
  "Company,Website,Contact Name,Email,Phone,Location,Industry,Lead Source\n" +
  "Acme Plumbing,acmeplumbing.com,Jane Smith,jane@acmeplumbing.com,555-555-5555,\"Austin, TX\",Plumbing,Google Maps\n";

const HEADER_ALIASES: Record<string, string[]> = {
  title: ["company", "company name", "business", "business name", "organization", "organisation"],
  website: ["website", "web site", "url", "site", "web"],
  seller: ["contact", "contact name", "name", "owner", "full name", "contact person"],
  contact_email: ["email", "e-mail", "email address", "contact email"],
  phone: ["phone", "phone number", "telephone", "mobile", "tel"],
  address: ["location", "address", "city", "city state", "city, state"],
  industry: ["industry", "category", "type", "business type"],
  lead_source: ["lead source", "source"],
  deal_value: ["estimated value", "estimated contract value", "value", "contract value"],
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", inQ = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQ) {
      if (c === '"') { if (src[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

function mapSource(v: string) {
  const t = v.trim().toLowerCase().replace(/[^a-z]/g, "");
  const hit = LEAD_SOURCES.find((s) => s.v.replace(/_/g, "") === t || s.l.toLowerCase().replace(/[^a-z]/g, "") === t);
  return hit ? hit.v : "other";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CampaignPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<"board" | "today">("board");
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [imp, setImp] = useState<{ fileName: string; rows: ImportRow[] } | null>(null);
  const [impMsg, setImpMsg] = useState("");
  const [impBusy, setImpBusy] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formMsg, setFormMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [openId, setOpenId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Record<string, string>>({});
  const [detailMsg, setDetailMsg] = useState("");
  const [log, setLog] = useState({ channel: "email", outcome: "no_response", note: "" });

  const load = useCallback(async (uid: string) => {
    const { data: d } = await supabase.from("deals").select("*")
      .eq("user_id", uid).eq("campaign", CAMPAIGN).order("created_at", { ascending: false });
    const list = (d || []) as Deal[];
    setDeals(list);
    const ids = list.map((x) => x.id);
    if (ids.length) {
      const { data: n } = await supabase.from("notes").select("*")
        .eq("user_id", uid).in("deal_id", ids).order("created_at", { ascending: false });
      setNotes((n || []) as Note[]);
    } else setNotes([]);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("campaign_access").eq("id", user.id).maybeSingle();
      if (!active) return;
      if (!profile?.campaign_access) { router.push("/dashboard"); return; }
      setUserId(user.id);
      setAllowed(true);
      await load(user.id);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [router, load]);

  const open = deals.find((d) => d.id === openId) || null;
  const openNotes = notes.filter((n) => n.deal_id === openId);

  function openDeal(d: Deal) {
    setOpenId(d.id);
    setDetailMsg("");
    setLog({ channel: "email", outcome: "no_response", note: "" });
    setEdit({
      title: d.title || "", website: d.website || "", seller: d.seller || "",
      contact_email: d.contact_email || "", phone: d.phone || "", address: d.address || "",
      industry: d.industry || "", lead_source: d.lead_source || "other",
      package_preference: d.package_preference || "undecided",
      deal_value: d.deal_value != null ? String(d.deal_value) : "",
      recurring_revenue: d.recurring_revenue != null ? String(d.recurring_revenue) : "",
      closed_revenue: d.closed_revenue != null ? String(d.closed_revenue) : "",
      next_follow_up: d.next_follow_up || "",
    });
  }

  // ── Duplicate check (friendly message before the database has to refuse) ──
  function findDuplicate(email: string, website: string, ignoreId?: number) {
    const e = normEmail(email), w = normWebsite(website);
    return deals.find((d) => d.id !== ignoreId && (
      (e && normEmail(d.contact_email || "") === e) ||
      (w && normWebsite(d.website || "") === w)
    ));
  }
  function dupMessage(d: Deal) {
    return `Duplicate: "${d.title}" is already in your campaign (stage: ${d.stage}${d.opted_out_at ? ", OPTED OUT — do not contact" : ""}).`;
  }

  async function addLead() {
    setFormMsg("");
    if (!form.title.trim()) { setFormMsg("Company name is required."); return; }
    const dup = findDuplicate(form.contact_email, form.website);
    if (dup) { setFormMsg(dupMessage(dup)); return; }
    setSaving(true);
    const recurring = toNum(form.recurring_revenue) ?? (form.package_preference === "managed_99" ? 99 : null);
    const { error } = await supabase.from("deals").insert({
      user_id: userId, campaign: CAMPAIGN, stage: "Identified",
      title: form.title.trim(), seller: form.seller.trim() || form.title.trim(),
      website: normWebsite(form.website) || null,
      contact_email: normEmail(form.contact_email) || null,
      phone: form.phone.trim() || null, address: form.address.trim() || null,
      industry: form.industry.trim() || null, lead_source: form.lead_source,
      package_preference: form.package_preference,
      deal_value: toNum(form.deal_value), recurring_revenue: recurring,
      amount: form.deal_value.trim(),
      next_follow_up: form.next_follow_up || null,
    });
    setSaving(false);
    if (error) {
      setFormMsg(error.code === "23505"
        ? "Duplicate: a lead with this email or website is already in your campaign."
        : "Could not save: " + error.message);
      return;
    }
    setForm(EMPTY_FORM); setShowAdd(false);
    await load(userId);
  }

  async function saveDetail() {
    if (!open) return;
    setDetailMsg("");
    if (!(edit.title || "").trim()) { setDetailMsg("Company name is required."); return; }
    const dup = findDuplicate(edit.contact_email || "", edit.website || "", open.id);
    if (dup) { setDetailMsg(dupMessage(dup)); return; }
    const { error } = await supabase.from("deals").update({
      title: edit.title.trim(), seller: (edit.seller || "").trim() || edit.title.trim(),
      website: normWebsite(edit.website || "") || null,
      contact_email: normEmail(edit.contact_email || "") || null,
      phone: (edit.phone || "").trim() || null, address: (edit.address || "").trim() || null,
      industry: (edit.industry || "").trim() || null, lead_source: edit.lead_source,
      package_preference: edit.package_preference,
      deal_value: toNum(edit.deal_value || ""), recurring_revenue: toNum(edit.recurring_revenue || ""),
      closed_revenue: toNum(edit.closed_revenue || ""),
      amount: (edit.deal_value || "").trim(),
      next_follow_up: edit.next_follow_up || null, updated_at: new Date().toISOString(),
    }).eq("id", open.id).eq("user_id", userId);
    if (error) {
      setDetailMsg(error.code === "23505" ? "Duplicate: another lead already uses this email or website." : error.message);
      return;
    }
    setDetailMsg("Saved.");
    await load(userId);
  }

  async function changeStage(d: Deal, stage: string) {
    if (stage === d.stage) return;
    const prev = deals;
    setDeals((ds) => ds.map((x) => x.id === d.id ? { ...x, stage } : x));
    const { error } = await supabase.from("deals")
      .update({ stage, updated_at: new Date().toISOString() }).eq("id", d.id).eq("user_id", userId);
    if (error) { setDeals(prev); setDetailMsg(error.message); return; }
    await supabase.from("notes").insert({ deal_id: d.id, user_id: userId, content: `📋 Moved to ${stage}` });
    await load(userId);
  }

  async function logOutreach() {
    if (!open) return;
    setDetailMsg("");
    if (open.opted_out_at) { setDetailMsg("This contact opted out. No new outreach can be logged."); return; }
    const { error } = await supabase.from("notes").insert({
      deal_id: open.id, user_id: userId, channel: log.channel, outcome: log.outcome,
      content: `${label(CHANNELS, log.channel)} — ${label(OUTCOMES, log.outcome)}${log.note.trim() ? ": " + log.note.trim() : ""}`,
    });
    if (error) { setDetailMsg(error.message); return; }

    // Gentle auto-advance (never moves a lead backwards).
    const idx = STAGES.indexOf(open.stage);
    let target: string | null = null;
    if (log.outcome === "opted_out") target = "Lost";
    else if (log.outcome === "meeting_booked" && idx < STAGES.indexOf("Meeting Scheduled")) target = "Meeting Scheduled";
    else if ((log.outcome === "replied" || log.outcome === "interested") && idx < STAGES.indexOf("Responded")) target = "Responded";
    else if (idx < STAGES.indexOf("Contacted")) target = "Contacted";

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (target) patch.stage = target;
    if (log.outcome === "opted_out") patch.opted_out_at = new Date().toISOString();
    await supabase.from("deals").update(patch).eq("id", open.id).eq("user_id", userId);

    setLog({ channel: log.channel, outcome: "no_response", note: "" });
    setDetailMsg(log.outcome === "opted_out" ? "Logged. This contact is now marked do-not-contact." : "Outreach logged.");
    await load(userId);
  }

  // ── CSV import ──
  async function onPickFile(file: File | undefined) {
    setImpMsg(""); setImp(null);
    if (!file) return;
    const text = await file.text();
    const table = parseCsv(text);
    if (table.length < 2) { setImpMsg("That file has no data rows. Use the template: header row first, then one lead per row."); return; }
    const headers = table[0].map((h) => h.trim().toLowerCase());
    const col: Record<string, number> = {};
    for (const [key, names] of Object.entries(HEADER_ALIASES)) {
      const idx = headers.findIndex((h) => names.includes(h));
      if (idx >= 0) col[key] = idx;
    }
    if (col.title === undefined) { setImpMsg('Could not find a "Company" column. Check the header row or use the template.'); return; }
    const body = table.slice(1);
    if (body.length > MAX_IMPORT_ROWS) { setImpMsg(`That file has ${body.length} rows. Please import ${MAX_IMPORT_ROWS} or fewer at a time.`); return; }

    const seenEmail = new Set<string>(), seenSite = new Set<string>();
    const rows: ImportRow[] = body.map((cells, i) => {
      const get = (k: string) => (col[k] !== undefined ? (cells[col[k]] || "").trim() : "");
      const data = {
        title: get("title"), website: normWebsite(get("website")), seller: get("seller"),
        contact_email: normEmail(get("contact_email")), phone: get("phone"), address: get("address"),
        industry: get("industry"), lead_source: mapSource(get("lead_source")), deal_value: get("deal_value"),
      };
      const line = i + 2;
      const mk = (status: ImportRow["status"], reason = ""): ImportRow => ({ line, data, status, reason });
      if (!data.title) return mk("invalid", "Missing company name");
      if (data.contact_email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contact_email)) return mk("invalid", "Email looks wrong");
      const ex = findDuplicate(data.contact_email, data.website);
      if (ex) return ex.opted_out_at
        ? mk("opted_out", `Already opted out (${ex.title}) — do not contact`)
        : mk("dup_existing", `Already in campaign (${ex.title}, ${ex.stage})`);
      if ((data.contact_email && seenEmail.has(data.contact_email)) || (data.website && seenSite.has(data.website)))
        return mk("dup_file", "Repeated earlier in this file");
      if (data.contact_email) seenEmail.add(data.contact_email);
      if (data.website) seenSite.add(data.website);
      return mk("new");
    });
    setImp({ fileName: file.name, rows });
  }

  async function runImport() {
    if (!imp) return;
    const fresh = imp.rows.filter((r) => r.status === "new");
    if (!fresh.length) return;
    setImpBusy(true); setImpMsg("");
    const toRow = (r: ImportRow) => ({
      user_id: userId, campaign: CAMPAIGN, stage: "Identified",
      title: r.data.title, seller: r.data.seller || r.data.title,
      website: r.data.website || null, contact_email: r.data.contact_email || null,
      phone: r.data.phone || null, address: r.data.address || null,
      industry: r.data.industry || null, lead_source: r.data.lead_source,
      package_preference: "undecided",
      deal_value: toNum(r.data.deal_value), amount: r.data.deal_value,
    });
    let added = 0, failed = 0;
    for (let i = 0; i < fresh.length; i += 100) {
      const chunk = fresh.slice(i, i + 100);
      const { error } = await supabase.from("deals").insert(chunk.map(toRow));
      if (!error) { added += chunk.length; continue; }
      // Fall back to one-by-one so a single bad row never blocks the rest.
      for (const r of chunk) {
        const { error: e2 } = await supabase.from("deals").insert(toRow(r));
        if (e2) failed++; else added++;
      }
    }
    const skipped = imp.rows.length - fresh.length;
    setImpMsg(`Imported ${added} new lead${added === 1 ? "" : "s"}. Skipped ${skipped}${failed ? `, ${failed} failed to save` : ""}.`);
    setImp(null);
    await load(userId);
    setImpBusy(false);
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "campaign-leads-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Derived data ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.title, d.seller, d.contact_email, d.website, d.address, d.industry]
        .some((v) => (v || "").toLowerCase().includes(q)));
  }, [deals, search]);

  const stats = useMemo(() => {
    const openDeals = deals.filter((d) => OPEN_STAGES.includes(d.stage));
    const won = deals.filter((d) => d.stage === "Won");
    return {
      total: deals.length,
      open: openDeals.length,
      pipelineValue: openDeals.reduce((s, d) => s + (d.deal_value || 0), 0),
      recurring: won.reduce((s, d) => s + (d.recurring_revenue || 0), 0),
      closed: won.reduce((s, d) => s + (d.closed_revenue || 0), 0),
      wonCount: won.length,
    };
  }, [deals]);

  const lastTouch = useMemo(() => {
    const m: Record<number, Note> = {};
    for (const n of notes) if (n.channel && !m[n.deal_id]) m[n.deal_id] = n;
    return m;
  }, [notes]);

  const todayOutreach = notes.filter((n) => n.channel && isToday(n.created_at));
  const dueToday = deals.filter((d) =>
    OPEN_STAGES.includes(d.stage) && !d.opted_out_at && d.next_follow_up && d.next_follow_up <= todayStr());
  const dealById = (id: number) => deals.find((d) => d.id === id);

  if (!allowed || loading) {
    return <div className="p-8 text-sm text-slate-500">Loading campaign…</div>;
  }

  const channelCounts = CHANNELS.map((c) => ({ ...c, n: todayOutreach.filter((x) => x.channel === c.v).length }))
    .filter((c) => c.n > 0);

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">SkyLinkStarLink Campaign</h1>
          <p className="text-sm text-slate-500">Outbound prospects, outreach and follow-ups.</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-48" />
          <button onClick={() => { setImp(null); setImpMsg(""); setShowImport(true); }} className={btnGhost}>Import CSV</button>
          <button onClick={() => { setForm(EMPTY_FORM); setFormMsg(""); setShowAdd(true); }} className={btnPrimary}>+ Add lead</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[
          { l: "Total leads", v: String(stats.total) },
          { l: "Open pipeline (est.)", v: money(stats.pipelineValue), s: `${stats.open} open leads` },
          { l: "Recurring revenue (won)", v: money(stats.recurring) + "/mo", s: `${stats.wonCount} won` },
          { l: "Closed revenue", v: money(stats.closed) },
          { l: "Contacted today", v: String(todayOutreach.length), s: channelCounts.map((c) => `${c.n} ${c.l.toLowerCase()}`).join(" · ") },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{s.l}</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{s.v}</div>
            {s.s ? <div className="text-xs text-slate-400 mt-0.5">{s.s}</div> : null}
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-3">
        {(["board", "today"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={"px-4 py-2 rounded-lg text-sm font-semibold " + (view === v ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}>
            {v === "board" ? "Pipeline board" : `Today (${todayOutreach.length} done · ${dueToday.length} due)`}
          </button>
        ))}
      </div>

      {/* Board */}
      {view === "board" && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const col = filtered.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="w-64 flex-shrink-0 bg-slate-50 rounded-xl border border-slate-200">
                <div className="px-3 py-2.5 flex items-center gap-2 border-b border-slate-200">
                  <span className={"w-2 h-2 rounded-full " + STAGE_DOT[stage]} />
                  <span className="text-sm font-semibold text-slate-800">{stage}</span>
                  <span className="ml-auto text-xs text-slate-500">{col.length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[80px]">
                  {col.map((d) => {
                    const lt = lastTouch[d.id];
                    const overdue = d.next_follow_up && d.next_follow_up < todayStr() && OPEN_STAGES.includes(d.stage);
                    return (
                      <button key={d.id} onClick={() => openDeal(d)}
                        className="w-full text-left bg-white rounded-lg border border-slate-200 p-2.5 hover:border-blue-400 hover:shadow-sm transition">
                        <div className="text-sm font-semibold text-slate-900 truncate">{d.title}</div>
                        <div className="text-xs text-slate-500 truncate">{d.seller !== d.title ? d.seller : d.website || ""}</div>
                        {d.opted_out_at && <div className="mt-1 inline-block text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">DO NOT CONTACT</div>}
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{lt ? `${label(CHANNELS, lt.channel)} · ${fmtTime(lt.created_at)}` : "No outreach yet"}</span>
                          {d.deal_value ? <span className="font-semibold text-slate-600">{money(d.deal_value)}</span> : null}
                        </div>
                        {d.next_follow_up && (
                          <div className={"text-[11px] mt-0.5 " + (overdue ? "text-red-600 font-semibold" : "text-slate-400")}>
                            Follow up {d.next_follow_up}{overdue ? " (overdue)" : ""}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Today */}
      {view === "today" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900 mb-2">Outreach logged today ({todayOutreach.length})</h2>
            {todayOutreach.length === 0 && <p className="text-sm text-slate-400">Nothing logged yet today.</p>}
            <ul className="divide-y divide-slate-100">
              {todayOutreach.map((n) => {
                const d = dealById(n.deal_id);
                return (
                  <li key={n.id} className="py-2">
                    <button className="text-left w-full" onClick={() => d && openDeal(d)}>
                      <div className="text-sm font-semibold text-slate-800">{d?.title || "Lead"}</div>
                      <div className="text-xs text-slate-500">{fmtTime(n.created_at)} · {label(CHANNELS, n.channel)} · {label(OUTCOMES, n.outcome)}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900 mb-2">Follow-ups due ({dueToday.length})</h2>
            {dueToday.length === 0 && <p className="text-sm text-slate-400">No follow-ups due.</p>}
            <ul className="divide-y divide-slate-100">
              {dueToday.map((d) => (
                <li key={d.id} className="py-2">
                  <button className="text-left w-full" onClick={() => openDeal(d)}>
                    <div className="text-sm font-semibold text-slate-800">{d.title}</div>
                    <div className={"text-xs " + (d.next_follow_up! < todayStr() ? "text-red-600" : "text-slate-500")}>
                      Due {d.next_follow_up} · {d.stage}{d.phone ? " · " + d.phone : ""}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add lead modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Add lead</h2>
            <LeadFields v={form} set={(k, val) => setForm((f) => ({ ...f, [k]: val }))} />
            {formMsg && <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formMsg}</div>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className={btnGhost}>Cancel</button>
              <button onClick={addLead} disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save lead"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowImport(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-slate-900">Import leads from CSV</h2>
              <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              One lead per row. Needed column: <b>Company</b>. Optional: Website, Contact Name, Email, Phone, Location, Industry, Lead Source.
              Duplicates and opted-out contacts are skipped automatically.
            </p>
            <button onClick={downloadTemplate} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">Download template</button>
            <input type="file" accept=".csv,text/csv" className="block mt-3 text-sm"
              onChange={(e) => onPickFile(e.target.files?.[0])} />

            {impMsg && <div className="mt-3 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700">{impMsg}</div>}

            {imp && (() => {
              const c = (st: ImportRow["status"]) => imp.rows.filter((r) => r.status === st).length;
              const skipped = imp.rows.filter((r) => r.status !== "new");
              return (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-slate-800">{imp.fileName}: {imp.rows.length} rows</div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    {[
                      { l: "New", n: c("new"), cls: "text-emerald-700 bg-emerald-50" },
                      { l: "Duplicates", n: c("dup_existing") + c("dup_file"), cls: "text-amber-700 bg-amber-50" },
                      { l: "Opted out", n: c("opted_out"), cls: "text-red-700 bg-red-50" },
                      { l: "Invalid", n: c("invalid"), cls: "text-slate-700 bg-slate-100" },
                    ].map((x) => (
                      <div key={x.l} className={"rounded-lg py-2 " + x.cls}>
                        <div className="text-lg font-bold">{x.n}</div>
                        <div className="text-[11px] font-semibold uppercase">{x.l}</div>
                      </div>
                    ))}
                  </div>
                  {skipped.length > 0 && (
                    <div className="mt-3 max-h-44 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                      {skipped.map((r) => (
                        <div key={r.line} className="px-3 py-1.5 text-xs text-slate-600">
                          <span className="font-semibold">Row {r.line}</span> · {r.data.title || "(no name)"} — {r.reason}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => setImp(null)} className={btnGhost}>Cancel</button>
                    <button onClick={runImport} disabled={impBusy || c("new") === 0} className={btnPrimary}>
                      {impBusy ? "Importing…" : `Import ${c("new")} new lead${c("new") === 1 ? "" : "s"}`}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Lead detail panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setOpenId(null)}>
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{open.title}</h2>
                {open.opted_out_at && <div className="mt-1 inline-block text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">OPTED OUT — DO NOT CONTACT</div>}
              </div>
              <button onClick={() => setOpenId(null)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
            </div>

            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-500">Stage</label>
              <select value={open.stage} onChange={(e) => changeStage(open, e.target.value)} className={inputCls}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Outreach log */}
            <div className="mt-5 rounded-xl border border-slate-200 p-3">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Log outreach</h3>
              {open.opted_out_at ? (
                <p className="text-sm text-red-700">This contact opted out. New outreach cannot be logged.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={log.channel} onChange={(e) => setLog({ ...log, channel: e.target.value })} className={inputCls}>
                      {CHANNELS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                    </select>
                    <select value={log.outcome} onChange={(e) => setLog({ ...log, outcome: e.target.value })} className={inputCls}>
                      {OUTCOMES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                    </select>
                  </div>
                  <input value={log.note} onChange={(e) => setLog({ ...log, note: e.target.value })}
                    placeholder="Note (optional)" className={inputCls + " mt-2"} />
                  <button onClick={logOutreach} className={btnPrimary + " mt-2"}>Log it</button>
                </>
              )}
            </div>

            {detailMsg && <div className="mt-3 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700">{detailMsg}</div>}

            {/* History */}
            <div className="mt-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">History</h3>
              {openNotes.length === 0 && <p className="text-sm text-slate-400">No activity yet.</p>}
              <ul className="space-y-1.5">
                {openNotes.map((n) => (
                  <li key={n.id} className="text-sm">
                    <span className="text-xs text-slate-400">{fmtTime(n.created_at)}</span>
                    <div className="text-slate-700">{n.content}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Details */}
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Lead details</h3>
              <LeadFields v={edit} set={(k, val) => setEdit((e) => ({ ...e, [k]: val }))} showClosed />
              <button onClick={saveDetail} className={btnPrimary + " mt-3"}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared form fields ───────────────────────────────────────────────────────

function LeadFields({ v, set, showClosed }: {
  v: Record<string, string>;
  set: (k: string, val: string) => void;
  showClosed?: boolean;
}) {
  const f = (k: string, ph: string, type = "text") => (
    <input type={type} value={v[k] || ""} onChange={(e) => set(k, e.target.value)} placeholder={ph} className={inputCls} />
  );
  const lbl = (t: string) => <label className="text-xs font-semibold text-slate-500 block mb-1">{t}</label>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>{lbl("Company *")}{f("title", "Acme Plumbing")}</div>
      <div>{lbl("Website")}{f("website", "acmeplumbing.com")}</div>
      <div>{lbl("Contact name")}{f("seller", "Jane Smith")}</div>
      <div>{lbl("Email")}{f("contact_email", "jane@acmeplumbing.com", "email")}</div>
      <div>{lbl("Phone")}{f("phone", "(555) 555-5555")}</div>
      <div>{lbl("Location")}{f("address", "City, State")}</div>
      <div>{lbl("Industry")}{f("industry", "Plumbing")}</div>
      <div>
        {lbl("Lead source")}
        <select value={v.lead_source || "other"} onChange={(e) => set("lead_source", e.target.value)} className={inputCls}>
          {LEAD_SOURCES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>
      <div>
        {lbl("Package preference")}
        <select value={v.package_preference || "undecided"} onChange={(e) => {
          set("package_preference", e.target.value);
          if (e.target.value === "managed_99" && !(v.recurring_revenue || "").trim()) set("recurring_revenue", "99");
        }} className={inputCls}>
          {PACKAGES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>
      <div>{lbl("Estimated contract value ($)")}{f("deal_value", "0")}</div>
      <div>{lbl("Recurring revenue ($/month)")}{f("recurring_revenue", "99")}</div>
      {showClosed ? <div>{lbl("Closed revenue ($)")}{f("closed_revenue", "0")}</div> : null}
      <div>{lbl("Next follow-up")}{f("next_follow_up", "", "date")}</div>
    </div>
  );
}
