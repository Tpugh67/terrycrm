import type { LucideIcon } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Counter, StaggerGroup } from "../motion";
import type { HeroCta } from "./HeroSection";

export type PartnerStat = { value: number; suffix?: string; prefix?: string; label: string };
export type PartnerPerk = { title: string; description: string };

/**
 * Shared structure behind AffiliateSection and SDRRecruitmentSection —
 * both are "become a partner" pitches that differ only in copy/tone, not
 * layout. Keeping one implementation here means the two never drift
 * apart visually as the brand evolves.
 */
export default function PartnerRecruitmentSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  stats,
  perks,
  cta,
  accentColor = "var(--color-primary)",
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  stats: PartnerStat[];
  perks: PartnerPerk[];
  cta: HeroCta;
  accentColor?: string;
}) {
  return (
    <Section background="alt">
      <Container width="content">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-6"
            style={{ background: accentColor }}
          >
            <Icon size={26} color="white" strokeWidth={2} />
          </div>
          <p className="pd-text-caption uppercase tracking-wider mb-3">{eyebrow}</p>
          <h2 className="pd-text-h1 mb-4">{title}</h2>
          <p className="pd-text-body-lg">{description}</p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} className="text-2xl font-semibold block" />
                <div className="pd-text-caption mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" staggerMs={60}>
          {perks.map((perk) => (
            <Card key={perk.title}>
              <h3 className="font-semibold text-sm mb-1.5">{perk.title}</h3>
              <p className="pd-text-body text-sm">{perk.description}</p>
            </Card>
          ))}
        </StaggerGroup>

        <div className="text-center">
          <Button href={cta.href} size="lg">
            {cta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
