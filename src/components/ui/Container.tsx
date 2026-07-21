import { HTMLAttributes, ReactNode } from "react";

type Width = "narrow" | "form" | "content" | "wide";

const WIDTH_CLASSES: Record<Width, string> = {
  narrow: "max-w-3xl",   // 768px  — long-form text
  form: "max-w-md",      // 448px  — forms / modals
  content: "max-w-6xl",  // 1152px — standard sections
  wide: "max-w-7xl",     // 1280px — wide marketing sections
};

export function Container({
  width = "content",
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { width?: Width; children: ReactNode }) {
  return (
    <div className={`mx-auto px-6 ${WIDTH_CLASSES[width]} ${className}`} {...rest}>
      {children}
    </div>
  );
}

type SectionBackground = "surface" | "alt" | "dark" | "gradient";

const BG_CLASSES: Record<SectionBackground, string> = {
  surface: "bg-(--color-surface)",
  alt: "bg-(--color-surface-alt)",
  dark: "bg-[var(--gradient-dark)] text-white",
  gradient: "bg-[var(--gradient-pipeline)] text-white",
};

/**
 * Section — standard vertical rhythm + background for full-width page
 * sections. Use instead of hand-writing `py-24 px-6` on every page.
 */
export function Section({
  background = "surface",
  spacing = "default",
  id,
  className = "",
  children,
}: {
  background?: SectionBackground;
  spacing?: "default" | "tight" | "loose";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const spacingClasses =
    spacing === "tight" ? "py-12 md:py-16" : spacing === "loose" ? "py-24 md:py-32" : "py-16 md:py-24";

  return (
    <section id={id} className={`${BG_CLASSES[background]} ${spacingClasses} ${className}`}>
      {children}
    </section>
  );
}
