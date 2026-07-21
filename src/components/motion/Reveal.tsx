"use client";
import { ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Effect = "fade-in" | "slide-up" | "reveal" | "scale";

const CLASS_BY_EFFECT: Record<Effect, string> = {
  "fade-in": "pd-animate-fade-in",
  "slide-up": "pd-animate-slide-up",
  reveal: "pd-animate-reveal",
  scale: "pd-animate-scale-in",
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

function subscribeMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionOk() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Server/first-paint snapshot — matches the client's default false-until-observed
 * behavior below, so hydration never has to reconcile a mismatch. */
function getMotionOkServer() {
  return false;
}

/**
 * Applies a Pass-2 motion keyframe (see globals.css) the first time the
 * element scrolls into view, then leaves it alone.
 *
 * The reduced-motion preference is read via useSyncExternalStore (the
 * correct React pattern for subscribing to a browser API) rather than
 * stored in effect-driven state — this also means motion preference
 * changes mid-session (e.g. a user toggling the OS setting) are picked
 * up automatically without any extra plumbing.
 */
export default function Reveal({
  children,
  effect = "slide-up",
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  effect?: Effect;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotionPreference, getMotionOk, getMotionOkServer);

  useEffect(() => {
    // Reduced-motion users skip the observer entirely — the CSS animation
    // classes are themselves no-ops under reduced motion, so staying in
    // the "waiting" state would otherwise leave content permanently
    // invisible (see render branch below).
    if (!motionOk) return;

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motionOk]);

  if (!motionOk) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`${visible ? CLASS_BY_EFFECT[effect] : "opacity-0"} ${className}`}
      style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
