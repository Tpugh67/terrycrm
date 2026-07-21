/**
 * Stylized, abstracted representation of a pipeline board — used as the
 * placeholder inside DashboardPreview until real product screenshots are
 * captured. Deliberately not a literal screenshot: it's built from shapes
 * and brand color tokens so it never goes stale or misrepresents the
 * actual UI, and can be swapped for `<ProductScreenshot>` later with no
 * layout changes.
 */
export default function DashboardIllustration({ className = "" }: { className?: string }) {
  const columns = [
    { label: "New leads", color: "var(--color-info)", rows: 3 },
    { label: "Contacted", color: "var(--color-primary)", rows: 2 },
    { label: "Offer made", color: "var(--color-warning)", rows: 2 },
    { label: "Closed won", color: "var(--color-success)", rows: 1 },
  ];

  return (
    <div
      className={`rounded-[var(--radius-xl)] bg-(--color-surface) border border-(--color-border) p-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-danger)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-warning)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-success)" }} />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {columns.map((col) => (
          <div key={col.label}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
              <span className="text-[9px] font-semibold text-(--color-foreground-subtle) uppercase tracking-wide">
                {col.label}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: col.rows }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-sm)] border border-(--color-border) p-2"
                  style={{ background: "var(--color-surface-alt)" }}
                >
                  <div className="h-1.5 w-3/4 rounded-full mb-1.5" style={{ background: "var(--color-border-strong)" }} />
                  <div className="h-1.5 w-1/2 rounded-full pd-numeric" style={{ background: col.color, opacity: 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
