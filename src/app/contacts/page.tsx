"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

type Contact = {
  id?: number;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) { console.error("Get user error:", error); return null; }
    return user;
  }

  async function loadContacts() {
    const user = await getCurrentUser();
    if (!user) return;
    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) { console.error("Load contacts error:", error); return; }
    setContacts(data || []);
  }

  useEffect(() => { loadContacts(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const user = await getCurrentUser();
    if (!user) return;
    if (editId !== null) {
      const { error } = await supabase.from("contacts").update(form).eq("id", editId).eq("user_id", user.id);
      if (error) { console.error("Update contact error:", error); return; }
      setEditId(null);
    } else {
      const { error } = await supabase.from("contacts").insert({ ...form, user_id: user.id });
      if (error) { console.error("Insert contact error:", error); return; }
    }
    setForm({ name: "", email: "", phone: "", company: "" });
    loadContacts();
  }

  async function handleDeleteContact(id?: number) {
    if (!id) return;
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from("contacts").delete().eq("id", id).eq("user_id", user.id);
    if (error) { console.error("Delete contact error:", error); return; }
    loadContacts();
  }

  function handleEditContact(contact: Contact) {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone || "", company: contact.company || "" });
    setEditId(contact.id || null);
  }

  function handleExport() {
    if (contacts.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Company"];
    const rows = contacts.map(c => [
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      `"${(c.company || "").replace(/"/g, '""')}"`,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipedesk-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadTemplate() {
    const csv = "Name,Email,Phone,Company\nJohn Smith,john@example.com,555-123-4567,Acme Corp\nJane Doe,jane@example.com,555-987-6543,Widget Co";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipedesk-contacts-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const user = await getCurrentUser();
    if (!user) { setImporting(false); return; }
    const text = await file.text();
    const lines = text.trim().split("\n");
    if (lines.length < 2) { setImportResult("File is empty or has no data rows."); setImporting(false); return; }
    const header = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
    const nameIdx = header.findIndex(h => h.includes("name"));
    const emailIdx = header.findIndex(h => h.includes("email"));
    const phoneIdx = header.findIndex(h => h.includes("phone"));
    const companyIdx = header.findIndex(h => h.includes("company"));
    if (nameIdx === -1 || emailIdx === -1) { setImportResult("CSV must have Name and Email columns."); setImporting(false); return; }
    const parseCell = (row: string[], idx: number) => idx >= 0 ? (row[idx] || "").replace(/^"|"$/g, "").trim() : "";
    const newContacts: Omit<Contact, "id">[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const name = parseCell(row, nameIdx);
      const email = parseCell(row, emailIdx);
      if (!name || !email) continue;
      newContacts.push({ user_id: user.id, name, email, phone: parseCell(row, phoneIdx), company: parseCell(row, companyIdx) });
    }
    if (newContacts.length === 0) { setImportResult("No valid contacts found in file."); setImporting(false); return; }
    const { error } = await supabase.from("contacts").insert(newContacts);
    if (error) { setImportResult("Import failed: " + error.message); setImporting(false); return; }
    setImportResult("Successfully imported " + newContacts.length + " contact" + (newContacts.length !== 1 ? "s" : "") + "!");
    setImporting(false);
    loadContacts();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) => [contact.name, contact.email, contact.phone, contact.company].join(" ").toLowerCase().includes(query));
  }, [contacts, search]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Contacts</h1>
        <p className="text-slate-500 mt-2 text-base">Manage sellers, buyers, and business contacts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">Import / Export:</span>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            {importing ? "Importing..." : "📥 Import CSV"}
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importing} />
          </label>
          <button onClick={handleExport} disabled={contacts.length === 0} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            📤 Export CSV ({contacts.length})
          </button>
          <button onClick={handleDownloadTemplate} className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg transition">
            📋 Download Template
          </button>
          {importResult && (
            <span className={"text-sm font-medium " + (importResult.includes("Successfully") ? "text-emerald-600" : "text-red-600")}>
              {importResult}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">{editId !== null ? "Edit Contact" : "Add Contact"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name *" value={form.name} onChange={handleChange} required className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} required className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <div className="flex gap-3">
            <button type="submit" className="bg-slate-950 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition">
              {editId !== null ? "Update Contact" : "Add Contact"}
            </button>
            {editId !== null && (
              <button type="button" onClick={() => { setEditId(null); setForm({ name: "", email: "", phone: "", company: "" }); }} className="border border-slate-200 text-slate-600 px-5 py-3 rounded-xl hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Contact List <span className="text-slate-400 text-base font-normal">({filteredContacts.length})</span></h2>
          <input type="text" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-slate-300 rounded-xl px-4 py-3 md:w-80" />
        </div>
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">👥</div>
            <div className="font-semibold text-slate-600 mb-1">No contacts yet</div>
            <div className="text-sm">Add a contact above or import a CSV file.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-3 pr-4">Name</th><th className="pr-4">Email</th><th className="pr-4">Phone</th><th className="pr-4">Company</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 pr-4 font-medium text-slate-900">{contact.name}</td>
                    <td className="pr-4 text-slate-600">{contact.email}</td>
                    <td className="pr-4 text-slate-600">{contact.phone}</td>
                    <td className="pr-4 text-slate-600">{contact.company}</td>
                    <td className="space-x-3">
                      <button onClick={() => handleEditContact(contact)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
