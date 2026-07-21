import { Children, ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Wraps a list of children (e.g. feature cards, industry cards) and gives
 * each one an incrementally later reveal delay, so a grid appears to
 * "cascade" in rather than popping all at once. Each child gets its own
 * IntersectionObserver via Reveal, so this works correctly even if only
 * part of a long grid is in the viewport initially.
 */
export default function StaggerGroup({
  children,
  effect = "slide-up",
  staggerMs = 80,
  className = "",
}: {
  children: ReactNode;
  effect?: "fade-in" | "slide-up" | "reveal" | "scale";
  staggerMs?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => (
        <Reveal effect={effect} delayMs={i * staggerMs}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
