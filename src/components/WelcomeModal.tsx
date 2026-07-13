"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const INDUSTRIES = [
  { slug: "real-estate", label: "Real Estate", icon: "🏠" },
  { slug: "insurance", label: "Insurance", icon: "🛡️" },
  { slug: "mortgage", label: "Mortgage & Lending", icon: "🏦" },
  { slug: "auto", label: "Automotive", icon: "🚗" },
  { slug: "solar", label: "Solar Energy", icon: "☀️" },
  { slug: "financial", label: "Financial Services", icon: "📈" },
  { slug: "legal", label: "Legal", icon: "⚖️" },
  { slug: "recruiting", label: "Recruiting", icon: "🧑‍💼" },
  { slug: "healthcare", label: "Healthcare", icon: "🏥" },
  { slug: "construction", label: "Construction", icon: "🏗️" },
  { slug: "consulting", label: "Consulting", icon: "💼" },
  { slug: "ecommerce", label: "E-Commerce", icon: "🛒" },
  { slug: "property-management", label: "Property Mgmt", icon: "🏢" },
  { slug: "trucking", label: "Trucking & Logistics", icon: "🚛" },
  { slug: "dental", label: "Dental", icon: "🦷" },
  { slug: "fitness", label: "Fitness & Wellness", icon: "💪" },
  { slug: "nonprofit", label: "Nonprofit", icon: "❤️" },
  { slug: "education", label: "Education", icon: "🎓" },
];

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile, error } = await supabase.from("profiles").select("onboarded, industry, email").eq("id", user.id).single();
      // Only show the modal when we successfully confirmed the profile is
      // genuinely not onboarded — a failed/empty query should never trigger
      // this (previously `!profile?.onboarded` was true on any query error,
      // incorrectly showing the modal to already-onboarded users).
      if (error || !profile) return;
      if (!profile.onboarded) {
        const name = (profile?.email || user.email || "").split("@")[0].split(".")[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        setShow(true);
      }
    }
    check();
  }, []);

  async function handleFinish() {
    if (!selected) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ industry: selected, onboarded: true }).eq("id", user.id);
    }
    setSaving(false);
    setShow(false);
    router.push("/pipeline");
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {step === 1 && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to PipeDesk{userName ? `, ${userName}` : ""}!</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">You now have access to 18 industry-specific CRM pipelines. Let us get you set up in about 60 seconds.</p>
            <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
              {[{ icon: "🔀", label: "Industry Pipeline" }, { icon: "👥", label: "Contact Manager" }, { icon: "✅", label: "Task Tracker" }].map((f) => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-xs font-semibold text-slate-700">{f.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm">Get Started →</button>
          </div>
        )}
        {step === 2 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">What industry are you in?</h2>
              <p className="text-slate-500 text-sm">We will set up your pipeline with the right stages and fields.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto mb-6 pr-1">
              {INDUSTRIES.map((ind) => (
                <button key={ind.slug} onClick={() => setSelected(ind.slug)} className={"flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-center " + (selected === ind.slug ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white")}>
                  <span className="text-xl">{ind.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">{ind.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition">Back</button>
              <button onClick={handleFinish} disabled={!selected || saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition">{saving ? "Setting up..." : "Open My Pipeline →"}</button>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-2 pb-5">
          {[1, 2].map((s) => (<div key={s} className={"w-2 h-2 rounded-full transition " + (step === s ? "bg-blue-600" : "bg-slate-200")} />))}
        </div>
      </div>
    </div>
  );
}
