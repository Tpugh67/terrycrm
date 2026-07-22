"use client";
import { useState } from "react";

type Post = {
  id: string;
  platform: string;
  caption: string;
  hashtags: string;
};

const POSTS: Post[] = [
  {
    id: "fb-1",
    platform: "Facebook",
    caption: "Still tracking leads in a spreadsheet? 📊 PipeDesk gives your team a CRM built specifically for your industry — real stages, real terminology, zero configuration headaches. 14-day free trial, no card required.",
    hashtags: "#CRM #SmallBusiness #SalesTools",
  },
  {
    id: "fb-2",
    platform: "Facebook",
    caption: "The best CRM isn't the one with the most features — it's the one built for how YOU actually sell. That's PipeDesk. Pick your industry, and your pipeline is ready in minutes.",
    hashtags: "#PipeDesk #CRMSoftware",
  },
  {
    id: "li-1",
    platform: "LinkedIn",
    caption: "Generic CRMs make you adapt your process to fit the software. We built PipeDesk to do the opposite — 18 industries, each with pipeline stages and fields that actually match how deals move in that industry. If your CRM feels like extra admin work instead of a tool that helps you close, it might be time for a change.",
    hashtags: "#SalesEnablement #CRM #B2BSales",
  },
  {
    id: "li-2",
    platform: "LinkedIn",
    caption: "We just shipped an AI assistant inside every deal card — draft follow-up emails, get a next-action suggestion, or get an honest read on deal health, all grounded in your team's real data. No fabricated stats, no black-box scoring. Just useful, honest AI.",
    hashtags: "#AI #SalesTech #ProductUpdate",
  },
  {
    id: "ig-1",
    platform: "Instagram",
    caption: "Your CRM should work as hard as you do. 💪 Swipe to see how PipeDesk sets up your pipeline in under 5 minutes — no generic templates, no configuration marathon.",
    hashtags: "#CRM #SmallBizTips #Productivity",
  },
  {
    id: "x-1",
    platform: "X",
    caption: "Hot take: most CRMs are built for sales teams in general. PipeDesk is built for YOUR industry specifically. That's the whole difference. 🎯",
    hashtags: "#CRM #SaaS",
  },
  {
    id: "x-2",
    platform: "X",
    caption: "14-day free trial. No credit card. Every feature included, not paywalled behind a \"contact sales\" button. That's how PipeDesk pricing works. 🚀",
    hashtags: "#PipeDesk #Pricing",
  },
  {
    id: "reddit-1",
    platform: "Reddit",
    caption: "Been using a lot of generic CRMs over the years and honestly got tired of bending my sales process to fit software that wasn't built for my industry. Found PipeDesk a few months back — it's set up specifically around how my industry's deals actually move through stages, not a generic \"lead > opportunity > closed\" funnel. Not affiliated, just wanted to share in case anyone else is dealing with the same frustration.",
    hashtags: "",
  },
];

const PLATFORMS = ["All", ...Array.from(new Set(POSTS.map((p) => p.platform)))];

export default function SocialMediaPage() {
  const [activePlatform, setActivePlatform] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activePlatform === "All" ? POSTS : POSTS.filter((p) => p.platform === activePlatform);

  function copyPost(post: Post) {
    const text = post.hashtags ? `${post.caption}\n\n${post.hashtags}` : post.caption;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📱 Social Media</h1>
        <p className="text-slate-600 mt-1">Ready-to-post captions across every platform — copy and share.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {PLATFORMS.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={"px-4 py-1.5 rounded-full text-sm font-semibold transition " + (activePlatform === platform ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-200")}
          >
            {platform}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{post.platform}</span>
              <button
                onClick={() => copyPost(post)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1.5 rounded-lg"
              >
                {copiedId === post.id ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{post.caption}</p>
            {post.hashtags && <p className="text-sm text-blue-500 mt-2">{post.hashtags}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
