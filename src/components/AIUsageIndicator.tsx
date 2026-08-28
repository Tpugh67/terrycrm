"use client";
import { useEffect, useState } from "react";
import { getAuthHeaders } from "../lib/authHeader";

export default function AIUsageIndicator() {
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUsage() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/ai/usage", { headers });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setUsage({ used: data.used, limit: data.limit });
      } catch {
        // Silently omit the indicator if usage can't be loaded --
        // this is a soft UX nicety, not something that should ever
        // block or alarm the customer if it fails to load.
      }
    }
    loadUsage();
    return () => { cancelled = true; };
  }, []);

  if (!usage) return null;

  const { used, limit } = usage;
  const pct = used / limit;

  // Thresholds from PIPE-AI-001 Phase 3: subtle at 120/150 (80%),
  // stronger at 140/150 (~93%), blocked at 150/150 (100%). Below 80%
  // we show nothing at all -- the point is to stay out of the way
  // until it's actually relevant.
  if (pct < 0.8) return null;

  const atLimit = used >= limit;
  const nearLimit = pct >= 0.933;

  return (
    <div
      className={
        "mt-2 text-[11px] font-medium px-2 py-1.5 rounded-lg text-center " +
        (atLimit
          ? "bg-red-50 text-red-700 border border-red-200"
          : nearLimit
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-slate-50 text-slate-500 border border-slate-200")
      }
    >
      {atLimit
        ? "You've reached your included AI usage for this month. Your allowance resets next month."
        : `AI usage this month: ${used} / ${limit}`}
    </div>
  );
}
