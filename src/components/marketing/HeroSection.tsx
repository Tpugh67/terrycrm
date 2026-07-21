import { ReactNode } from "react";
import { Container, Section } from "../ui/Container";
import Button from "../ui/Button";
import { Reveal } from "../motion";

export type HeroCta = { label: string; href: string };

export default function HeroSection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  visual,
  background = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Slot for HeroVisual, ProductScreenshot, or any illustration. */
  visual?: ReactNode;
  background?: "dark" | "surface" | "gradient";
}) {
  return (
    <Section background={background} spacing="loose" className="relative overflow-hidden">
      <Container width="wide">
        <div className={`grid gap-12 items-center ${visual ? "lg:grid-cols-2" : ""}`}>
          <Reveal effect="slide-up">
            <div>
              {eyebrow && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-[var(--radius-full)] mb-6 bg-white/10 border border-white/20">
                  {eyebrow}
                </div>
              )}
              <h1 className="pd-text-display">{title}</h1>
              {description && <p className="pd-text-body-lg mt-6 max-w-xl opacity-90">{description}</p>}
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap items-center gap-4 mt-10">
                  {primaryCta && (
                    <Button href={primaryCta.href} variant="primary" size="lg">
                      {primaryCta.label}
                    </Button>
                  )}
                  {secondaryCta && (
                    <Button href={secondaryCta.href} variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                      {secondaryCta.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Reveal>
          {visual && (
            <Reveal effect="reveal" delayMs={150}>
              {visual}
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}
