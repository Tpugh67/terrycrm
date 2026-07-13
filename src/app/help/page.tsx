"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "General",
    items: [
      { q: "What is PipeDesk?", a: "PipeDesk is a multi-industry CRM platform built for businesses that manage leads, clients, and sales pipelines. It serves 18 industries including real estate, insurance, mortgage, solar, legal, healthcare, and more." },
      { q: "How much does PipeDesk cost?", a: "PipeDesk offers three plans: Solo at $29/month, Team at $79/month, and Business at $149/month. All plans include a free 14-day trial." },
      { q: "Is there a free trial?", a: "Yes — every plan includes a free 14-day trial. We ask for a card at signup, but you will not be charged until the trial ends." },
      { q: "Do I need a credit card?", a: "We collect your card when you sign up, but you will not be charged until your 14-day trial ends. Cancel anytime before then and you will not be billed." },
      { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time from your account settings. No cancellation fees." },
      { q: "Can I change plans later?", a: "Yes. You can upgrade or downgrade your plan at any time from your account settings." },
    ],
  },
  {
    category: "Accounts",
    items: [
      { q: "How do I reset my password?", a: "Go to pipedesk.app/login and click 'Forgot password'. Enter your email and we'll send you a reset link." },
      { q: "How do I verify my email?", a: "After signing up, check your inbox for a verification email from PipeDesk. Click the link to verify your account." },
      { q: "How do I delete my account?", a: "Go to Settings → Account and scroll to the bottom to find the delete account option. This action is permanent and cannot be undone." },
    ],
  },
  {
    category: "Contacts",
    items: [
      { q: "How do I add a contact?", a: "Go to the Contacts page and fill in the Add Contact form at the top. Name and email are required. Click Add Contact to save." },
      { q: "Can I import contacts?", a: "Yes. Go to the Contacts page and click '📥 Import CSV'. Your CSV must have Name and Email columns. Download our template to get the right format." },
      { q: "Can I export contacts?", a: "Yes. Go to the Contacts page and click '📤 Export CSV'. All your contacts will download as a CSV file." },
      { q: "How do I delete a contact?", a: "Find the contact in your Contact List and click Delete. This cannot be undone." },
    ],
  },
  {
    category: "Pipeline",
    items: [
      { q: "How do I create a deal?", a: "Go to the Pipeline page and click '+ Add Deal' in the top right. Fill in the deal title, seller name, and any other details, then click Create Deal." },
      { q: "How do I move a deal between stages?", a: "Click on a deal card to expand it, then use the 'Move stage' dropdown to select the new stage. It saves automatically." },
      { q: "How do I set a follow-up reminder?", a: "When adding or editing a deal, set the Follow-up Date field. Overdue follow-ups will appear highlighted in red on your dashboard." },
      { q: "Can I import deals?", a: "Yes. On the Pipeline page click '⬆️ Import' in the top bar. Your CSV should have columns for title, seller, stage, arv, offer, and amount." },
      { q: "What is ARV?", a: "ARV stands for After Repair Value — the estimated value of a property after renovations. It's used to calculate spread and deal profitability, primarily for real estate wholesalers." },
    ],
  },
  {
    category: "AI Assistant",
    items: [
      { q: "What can the AI Assistant do?", a: "The AI Assistant inside each deal card can draft follow-up emails, suggest next actions, summarize deals, predict close probability, and help you handle seller objections." },
      { q: "How do I use the AI Assistant?", a: "Go to your Pipeline, click on any deal to expand it, then click '✨ AI Assistant'. Choose an action and the AI will generate a response instantly." },
      { q: "Is the AI Assistant available on all plans?", a: "Yes — the AI Assistant is included on all PipeDesk plans." },
    ],
  },
  {
    category: "Rep Program",
    items: [
      { q: "How do I become a PipeDesk rep?", a: "Go to pipedesk.app/reps and fill out the application. We review all applications within 24 hours." },
      { q: "How much do reps earn?", a: "Reps earn 30% recurring monthly commission on every paying customer they refer. Solo plan pays $8.70/month, Team pays $23.70/month, Business pays $44.70/month per customer." },
      { q: "How do I get my referral link?", a: "After your application is approved, your unique referral link is generated automatically and emailed to you." },
      { q: "When do reps get paid?", a: "Commissions are paid monthly on all active accounts attributed to you." },
    ],
  },
];

