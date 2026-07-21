import { ReactNode } from "react";

export default function DesktopMockup({
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
      <div className="rounded-[var(--radius-lg)] border-[10px] border-(--color-secondary) bg-(--color-secondary) overflow-hidden shadow-[var(--shadow-xl)]">
        <div data-theme={mode === "dark" ? "dark" : undefined} className="bg-(--color-surface) aspect-[16/10] overflow-hidden">
          {children}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-24 h-6 bg-(--color-secondary) [clip-path:polygon(20%_0,80%_0,95%_100%,5%_100%)]" />
        <div className="w-40 h-2.5 bg-(--color-secondary-hover) rounded-full -mt-px" />
      </div>
    </div>
  );
}
