/**
 * Ambient decorative background — soft blurred gradient blobs positioned
 * absolutely behind section content. Use sparingly (one per section max)
 * and always behind a `relative z-10` content wrapper. Never carries
 * meaning on its own, so it has no aria role and is hidden from
 * assistive tech.
 */
export default function BackgroundIllustration({
  variant = "corner",
  className = "",
}: {
  variant?: "corner" | "centered";
  className?: string;
}) {
  if (variant === "centered") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-pipeline)" }}
        />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />
    </div>
  );
}
