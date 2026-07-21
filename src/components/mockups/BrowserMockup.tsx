import { ReactNode } from "react";

/**
 * Chrome-style browser frame. Wraps any content — a real screenshot via
 * `ProductScreenshot`, or `DashboardIllustration` as a placeholder — so
 * swapping real screenshots in later never touches this component.
 */
export default function BrowserMockup({
  url = "pipedesk.app",
  mode = "light",
  children,
  className = "",
}: {
  url?: string;
  mode?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] overflow-hidden border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-lg)] ${className}`}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-(--color-surface-alt) border-b border-(--color-border)">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-danger)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-warning)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-success)" }} />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs pd-numeric text-(--color-foreground-subtle) bg-(--color-surface) px-3 py-1 rounded-[var(--radius-full)] border border-(--color-border)">
            {url}
          </span>
        </div>
      </div>
      <div data-theme={mode === "dark" ? "dark" : undefined} className="bg-(--color-surface)">
        {children}
      </div>
    </div>
  );
}
