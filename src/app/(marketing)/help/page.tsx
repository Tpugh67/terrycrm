"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import { TimelineSection, FAQSection } from "../../../components/marketing";
import type { FAQCategory } from "../../../components/marketing";
import { Container, Section } from "../../../components/ui/Container";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

const FAQS: FAQCategory[] = [
  {
    category: "General",
    items: [
      { question: "What is PipeDesk?", answer: "PipeDesk is a CRM built for businesses that manage leads, clients, and sales pipelines. Start from a template built for your business, or customize your own stages and fields." },
      { question: "How much does PipeDesk cost?", answer: "PipeDesk offers three plans: Solo at $29/month, Team at $79/month, and Business at $149/month. All plans include a free 14-day trial." },
      { question: "Is there a free trial?", answer: "Yes — every plan includes a free 14-day trial. We ask for a card at signup, but you will not be charged until the trial ends." },
      { question: "Do I need a credit card?", answer: "We collect your card when you sign up, but you will not be charged until your 14-day trial ends. Cancel anytime before then and you will not be billed." },
      { question: "Can I cancel anytime?", answer: "Yes. You can cancel your subscription at any time from your account settings. No cancellation fees." },
      { question: "Can I change plans later?", answer: "Yes. You can upgrade or downgrade your plan at any time from your account settings." },
    ],
  },
  {
    category: "Accounts",
    items: [
      { question: "How do I reset my password?", answer: "Go to pipedesk.app/login and click 'Forgot password'. Enter your email and we'll send you a reset link." },
      { question: "How do I verify my email?", answer: "After signing up, check your inbox for a verification email from PipeDesk. Click the link to verify your account." },
      { question: "How do I delete my account?", answer: "Go to Settings → Account and scroll to the bottom to find the delete account option. This action is permanent and cannot be undone." },
    ],
  },
  {
    category: "Contacts",
    items: [
      { question: "How do I add a contact?", answer: "Go to the Contacts page and fill in the Add Contact form at the top. Name and email are required. Click Add Contact to save." },
      { question: "Can I import contacts?", answer: "Yes. Go to the Contacts page and click 'Import CSV'. Your CSV must have Name and Email columns. Download our template to get the right format." },
      { question: "Can I export contacts?", answer: "Yes. Go to the Contacts page and click 'Export CSV'. All your contacts will download as a CSV file." },
      { question: "How do I delete a contact?", answer: "Find the contact in your Contact List and click Delete. This cannot be undone." },
    ],
  },
  {
    category: "Pipeline",
    items: [
      { question: "How do I create a deal?", answer: "Go to the Pipeline page and click '+ Add Deal' in the top right. Fill in the deal title, seller name, and any other details, then click Create Deal." },
      { question: "How do I move a deal between stages?", answer: "Click on a deal card to expand it, then use the 'Move stage' dropdown to select the new stage. It saves automatically." },
      { question: "How do I set a follow-up reminder?", answer: "When adding or editing a deal, set the Follow-up Date field. Overdue follow-ups will appear highlighted in red on your dashboard." },
      { question: "Can I import deals?", answer: "Yes. On the Pipeline page click 'Import' in the top bar. Your CSV should have columns for title, seller, stage, arv, offer, and amount." },
      { question: "What is ARV?", answer: "ARV stands for After Repair Value — the estimated value of a property after renovations. It's used to calculate spread and deal profitability, primarily for real estate wholesalers." },
    ],
  },
  {
    category: "AI Assistant",
    items: [
      { question: "What can the AI Assistant do?", answer: "The AI Assistant inside each deal card can draft follow-up emails, suggest next actions, summarize deals, predict close probability, and help you handle seller objections." },
      { question: "How do I use the AI Assistant?", answer: "Go to your Pipeline, click on any deal to expand it, then click 'AI Assistant'. Choose an action and the AI will generate a response instantly." },
      { question: "Is the AI Assistant available on all plans?", answer: "Yes — the AI Assistant is included on all PipeDesk plans." },
    ],
  },
  {
    category: "Rep Program",
    items: [
      { question: "How do I become a PipeDesk rep?", answer: "Go to pipedesk.app/reps and fill out the application. We review all applications within 24 hours." },
      { question: "How much do reps earn?", answer: "Reps earn 30% recurring monthly commission on every paying customer they refer. Solo plan pays $8.70/month, Team pays $23.70/month, Business pays $44.70/month per customer." },
      { question: "How do I get my referral link?", answer: "After your application is approved, your unique referral link is generated automatically and emailed to you." },
      { question: "When do reps get paid?", answer: "Commissions are paid monthly on all active accounts attributed to you." },
    ],
  },
];

