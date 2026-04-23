"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Deal = {
  id?: number;
  user_id?: string;
  title: string;
  address?: string;
  arv?: string;
  offer?: string;
  seller: string;
  amount?: string;
  stage: string;
  contact_email?: string;
  next_follow_up?: string;
  created_at?: string;
  updated_at?: string;
};

type Contact = {
  id?: number;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

type Note = {
  id?: number;
  user_id?: string;
  deal_id: number;
  content: string;
  created_at?: string;
};

type Filter = "all" | "hot" | "overdue" | "stale";

const STAGES = ["Inquiry", "Pre-Qualified", "Application", "Processing", "Underwriting", "Closed"];
const STAGE_DOT: Record<string, string> = {
  "Inquiry": "bg-blue-500",
  "Pre-Qualified": "bg-violet-500",
  "Application": "bg-amber-500",
  "Processing": "bg-orange-500",
  "Underwriting": "bg-pink-500",
  "Closed": "bg-emerald-500",
};

const LOAN_TYPES = ["Conventional", "FHA", "VA", "USDA", "Jumbo", "HELOC", "Refinance", "Hard Money"];

const EMPTY_FORM = {
  title: "", address: "", arv: "", offer: "",
  seller: "", amount: "", stage: "Inquiry",
  contact_email: "", next_follow_up: "",
};

function parseMoney(v?: string) {
  return Number((v || "").replace(/[^0-9.-]+/g, "")) || 0;
}
function fmt(v?: string | number) {
  const n = typeof v === "number" ? v : parseMoney(v as string);
  if (!n) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtShort(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return fmt(n);
}
function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function isOverdue(d?: string) {
  if (!d) return false;
  return new Date(d) < new Date(new Date().toDateString());
}
function isDueToday(d?: string) {
  if (!d) return false;
  return new Date(d).toDateString() === new Date().toDateString();
}
function isStale(deal: Deal) {
  const ref = deal.updated_at || deal.created_at;
  if (!ref) return false;
  return Date.now() - new Date(ref).getTime() > 7 * 86400 * 1000;
}

export default function MortgagePipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async function loadAll() {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user) { setLoading(false); return; }
    const [{ data: d }, { data: c }, { data: n }] = await Promise.all([
      supabase.from("deals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setDeals(d || []); setContacts(c || []); setNotes(n || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function reloadNotes() {
    const user = await getCurrentUser();
    if (!user) return;
    const { data } = await supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setNotes(data);
  }

  function openAdd(stage = "Inquiry") { setForm({ ...EMPTY_FORM, stage }); setEditId(null); setPanelOpen(true); }
  function openEdit(deal: Deal) {
    setForm({ title: deal.title || "", address: deal.address || "", arv: deal.arv || "", offer: deal.offer || "",
      seller: deal.seller || "", amount: deal.amount || "", stage: deal.stage || "Inquiry",
      contact_email: deal.contact_email || "", next_follow_up: deal.next_follow_up || "" });
    setEditId(deal.id ?? null); setPanelOpen(true);
  }
  function closePanel() { setPanelOpen(false); setEditId(null); setForm(EMPTY_FORM); }
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.seller) return;
    setSaving(true);
    const user = await getCurrentUser();
    if (!user) { setSaving(false); return; }
    if (editId !== null) {
      const { error } = await supabase.from("deals").update({ ...form, next_follow_up: form.next_follow_up || null, updated_at: new Date().toISOString() }).eq("id", editId).eq("user_id", user.id);
      if (error) { alert(error.message); setSaving(false); return; }
      await supabase.from("notes").insert({ deal_id: editId, user_id: user.id, content: "✏️ Loan updated" });
    } else {
      const { error } = await supabase.from("deals").insert({ ...form, next_follow_up: form.next_follow_up || null, user_id: user.id });
      if (error) { alert(error.message); setSaving(false); return; }
    }
    setSaving(false); closePanel(); loadAll();
  }

  async function handleDelete(id?: number) {
    if (!id || !confirm("Delete this loan?")) return;
    const user = await getCurrentUser();
    if (!user) return;
    await supabase.from("deals").delete().eq("id", id).eq("user_id", user.id);
    loadAll();
  }

  async function handleStageChange(id: number | undefined, newStage: string) {
    if (!id) return;
    const user = await getCurrentUser();
    if (!user) return;
    const prev = deals.find((d) => d.id === id);
    setDeals((ds) => ds.map((d) => d.id === id ? { ...d, stage: newStage } : d));
    const { error } = await supabase.from("deals").update({ stage: newStage, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
    if (error) { setDeals((ds) => ds.map((d) => d.id === id ? { ...d, stage: prev?.stage || d.stage } : d)); return; }
    await supabase.from("notes").insert({ deal_id: id, user_id: user.id, content: `📋 Moved to ${newStage}` });
    await reloadNotes();
  }

  function getContact(email?: string) { return contacts.find((c) => c.email === email); }
  function getDealNotes(dealId?: number) {
    return notes.filter((n) => n.deal_id === dealId).sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  }

  async function addNote(dealId: number, contentOverride?: string) {
    const content = (contentOverride ?? noteInputs[dealId] ?? "").trim();
    if (!content) return;
    const user = await getCurrentUser();
    if (!user) return;
    setNoteInputs((p) => ({ ...p, [dealId]: "" }));
    setNotes((p) => [{ id: Date.now(), deal_id: dealId, user_id: user.id, content, created_at: new Date().toISOString() }, ...p]);
    await supabase.from("notes").insert({ deal_id: dealId, content, user_id: user.id });
    await reloadNotes();
  }

  async function quickAction(dealId: number, action: "call" | "text" | "docs" | "appraisal") {
    const map = { call: "📞 Called borrower", text: "💬 Sent text", docs: "📋 Requested documents", appraisal: "🏠 Ordered appraisal" };
    await addNote(dealId, map[action]);
  }

  const filteredDeals = useMemo(() => {
    let r = deals;
    if (search) { const q = search.toLowerCase(); r = r.filter((d) => [d.title, d.seller, d.address].join(" ").toLowerCase().includes(q)); }
    if (filter === "hot") r = r.filter((d) => parseMoney(d.arv) >= 500000);
    if (filter === "overdue") r = r.filter((d) => isOverdue(d.next_follow_up));
    if (filter === "stale") r = r.filter((d) => isStale(d));
    return r;
  }, [deals, search, filter]);

  const stageDeals = (s: string) => filteredDeals.filter((d) => d.stage === s);
  const stageLoanVol = (s: string) => stageDeals(s).reduce((sum, d) => sum + parseMoney(d.arv), 0);
  const totalVolume = deals.reduce((s, d) => s + parseMoney(d.arv), 0);
  const closedVolume = deals.filter((d) => d.stage === "Closed").reduce((s, d) => s + parseMoney(d.arv), 0);
  const totalFees = deals.filter((d) => d.stage === "Closed").reduce((s, d) => s + parseMoney(d.amount), 0);
  const overdueCount = deals.filter((d) => isOverdue(d.next_follow_up)).length;

  return (
    <div className="min-h-screen bg-slate-50 -m-8">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">ML</div>
          <h1 className="text-base font-bold text-slate-900">Mortgage Pipeline</h1>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-400">{deals.length} loans</span>
        </div>
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search loans..."
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-48 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white" />
          <button onClick={() => openAdd()} className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1">
            <span className="text-lg leading-none">+</span> New Loan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Pipeline Volume", value: fmtShort(totalVolume), sub: `${deals.length} active loans` },
          { label: "Closed Volume", value: fmtShort(closedVolume), sub: "funded this period", green: true },
          { label: "Origination Fees", value: fmtShort(totalFees), sub: "earned on closed loans", green: totalFees > 0 },
          { label: "Follow-ups Due", value: String(overdueCount), sub: overdueCount > 0 ? "need attention" : "all clear ✓", red: overdueCount > 0 },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.red ? "text-red-500" : s.green ? "text-emerald-600" : "text-slate-900"}`}>{s.value}</div>
            <div className={`text-xs mt-0.5 ${s.red ? "text-red-400" : "text-slate-400"}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-2 flex-wrap">
        {(["all", "hot", "overdue", "stale"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${filter === f ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
            {f === "all" && "All loans"}{f === "hot" && "💎 Jumbo ($500k+)"}{f === "overdue" && "⚠️ Overdue"}{f === "stale" && "⏳ Stale 7d+"}
          </button>
        ))}
        {filter !== "all" && <button onClick={() => setFilter("all")} className="text-xs text-slate-400 hover:text-slate-700 underline">Clear</button>}
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading...</div>
      ) : (
        <div className="px-6 pb-12 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map((stage) => {
            const items = stageDeals(stage);
            const vol = stageLoanVol(stage);
            return (
              <div key={stage} className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${STAGE_DOT[stage]}`} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{stage}</span>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full px-2 py-0.5">{items.length}</span>
                  </div>
                  {vol > 0 && <span className="text-xs text-slate-400">{fmtShort(vol)}</span>}
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center h-20 text-xs text-slate-400">No loans</div>
                  )}
                  {items.map((d) => {
                    const contact = getContact(d.contact_email);
                    const loanAmt = parseMoney(d.arv);
                    const jumbo = loanAmt >= 500000;
                    const stale = isStale(d);
                    const overdue = isOverdue(d.next_follow_up);
                    const dueToday = isDueToday(d.next_follow_up);
                    const expanded = expandedDeal === d.id;
                    const dealNotes = getDealNotes(d.id);
                    const ltv = loanAmt && parseMoney(d.offer) ? Math.round((loanAmt / parseMoney(d.offer)) * 100) : null;
                    return (
                      <div key={d.id} className={`bg-white rounded-xl border text-sm shadow-sm hover:shadow-md transition-all ${jumbo ? "border-violet-200" : "border-slate-200"}`}>
                        <div className="p-4 cursor-pointer select-none" onClick={() => setExpandedDeal(expanded ? null : d.id!)}>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {jumbo && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-semibold">💎 Jumbo</span>}
                            {stale && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">⏳ Stale</span>}
                            {overdue && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">⚠️ Overdue</span>}
                          </div>
                          <div className="font-bold text-slate-900 leading-tight">{d.title}</div>
                          {d.address && <div className="text-xs text-slate-400 mt-0.5 truncate">{d.address}</div>}
                          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Loan Amount</div>
                              <div className={`text-xs font-bold ${jumbo ? "text-violet-600" : "text-slate-800"}`}>{fmt(d.arv)}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Property Value</div>
                              <div className="text-xs font-semibold text-slate-800">{fmt(d.offer)}</div>
                            </div>
                            {ltv && <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">LTV</div>
                              <div className={`text-xs font-bold ${ltv > 80 ? "text-amber-600" : "text-slate-800"}`}>{ltv}%</div>
                            </div>}
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Loan Type</div>
                              <div className="text-xs text-slate-700">{d.address || "—"}</div>
                            </div>
                          </div>
                          {d.next_follow_up && (
                            <div className={`mt-2 text-xs font-medium ${overdue ? "text-red-500" : dueToday ? "text-amber-500" : "text-slate-400"}`}>
                              {overdue ? "⚠️ Overdue · " : dueToday ? "📅 Today · " : "📅 "}{fmtDate(d.next_follow_up)}
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            {contact ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold flex items-center justify-center">{initials(contact.name)}</div>
                                <div className="text-xs font-semibold text-slate-700">{contact.name}</div>
                              </div>
                            ) : <span className="text-xs text-slate-400">No borrower</span>}
                            <span className="text-[10px] text-slate-400">{dealNotes.length > 0 ? `${dealNotes.length} notes · ` : ""}{expanded ? "▲" : "▼"}</span>
                          </div>
                        </div>
                        {expanded && (
                          <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                            <select value={d.stage} onChange={(e) => handleStageChange(d.id, e.target.value)}
                              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500">
                              {STAGES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {(["call", "text", "docs", "appraisal"] as const).map((a) => (
                                <button key={a} onClick={() => quickAction(d.id!, a)}
                                  className="text-[11px] py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium transition">
                                  {a === "call" && "📞 Call"}{a === "text" && "💬 Text"}{a === "docs" && "📋 Docs"}{a === "appraisal" && "🏠 Appraisal"}
                                </button>
                              ))}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Activity</div>
                            <div className="relative pl-4 space-y-2 mb-3 max-h-44 overflow-y-auto">
                              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-100" />
                              {dealNotes.length === 0 ? <div className="text-xs text-slate-400 italic">No activity yet</div> : dealNotes.map((n) => (
                                <div key={n.id} className="relative">
                                  <div className="absolute -left-[11px] top-2 h-2 w-2 rounded-full bg-slate-300" />
                                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                                    <div className="text-xs text-slate-700">{n.content}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{fmtTime(n.created_at)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <input value={noteInputs[d.id!] || ""} onChange={(e) => setNoteInputs((p) => ({ ...p, [d.id!]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNote(d.id!); } }}
                              placeholder="Add note... (Enter to save)"
                              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                            <div className="flex gap-4 mt-3">
                              <button onClick={() => { openEdit(d); setExpandedDeal(null); }} className="text-xs text-violet-600 hover:text-violet-800 font-semibold">Edit</button>
                              <button onClick={() => handleDelete(d.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => openAdd(stage)} className="text-xs text-slate-400 hover:text-violet-600 border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-xl py-3 transition">
                    + Add loan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={closePanel} />
          <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">ML</div>
                <h2 className="text-base font-bold text-slate-900">{editId !== null ? "Edit Loan" : "New Loan Application"}</h2>
              </div>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Loan / File Name *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Smith Purchase - 123 Oak St"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Borrower Name *</label>
                <input name="seller" value={form.seller} onChange={handleChange} required placeholder="Borrower full name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Property Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City, State"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Loan Amount ($)</label>
                  <input name="arv" value={form.arv} onChange={handleChange} placeholder="e.g. 350000"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Property Value ($)</label>
                  <input name="offer" value={form.offer} onChange={handleChange} placeholder="e.g. 420000"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              {form.arv && form.offer && (
                <div className={`rounded-lg px-4 py-3 text-sm font-semibold border ${Math.round((parseMoney(form.arv) / parseMoney(form.offer)) * 100) > 80 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                  LTV: {Math.round((parseMoney(form.arv) / parseMoney(form.offer)) * 100)}%
                  {Math.round((parseMoney(form.arv) / parseMoney(form.offer)) * 100) > 80 ? " ⚠️ Above 80% — PMI may apply" : " ✓ Below 80%"}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Loan Type</label>
                <select name="offer" onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">Select type</option>
                  {LOAN_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Origination Fee ($)</label>
                <input name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 5000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Stage</label>
                  <select name="stage" value={form.stage} onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Follow-up / Close Date</label>
                  <input type="date" name="next_follow_up" value={form.next_follow_up} onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Link Contact</label>
                <select name="contact_email" value={form.contact_email} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">No contact</option>
                  {contacts.map((c) => <option key={c.email} value={c.email}>{c.name} — {c.phone}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2 pb-6">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-lg transition">
                  {saving ? "Saving..." : editId !== null ? "Update Loan" : "Create Loan"}
                </button>
                <button type="button" onClick={closePanel}
                  className="px-5 border border-slate-200 text-slate-600 font-medium text-sm py-3 rounded-lg hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
