"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const PUBLIC_PATHS = ["/", "/login", "/pricing",
  "/real-estate", "/insurance", "/mortgage", "/auto", "/solar",
  "/financial", "/legal", "/recruiting", "/healthcare", "/construction",
  "/consulting", "/ecommerce", "/property-management", "/trucking",
  "/dental", "/fitness", "/nonprofit", "/education",
  "/reps", "/rep-portal"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPage = PUBLIC_PATHS.includes(pathname);

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (publicPage) {
        if (session && pathname === "/login") {
          router.replace("/dashboard");
          return;
        }
        setChecked(true);
        return;
      }

      // Private page, not logged in → send to login
      if (!session) {
        router.replace("/login");
        return;
      }

      // Check trial/subscription status
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, trial_ends_at, role")
        .eq("id", session.user.id)
        .single();

      // Reps bypass trial check
      if (profile?.role === "rep" || profile?.role === "admin") {
        setChecked(true);
        return;
      }

      const status = profile?.subscription_status;
      const trialEndsAt = profile?.trial_ends_at;

      // Active paying subscriber — let them in
      if (status === "active") {
        setChecked(true);
        return;
      }

      // Trial user — check expiry
      if (trialEndsAt) {
        const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0) {
          // Trial expired — send to pricing
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
  }, [pathname, router]);

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
          🎉 You have <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> left in your free trial.{" "}
          <a href="/pricing" className="underline font-semibold hover:text-blue-200">Upgrade now →</a>
        </div>
      )}
      {children}
    </>
  );
}
