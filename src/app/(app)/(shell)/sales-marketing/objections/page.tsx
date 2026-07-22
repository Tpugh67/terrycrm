"use client";
import { useState } from "react";

type Objection = {
  id: string;
  objection: string;
  response: string;
};

const OBJECTIONS: Objection[] = [
  {
    id: "already-have-crm",
    objection: "I already have a CRM.",
    response: "Totally fair — most people we talk to do. Quick question though: does it actually match how your industry's deals move, or does it feel like a generic tool you've had to bend to fit your process? That's really the core difference with PipeDesk.",
  },
  {
    id: "too-expensive",
    objection: "It's too expensive.",
    response: "I hear that a lot, and I'd push back gently — every PipeDesk plan includes the full feature set, including the AI assistant, with no hidden add-ons. Compare that to what you'd actually pay elsewhere once you add the features you need, and it's usually a wash or cheaper.",
  },
  {
    id: "no-time",
    objection: "I don't have time to switch tools.",
    response: "That's actually the reason PipeDesk tends to work well here — setup is same-day, not a multi-week implementation. Pick your industry and your pipeline is ready. We also support CSV import so your existing contacts come with you.",
  },
  {
    id: "too-small",
    objection: "We're too small for a CRM like this.",
    response: "Honestly, that's usually the best time to start — it's much easier to build good habits with 20 leads than to untangle a mess with 2,000. Solo plan starts at $29/month specifically for teams your size.",
  },
  {
    id: "spreadsheets",
    objection: "We use spreadsheets and it works fine.",
    response: "Spreadsheets work until something falls through the cracks — a follow-up that never happened, a deal nobody remembered to update. PipeDesk automates the stuff spreadsheets can't: reminders, stage tracking, and a real view of your whole pipeline at a glance.",
  },
  {
    id: "call-next-month",
    objection: "Call me next month.",
    response: "Happy to — just so I follow up with something useful rather than just checking in, is there something specific that would need to change between now and then for the timing to make sense?",
  },
  {
    id: "need-to-think",
    objection: "I need to think about it.",
    response: "Totally understand — is there a specific concern I can help address right now, or is it more that you want time to look at it on your own? Either way, I can send over a couple resources so you have what you need to think it through.",
  },
  {
    id: "not-decision-maker",
    objection: "I'm not the one who makes this decision.",
    response: "Good to know — who else should be part of this conversation? I'm happy to include them directly, or send over a short summary you can pass along if that's easier.",
  },
];

export default function ObjectionLibraryPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">💬 Objection Library</h1>
        <p className="text-slate-600 mt-1">Confident, short responses to the objections you'll hear most often.</p>
      </div>

      <div className="space-y-3">
        {OBJECTIONS.map((o) => (
          <details key={o.id} className="bg-white rounded-2xl shadow p-5 group">
            <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between">
              <span>"{o.objection}"</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{o.response}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
