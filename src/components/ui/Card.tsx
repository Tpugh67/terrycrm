import { HTMLAttributes, ReactNode } from "react";

type Variant = "default" | "elevated" | "bordered" | "flat";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-(--color-surface) border border-(--color-border) shadow-[var(--shadow-sm)]",
  elevated: "bg-(--color-surface) border border-(--color-border) shadow-[var(--shadow-md)]",
  bordered: "bg-(--color-surface) border border-(--color-border-strong)",
  flat: "bg-(--color-surface-alt)",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  hoverLift?: boolean;
  children: ReactNode;
};

export default function Card({
  variant = "default",
  hoverLift = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div
      className={`rounded-[var(--radius-2xl)] p-6 ${VARIANT_CLASSES[variant]} ${
        hoverLift ? "pd-hover-lift" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
