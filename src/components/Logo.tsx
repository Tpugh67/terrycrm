import Image from "next/image";

/**
 * The one place the PipeDesk logo is referenced from. Previously every
 * header/footer/sidebar/login screen hardcoded its own "PD" text badge
 * independently (7 separate places) — a placeholder that was never
 * replaced with the real logo. This component exists so that never
 * happens again: swap the image once, here, and it updates everywhere.
 *
 * The source file already contains the full "PipeDesk" wordmark baked
 * into the circular mark, so at small sizes (nav bars, sidebars) it's
 * paired with real, crisp coded text via `withWordmark` — the same
 * pattern most real logo systems use (an icon-scale mark for tight
 * spaces, the full lockup for larger standalone placements).
 */
export default function Logo({
  size = 32,
  withWordmark = false,
  wordmarkClassName = "text-base font-bold tracking-tight",
  className = "",
}: {
  size?: number;
  /** Renders "PipeDesk" as real, crisp text next to the mark — use at small sizes where the logo's own baked-in wordmark isn't legible. */
  withWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
}) {
  const mark = (
    <Image
      src="/brand/pipedesk-logo.png"
      alt="PipeDesk"
      width={size}
      height={size}
      className={`rounded-full flex-shrink-0 ${className}`}
      priority
    />
  );

  if (!withWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2">
      {mark}
      <span className={wordmarkClassName}>PipeDesk</span>
    </span>
  );
}
