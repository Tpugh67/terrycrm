import { Container, Section } from "../ui/Container";
import ProductScreenshot from "../mockups/ProductScreenshot";
import { Reveal } from "../motion";

export default function DashboardPreview({
  eyebrow,
  title,
  description,
  screenshotSrc,
  screenshotAlt,
  frame = "browser",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  screenshotSrc?: string;
  screenshotAlt?: string;
  frame?: "browser" | "laptop";
}) {
  return (
    <Section background="alt">
      <Container width="wide">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {eyebrow && <p className="pd-text-caption mb-3 uppercase tracking-wider">{eyebrow}</p>}
          <h2 className="pd-text-h1 mb-4">{title}</h2>
          {description && <p className="pd-text-body-lg">{description}</p>}
        </div>
        <Reveal effect="reveal">
          <ProductScreenshot
            src={screenshotSrc}
            alt={screenshotAlt ?? title}
            frame={frame}
            url="pipedesk.app/pipeline"
            className="max-w-4xl mx-auto"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
