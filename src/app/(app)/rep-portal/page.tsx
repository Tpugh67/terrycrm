"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { getAuthHeaders } from "../../../lib/authHeader";

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

type Lead = {
  id: string;
  email: string;
  subscription_status: string;
  plan: string;
  created_at: string;
};

type Commission = {
  id: string;
  subscription_amount: number | null;
  commission_amount: number | null;
  month: string;
  status: string;
};

const AI_PROMPTS = [
  "Write a LinkedIn post promoting PipeDesk CRM",
  "Create a cold email to a real estate investor about PipeDesk",
  "Write a Facebook post about PipeDesk for small businesses",
  "Generate 5 objection responses for PipeDesk sales calls",
  "Write an SMS follow-up message for a PipeDesk prospect",
  "Create a 60-second elevator pitch for PipeDesk",
];

export default function RepPortalPage() {
  const [rep, setRep] = useState<Rep | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard"|"activity"|"ai"|"training">("dashboard");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    activity_type: "LinkedIn post", platform: "LinkedIn",
    post_url: "", description: "", notes: ""
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: repData } = await supabase.from("reps").select("*").eq("email", user.email).single();
      if (repData) {
        setRep(repData);
        const { data: acts } = await supabase.from("rep_activity").select("*").eq("rep_id", repData.id).order("created_at", { ascending: false });
        if (acts) setActivities(acts);

        const { data: leadsData } = await supabase
          .from("profiles")
          .select("id, email, subscription_status, plan, created_at")
          .eq("referred_by", repData.ref_code)
          .order("created_at", { ascending: false });
        if (leadsData) setLeads(leadsData);

        const { data: commData } = await supabase
          .from("rep_commissions")
          .select("id, subscription_amount, commission_amount, month, status")
          .eq("rep_id", repData.id)
          .order("month", { ascending: false });
        if (commData) setCommissions(commData);
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

  async function runAI(prompt: string) {
    setAiPrompt(prompt);
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          prompt: `You are a sales assistant for PipeDesk, a multi-industry CRM at $29-149/month with 18 industry pipelines. Help this sales rep with their request. Be specific, professional, and ready to use. Request: ${prompt}`
        }),
      });
      const data = await res.json();
      setAiResult(data.result || "Something went wrong.");
    } catch {
      setAiResult("Failed to connect. Please try again.");
    }
    setAiLoading(false);
  }

  function copyLink() {
    if (!rep) return;
    navigator.clipboard.writeText(`https://pipedesk.app/?ref=${rep.ref_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">Loading...</div>
  );

  if (!rep) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center">
        <div className="text-4xl mb-3">⏳</div>
        <h2 className="font-bold text-slate-800 mb-2">Application Pending</h2>
        <p className="text-sm text-slate-500">Your rep application is under review. You will hear back within 48 hours.</p>
      </div>
    </div>
  );

  const refLink = `https://pipedesk.app/?ref=${rep.ref_code}`;
  const activeClients = leads.filter(l => l.subscription_status === "active").length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = commissions
    .filter(c => c.month === currentMonth && c.status === "paid")
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
  const totalEarned = commissions
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <div>
            <div className="font-bold text-sm">PipeDesk Rep Portal</div>
            <div className="text-xs text-slate-400">{rep.name} · {rep.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${rep.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
            {rep.status}
          </span>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")} className="text-xs text-slate-400 hover:text-white">Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "activity", label: "📋 Activity Log" },
            { id: "ai", label: "✨ AI Assistant" },
            { id: "training", label: "🎓 Training" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={"px-4 py-3 text-sm font-semibold border-b-2 transition " + (activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            {/* Welcome */}
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="text-sm text-slate-400 mb-1">Welcome back</div>
              <h1 className="text-2xl font-bold mb-1">{rep.name.split(" ")[0]} 👋</h1>
              <p className="text-slate-400 text-sm">Your rep dashboard — track your referrals, commissions, and activity.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Commission Rate", value: "30%", icon: "💰", color: "text-emerald-600" },
                { label: "Active Clients", value: String(activeClients), icon: "👥", color: "text-blue-600" },
                { label: "Monthly Income", value: `$${monthlyIncome.toFixed(2)}`, icon: "📈", color: "text-purple-600" },
                { label: "Activities Logged", value: String(activities.length), icon: "📋", color: "text-amber-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Referral Link */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">🔗 Your Referral Link</h2>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-3">
                <span className="text-sm font-mono text-blue-600 flex-1 truncate">{refLink}</span>
                <button onClick={copyLink} className={"text-sm font-bold px-4 py-2 rounded-lg transition " + (copied ? "bg-emerald-100 text-emerald-700" : "bg-blue-600 hover:bg-blue-700 text-white")}>
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <p className="text-xs text-slate-400">Share this link on LinkedIn, Facebook, email, or anywhere. Every signup through your link is tracked to you and earns you 30% recurring commission.</p>

              {/* Campaign links */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {["LinkedIn", "Facebook", "Email", "TikTok"].map((platform) => (
                  <div key={platform} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-slate-600 mb-1">{platform}</div>
                    <button onClick={() => navigator.clipboard.writeText(refLink + "?utm_source=" + platform.toLowerCase())}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold">Copy link</button>
                  </div>
                ))}
              </div>
            </div>

            {/* My Leads */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">👥 My Leads</h2>
              {leads.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="text-3xl mb-2">🔗</div>
                  <div className="font-semibold text-slate-600 mb-1">No signups yet</div>
                  <div className="text-sm">Share your referral link above to start earning.</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{lead.email}</div>
                        <div className="text-xs text-slate-400">Joined {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                      <span className={"text-xs font-bold px-2 py-1 rounded-full " + (
                        lead.subscription_status === "active" ? "bg-emerald-100 text-emerald-700" :
                        lead.subscription_status === "trial" ? "bg-blue-100 text-blue-700" :
                        lead.subscription_status === "past_due" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-200 text-slate-600"
                      )}>
                        {lead.subscription_status === "active" ? "Paying" :
                         lead.subscription_status === "trial" ? "On Trial" :
                         lead.subscription_status === "past_due" ? "Past Due" :
                         lead.subscription_status || "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commission breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">💰 Commission Structure</h2>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total earned</div>
                  <div className="text-xl font-bold text-emerald-600">${totalEarned.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { plan: "Solo Plan", price: "$29/mo", commission: "$8.70/mo" },
                  { plan: "Team Plan", price: "$79/mo", commission: "$23.70/mo" },
                  { plan: "Business Plan", price: "$149/mo", commission: "$44.70/mo" },
                ].map((p) => (
                  <div key={p.plan} className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <div className="font-bold text-slate-900 mb-1">{p.plan}</div>
                    <div className="text-xs text-slate-400 mb-2">{p.price} per customer</div>
                    <div className="text-xl font-bold text-emerald-600">{p.commission}</div>
                    <div className="text-xs text-slate-400">your commission</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">Commissions are recurring — you earn every month as long as the customer stays subscribed.</p>
            </div>
          </>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">📋 Activity Log</h2>
              <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
                + Log Activity
              </button>
            </div>

            {showForm && (
              <form onSubmit={logActivity} className="bg-slate-50 rounded-xl p-5 mb-6 space-y-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Activity Type</label>
                    <select value={form.activity_type} onChange={e => setForm({...form, activity_type: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["LinkedIn post","Facebook post","TikTok video","Email campaign","Direct outreach","Networking event","Phone call","Text message","Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Platform</label>
                    <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["LinkedIn","Facebook","TikTok","Instagram","Email","Phone","In Person","Other"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Post URL (optional)</label>
                  <input type="text" placeholder="https://..." value={form.post_url} onChange={e => setForm({...form, post_url: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description *</label>
                  <textarea rows={3} required placeholder="What did you do? Who did you reach?" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm transition">
                    {submitting ? "Saving..." : "Save Activity"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">📋</div>
                <div className="font-semibold text-slate-600 mb-1">No activity logged yet</div>
                <div className="text-sm">Start sharing your referral link and log your activities here.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map(act => (
                  <div key={act.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-700">{act.activity_type}</span>
                        <span className="text-xs text-slate-400">· {act.platform}</span>
                      </div>
                      <p className="text-sm text-slate-600">{act.description}</p>
                      {act.post_url && <a href={act.post_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">{act.post_url}</a>}
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">{new Date(act.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI ASSISTANT TAB */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">✨</span>
                <h2 className="text-lg font-bold text-slate-900">AI Sales Assistant</h2>
                <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">Powered by Claude</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Generate sales content, emails, scripts, and more instantly.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {AI_PROMPTS.map((prompt) => (
                  <button key={prompt} onClick={() => runAI(prompt)}
                    className="text-left text-xs bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-medium px-3 py-2.5 rounded-lg transition">
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") runAI(aiPrompt); }}
                  placeholder="Ask AI anything... e.g. Write a cold email to a dentist"
                  className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button onClick={() => runAI(aiPrompt)} disabled={aiLoading || !aiPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-lg text-sm transition">
                  {aiLoading ? "..." : "Generate"}
                </button>
              </div>

              {(aiLoading || aiResult) && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-sm text-purple-400">
                      <span className="animate-pulse">✨</span>
                      <span>Generating your content...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResult}</p>
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => navigator.clipboard.writeText(aiResult)} className="text-xs font-semibold text-purple-600 hover:text-purple-800">📋 Copy</button>
                        <button onClick={() => { setAiResult(""); setAiPrompt(""); }} className="text-xs font-semibold text-slate-400 hover:text-slate-600">✕ Clear</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TRAINING TAB */}
        {activeTab === "training" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">🎓 Sales Rep Training</h2>
            <div className="space-y-4">
              {[
                { title: "Getting Started as a PipeDesk Rep", desc: "Learn your referral link, commission structure, and how to get your first customer.", status: "Start", color: "bg-blue-600" },
                { title: "Who to Target — 18 Industries", desc: "Learn which businesses need PipeDesk and how to identify the right prospects.", status: "Start", color: "bg-blue-600" },
                { title: "Your Sales Script", desc: "Word-for-word scripts for LinkedIn DMs, cold emails, phone calls, and follow-ups.", status: "Start", color: "bg-blue-600" },
                { title: "Handling Objections", desc: "The most common objections and exactly how to respond to each one.", status: "Coming Soon", color: "bg-slate-300" },
                { title: "Closing the Deal", desc: "How to move prospects from free trial to paid customer.", status: "Coming Soon", color: "bg-slate-300" },
                { title: "Building Recurring Income", desc: "How to stack clients and build a $1,000+/month recurring commission income.", status: "Coming Soon", color: "bg-slate-300" },
              ].map((module) => (
                <div key={module.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm mb-1">{module.title}</div>
                    <div className="text-xs text-slate-500">{module.desc}</div>
                  </div>
                  <button disabled={module.status === "Coming Soon"} className={"text-xs font-bold px-4 py-2 rounded-lg text-white " + module.color}>
                    {module.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