const QUICK_STEPS = [
  { step: 1, title: "Create your account", desc: "Sign up at pipedesk.app/login with your email and password.", icon: "👤" },
  { step: 2, title: "Select your industry", desc: "Choose from 18 industries. PipeDesk will set up your pipeline with the right stages.", icon: "🏭" },
  { step: 3, title: "Import your contacts", desc: "Upload a CSV file or add contacts manually on the Contacts page.", icon: "👥" },
  { step: 4, title: "Add your first deal", desc: "Go to Pipeline and click + Add Deal. Fill in the details and save.", icon: "🔀" },
  { step: 5, title: "Set follow-up reminders", desc: "Add a follow-up date to each deal so nothing falls through the cracks.", icon: "📅" },
  { step: 6, title: "Use the AI Assistant", desc: "Expand any deal and click ✨ AI Assistant to draft emails and get next action suggestions.", icon: "✨" },
  { step: 7, title: "Close your first deal", desc: "Move the deal to Closed Won and track your revenue on the dashboard.", icon: "🏆" },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("General");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quickstart" | "faq" | "ai">("quickstart");

  async function askAI() {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a helpful support assistant for PipeDesk, a multi-industry CRM platform. PipeDesk serves 18 industries, costs $29-149/month, has a free 14-day trial, and includes features like contact management, deal pipeline, task tracking, CSV import/export, and an AI assistant inside each deal card. Answer this user question clearly and concisely in 2-4 sentences: "${aiQuestion}"`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.result || "Sorry, I could not find an answer. Please contact hello@pipedesk.app for help.");
    } catch {
      setAiAnswer("Failed to connect. Please try again or email hello@pipedesk.app.");
    }
    setAiLoading(false);
  }

  const currentFaqs = FAQS.find(f => f.category === activeCategory)?.items || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">← Back to dashboard</Link>
          <a href="mailto:hello@pipedesk.app" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Contact Support</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-slate-400 text-lg mb-8">Search our help center or ask our AI assistant anything about PipeDesk.</p>
          {/* AI Search */}
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto">
            <input
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") askAI(); }}
              placeholder="Ask anything... e.g. How do I import contacts?"
              className="flex-1 px-4 py-3 text-slate-900 text-sm focus:outline-none rounded-xl"
            />
            <button
              onClick={askAI}
              disabled={aiLoading || !aiQuestion.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-sm transition"
            >
              {aiLoading ? "..." : "✨ Ask AI"}
            </button>
          </div>
          {aiAnswer && (
            <div className="mt-4 bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-left max-w-2xl mx-auto">
              <div className="text-xs text-blue-300 font-semibold mb-2">✨ AI Answer</div>
              <p className="text-sm text-white leading-relaxed">{aiAnswer}</p>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-6">
        <div className="max-w-5xl mx-auto flex gap-6">
          {[
            { id: "quickstart", label: "⚡ Quick Start" },
            { id: "faq", label: "❓ FAQ" },
            { id: "ai", label: "✨ AI Assistant" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={"py-4 text-sm font-semibold border-b-2 transition " + (activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Quick Start */}
        {activeTab === "quickstart" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">15-Minute Setup Guide</h2>
              <p className="text-slate-500">Follow these steps to get PipeDesk fully set up and close your first deal.</p>
            </div>
            <div className="space-y-4">
              {QUICK_STEPS.map((s) => (
                <div key={s.step} className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{s.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{s.icon}</span>
                      <h3 className="font-bold text-slate-900">{s.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold text-blue-900 mb-2">Ready to get started?</h3>
              <p className="text-blue-700 text-sm mb-4">Start your free 14-day trial — no charge for 14 days.</p>
              <Link href="/login?mode=signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm">Start Free Trial →</Link>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div className="flex gap-8">
            {/* Category sidebar */}
            <div className="w-48 flex-shrink-0">
              <div className="space-y-1 sticky top-24">
                {FAQS.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={"w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition " + (activeCategory === cat.category ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ items */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{activeCategory}</h2>
              <div className="space-y-3">
                {currentFaqs.map((item) => (
                  <div key={item.q} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
                    >
                      <span className="font-semibold text-slate-900 text-sm">{item.q}</span>
                      <span className="text-slate-400 ml-4 flex-shrink-0">{openFaq === item.q ? "▲" : "▼"}</span>
                    </button>
                    {openFaq === item.q && (
                      <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant tab */}
        {activeTab === "ai" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ask PipeDesk AI</h2>
              <p className="text-slate-500">Get instant answers to any question about PipeDesk.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-5 py-3">
                <span className="text-white font-bold text-sm">✨ PipeDesk AI Support</span>
              </div>
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  {["How do I import my contacts?", "How do I move a deal to a new stage?", "How do I set a follow-up reminder?", "How does the AI assistant work?", "How do I become a rep?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setAiQuestion(q); }}
                      className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") askAI(); }}
                    placeholder="Type your question..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={askAI}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-3 rounded-xl text-sm transition"
                  >
                    {aiLoading ? "..." : "Ask"}
                  </button>
                </div>
                {aiAnswer && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-xs text-blue-600 font-semibold mb-2">✨ AI Answer</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiAnswer}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">Still need help? <a href="mailto:hello@pipedesk.app" className="text-blue-600 hover:underline font-semibold">Email us at hello@pipedesk.app</a></p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 mt-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-slate-900">PipeDesk</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="mailto:hello@pipedesk.app" className="hover:text-slate-900">Support</a>
            <Link href="/reps" className="hover:text-slate-900">Become a Rep</Link>
            <Link href="/" className="hover:text-slate-900">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
