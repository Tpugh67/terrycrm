import { Container, Section } from "../ui/Container";
import { StaggerGroup } from "../motion";

export type TimelineStep = { title: string; description: string };

export default function TimelineSection({
  title,
  steps,
}: {
  title?: string;
  steps: TimelineStep[];
}) {
  return (
    <Section background="surface">
      <Container width="narrow">
        {title && <h2 className="pd-text-h1 text-center mb-16">{title}</h2>}
        <StaggerGroup className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-5 p-6 bg-(--color-surface) rounded-[var(--radius-2xl)] border border-(--color-border)">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-(--color-primary) text-white flex items-center justify-center font-semibold pd-numeric flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="pd-text-body">{step.description}</p>
              </div>
            </div>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
