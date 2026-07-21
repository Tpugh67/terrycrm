import { ReactNode } from "react";

type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-(--color-primary-light) text-(--color-primary)",
  accent: "bg-(--color-accent-light) text-(--color-accent-text)",
  success: "bg-(--color-success-light) text-(--color-success-text)",
  warning: "bg-(--color-warning-light) text-(--color-warning-text)",
  danger: "bg-(--color-danger-light) text-(--color-danger-text)",
  info: "bg-(--color-info-light) text-(--color-info-text)",
  neutral: "bg-(--color-surface-sunken) text-(--color-foreground-muted)",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
