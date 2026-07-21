import type { LucideIcon } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import FeatureIllustration from "../illustrations/FeatureIllustration";
import ProductScreenshot from "../mockups/ProductScreenshot";
import { StaggerGroup } from "../motion";
import type { HeroCta } from "./HeroSection";

export type Feature = {
  icon: LucideIcon;
  headline: string;
  description: string;
  /** Optional real (or placeholder) screenshot rendered below the copy. */
  screenshot?: { src?: string; alt: string; frame?: "browser" | "none" };
  /** Optional small abstract motion accent — reuses the illustration system. */
  animation?: "flow" | "radar" | "stack" | "bolt";
  cta?: HeroCta;
  badge?: { label: string; tone?: "primary" | "accent" | "success" | "warning" };
};

export function FeatureCard({ icon: Icon, headline, description, screenshot, animation, cta, badge }: Feature) {
  return (
    <Card hoverLift className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-(--color-primary-light) flex items-center justify-center">
          <Icon size={22} color="var(--color-primary)" strokeWidth={2} />
        </div>
        {badge && <Badge tone={badge.tone ?? "primary"}>{badge.label}</Badge>}
      </div>

      <h3 className="pd-text-h3 mb-2">{headline}</h3>
      <p className="pd-text-body flex-1">{description}</p>

      {animation && <FeatureIllustration variant={animation} className="mt-4 opacity-80" />}

      {screenshot && (
        <ProductScreenshot
          src={screenshot.src}
          alt={screenshot.alt}
          frame={screenshot.frame ?? "browser"}
          className="mt-5"
        />
      )}

      {cta && (
        <Button href={cta.href} variant="ghost" size="sm" className="mt-5 -ml-3.5 self-start">
          {cta.label}
        </Button>
      )}
    </Card>
  );
}

export function FeatureGrid({
  title,
  description,
  features,
  columns = 3,
}: {
  title?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}) {
  const colClass = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <Section background="surface">
      <Container width="content">
        {(title || description) && (
          <div className="text-center mb-16 max-w-2xl mx-auto">
            {title && <h2 className="pd-text-h1 mb-4">{title}</h2>}
            {description && <p className="pd-text-body-lg">{description}</p>}
          </div>
        )}
        <StaggerGroup className={`grid grid-cols-1 ${colClass} gap-6`}>
          {features.map((f) => (
            <FeatureCard key={f.headline} {...f} />
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
