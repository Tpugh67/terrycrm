import { Container, Section } from "../ui/Container";
import Button from "../ui/Button";
import { Reveal } from "../motion";
import type { HeroCta } from "./HeroSection";

export default function CTASection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  background = "gradient",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  background?: "gradient" | "dark" | "alt";
}) {
  // Inline style so no shared text class can wash this out to grey on the
  // gradient/dark backgrounds.
  const subtleColor = background === "alt" ? undefined : "rgba(255,255,255,0.88)";
  return (
    <Section background={background} spacing="loose">
      <Container width="narrow" className="text-center">
        <Reveal effect="slide-up">
          {eyebrow && <p className="pd-text-caption mb-4 uppercase tracking-wider" style={{ color: subtleColor }}>{eyebrow}</p>}
          <h2 className="pd-text-h1 mb-4">{title}</h2>
          {description && <p className="pd-text-body-lg mb-10" style={{ color: subtleColor }}>{description}</p>}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={primaryCta.href} variant="onDark" size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="onDarkOutline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
