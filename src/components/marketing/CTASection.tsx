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
  return (
    <Section background={background} spacing="loose">
      <Container width="narrow" className="text-center">
        <Reveal effect="slide-up">
          {eyebrow && <p className="pd-text-caption mb-4 uppercase tracking-wider opacity-90">{eyebrow}</p>}
          <h2 className="pd-text-h1 mb-4">{title}</h2>
          {description && <p className="pd-text-body-lg mb-10 opacity-90">{description}</p>}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={primaryCta.href} variant="primary" size="lg" className="bg-white text-(--color-primary) hover:bg-white/90">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
