"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Rep = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  sales_background: string;
  why_interested: string;
  status: string;
  ref_code: string;
};

export default function AdminRepsPage() {
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function loadReps() {
    const { data } = await supabase
      .from("reps")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReps(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("reps").update({ status }).eq("id", id);
    setReps(reps.map(r => r.id === id ? { ...r, status } : r));
  }

  useEffect(() => { loadReps(); }, []);

  const filtered = filter === "all" ? reps : reps.filter(r => r.status === filter);
  const counts = {
    all: reps.length,
    pending: reps.filter(r => r.status === "pending").length,
    approved: reps.filter(r => r.status === "approved").length,
    rejected: reps.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Sales Rep Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{counts.pending} pending review</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${filter === f ? "bg-[#0d1f3c] text-white" : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-50"}`}>
            {f} ({counts[f as keyof typeof counts]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-slate-400 text-sm">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rep => (
            <div key={rep.id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-800">{rep.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      rep.status === "approved" ? "bg-green-100 text-green-700" :
                      rep.status === "rejected" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{rep.status}</span>
                  </div>
                  <div className="text-sm text-slate-500 mb-3">{rep.email} {rep.phone && `· ${rep.phone}`}</div>
                  {rep.linkedin && (
                    <a href={rep.linkedin} target="_blank" rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline mb-3 block">{rep.linkedin}</a>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Sales Background</div>
                      <div className="text-sm text-slate-600 leading-relaxed">{rep.sales_background}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Why Interested</div>
                      <div className="text-sm text-slate-600 leading-relaxed">{rep.why_interested}</div>
                    </div>
                  </div>
                  {rep.status === "approved" && rep.ref_code && (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Referral Link</div>
                      <div className="text-sm font-mono text-[#1a5fa8]">pipedesk.app/?ref={rep.ref_code}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {rep.status !== "approved" && (
                    <button onClick={() => updateStatus(rep.id, "approved")}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                      Approve
                    </button>
                  )}
                  {rep.status !== "rejected" && (
                    <button onClick={() => updateStatus(rep.id, "rejected")}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition">
                      Reject
                    </button>
                  )}
                  {rep.status !== "pending" && (
                    <button onClick={() => updateStatus(rep.id, "pending")}
                      className="px-4 py-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium hover:bg-gray-100 transition">
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-300 mt-4">
                Applied {new Date(rep.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
