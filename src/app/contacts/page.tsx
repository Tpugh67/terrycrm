"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
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

  async function loadContacts() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load contacts error:", error);
      return;
    }

    setContacts(data || []);
  }

  useEffect(() => {
    loadContacts();
  }, []);

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
      const { error } = await supabase
        .from("contacts")
        .update(form)
        .eq("id", editId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Update contact error:", error);
        return;
      }

      setEditId(null);
    } else {
      const { error } = await supabase.from("contacts").insert({
        ...form,
        user_id: user.id,
      });

      if (error) {
        console.error("Insert contact error:", error);
        return;
      }
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
    });

    loadContacts();
  }

  async function handleDeleteContact(id?: number) {
    if (!id) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete contact error:", error);
      return;
    }

    loadContacts();
  }

  function handleEditContact(contact: Contact) {
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
    });
    setEditId(contact.id || null);
  }

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.company]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [contacts, search]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Contacts</h1>
        <p className="text-slate-500 mt-2 text-base">
          Manage sellers, buyers, and business contacts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {editId !== null ? "Edit Contact" : "Add Contact"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <button type="submit" className="bg-slate-950 text-white px-5 py-3 rounded-xl w-fit hover:bg-slate-800 transition">
            {editId !== null ? "Update Contact" : "Add Contact"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Contact List</h2>
          <input type="text" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-slate-300 rounded-xl px-4 py-3 md:w-80" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left"><thead><tr className="border-b border-slate-200 text-slate-500 text-sm"><th className="py-3">Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Actions</th></tr></thead><tbody>{filteredContacts.map((contact) => <tr key={contact.id} className="border-b border-slate-100"><td className="py-4 font-medium text-slate-900">{contact.name}</td><td className="text-slate-600">{contact.email}</td><td className="text-slate-600">{contact.phone}</td><td className="text-slate-600">{contact.company}</td><td className="space-x-3"><button onClick={() => handleEditContact(contact)} className="text-blue-600 hover:underline">Edit</button><button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:underline">Delete</button></td></tr>)}</tbody></table>
        </div>
      </div>
    </>
  );
}
