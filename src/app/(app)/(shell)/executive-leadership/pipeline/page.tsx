"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../../../lib/supabase";
import { useRequireAdmin } from "../../../../../lib/useRequireAdmin";

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

const STAGE_DOT: Record<string, string> = {
  "Prospect": "bg-slate-400",
  "Contacted": "bg-blue-500",
  "Discovery Call": "bg-blue-500",
  "NDA": "bg-indigo-500",
  "Executive Interview": "bg-violet-500",
  "Founder Interview": "bg-violet-500",
  "Due Diligence": "bg-amber-500",
  "Reference Checks": "bg-amber-500",
  "Offer": "bg-orange-500",
  "Negotiation": "bg-orange-500",
  "Accepted": "bg-emerald-500",
  "Active Executive": "bg-emerald-600",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ExecutivePipelinePage() {
  const { checking, allowed } = useRequireAdmin();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function loadCandidates() {
    setLoading(true);
    const { data, error } = await supabase
      .from("exec_candidates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("Load candidates error:", error); setLoading(false); return; }
    setCandidates(data || []);
    setLoading(false);
  }

  useEffect(() => { loadCandidates(); }, []);

  async function handleStageChange(id: number | undefined, newStage: string) {
    if (!id) return;
    const { data: { user } } = await supabase.auth.getUser();
    const prev = candidates.find((c) => c.id === id);
    const prevStage = prev?.stage;
    setCandidates((cs) => cs.map((c) => c.id === id ? { ...c, stage: newStage } : c));
    const { error } = await supabase.from("exec_candidates")
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setCandidates((cs) => cs.map((c) => c.id === id ? { ...c, stage: prevStage || c.stage } : c));
      alert(error.message);
      return;
    }
    await supabase.from("exec_activities").insert({
      candidate_id: id,
      activity_type: "stage_change",
      detail: `Moved from ${prevStage} to ${newStage}`,
      actor: user?.id,
    });
  }

  async function handleDelete(id?: number) {
    if (!id || !confirm("Delete this candidate? This cannot be undone.")) return;
    const { error } = await supabase.from("exec_candidates").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    loadCandidates();
  }

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return candidates;
    return candidates.filter((c) =>
      [c.name, c.role_title, c.current_company].join(" ").toLowerCase().includes(query)
    );
  }, [candidates, search]);

  const stageCandidates = (s: string) => filteredCandidates.filter((c) => c.stage === s);

  if (checking) return <div className="text-center py-20 text-slate-400">Checking access...</div>;
  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-slate-50 -m-4 md:-m-6">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/executive-leadership" className="text-sm text-slate-400 hover:text-slate-700">← List</Link>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Executive Pipeline</h1>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-400">{candidates.length} candidates</span>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-full md:w-64 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading pipeline...</div>
      ) : (
        <div className="px-6 py-5 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {STAGES.map((stage) => {
              const items = stageCandidates(stage);
              return (
                <div key={stage} className="flex flex-col w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={"w-2.5 h-2.5 rounded-full " + STAGE_DOT[stage]} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{stage}</span>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full px-2 py-0.5">{items.length}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {items.length === 0 && (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center h-16 text-xs text-slate-400">
                        Empty
                      </div>
                    )}

                    {items.map((c) => {
                      const expanded = expandedId === c.id;
                      return (
                        <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md text-sm transition-all">
                          <div className="p-4 cursor-pointer select-none" onClick={() => setExpandedId(expanded ? null : c.id!)}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {initials(c.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 leading-tight truncate">{c.name}</div>
                                <div className="text-xs text-slate-400 truncate">{c.role_title}</div>
                              </div>
                            </div>
                            {c.current_company && <div className="text-xs text-slate-400 mt-2 truncate">{c.current_company}</div>}
                            <div className="mt-2 text-[10px] text-slate-400 text-right">{expanded ? "▲" : "▼"}</div>
                          </div>

                          {expanded && (
                            <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                              <div className="mb-3">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Move stage</div>
                                <select
                                  value={c.stage}
                                  onChange={(e) => handleStageChange(c.id, e.target.value)}
                                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                                </select>
                              </div>
                              <div className="flex gap-4">
                                <Link href={`/executive-leadership/candidates/${c.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                                  View profile
                                </Link>
                                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
