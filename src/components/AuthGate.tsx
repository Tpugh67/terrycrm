"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const PUBLIC_PATHS = ["/", "/login", "/pricing"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPage = PUBLIC_PATHS.includes(pathname);

    async function checkAuth() {
      if (publicPage) {
        setIsPublic(true);
        setChecked(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
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

  // Public pages: render children WITHOUT AppLayout (no sidebar)
  if (isPublic) return <>{children}</>;

  return <>{children}</>;
}
