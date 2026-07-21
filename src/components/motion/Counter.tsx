"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up to `value` once it scrolls into view.
 * Renders in mono (`.pd-numeric`) per the brand system's numeric-data
 * convention. Reduced-motion users see the final value immediately —
 * no animation attempt at all, not just a faster one.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1200,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduceMotion = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, durationMs]);

  return (
    <span ref={ref} className={`pd-numeric ${className}`}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
