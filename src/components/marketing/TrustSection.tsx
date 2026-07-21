import type { LucideIcon } from "lucide-react";
import { Container, Section } from "../ui/Container";
import { StaggerGroup } from "../motion";

export type TrustPoint = { icon: LucideIcon; label: string };

/**
 * The trust-building counterpart to LogoCloud/TestimonialsSection for
 * a homepage that doesn't have real customer logos or quotes yet. Every
 * point passed in must be something true today (per the standing
 * no-fabrication policy) — this is a strip of verified facts, not
 * generic social-proof filler. Deliberately not styled as cards (that's
 * FeatureGrid's job elsewhere on the page) — a plain horizontal strip
 * reads as "quick facts," not "another feature pitch."
 */
export default function TrustSection({ points }: { points: TrustPoint[] }) {
  if (points.length === 0) return null;

  return (
    <Section background="alt" spacing="tight">
      <Container width="content">
        <StaggerGroup
          staggerMs={40}
          effect="fade-in"
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        >
          {points.map((point) => (
            <div key={point.label} className="flex items-center gap-2.5 text-sm font-medium text-(--color-foreground-muted)">
              <point.icon size={18} className="text-(--color-primary) flex-shrink-0" strokeWidth={2} />
              {point.label}
            </div>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
