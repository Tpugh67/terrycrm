"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { useRequireAdmin } from "../../../../lib/useRequireAdmin";

type Candidate = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role_title: string;
  current_company: string;
  linkedin_url: string;
  stage: string;
  source: string;
  created_at?: string;
};

const STAGES = [
  "Prospect", "Contacted", "Discovery Call", "NDA", "Executive Interview",
  "Founder Interview", "Due Diligence", "Reference Checks", "Offer",
  "Negotiation", "Accepted", "Active Executive",
];

const STAGE_BAR_COLOR: Record<string, string> = {
  "Prospect": "bg-slate-400",
  "Contacted": "bg-blue-400",
  "Discovery Call": "bg-blue-400",
  "NDA": "bg-indigo-400",
  "Executive Interview": "bg-violet-400",
  "Founder Interview": "bg-violet-400",
  "Due Diligence": "bg-amber-400",
  "Reference Checks": "bg-amber-400",
  "Offer": "bg-orange-400",
  "Negotiation": "bg-orange-400",
  "Accepted": "bg-emerald-400",
  "Active Executive": "bg-emerald-600",
};

function stageColor(stage: string) {
  switch (stage) {
    case "Prospect": return "bg-slate-100 text-slate-700";
    case "Contacted": return "bg-blue-100 text-blue-700";
    case "Discovery Call": return "bg-blue-100 text-blue-700";
    case "NDA": return "bg-indigo-100 text-indigo-700";
    case "Executive Interview": return "bg-violet-100 text-violet-700";
    case "Founder Interview": return "bg-violet-100 text-violet-700";
    case "Due Diligence": return "bg-amber-100 text-amber-700";
    case "Reference Checks": return "bg-amber-100 text-amber-700";
    case "Offer": return "bg-orange-100 text-orange-700";
    case "Negotiation": return "bg-orange-100 text-orange-700";
    case "Accepted": return "bg-emerald-100 text-emerald-700";
    case "Active Executive": return "bg-emerald-600 text-white";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function ExecutiveLeadershipPage() {
  const { checking, allowed } = useRequireAdmin();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role_title: "", current_company: "",
    linkedin_url: "", stage: "Prospect", source: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 25;

  async function loadCandidates() {
    setLoading(true);
    let query = supabase
      .from("exec_candidates")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });
    if (stageFilter !== "all") query = query.eq("stage", stageFilter);
    if (search.trim()) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,role_title.ilike.%${q}%,current_company.ilike.%${q}%`);
    }
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) { console.error("Load candidates error:", error); setLoading(false); return; }
    setCandidates(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  }

  useEffect(() => { loadCandidates(); }, [page, stageFilter, search]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role_title) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (editId !== null) {
      const { error } = await supabase.from("exec_candidates").update(form).eq("id", editId);
      if (error) { console.error("Update candidate error:", error); return; }
      setEditId(null);
    } else {
      const { error } = await supabase.from("exec_candidates").insert({ ...form, created_by: user?.id });
      if (error) { console.error("Insert candidate error:", error); return; }
    }
    setForm({ name: "", email: "", phone: "", role_title: "", current_company: "", linkedin_url: "", stage: "Prospect", source: "" });
    loadCandidates();
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Delete this candidate? This cannot be undone.")) return;
    const { error } = await supabase.from("exec_candidates").delete().eq("id", id);
    if (error) { console.error("Delete candidate error:", error); return; }
    loadCandidates();
  }

  function handleEdit(candidate: Candidate) {
    setForm({
      name: candidate.name, email: candidate.email || "", phone: candidate.phone || "",
      role_title: candidate.role_title, current_company: candidate.current_company || "",
      linkedin_url: candidate.linkedin_url || "", stage: candidate.stage, source: candidate.source || "",
    });
    setEditId(candidate.id || null);
  }

  if (checking) return <div className="text-center py-20 text-slate-400">Checking access...</div>;
  if (!allowed) return null;

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Executive Recruiting</h1>
          <p className="text-slate-500 mt-2 text-base">Candidate pipeline for executive hires.</p>
        </div>
        <Link href="/executive-leadership/pipeline" className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          🔀 Kanban View
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Pipeline Funnel</h2>
        <div className="space-y-2">
          {STAGES.map((s) => {
            const count = candidates.filter((c) => c.stage === s).length;
            const max = Math.max(1, ...STAGES.map((st) => candidates.filter((c) => c.stage === st).length));
            const pct = Math.round((count / max) * 100);
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-40 flex-shrink-0 truncate">{s}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <div className={"h-full rounded-full transition-all " + STAGE_BAR_COLOR[s]} style={{ width: pct + "%" }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">{editId !== null ? "Edit Candidate" : "Add Candidate"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} required className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="role_title" placeholder="Role Being Recruited For *" value={form.role_title} onChange={handleChange} required className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="current_company" placeholder="Current Company" value={form.current_company} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={form.linkedin_url} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <input type="text" name="source" placeholder="Source (e.g. referral, outbound)" value={form.source} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" />
          <select name="stage" value={form.stage} onChange={handleChange} className="border border-slate-300 rounded-xl px-4 py-3 bg-white">
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="bg-slate-950 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition">
              {editId !== null ? "Update Candidate" : "Add Candidate"}
            </button>
            {editId !== null && (
              <button type="button" onClick={() => { setEditId(null); setForm({ name: "", email: "", phone: "", role_title: "", current_company: "", linkedin_url: "", stage: "Prospect", source: "" }); }} className="border border-slate-200 text-slate-600 px-5 py-3 rounded-xl hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Candidate List <span className="text-slate-400 text-base font-normal">({totalCount})</span></h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(0); }} className="border border-slate-300 rounded-xl px-4 py-3">
              <option value="all">All Stages</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="Search candidates..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="border border-slate-300 rounded-xl px-4 py-3 md:w-72" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">🎯</div>
            <div className="font-semibold text-slate-600 mb-1">No candidates yet</div>
            <div className="text-sm">Add a candidate above to start the pipeline.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-3 pr-4">Name</th><th className="pr-4">Role</th><th className="pr-4">Company</th><th className="pr-4">Stage</th><th className="pr-4">Source</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 pr-4 font-medium text-slate-900">
                      <Link href={`/executive-leadership/candidates/${candidate.id}`} className="hover:underline">
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="pr-4 text-slate-600">{candidate.role_title}</td>
                    <td className="pr-4 text-slate-600">{candidate.current_company}</td>
                    <td className="pr-4">
                      <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + stageColor(candidate.stage)}>{candidate.stage}</span>
                    </td>
                    <td className="pr-4 text-slate-600">{candidate.source}</td>
                    <td className="space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(candidate)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDelete(candidate.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => (p + 1) * PAGE_SIZE < totalCount ? p + 1 : p)}
                disabled={(page + 1) * PAGE_SIZE >= totalCount}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
