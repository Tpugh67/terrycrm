import { ReactNode } from "react";

export default function LaptopMockup({
  mode = "light",
  children,
  className = "",
}: {
  mode?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="rounded-t-[var(--radius-lg)] border-8 border-b-0 border-(--color-secondary) bg-(--color-secondary) overflow-hidden shadow-[var(--shadow-xl)]">
        <div data-theme={mode === "dark" ? "dark" : undefined} className="bg-(--color-surface) aspect-video overflow-hidden">
          {children}
        </div>
      </div>
      <div className="relative h-3 bg-(--color-secondary) rounded-b-[6px]">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-1.5 bg-(--color-secondary-hover) rounded-b-[var(--radius-sm)]" />
      </div>
    </div>
  );
}
