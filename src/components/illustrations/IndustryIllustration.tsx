import type { LucideIcon } from "lucide-react";

/**
 * Compact mark used on industry cards. A rounded square in the industry's
 * accent color with a Lucide icon — reads clearly at small sizes in a grid
 * of 18. Icons are the one sanctioned icon system across the app; no
 * emoji ships in the production interface.
 */
export default function IndustryIllustration({
  icon: Icon,
  color = "var(--color-primary)",
  size = 48,
  className = "",
}: {
  icon: LucideIcon;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[var(--radius-lg)] ${className}`}
      style={{ width: size, height: size, background: color }}
    >
      <Icon size={size * 0.5} color="white" strokeWidth={2} />
    </div>
  );
}
