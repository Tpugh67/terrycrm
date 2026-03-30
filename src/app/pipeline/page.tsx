"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Deal = {
  id?: number;
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
  name: string;
  email: string;
  phone: string;
  company: string;
};

type Note = {
  id?: number;
  deal_id: number;
  content: string;
};

const stages = ["New Leads", "Contacted", "Offer Made", "Closed"];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");

  async function loadAll() {
    const { data: dealsData } = await supabase.from("deals").select("*");
    const { data: contactsData } = await supabase.from("contacts").select("*");
    const { data: notesData } = await supabase.from("notes").select("*");

    setDeals(dealsData || []);
    setContacts(contactsData || []);
    setNotes(notesData || []);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function getLinkedContact(email?: string) {
    return contacts.find((c) => c.email === email);
  }

  function getNotesForDeal(dealId?: number) {
    return notes.filter((n) => n.deal_id === dealId);
  }

  async function addNote(dealId: number) {
    const content = noteInputs[dealId];
    if (!content) return;

    await supabase.from("notes").insert({
      deal_id: dealId,
      content,
    });

    setNoteInputs((prev) => ({ ...prev, [dealId]: "" }));
    loadAll();
  }

  function handleNoteChange(dealId: number, value: string) {
    setNoteInputs((prev) => ({ ...prev, [dealId]: value }));
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
          Track deals, spread, contacts, and activity notes.
        </p>
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

                    <div className="mt-2 text-slate-700">
                      <div>Spread: {formatMoney(spread)}</div>
                    </div>

                    <div className="mt-2 text-slate-600">
                      {contact ? contact.name : "No contact"}
                    </div>

                    <div className="mt-3">
                      <div className="font-semibold text-xs mb-2 text-slate-700">Notes</div>

                      <div className="space-y-2 mb-2">
                        {getNotesForDeal(d.id).map((n) => (
                          <div key={n.id} className="bg-white border border-slate-200 px-3 py-2 rounded text-xs text-slate-700">
                            {n.content}
                          </div>
                        ))}
                      </div>

                      <input
                        value={noteInputs[d.id!] || ""}
                        onChange={(e) => handleNoteChange(d.id!, e.target.value)}
                        placeholder="Add note..."
                        className="w-full border border-slate-300 px-3 py-2 rounded text-xs"
                      />

                      <button
                        onClick={() => addNote(d.id!)}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Add Note
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
