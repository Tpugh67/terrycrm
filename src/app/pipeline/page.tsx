"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  next_follow_up?: string; // FIX: was missing from type
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

const STAGES = ["New Leads", "Contacted", "Offer Made", "Closed"];

const EMPTY_FORM = {
  title: "",
  address: "",
  arv: "",
  offer: "",
  seller: "",
  amount: "",
  stage: "New Leads",
  contact_email: "",
  next_follow_up: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMoney(value?: string) {
  return Number((value || "").replace(/[^0-9.-]+/g, "")) || 0;
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatTime(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(date?: string) {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
}

function isDueToday(date?: string) {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
}

function daysSinceActivity(dateStr?: string) {
  if (!dateStr) return 999;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Auth ──────────────────────────────────────────────────────────────────

  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Get user error:", error);
      return null;
    }
    return user;
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  async function loadAll() {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user) { setLoading(false); return; }

    const [
      { data: dealsData, error: dealsError },
      { data: contactsData, error: contactsError },
      { data: notesData, error: notesError },
    ] = await Promise.all([
      supabase.from("deals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (dealsError) console.error("Load deals error:", dealsError);
    if (contactsError) console.error("Load contacts error:", contactsError);
    if (notesError) console.error("Load notes error:", notesError);

    setDeals(dealsData || []);
    setContacts(contactsData || []);
    setNotes(notesData || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  // ── Form ──────────────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // FIX #1: populate form with deal values instead of blanking it
  function handleEditDeal(deal: Deal) {
    setForm({
      title: deal.title || "",
      address: deal.address || "",
      arv: deal.arv || "",
      offer: deal.offer || "",
      seller: deal.seller || "",
      amount: deal.amount || "",
      stage: deal.stage || "New Leads",
      contact_email: deal.contact_email || "",
      next_follow_up: deal.next_follow_up || "",
    });
    setEditId(deal.id ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.seller) return;

    setSaving(true);
    const user = await getCurrentUser();
    if (!user) { setSaving(false); return; }

    if (editId !== null) {
      // FIX #2: include next_follow_up in the update payload
      const { error } = await supabase
        .from("deals")
        .update({
          title: form.title,
          address: form.address,
          arv: form.arv,
          offer: form.offer,
          seller: form.seller,
          amount: form.amount,
          stage: form.stage,
          contact_email: form.contact_email,
          next_follow_up: form.next_follow_up || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Update deal error:", JSON.stringify(error, null, 2));
        alert(`Update failed: ${error.message}`);
        setSaving(false);
        return;
      }

      // Auto-log the edit to timeline
      await supabase.from("notes").insert({
        deal_id: editId,
        user_id: user.id,
        content: "✏️ Deal updated",
      });

      setEditId(null);
    } else {
      const { error } = await supabase.from("deals").insert({
        ...form,
        next_follow_up: form.next_follow_up || null,
        user_id: user.id,
      });

      if (error) {
        console.error("Insert deal error:", error);
        alert(`Insert failed: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setForm(EMPTY_FORM);
    setSaving(false);
    loadAll();
  }

  // ── Deal actions ──────────────────────────────────────────────────────────

  async function handleDeleteDeal(id?: number) {
    if (!id) return;
    if (!confirm("Delete this deal? This cannot be undone.")) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from("deals").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      console.error("Delete deal error:", error);
      alert(error.message);
      return;
    }
    loadAll();
  }

  // FIX #3: optimistic update — no full reload on stage change
  async function handleStageChange(id: number | undefined, newStage: string) {
    if (!id) return;
    const user = await getCurrentUser();
    if (!user) return;

    // Optimistic update
    const previous = deals.find((d) => d.id === id);
    setDeals((prev) => prev.map((d) => d.id === id ? { ...d, stage: newStage } : d));

    const { error } = await supabase
      .from("deals")
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Stage change error:", error);
      // Revert on failure
      setDeals((prev) => prev.map((d) => d.id === id ? { ...d, stage: previous?.stage || d.stage } : d));
      alert(error.message);
      return;
    }

    // Auto-log stage change to timeline
    await supabase.from("notes").insert({
      deal_id: id,
      user_id: user.id,
      content: `📋 Moved to ${newStage}`,
    });

    // Only reload notes (not all data)
    const { data: notesData } = await supabase
      .from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (notesData) setNotes(notesData);
  }

  // ── Notes ─────────────────────────────────────────────────────────────────

  function getLinkedContact(email?: string) {
    return contacts.find((c) => c.email === email);
  }

  function getNotesForDeal(dealId?: number) {
    return notes
      .filter((n) => n.deal_id === dealId)
      .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  }

  async function addNote(dealId: number, contentOverride?: string) {
    const content = (contentOverride ?? noteInputs[dealId] ?? "").trim();
    if (!content) { alert("Type a note first."); return; }

    const user = await getCurrentUser();
    if (!user) { alert("You are not logged in."); return; }

    const newNote: Note = {
      deal_id: dealId,
      content,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    // Optimistic update for notes too
    setNotes((prev) => [{ ...newNote, id: Date.now() }, ...prev]);
    setNoteInputs((prev) => ({ ...prev, [dealId]: "" }));

    const { error } = await supabase.from("notes").insert(newNote);

    if (error) {
      console.error("Add note error:", error);
      alert(error.message);
      // Revert optimistic note
      setNotes((prev) => prev.filter((n) => n.id !== Date.now()));
      return;
    }

    // Reload notes only
    const { data: notesData } = await supabase
      .from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (notesData) setNotes(notesData);
  }

  async function quickAction(dealId: number, action: "call" | "text" | "offer") {
    const actionMap = {
      call: "📞 Called seller",
      text: "💬 Sent text to seller",
      offer: "💰 Made offer",
    };
    await addNote(dealId, actionMap[action]);
  }

  function handleNoteChange(dealId: number, value: string) {
    setNoteInputs((prev) => ({ ...prev, [dealId]: value }));
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredDeals = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.title, d.address, d.seller, d.contact_email].join(" ").toLowerCase().includes(q)
    );
  }, [deals, search]);

  function stageDeals(stage: string) {
    return filteredDeals.filter((d) => d.stage === stage);
  }

  function stageTotalValue(stage: string) {
    return stageDeals(stage).reduce((sum, d) => sum + parseMoney(d.arv), 0);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Pipeline</h1>
        <p className="text-slate-500 mt-2 text-base">
          Track deals, spread, contacts, and note history.
        </p>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {editId !== null ? "Edit Deal" : "Add Deal"}
          </h2>
          {editId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Deal Title *"
            value={form.title}
            onChange={handleChange}
            required
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />
          <input
            name="seller"
            placeholder="Seller Name *"
            value={form.seller}
            onChange={handleChange}
            required
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />
          <input
            name="address"
            placeholder="Property Address"
            value={form.address}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />
          <input
            name="arv"
            placeholder="ARV ($)"
            value={form.arv}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />
          <input
            name="offer"
            placeholder="Offer Price ($)"
            value={form.offer}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />
          <input
            name="amount"
            placeholder="Assignment Fee ($)"
            value={form.amount}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          />

          {/* Follow-up date with label */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 px-1">Next follow-up date</label>
            <input
              type="date"
              name="next_follow_up"
              value={form.next_follow_up}
              onChange={handleChange}
              className="border border-slate-300 px-4 py-3 rounded-xl"
            />
          </div>

          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          >
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
            className="border border-slate-300 px-4 py-3 rounded-xl"
          >
            <option value="">Select Contact (optional)</option>
            {contacts.map((c) => (
              <option key={c.email} value={c.email}>{c.name} — {c.email}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={saving}
            className="bg-slate-950 text-white px-5 py-3 rounded-xl w-fit hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : editId !== null ? "Update Deal" : "Add Deal"}
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <input
          placeholder="Search deals by title, address, or seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 w-full md:w-96"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-slate-400 py-12">Loading pipeline...</div>
      )}

      {/* Pipeline Columns */}
      {!loading && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {STAGES.map((stage) => {
            const stageItems = stageDeals(stage);
            const totalValue = stageTotalValue(stage);

            return (
              <div key={stage} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                {/* Stage header with count + value */}
                <div className="mb-4">
                  <h2 className="font-bold text-slate-900">{stage}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {stageItems.length} deal{stageItems.length !== 1 ? "s" : ""}
                    {totalValue > 0 && ` · ${formatMoney(totalValue)} ARV`}
                  </div>
                </div>

                {/* Empty state */}
                {stageItems.length === 0 && (
                  <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                    No deals here yet
                  </div>
                )}

                {stageItems.map((d) => {
                  const contact = getLinkedContact(d.contact_email);
                  const spread = parseMoney(d.arv) - parseMoney(d.offer);
                  const isHot = spread >= 50000;
                  const stale = daysSinceActivity(d.updated_at || d.created_at) >= 7;
                  const overdue = isOverdue(d.next_follow_up);
                  const dueToday = isDueToday(d.next_follow_up);

                  return (
                    <div
                      key={d.id}
                      className={`p-4 rounded-xl mb-3 border text-sm ${
                        isHot
                          ? "bg-amber-50 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Badges row */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {isHot && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                            🔥 Hot Deal
                          </span>
                        )}
                        {stale && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-200 text-slate-600 font-medium">
                            ⏳ No activity 7d+
                          </span>
                        )}
                      </div>

                      {/* Title & address */}
                      <div className="font-bold text-slate-900">{d.title}</div>
                      <div className="text-slate-500">{d.address || "No address"}</div>

                      {/* Financials */}
                      <div className="mt-2 text-slate-700 space-y-1">
                        <div>ARV: {d.arv || "$0"}</div>
                        <div>Offer: {d.offer || "$0"}</div>
                        <div>Fee: {d.amount || "$0"}</div>
                        <div className="font-semibold text-slate-900">
                          Spread: {formatMoney(spread)}
                        </div>
                      </div>

                      {/* Follow-up date — FIX: now rendered with overdue/due-today highlighting */}
                      {d.next_follow_up && (
                        <div className={`mt-2 text-xs font-medium ${
                          overdue
                            ? "text-red-600"
                            : dueToday
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}>
                          {overdue ? "⚠️ Overdue:" : dueToday ? "📅 Due today:" : "📅 Follow-up:"}{" "}
                          {formatDate(d.next_follow_up)}
                        </div>
                      )}

                      {/* Contact */}
                      <div className="mt-2 text-slate-600">
                        {contact ? (
                          <>
                            <div className="font-medium text-slate-900">{contact.name}</div>
                            <div>{contact.phone}</div>
                            <div>{contact.company}</div>
                          </>
                        ) : (
                          <div className="text-slate-400 text-xs">No contact linked</div>
                        )}
                      </div>

                      {/* Stage selector */}
                      <select
                        value={d.stage}
                        onChange={(e) => handleStageChange(d.id, e.target.value)}
                        className="border border-slate-300 mt-3 px-3 py-2 rounded-xl w-full bg-white text-sm"
                      >
                        {STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>

                      {/* Edit / Delete */}
                      <div className="mt-3 flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleEditDeal(d)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeal(d.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Quick actions */}
                      <div className="mt-3 flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => quickAction(d.id!, "call")}
                          className="rounded-lg border border-slate-300 px-2 py-1 bg-white hover:bg-slate-100"
                        >
                          📞 Call
                        </button>
                        <button
                          type="button"
                          onClick={() => quickAction(d.id!, "text")}
                          className="rounded-lg border border-slate-300 px-2 py-1 bg-white hover:bg-slate-100"
                        >
                          💬 Text
                        </button>
                        <button
                          type="button"
                          onClick={() => quickAction(d.id!, "offer")}
                          className="rounded-lg border border-slate-300 px-2 py-1 bg-white hover:bg-slate-100"
                        >
                          💰 Offer
                        </button>
                      </div>

                      {/* Notes timeline */}
                      <div className="mt-4">
                        <div className="font-semibold text-xs mb-2 text-slate-700">Timeline</div>

                        <div className="relative pl-4 space-y-2 mb-3">
                          <div className="absolute left-1 top-0 bottom-0 w-px bg-slate-200" />
                          {getNotesForDeal(d.id).length === 0 ? (
                            <div className="relative bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-400">
                              No activity yet
                            </div>
                          ) : (
                            getNotesForDeal(d.id).map((n, index) => (
                              <div
                                key={n.id}
                                className="relative bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-700"
                              >
                                <div className="absolute -left-[14px] top-3 h-2 w-2 rounded-full bg-slate-400" />
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {index === 0 ? "Latest" : "Note"}
                                    </div>
                                    <div className="mt-1">{n.content}</div>
                                  </div>
                                  <div className="text-[10px] text-slate-400 whitespace-nowrap">
                                    {formatTime(n.created_at)}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Note input */}
                        <input
                          value={noteInputs[d.id!] || ""}
                          onChange={(e) => handleNoteChange(d.id!, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addNote(d.id!);
                            }
                          }}
                          placeholder="Add note... (Enter to save)"
                          className="w-full border border-slate-300 px-3 py-2 rounded text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => addNote(d.id!)}
                          className="mt-1.5 text-xs text-blue-600 hover:underline"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
