"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// No PUBLIC_PATHS list here anymore — this component only ever mounts
// inside (app)/layout.tsx (see docs/adr/0001-public-app-layout-split.md),
// so every page that reaches it is, by construction, meant to be
// protected. The "already logged in, redirect away from /login" case
// this used to also handle now lives in login/page.tsx itself, since
// /login is no longer wrapped by this component at all.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, trial_ends_at, role")
        .eq("id", session.user.id)
        .single();

      // No profile yet, or an internal role (rep/admin) — let them in
      // without a trial/subscription check.
      if (!profile || profile?.role === "rep" || profile?.role === "admin") {
        setChecked(true);
        return;
      }

      const status = profile?.subscription_status;
      const trialEndsAt = profile?.trial_ends_at;

      if (status === "active") {
        setChecked(true);
        return;
      }

      if (trialEndsAt) {
        const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0) {
          router.replace("/pricing?expired=true");
          return;
        }
        setTrialDaysLeft(daysLeft);
      }

      setChecked(true);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {trialDaysLeft !== null && trialDaysLeft > 0 && (
        <div className="bg-blue-600 text-white text-center text-xs py-2 px-4">
          You have <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> left in your free trial.{" "}
          <a href="/pricing" className="underline font-semibold hover:text-blue-200">Upgrade now →</a>
        </div>
      )}
      {children}
    </>
  );
}
