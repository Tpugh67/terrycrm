import { ReactNode } from "react";

export default function TabletMockup({
  mode = "light",
  children,
  className = "",
}: {
  mode?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-[340px] rounded-[1.75rem] border-[12px] border-(--color-secondary) bg-(--color-secondary) shadow-[var(--shadow-xl)] overflow-hidden ${className}`}
    >
      <div data-theme={mode === "dark" ? "dark" : undefined} className="bg-(--color-surface) aspect-[4/3] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
