"use client";
import { useState } from "react";

type BattleCard = {
  id: string;
  name: string;
  strengths: string[];
  weaknesses: string[];
  whyPipeDesk: string;
  whenToRecommend: string;
  objectionResponses: { objection: string; response: string }[];
};

const CARDS: BattleCard[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    strengths: [
      "Strong brand recognition and large ecosystem of integrations",
      "Generous free tier for very small teams",
      "Extensive marketing automation features",
    ],
    weaknesses: [
      "Generic pipeline stages not built for any specific industry",
      "Pricing escalates quickly as you add contacts and features",
      "Can feel like overkill — lots of features most small teams never use",
    ],
    whyPipeDesk: "PipeDesk is built around your specific industry's real pipeline stages and terminology from day one — no configuring generic 'lead > opportunity > closed' stages to try to match how your industry actually works. Pricing is also simpler and doesn't balloon as your contact list grows.",
    whenToRecommend: "Best fit when the prospect is a small-to-mid-size team in one of PipeDesk's 18 supported industries who wants something that works out of the box, not a platform they need to heavily configure.",
    objectionResponses: [
      { objection: "\"HubSpot has way more integrations.\"", response: "True — but most teams use maybe 3-4 integrations day to day. The question is whether the core pipeline actually matches your industry, not how many logos are on an integrations page you'll never fully use." },
      { objection: "\"We already have data in HubSpot.\"", response: "Totally fair — we support CSV import, so your contacts and deals come over without starting from scratch." },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    strengths: [
      "Extremely powerful and customizable for large enterprises",
      "Massive ecosystem and marketplace of add-ons",
      "Industry-standard name that's familiar to many buyers",
    ],
    weaknesses: [
      "Requires significant setup time and often a dedicated admin",
      "Expensive, especially once you factor in implementation and add-ons",
      "Steep learning curve for reps who just want to track deals",
    ],
    whyPipeDesk: "Salesforce is genuinely powerful, but that power comes with real setup cost and complexity most small-to-mid-size teams don't need. PipeDesk gets a team productive same-day, with an industry-specific pipeline ready out of the box — no admin, no lengthy implementation.",
    whenToRecommend: "Best fit when the prospect is frustrated by how long it took (or would take) to get Salesforce properly configured, or when they don't have a dedicated ops/admin person to maintain it.",
    objectionResponses: [
      { objection: "\"Salesforce can do anything we need.\"", response: "It can — the question is how much time and cost it takes to get there. PipeDesk is built to get you productive on day one, specifically for your industry." },
      { objection: "\"Our investors/board expect us to use Salesforce.\"", response: "Understandable for later-stage growth — PipeDesk tends to be the better fit earlier on, when speed and simplicity matter more than enterprise-scale customization." },
    ],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    strengths: [
      "Clean, simple visual pipeline interface",
      "Reasonably priced compared to HubSpot/Salesforce",
      "Easy for reps to learn quickly",
    ],
    weaknesses: [
      "Same generic pipeline stages regardless of industry",
      "AI and automation features are more limited or cost extra",
      "Less built-in support for team growth features like commissions/referrals",
    ],
    whyPipeDesk: "Pipedrive's simplicity is genuinely appealing, but it's still a generic pipeline — you're customizing stage names yourself rather than starting from an industry-specific setup. PipeDesk also includes an AI deal assistant and rep/affiliate program tools that Pipedrive doesn't offer natively.",
    whenToRecommend: "Best fit when the prospect specifically likes Pipedrive's simplicity but is frustrated that the stages still don't quite match how their industry's deals actually move.",
    objectionResponses: [
      { objection: "\"Pipedrive is cheaper.\"", response: "Worth comparing actual plan tiers side by side — PipeDesk's pricing is transparent and every plan includes the AI assistant, which is often an add-on cost elsewhere." },
    ],
  },
];

export default function BattleCardsPage() {
  const [activeCard, setActiveCard] = useState(CARDS[0].id);
  const card = CARDS.find((c) => c.id === activeCard) || CARDS[0];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">⚔️ Battle Cards</h1>
        <p className="text-slate-600 mt-1">How PipeDesk compares — know the real strengths and weaknesses before the call.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CARDS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCard(c.id)}
            className={"px-4 py-2 rounded-lg text-sm font-semibold transition " + (activeCard === c.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-200")}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold">{card.name}</h2>

        <div>
          <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-2">Strengths</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {card.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wide mb-2">Weaknesses</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {card.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Why PipeDesk</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{card.whyPipeDesk}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-2">When to Recommend</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{card.whenToRecommend}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-2">Objection Responses</h3>
          <div className="space-y-3">
            {card.objectionResponses.map((o, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-800 italic mb-1">{o.objection}</p>
                <p className="text-sm text-slate-600">{o.response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

