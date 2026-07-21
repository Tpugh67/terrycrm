import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Button from "../ui/Button";
import IndustryIllustration from "../illustrations/IndustryIllustration";
import ProductScreenshot from "../mockups/ProductScreenshot";
import { StaggerGroup } from "../motion";
import type { HeroCta } from "./HeroSection";

export type Industry = {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  description?: string;
  cta?: HeroCta;
  /** Renders a small dashboard preview inside the card — detailed variant only. */
  dashboardPreview?: boolean;
  /** Short bullet list of industry-specific capabilities — detailed variant only. */
  features?: string[];
};

/**
 * `variant="compact"` (default) is built for a dense grid of all 18
 * industries — icon + label only, no layout shift no matter how many
 * optional fields a given industry defines. `variant="detailed"` is for
 * a single-industry showcase (e.g. a features tab) and renders every
 * optional field that's present.
 */
export function IndustryCard({
  icon,
  label,
  href,
  color,
  description,
  cta,
  dashboardPreview,
  features,
  variant = "compact",
}: Industry & { variant?: "compact" | "detailed" }) {
  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group bg-(--color-surface) rounded-[var(--radius-2xl)] border border-(--color-border) p-5 flex flex-col items-center text-center gap-3 pd-hover-lift"
      >
        <IndustryIllustration icon={icon} color={color} className="transition-transform group-hover:scale-110" />
        <div className="font-semibold text-sm text-(--color-foreground)">{label}</div>
        <span className="flex items-center gap-1 text-xs font-medium text-(--color-primary) opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <div className="bg-(--color-surface) rounded-[var(--radius-2xl)] border border-(--color-border) p-8 pd-hover-lift">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <IndustryIllustration icon={icon} color={color} size={56} className="mb-5" />
          <h3 className="pd-text-h2 mb-3">{label}</h3>
          {description && <p className="pd-text-body-lg mb-5">{description}</p>}
          {features && features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-(--color-foreground-muted)">
                  <Check size={16} className="text-(--color-success) flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <Button href={cta.href} variant="primary">
              {cta.label}
            </Button>
          )}
        </div>
        {dashboardPreview && (
          <ProductScreenshot alt={`${label} pipeline preview`} frame="browser" url={`pipedesk.app${href}`} />
        )}
      </div>
    </div>
  );
}

export function IndustryGrid({
  title,
  description,
  industries,
}: {
  title?: string;
  description?: string;
  industries: Industry[];
}) {
  return (
    <Section background="alt" id="industries">
      <Container width="wide">
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && <h2 className="pd-text-h1 mb-4">{title}</h2>}
            {description && <p className="pd-text-body-lg">{description}</p>}
          </div>
        )}
        <StaggerGroup
          staggerMs={30}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {industries.map((ind) => (
            <IndustryCard key={ind.href} {...ind} variant="compact" />
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
