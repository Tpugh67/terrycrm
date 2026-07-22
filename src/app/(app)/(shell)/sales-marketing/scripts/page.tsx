"use client";
import { useState } from "react";

type Script = {
  id: string;
  category: string;
  title: string;
  situation: string;
  body: string;
};

const SCRIPTS: Script[] = [
  {
    id: "first-call",
    category: "Outbound",
    title: "First Call — Cold Outreach",
    situation: "Calling a business that has never heard of PipeDesk.",
    body: `Hi, is this [Name]? This is [Your Name] with PipeDesk — I'll be quick.

We build CRM software specifically for [their industry] businesses, not a generic one-size-fits-all tool. Most teams we talk to are either using spreadsheets or a CRM that wasn't built for how they actually sell.

Quick question — how are you currently keeping track of your leads and follow-ups?

[Listen to their answer]

Got it. Based on what you just told me, I think it's worth a quick 15-minute look at how PipeDesk handles that specifically for [their industry]. Does tomorrow afternoon or Thursday morning work better for a quick call?`,
  },
  {
    id: "gatekeeper",
    category: "Outbound",
    title: "Gatekeeper Script",
    situation: "A receptionist or assistant answers before you reach the decision-maker.",
    body: `Hi, this is [Your Name] with PipeDesk. I'm hoping you can help me — who handles decisions about the CRM or sales software the team uses?

[If they ask what it's about]
Sure — we build CRM software specifically for [industry], and I wanted to see if it'd be worth a quick conversation. Is [decision-maker] usually available in the mornings, or would afternoons be better for a callback?`,
  },
  {
    id: "voicemail",
    category: "Voicemail",
    title: "Standard Voicemail",
    situation: "No answer, going to voicemail.",
    body: `Hi [Name], this is [Your Name] with PipeDesk. I work with [industry] businesses on their CRM and follow-up process — wanted to see if it made sense to connect for 15 minutes.

My number is [phone number]. I'll also follow up with a quick email in case that's easier. Talk soon.`,
  },
  {
    id: "existing-crm",
    category: "Existing CRM Replacement",
    title: "Prospect Already Uses a CRM",
    situation: "Prospect mentions they already have HubSpot, Salesforce, or another tool.",
    body: `Totally fair — most people we talk to already have something. Quick question though: does it actually match how [their industry] businesses work, or does it feel like you're bending your process to fit a generic sales tool?

That's really the core difference — PipeDesk is built around the actual stages and terminology of your industry, not a one-size-fits-all pipeline. A lot of our customers switched over specifically because their old CRM felt like extra admin work instead of something that actually helped them close.

Would it be worth a 15-minute side-by-side look, just so you can see the difference for yourself? No pressure either way.`,
  },
  {
    id: "referral-request",
    category: "Referral",
    title: "Referral Request",
    situation: "Asking a happy existing customer for a referral.",
    body: `Hey [Name], glad to hear PipeDesk's been working well for you. Quick ask — do you know anyone else in [industry] who might be dealing with the same lead-tracking headaches you had before? 

Happy to give them a no-pressure look, and if they sign up, there's a referral bonus in it for you too. Anyone come to mind?`,
  },
  {
    id: "closing",
    category: "Closing",
    title: "Trial Close",
    situation: "Prospect seems interested but hasn't committed yet.",
    body: `Sounds like this could genuinely help with [specific pain point they mentioned]. Since there's a 14-day free trial, there's really no risk in getting started today — you can test it with your actual leads and see how it feels.

Want me to get you set up right now so you can start exploring it today?`,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(SCRIPTS.map((s) => s.category)))];

export default function SalesScriptsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? SCRIPTS : SCRIPTS.filter((s) => s.category === activeCategory);

  function copyScript(script: Script) {
    navigator.clipboard.writeText(script.body);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📞 Sales Scripts</h1>
        <p className="text-slate-600 mt-1">Real scripts for real situations — copy, adapt to your voice, and use on your next call.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={"px-4 py-1.5 rounded-full text-sm font-semibold transition " + (activeCategory === cat ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-200")}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((script) => (
          <div key={script.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{script.category}</span>
                <h2 className="text-lg font-semibold">{script.title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{script.situation}</p>
              </div>
              <button
                onClick={() => copyScript(script)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                {copiedId === script.id ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {script.body}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
