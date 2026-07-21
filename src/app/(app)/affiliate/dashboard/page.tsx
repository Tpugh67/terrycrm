"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { getAuthHeaders } from "../../../../lib/authHeader";
import Logo from "../../../../components/Logo";

type Affiliate = {
  id: string;
  name: string;
  email: string;
  ref_code: string;
  status: string;
};

type Lead = {
  id: string;
  email: string;
  subscription_status: string;
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
  "Write a LinkedIn post promoting PipeDesk",
  "Create a Facebook ad for PipeDesk",
  "Generate an email newsletter blurb about PipeDesk",
  "Suggest 5 blog ideas about PipeDesk",
  "Write a YouTube video script about PipeDesk",
  "Explain PipeDesk to a real estate investor",
];

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: repData } = await supabase
        .from("reps")
        .select("id, name, email, ref_code, status")
        .eq("email", user.email)
        .eq("partner_type", "affiliate")
        .maybeSingle();

      if (repData) {
        setAffiliate(repData);

        const { data: leadsData } = await supabase
          .from("profiles")
          .select("id, email, subscription_status, created_at")
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

  const referralLink = affiliate ? `https://pipedesk.app/?ref=${affiliate.ref_code}` : "";
  const activeClients = leads.filter(l => l.subscription_status === "active").length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = commissions
    .filter(c => c.month === currentMonth && c.status === "paid")
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
  const totalEarned = commissions
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function runAI() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          prompt: `You are a marketing assistant for PipeDesk, a multi-industry CRM serving 18 industries at $29-149/month. An affiliate partner is asking you to help them create marketing content. Follow PipeDesk brand guidelines: professional, helpful, growth-focused. Request: ${aiPrompt}`
        }),
      });
      const data = await res.json();
      setAiResult(data.result || "Something went wrong.");
    } catch {
      setAiResult("Failed to connect. Please try again.");
    }
    setAiLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
  );

  if (!affiliate) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
        <div className="text-4xl mb-3">⏳</div>
        <h2 className="font-bold text-slate-800 mb-2">Application Pending</h2>
        <p className="text-sm text-slate-500">Your affiliate application is under review. You will hear back within 24 hours.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <div className="font-bold text-slate-900 text-sm">PipeDesk Affiliate Portal</div>
            <div className="text-xs text-slate-400">{affiliate.name} · {affiliate.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${affiliate.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
            {affiliate.status}
          </span>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {affiliate.name.split(" ")[0]} 👋</h1>
          <p className="text-slate-500 mt-1">Track your referrals, commissions, and marketing performance.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Commission Rate", value: "20%", icon: "💰", color: "text-emerald-600" },
            { label: "Active Clients", value: String(activeClients), icon: "👥", color: "text-blue-600" },
            { label: "Monthly Income", value: `$${monthlyIncome.toFixed(2)}`, icon: "📈", color: "text-purple-600" },
            { label: "Total Earned", value: `$${totalEarned.toFixed(2)}`, icon: "💵", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🔗 Your Referral Link</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 font-mono truncate">
              {referralLink}
            </div>
            <button onClick={copyLink} className={"text-sm font-bold px-4 py-3 rounded-lg transition " + (copied ? "bg-emerald-100 text-emerald-700" : "bg-blue-600 hover:bg-blue-700 text-white")}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">Share this link anywhere. You earn 20% recurring commission on every customer who signs up through it.</p>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Facebook", "LinkedIn", "Email", "YouTube"].map((campaign) => (
              <div key={campaign} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">{campaign}</div>
                <button onClick={() => navigator.clipboard.writeText(referralLink + "?utm_source=" + campaign.toLowerCase())}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold">Copy link</button>
              </div>
            ))}
          </div>
        </div>

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

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">💰 Commission Structure</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { plan: "Solo Plan", price: "$29/mo", commission: "$5.80/mo" },
              { plan: "Team Plan", price: "$79/mo", commission: "$15.80/mo" },
              { plan: "Business Plan", price: "$149/mo", commission: "$29.80/mo" },
            ].map((p) => (
              <div key={p.plan} className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <div className="font-bold text-slate-900 mb-1">{p.plan}</div>
                <div className="text-xs text-slate-400 mb-2">{p.price} per customer</div>
                <div className="text-xl font-bold text-emerald-600">{p.commission}</div>
                <div className="text-xs text-slate-400">your commission</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-slate-900">AI Marketing Assistant</h2>
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">Powered by Claude</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">Generate marketing content for PipeDesk instantly.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {AI_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => { setAiPrompt(prompt); setAiOpen(true); }} className="text-left text-xs bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-medium px-3 py-2 rounded-lg transition">
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setAiOpen(true); runAI(); } }}
              placeholder="Ask AI anything... e.g. Write a tweet about PipeDesk"
              className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={() => { setAiOpen(true); runAI(); }} disabled={aiLoading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-lg text-sm transition">
              {aiLoading ? "..." : "Generate"}
            </button>
          </div>

          {aiOpen && (
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
                    <button onClick={() => { setAiOpen(false); setAiResult(""); setAiPrompt(""); }} className="text-xs font-semibold text-slate-400 hover:text-slate-600">✕ Clear</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
