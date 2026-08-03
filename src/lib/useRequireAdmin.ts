"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

/**
 * Client-side page guard for admin-only routes. Redirects to /login if
 * there's no session, or to /dashboard if the signed-in user isn't an
 * admin. This is a UX safeguard, not the security boundary — RLS on the
 * underlying tables is what actually enforces access; this hook just
 * stops a non-admin from seeing a broken/empty page shell instead of a
 * clear redirect.
 */
export function useRequireAdmin() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (active) router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!active) return;
      if (profile?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setAllowed(true);
      setChecking(false);
    }

    check();
    return () => { active = false; };
  }, [router]);

  return { checking, allowed };
}
