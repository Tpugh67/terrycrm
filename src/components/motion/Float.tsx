import { ReactNode } from "react";

/**
 * Continuous, subtle vertical bob — used for the floating stat cards and
 * mini panels layered over hero visuals. Unlike Reveal/StaggerGroup this
 * isn't scroll-triggered, it's ambient — so it's a plain CSS animation
 * (`.pd-animate-float` in globals.css), already reduced-motion-gated at
 * the CSS layer, no JS needed.
 */
export default function Float({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  return (
    <div className={`pd-animate-float ${className}`} style={{ animationDelay: `${delayMs}ms` }}>
      {children}
    </div>
  );
}
