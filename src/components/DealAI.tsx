"use client";
import { useState } from "react";
import { getAuthHeaders } from "../lib/authHeader";

type Deal = {
  title: string;
  seller: string;
  stage: string;
  arv?: string;
  offer?: string;
  amount?: string;
  address?: string;
  next_follow_up?: string;
};

type Action = {
  id: string;
  label: string;
  emoji: string;
  prompt: (deal: Deal, notes: string) => string;
};

const ACTIONS: Action[] = [
  {
    id: "email",
    label: "Draft follow-up email",
    emoji: "📧",
    prompt: (deal, notes) => `You are a CRM assistant for a ${deal.stage} deal. Write a short, professional follow-up email to ${deal.seller} about "${deal.title}"${deal.address ? ` at ${deal.address}` : ""}. The deal is in the "${deal.stage}" stage.${notes ? ` Recent notes: ${notes}` : ""} Keep it under 150 words, friendly, and end with a clear call to action. Do not use placeholders — write the full email ready to send.`,
  },
  {
    id: "next",
    label: "Suggest next action",
    emoji: "🎯",
    prompt: (deal, notes) => `You are a CRM assistant. Based on this deal: Title: "${deal.title}", Seller: ${deal.seller}, Stage: ${deal.stage}, ARV: ${deal.arv || "unknown"}, Offer: ${deal.offer || "none made"}.${notes ? ` Recent activity: ${notes}` : ""} Suggest the single most important next action to move this deal forward. Be specific and actionable. Keep it to 2-3 sentences.`,
  },
  {
    id: "summary",
    label: "Summarize this deal",
    emoji: "📋",
    prompt: (deal, notes) => `Summarize this CRM deal in 3-4 bullet points: Title: "${deal.title}", Seller: ${deal.seller}, Stage: ${deal.stage}, ARV: ${deal.arv || "N/A"}, Offer: ${deal.offer || "N/A"}, Fee: ${deal.amount || "N/A"}.${notes ? ` Activity notes: ${notes}` : ""} Include deal status, key numbers, and any risks or opportunities.`,
  },
  {
    id: "health",
    label: "Assess deal health",
    emoji: "🩺",
    prompt: (deal, notes) => `You are a real estate wholesale CRM assistant. Based on: Deal: "${deal.title}", Stage: "${deal.stage}", ARV: ${deal.arv || "unknown"}, Offer: ${deal.offer || "none"}, Follow-up: ${deal.next_follow_up || "not set"}.${notes ? ` Notes: ${notes}` : ""} Do NOT state or imply any percentage or numeric probability of closing -- you have no statistical model to base one on. Instead, give a one-word qualitative health signal (Strong, Moderate, or Weak) based only on the real facts provided, followed by a 2-3 sentence explanation of the key factors driving that assessment. If there isn't enough information to make a reasonable assessment, say so explicitly instead of guessing.`,
  },
  {
    id: "objections",
    label: "Handle objections",
    emoji: "💬",
    prompt: (deal, notes) => `You are a sales coach for a CRM deal. Deal: "${deal.title}", Seller: ${deal.seller}, Stage: "${deal.stage}".${notes ? ` Recent notes: ${notes}` : ""} List the 2-3 most likely seller objections at this stage and give a short, confident response to each one. Keep each response under 2 sentences.`,
  },
];

export default function DealAI({ deal, notes }: { deal: Deal; notes: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [copied, setCopied] = useState(false);

  async function runAction(action: Action) {
    setActiveAction(action.id);
    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({ prompt: action.prompt(deal, notes) }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "Something went wrong.");
    } catch {
      setResult("Failed to connect to AI. Please try again.");
    }

    setLoading(false);
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-400 bg-purple-50 hover:bg-purple-100 rounded-lg py-2 transition"
      >
        ✨ AI Assistant
      </button>
    );
  }

  return (
    <div className="mt-2 border border-purple-200 rounded-xl bg-purple-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-purple-600">
        <span className="text-white text-xs font-bold">✨ AI Assistant</span>
        <button onClick={() => { setOpen(false); setResult(""); setActiveAction(""); }} className="text-purple-200 hover:text-white text-sm">✕</button>
      </div>

      {/* Action buttons */}
      <div className="p-3 grid grid-cols-1 gap-1.5">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => runAction(action)}
            disabled={loading}
            className={"flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition " + (
              activeAction === action.id && !loading
                ? "bg-purple-600 text-white"
                : "bg-white text-slate-700 hover:bg-purple-100 border border-purple-100"
            )}
          >
            <span>{action.emoji}</span>
            <span>{action.label}</span>
            {activeAction === action.id && loading && <span className="ml-auto text-purple-400 animate-pulse">...</span>}
          </button>
        ))}
      </div>

      {/* Result */}
      {(loading || result) && (
        <div className="px-3 pb-3">
          <div className="bg-white border border-purple-100 rounded-lg p-3">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <span className="animate-pulse">✨</span>
                <span>Generating...</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{result}</p>
                <button
                  onClick={copyResult}
                  className="mt-2 text-[10px] font-semibold text-purple-600 hover:text-purple-800"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
