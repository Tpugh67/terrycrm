"use client";
import { useEffect } from "react";

export const REF_STORAGE_KEY = "pd_ref_code";

// Mounted once in the root layout. Runs on every page load (not just "/"),
// so a rep's link works whether it points to the homepage or a specific
// industry landing page (e.g. pipedesk.app/real-estate?ref=xyz).
export default function ReferralCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        // Last-touch attribution: whoever's link they clicked most recently wins.
        localStorage.setItem(REF_STORAGE_KEY, ref);
        localStorage.setItem(`${REF_STORAGE_KEY}_captured_at`, new Date().toISOString());
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — fail silently,
      // referral just won't be attributed for this visitor.
    }
  }, []);

  return null;
}
