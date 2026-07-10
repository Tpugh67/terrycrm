"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

const STEPS = [
  { id: "industry", label: "Choose your industry", icon: "🏭" },
  { id: "contact", label: "Add your first contact", icon: "👤" },
  { id: "deal", label: "Add a deal to your pipeline", icon: "🔀" },
  { id: "task", label: "Create a follow-up task", icon: "✅" },
  { id: "profile", label: "Complete your profile", icon: "⚙️" },
];

export default function OnboardingChecklist() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("onboarded, onboarding_steps, onboarding_dismissed").eq("id", user.id).single();
      if (profile?.onboarding_dismissed) return;
      if (!profile?.onboarded) return;
      setCompleted(profile?.onboarding_steps || []);
      setShow(true);
      const pathToStep: Record<string, string> = { "/contacts": "contact", "/pipeline": "deal", "/tasks": "task", "/settings": "profile" };
      const stepFromPath = pathToStep[pathname];
      if (stepFromPath && !(profile?.onboarding_steps || []).includes(stepFromPath)) {
        const updated = [...(profile?.onboarding_steps || []), stepFromPath];
        setCompleted(updated);
        await supabase.from("profiles").update({ onboarding_steps: updated }).eq("id", user.id);
      }
    }
    load();
  }, [pathname]);

  async function markComplete(stepId: string) {
    const updated = [...completed, stepId];
    setCompleted(updated);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ onboarding_steps: updated }).eq("id", user.id);
  }

  async function dismiss() {
    setDismissed(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ onboarding_dismissed: true }).eq("id", user.id);
  }

  if (!show || dismissed) return null;

  const completedCount = STEPS.filter(s => completed.includes(s.id)).length;
  const allDone = completedCount === STEPS.length;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  if (minimized) {
    return (
      <button onClick={() => setMinimized(false)} className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-semibold transition">
        🚀 Setup {completedCount}/{STEPS.length}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-sm">{allDone ? "🎉 You are all set!" : "🚀 Get started"}</div>
          <div className="text-blue-200 text-xs mt-0.5">{completedCount} of {STEPS.length} steps complete</div>
        </div>
        <button onClick={() => setMinimized(true)} className="text-blue-200 hover:text-white text-lg leading-none">−</button>
      </div>
      <div className="h-1.5 bg-slate-100">
        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: progress + "%" }} />
      </div>
      <div className="p-3 space-y-1">
        {STEPS.map((step) => {
          const done = completed.includes(step.id);
          return (
            <div key={step.id} className={"flex items-center gap-3 p-2 rounded-lg " + (done ? "opacity-60" : "")}>
              <div className={"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 " + (done ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}>
                {done && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={"text-xs flex-1 " + (done ? "line-through text-slate-400" : "text-slate-700 font-medium")}>
                {step.icon} {step.label}
              </span>
              {!done && <button onClick={() => markComplete(step.id)} className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold">Done</button>}
            </div>
          );
        })}
      </div>
      <div className="px-3 pb-3">
        {allDone ? (
          <button onClick={dismiss} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg transition">Dismiss — I am all set! 🎉</button>
        ) : (
          <button onClick={dismiss} className="w-full text-slate-400 hover:text-slate-600 text-xs py-1 transition">Dismiss</button>
        )}
      </div>
    </div>
  );
}
