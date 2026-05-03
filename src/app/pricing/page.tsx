"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const PLANS = [
  {
    name: "Solo",
    price: "$29",
    period: "/month",
    description: "Perfect for individual professionals",
    priceId: "price_1TT1CDANf6sspitdbeYGjnih",
    features: ["1 user","All 18 industry pipelines","Unlimited deals & contacts","Follow-up reminders","Hot deal alerts","Activity timeline","Email support"],
    popular: false,
  },
  {
    name: "Team",
    price: "$59",
    period: "/month",
    description: "For small teams closing more deals",
    priceId: "price_1TT1CDANf6sspitdK6JFF3uq",
    features: ["Up to 5 users","All 18 industry pipelines","Unlimited deals & contacts","Follow-up reminders","Hot deal alerts","Activity timeline","Priority support","Team activity feed"],
    popular: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  async function handleCheckout(priceId: string, planName: string) {
    setLoading(planName);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: userEmail }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { alert("Error: " + data.error); }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-8">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, honest pricing</h2>
          <p className="text-lg text-slate-500">14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {PLANS.map((plan)=>(
            <div key={plan.name} className={`bg-white rounded-2xl border-2 p-8 relative ${plan.popular?"border-blue-500 shadow-xl":"border-slate-200 shadow-sm"}`}>
              {plan.popular&&<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f)=>(<li key={f} className="flex items-center gap-3 text-sm text-slate-600"><span className="text-emerald-500 font-bold">✓</span>{f}</li>))}
              </ul>
              <button onClick={()=>handleCheckout(plan.priceId, plan.name)} disabled={loading===plan.name} className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${plan.popular?"bg-blue-600 hover:bg-blue-700 text-white":"bg-slate-900 hover:bg-slate-800 text-white"} disabled:opacity-50`}>
                {loading===plan.name?"Processing...":"Start free 14-day trial"}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">No credit card required</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
