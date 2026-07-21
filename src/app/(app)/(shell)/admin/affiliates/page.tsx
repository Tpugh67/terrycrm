"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";

type Application = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  website: string;
  audience: string;
  platform: string;
  why: string;
  status: string;
};

export default function AdminAffiliatesPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function loadApps() {
    const { data } = await supabase
      .from("affiliate_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string, name: string, email: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/update-partner-status", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ partnerType: "affiliate", status, applicationId: id, name, email }),
    });
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
  }

  useEffect(() => { loadApps(); }, []);

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);
  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Affiliate Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{counts.pending} pending review</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${filter === f ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-50"}`}>
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
          {filtered.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-800">{app.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      app.status === "approved" ? "bg-green-100 text-green-700" :
                      app.status === "rejected" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{app.status}</span>
                  </div>
                  <div className="text-sm text-slate-500 mb-3">{app.email} {app.platform && `· ${app.platform}`}</div>
                  {app.website && (
                    <a href={app.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-3 block">{app.website}</a>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Audience</div>
                      <div className="text-sm text-slate-600 leading-relaxed">{app.audience}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Promotion Plan</div>
                      <div className="text-sm text-slate-600 leading-relaxed">{app.why}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {app.status !== "approved" && (
                    <button onClick={() => updateStatus(app.id, "approved", app.name, app.email)}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                      Approve
                    </button>
                  )}
                  {app.status !== "rejected" && (
                    <button onClick={() => updateStatus(app.id, "rejected", app.name, app.email)}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition">
                      Reject
                    </button>
                  )}
                  {app.status !== "pending" && (
                    <button onClick={() => updateStatus(app.id, "pending", app.name, app.email)}
                      className="px-4 py-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium hover:bg-gray-100 transition">
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-300 mt-4">
                Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
