"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Rep = {
  id: string;
  name: string;
  email: string;
  ref_code: string;
  status: string;
};

type Activity = {
  id: string;
  created_at: string;
  activity_type: string;
  platform: string;
  post_url: string;
  description: string;
  notes: string;
};

export default function RepPortalPage() {
  const [rep, setRep] = useState<Rep | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ activity_type: "LinkedIn post", platform: "LinkedIn", post_url: "", description: "", notes: "" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: repData } = await supabase.from("reps").select("*").eq("email", user.email).single();
      if (repData) {
        setRep(repData);
        const { data: acts } = await supabase.from("rep_activity").select("*").eq("rep_id", repData.id).order("created_at", { ascending: false });
        if (acts) setActivities(acts);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function logActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!rep) return;
    setSubmitting(true);
    const { data } = await supabase.from("rep_activity").insert({ rep_id: rep.id, ...form }).select().single();
    if (data) setActivities([data, ...activities]);
    setShowForm(false);
    setForm({ activity_type: "LinkedIn post", platform: "LinkedIn", post_url: "", description: "", notes: "" });
    setSubmitting(false);
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">Loading...</div>;

  if (!rep) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center">
        <div className="text-2xl mb-3">⏳</div>
        <h2 className="font-semibold text-slate-800 mb-2">Application Pending</h2>
        <p className="text-sm text-slate-500">Your rep application is under review. Terry will be in touch within 48 hours.</p>
      </div>
    </div>
  );

  const refLink = `https://pipedesk.app/?ref=${rep.ref_code}`;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-[#0d1f3c] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-white/50 uppercase tracking-widest">Rep Portal</div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rep.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{rep.status}</span>
          </div>
          <h1 className="text-xl font-semibold mt-1">Welcome, {rep.name.split(" ")[0]}</h1>
          <p className="text-white/50 text-sm mt-0.5">{rep.email}</p>
        </div>

        {/* Referral link */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Your Referral Link</h2>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <span className="text-sm font-mono text-[#1a5fa8] flex-1 truncate">{refLink}</span>
            <button onClick={() => navigator.clipboard.writeText(refLink)}
              className="text-xs px-3 py-1.5 bg-[#0d1f3c] text-white rounded-lg hover:bg-[#1a3a6e] transition shrink-0">
              Copy
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Share this link on LinkedIn, Facebook, email, or anywhere. Every signup through your link is tracked to you.</p>
        </div>

        {/* Commission info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Your Commission</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Rate", value: "30%" },
              { label: "Active Clients", value: "0" },
              { label: "Monthly Income", value: "$0" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-xl font-semibold text-[#1a5fa8]">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Activity Log</h2>
            <button onClick={() => setShowForm(!showForm)}
              className="text-xs px-3 py-1.5 bg-[#0d1f3c] text-white rounded-lg hover:bg-[#1a3a6e] transition">
              + Log Activity
            </button>
          </div>

          {showForm && (
            <form onSubmit={logActivity} className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Activity type</label>
                  <select value={form.activity_type} onChange={e => setForm({...form, activity_type: e.target.value})}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-slate-800 focus:outline-none">
                    {["LinkedIn post","Facebook post","TikTok video","Email campaign","Direct outreach","Networking event","Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Platform</label>
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-slate-800 focus:outline-none">
                    {["LinkedIn","Facebook","TikTok","Instagram","Email","Phone","In Person","Other"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">Post URL (optional)</label>
                <input type="text" placeholder="https://..." value={form.post_url} onChange={e => setForm({...form, post_url: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">Description</label>
                <textarea rows={2} required placeholder="What did you do?" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none resize-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-2 bg-[#0d1f3c] text-white text-sm rounded-lg hover:bg-[#1a3a6e] transition disabled:opacity-50">
                {submitting ? "Saving..." : "Save Activity"}
              </button>
            </form>
          )}

          {activities.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No activity logged yet. Start sharing your referral link!</p>
          ) : (
            <div className="space-y-3">
              {activities.map(act => (
                <div key={act.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-slate-700">{act.activity_type}</span>
                      <span className="text-xs text-slate-400">· {act.platform}</span>
                    </div>
                    <p className="text-sm text-slate-600">{act.description}</p>
                    {act.post_url && <a href={act.post_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{act.post_url}</a>}
                  </div>
                  <div className="text-xs text-slate-300 shrink-0">{new Date(act.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <a href="/login" onClick={() => supabase.auth.signOut()} className="text-xs text-slate-500 hover:text-slate-300 transition">Sign out</a>
        </div>

      </div>
    </div>
  );
}
