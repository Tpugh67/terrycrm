"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      router.replace("/login");
    }

    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">
      Logging out...
    </div>
  );
}