const QUICK_STEPS = [
  { title: "Create your account", description: "Sign up at pipedesk.app/login with your email and password." },
  { title: "Set up your pipeline", description: "Pick a starting template that fits your business, or customize your own stages and fields." },
  { title: "Import your contacts", description: "Upload a CSV file or add contacts manually on the Contacts page." },
  { title: "Add your first deal", description: "Go to Pipeline and click + Add Deal. Fill in the details and save." },
  { title: "Set follow-up reminders", description: "Add a follow-up date to each deal so nothing falls through the cracks." },
  { title: "Use the AI Assistant", description: "Expand any deal and click AI Assistant to draft emails and get next action suggestions." },
  { title: "Close your first deal", description: "Move the deal to Closed Won and track your revenue on the dashboard." },
];

const SUGGESTED_QUESTIONS = [
  "How do I import my contacts?",
  "How do I move a deal to a new stage?",
  "How do I set a follow-up reminder?",
  "How does the AI assistant work?",
  "How do I become a rep?",
];

export default function HelpPage() {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  async function askAI(question?: string) {
    const q = question ?? aiQuestion;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a helpful support assistant for PipeDesk, a CRM platform built for any business that manages leads, clients, and sales pipelines. PipeDesk costs $29-149/month, has a free 14-day trial, and includes features like contact management, deal pipeline, task tracking, CSV import/export, and an AI assistant inside each deal card. Answer this user question clearly and concisely in 2-4 sentences: "${q}"`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.result || "Sorry, I could not find an answer. Please contact hello@pipedesk.app for help.");
    } catch {
      setAiAnswer("Failed to connect. Please try again or email hello@pipedesk.app.");
    }
    setAiLoading(false);
  }

  return (
    <>
      <Section background="dark" spacing="loose">
        <Container width="narrow" className="text-center">
          <h1 className="pd-text-display mb-4">How can we help?</h1>
          <p className="pd-text-body-lg opacity-90 mb-8">Search our help center or ask our AI assistant anything about PipeDesk.</p>
          <div className="bg-white rounded-[var(--radius-xl)] p-2 flex gap-2 max-w-2xl mx-auto">
            <input
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") askAI(); }}
              placeholder="Ask anything... e.g. How do I import contacts?"
              className="flex-1 px-4 py-3 text-(--color-foreground) text-sm focus:outline-none rounded-[var(--radius-lg)]"
            />
            <Button onClick={() => askAI()} disabled={aiLoading || !aiQuestion.trim()} icon={<Sparkles size={16} />}>
              {aiLoading ? "..." : "Ask AI"}
            </Button>
          </div>
          {aiAnswer && (
            <Card variant="bordered" className="mt-4 bg-white/10 border-white/20 text-left max-w-2xl mx-auto">
              <div className="text-xs text-blue-300 font-semibold mb-2 flex items-center gap-1.5"><Sparkles size={13} /> AI Answer</div>
              <p className="text-sm text-white leading-relaxed">{aiAnswer}</p>
            </Card>
          )}
        </Container>
      </Section>

      <TimelineSection title="15-minute setup guide" steps={QUICK_STEPS} />

      <FAQSection title="Frequently asked questions" categories={FAQS} />

      <Section background="surface" spacing="tight">
        <Container width="form" className="text-center">
          <h2 className="pd-text-h3 mb-4">Still need help?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => { setAiQuestion(q); askAI(q); }}
                className="text-sm text-(--color-primary) bg-(--color-primary-light) hover:opacity-80 px-4 py-2 rounded-[var(--radius-full)] transition-opacity"
              >
                {q}
              </button>
            ))}
          </div>
          <Link
            href="mailto:hello@pipedesk.app"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-foreground-muted) hover:text-(--color-foreground) mt-6"
          >
            <Mail size={14} /> Email us at hello@pipedesk.app
          </Link>
        </Container>
      </Section>
    </>
  );
}
