import type { LucideIcon } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Card from "../ui/Card";
import AIIllustration from "../illustrations/AIIllustration";
import { StaggerGroup } from "../motion";

export type AICapability = { icon?: LucideIcon; label: string; description?: string };

export default function AISection({
  eyebrow = "AI assistant",
  title,
  description,
  capabilities,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  capabilities: AICapability[];
}) {
  return (
    <Section background="dark">
      <Container width="content">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="pd-text-caption uppercase tracking-wider mb-3 opacity-80">{eyebrow}</p>
            <h2 className="pd-text-h1 mb-4">{title}</h2>
            {description && <p className="pd-text-body-lg opacity-90 mb-8">{description}</p>}
            <StaggerGroup className="space-y-3" staggerMs={60}>
              {capabilities.map((cap) => (
                <Card key={cap.label} variant="bordered" className="bg-white/5 border-white/15 flex items-start gap-3">
                  {cap.icon && <cap.icon size={20} className="text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />}
                  <div>
                    <div className="font-semibold text-sm text-white">{cap.label}</div>
                    {cap.description && <div className="text-sm text-white/70 mt-0.5">{cap.description}</div>}
                  </div>
                </Card>
              ))}
            </StaggerGroup>
          </div>
          <AIIllustration className="w-full max-w-sm mx-auto" />
        </div>
      </Container>
    </Section>
  );
}
