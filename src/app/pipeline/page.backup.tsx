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
  type?: string;
  created_at?: string;
};

const stages = ["New Leads", "Contacted", "Offer Made", "Closed"];

const noteTypes = [
  { value: "note", label: "Note", icon: "📝" },
  { value: "call", label: "Call", icon: "📞" },
  { value: "text", label: "Text", icon: "💬" },
  { value: "offer", label: "Offer", icon: "💰" },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [noteTypesState, setNoteTypesState] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    address: "",
    arv: "",
    offer: "",
    seller: "",
    amount: "",
    stage: "New Leads",
    contact_email: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  async function getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      return null;
    }

    return user;
  }

  async function loadAll() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: dealsData, error: dealsError } = await supabase
      .from("deals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: contactsData, error: contactsError } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dealsError) console.error("Load deals error:", dealsError);
    if (contactsError) console.error("Load contacts error:", contactsError);
    if (notesError) console.error("Load notes error:", notesError);

    setDeals(dealsData || []);
    setContacts(contactsData || []);
    setNotes(notesData || []);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.seller) return;

    const user = await getCurrentUser();
    if (!user) return;

    if (editId !== null) {
      const { error } = await supabase
        .from("deals")
        .update(form)
        .eq("id", editId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Update deal error:", error);
        return;
      }

      setEditId(null);
    } else {
      const { error } = await supabase.from("deals").insert({
        ...form,
        user_id: user.id,
      });

      if (error) {
        console.error("Insert deal error:", error);
        return;
      }
    }

    setForm({
      title: "",
      address: "",
      arv: "",
      offer: "",
      seller: "",
      amount: "",
      stage: "New Leads",
      contact_email: "",
    });

    loadAll();
  }

  async function handleDeleteDeal(id?: number) {
    if (!id) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from("deals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete deal error:", error);
      return;
    }

    loadAll();
  }

  async function handleStageChange(id: number | undefined, newStage: string) {
    if (!id) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from("deals")
      .update({ stage: newStage })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Stage change error:", error);
      return;
    }

    loadAll();
  }

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
    });
    setEditId(deal.id || null);
  }

  function getLinkedContact(email?: string) {
    return contacts.find((c) => c.email === email);
  }

  function getNotesForDeal(dealId?: number) {
    return notes
      .filter((n) => n.deal_id === dealId)
      .sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      );
  }

  async function addNote(dealId: number) {
    const content = noteInputs[dealId];
    const type = noteTypesState[dealId] || "note";

    if (!content) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase.from("notes").insert({
      deal_id: dealId,
      content,
      type,
      user_id: user.id,
    });

    if (error) {
      console.error("Add note error:", error);
      return;
    }

    setNoteInputs((prev) => ({ ...prev, [dealId]: "" }));
    setNoteTypesState((prev) => ({ ...prev, [dealId]: "note" }));
    loadAll();
  }

  function handleNoteChange(dealId: number, value: string) {
    setNoteInputs((prev) => ({ ...prev, [dealId]: value }));
  }

  function handleTypeChange(dealId: number, value: string) {
    setNoteTypesState((prev) => ({ ...prev, [dealId]: value }));
  }

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

  function getTypeMeta(type?: string) {
    return noteTypes.find((t) => t.value === type) || noteTypes[0];
  }

  const filteredDeals = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return deals;

    return deals.filter((d) =>
      [d.title, d.address, d.seller].join(" ").toLowerCase().includes(q)
    );
  }, [deals, search]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Pipeline
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          Track deals, spread, contacts, and activity history.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {editId !== null ? "Edit Deal" : "Add Deal"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Deal Title" value={form.title} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />
          <input name="address" placeholder="Property Address" value={form.address} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />
          <input name="arv" placeholder="ARV ($)" value={form.arv} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />
          <input name="offer" placeholder="Offer Price ($)" value={form.offer} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />
          <input name="seller" placeholder="Seller Name" value={form.seller} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />
          <input name="amount" placeholder="Assignment Fee ($)" value={form.amount} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl" />

          <select name="stage" value={form.stage} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl">
            {stages.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select name="contact_email" value={form.contact_email} onChange={handleChange} className="border border-slate-300 px-4 py-3 rounded-xl">
            <option value="">Select Contact</option>
            {contacts.map((c) => (
              <option key={c.email} value={c.email}>
                {c.name}
              </option>
            ))}
          </select>

          <button className="bg-slate-950 text-white px-5 py-3 rounded-xl w-fit hover:bg-slate-800 transition">
            {editId !== null ? "Update Deal" : "Add Deal"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <input
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 w-full md:w-96"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {stages.map((stage) => (
          <div key={stage} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold mb-4 text-slate-900">{stage}</h2>

            {filteredDeals
              .filter((d) => d.stage === stage)
              .map((d) => {
                const contact = getLinkedContact(d.contact_email);
                const spread = parseMoney(d.arv) - parseMoney(d.offer);

                return (
                  <div key={d.id} className="bg-slate-50 p-4 rounded-xl mb-3 border border-slate-200 text-sm">
                    <div className="font-bold text-slate-900">{d.title}</div>
                    <div className="text-slate-500">{d.address || "No address"}</div>

                    <div className="mt-2 text-slate-700 space-y-1">
                      <div>ARV: {d.arv || "$0"}</div>
                      <div>Offer: {d.offer || "$0"}</div>
                      <div>Fee: {d.amount || "$0"}</div>
                      <div className="font-semibold text-slate-900">
                        Spread: {formatMoney(spread)}
                      </div>
                    </div>

                    <div className="mt-2 text-slate-600">
                      {contact ? contact.name : "No contact"}
                    </div>

                    <select
                      value={d.stage}
                      onChange={(e) => handleStageChange(d.id, e.target.value)}
                      className="border border-slate-300 mt-3 px-3 py-2 rounded-xl w-full bg-white"
                    >
                      {stages.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    <div className="mt-3 flex gap-4">
                      <button onClick={() => handleEditDeal(d)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteDeal(d.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold text-xs mb-2 text-slate-700">
                        Activity Timeline
                      </div>

                      <div className="space-y-2 mb-3">
                        {getNotesForDeal(d.id).map((n) => {
                          const meta = getTypeMeta(n.type);
                          return (
                            <div
                              key={n.id}
                              className="bg-white border border-slate-200 px-3 py-2 rounded text-xs text-slate-700"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {meta.icon} {meta.label}
                                  </div>
                                  <div className="mt-1">{n.content}</div>
                                </div>
                                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {formatTime(n.created_at)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={noteTypesState[d.id!] || "note"}
                          onChange={(e) => handleTypeChange(d.id!, e.target.value)}
                          className="border border-slate-300 px-2 py-2 rounded text-xs bg-white"
                        >
                          {noteTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <input
                          value={noteInputs[d.id!] || ""}
                          onChange={(e) => handleNoteChange(d.id!, e.target.value)}
                          placeholder="Add activity..."
                          className="w-full border border-slate-300 px-3 py-2 rounded text-xs"
                        />
                      </div>

                      <button
                        onClick={() => addNote(d.id!)}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </>
  );
}
