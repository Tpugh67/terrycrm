import { ReactNode } from "react";

export default function PhoneMockup({
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
      className={`w-[220px] rounded-[2.25rem] border-[10px] border-(--color-secondary) bg-(--color-secondary) shadow-[var(--shadow-xl)] overflow-hidden ${className}`}
    >
      <div
        data-theme={mode === "dark" ? "dark" : undefined}
        className="relative bg-(--color-surface) aspect-[9/19.5] overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-(--color-secondary) rounded-b-[var(--radius-md)] z-10" />
        {children}
      </div>
    </div>
  );
}
