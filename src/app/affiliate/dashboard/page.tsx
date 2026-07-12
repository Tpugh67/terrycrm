"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function AffiliateDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email || "");
      const code = "aff_" + user.email?.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
      setRefCode(code);
    }
    load();
  }, []);

  const referralLink = `https://pipedesk.app/?ref=${refCode}`;

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
        headers: { "Content-Type": "application/json" },
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

  const QUICK_PROMPTS = [
    "Write a LinkedIn post promoting PipeDesk",
    "Create a Facebook ad for PipeDesk",
    "Generate an email campaign for PipeDesk",
    "Suggest 5 blog ideas about PipeDesk",
    "Write a YouTube video script about PipeDesk",
    "Explain PipeDesk to a real estate investor",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <div>
            <div className="font-bold text-slate-900 text-sm">PipeDesk Affiliate Portal</div>
            <div className="text-xs text-slate-400">{userEmail}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/partners" className="text-sm text-slate-500 hover:text-slate-900">← Partner Home</Link>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Affiliate Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your referrals, commissions, and marketing performance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Clicks", value: "0", icon: "👆", color: "text-blue-600" },
            { label: "Signups", value: "0", icon: "👤", color: "text-purple-600" },
            { label: "Paid Customers", value: "0", icon: "💳", color: "text-emerald-600" },
            { label: "Total Earned", value: "$0.00", icon: "💰", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={"text-3xl font-bold " + s.color}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Referral Link */}
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

          {/* Campaign links */}
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Campaign Links</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Facebook", "LinkedIn", "Email", "YouTube"].map((campaign) => (
                <div key={campaign} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-slate-700 mb-1">{campaign}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{referralLink}&utm_source={campaign.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">💰 Commission Overview</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Commission Rate", value: "20%", sub: "of monthly subscription" },
              { label: "Pending", value: "$0.00", sub: "awaiting approval" },
              { label: "Next Payout", value: "—", sub: "minimum $50 threshold" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="text-center py-8 text-slate-400">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-slate-600 mb-1">No commissions yet</div>
            <div className="text-sm">Share your referral link to start earning.</div>
          </div>
        </div>

        {/* AI Marketing Assistant */}
        <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-slate-900">AI Marketing Assistant</h2>
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">Powered by Claude</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">Generate marketing content for PipeDesk instantly. Posts, emails, scripts, and more.</p>

          {/* Quick prompts */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => { setAiPrompt(prompt); setAiOpen(true); }} className="text-left text-xs bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-medium px-3 py-2 rounded-lg transition">
                {prompt}
              </button>
            ))}
          </div>

          {/* Custom prompt */}
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

          {/* Result */}
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
                    <button onClick={() => { navigator.clipboard.writeText(aiResult); }} className="text-xs font-semibold text-purple-600 hover:text-purple-800">📋 Copy</button>
                    <button onClick={() => { setAiOpen(false); setAiResult(""); setAiPrompt(""); }} className="text-xs font-semibold text-slate-400 hover:text-slate-600">✕ Clear</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Marketing Assets */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🎨 Marketing Assets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "🖼️", title: "Banners & Graphics", desc: "Website banners, social media graphics, email headers", status: "Coming Soon" },
              { icon: "📧", title: "Email Templates", desc: "Ready-to-send email campaigns for your audience", status: "Coming Soon" },
              { icon: "🎬", title: "Video Assets", desc: "Product demos, feature highlights, testimonials", status: "Coming Soon" },
            ].map((asset) => (
              <div key={asset.title} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-2xl mb-2">{asset.icon}</div>
                <div className="font-bold text-slate-900 text-sm mb-1">{asset.title}</div>
                <div className="text-xs text-slate-500 mb-3">{asset.desc}</div>
                <span className="text-xs bg-slate-200 text-slate-500 font-semibold px-2 py-1 rounded-full">{asset.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
