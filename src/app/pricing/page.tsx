"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    name: "Solo",
    monthly: 29,
    annual: 24,
    priceId: "price_1TT1CDANf6sspitdbeYGjnih",
    priceIdAnnual: "price_1TT1CDANf6sspitdbeYGjnih",
    description: "Perfect for independent professionals",
    users: "1 user",
    color: "border-slate-200",
    btn: "bg-blue-600 hover:bg-blue-700",
    popular: false,
    features: [
      "1 user",
      "All 18 industry pipelines",
      "Unlimited deals",
      "CSV import/export",
      "Follow-up reminders",
      "Mobile app",
      "Email support",
    ],
  },
  {
    name: "Team",
    monthly: 79,
    annual: 66,
    priceId: "price_1TT1CDANf6sspitdK6JFF3uq",
    priceIdAnnual: "price_1TT1CDANf6sspitdK6JFF3uq",
    description: "For growing teams and small agencies",
    users: "Up to 5 users",
    color: "border-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700",
    popular: true,
    features: [
      "Up to 5 users",
      "Everything in Solo",
      "Team collaboration",
      "Shared pipeline views",
      "Team activity log",
      "Priority email support",
      "Onboarding call",
    ],
  },
  {
    name: "Business",
    monthly: 149,
    annual: 124,
    priceId: "price_1Tb6URANf6sspitdGKpMBFJy",
    priceIdAnnual: "price_1Tb6URANf6sspitdGKpMBFJy",
    description: "For established businesses",
    users: "Up to 15 users",
    color: "border-slate-200",
    btn: "bg-slate-900 hover:bg-slate-800",
    popular: false,
    features: [
      "Up to 15 users",
      "Everything in Team",
      "Advanced reporting",
      "Custom fields",
      "Priority support",
      "Dedicated success manager",
      "Custom onboarding",
    ],
  },
  {
    name: "Corporate",
    monthly: null,
    annual: null,
    priceId: null,
    priceIdAnnual: null,
    description: "For large organizations",
    users: "15+ users",
    color: "border-slate-200",
    btn: "bg-slate-700 hover:bg-slate-800",
    popular: false,
    features: [
      "Unlimited users",
      "Everything in Business",
      "White glove onboarding",
      "Dedicated support rep",
      "Custom workflows",
      "SLA guarantee",
      "Custom contract",
    ],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  async function handleCheckout(priceId: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
          <Link href="/login?mode=signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-500 mb-10">Start free for 14 days. No credit card required.</p>
        
        <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1 mb-12">
          <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${!annual ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${annual ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
            Annual <span className="text-green-600 font-bold ml-1">Save 2 months</span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl border-2 ${plan.color} p-6 text-left flex flex-col ${plan.popular ? "shadow-xl ring-2 ring-blue-500" : "shadow-sm"}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>
              )}
              <div className="mb-6">
                <div className="text-xl font-bold text-slate-900 mb-1">{plan.name}</div>
                <div className="text-xs text-slate-500 mb-4">{plan.description}</div>
                {plan.monthly ? (
                  <div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-slate-900">${annual ? plan.annual : plan.monthly}</span>
                      <span className="text-slate-400 mb-1">/mo</span>
                    </div>
                    {annual && <div className="text-xs text-green-600 font-semibold mt-1">2 months free vs monthly</div>}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-slate-900">Custom</div>
                )}
                <div className="text-xs text-slate-400 mt-2">{plan.users}</div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.priceId ? (
                <button onClick={() => handleCheckout(annual ? plan.priceIdAnnual! : plan.priceId!)} className={`w-full ${plan.btn} text-white font-bold py-3 rounded-xl transition`}>
                  Start free trial →
                </button>
              ) : (
                <a href="mailto:hello@pipedesk.app?subject=Corporate Plan Inquiry" className={`w-full ${plan.btn} text-white font-bold py-3 rounded-xl transition text-center block`}>
                  Contact us →
                </a>
              )}
              <p className="text-xs text-slate-400 text-center mt-3">
                {plan.monthly ? "14-day free trial · No credit card" : "Custom contract · White glove setup"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "Can I change plans later?", a: "Yes! You can upgrade or downgrade your plan at any time from your account settings." },
              { q: "What happens after the free trial?", a: "After 14 days you'll be prompted to enter payment details. No charge until then." },
              { q: "Do you offer refunds?", a: "Yes — if you're not satisfied within 30 days of your first payment we'll refund you in full." },
              { q: "Which industries are supported?", a: "All 18 industries — Real Estate, Insurance, Solar, Trucking, Recruiting, Healthcare, Legal, and 11 more." },
              { q: "Can I import my existing data?", a: "Yes! PipeDesk supports CSV import on all plans so you can bring your existing deals and contacts." },
              { q: "Is there a setup fee?", a: "No setup fees ever. Solo and Team plans you set up yourself. Business and Corporate include onboarding." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="font-bold text-slate-900 mb-2">{faq.q}</div>
                <div className="text-sm text-slate-500 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to close more deals?</h2>
          <p className="text-slate-400 text-lg mb-8">Start your free 14-day trial. No credit card required.</p>
          <Link href="/login?mode=signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition">Start free trial →</Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>✓ 14 days free</span><span>✓ No credit card</span><span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-white">PipeDesk</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/join" className="hover:text-white transition">Become a Rep</Link>
            <a href="mailto:hello@pipedesk.app" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
