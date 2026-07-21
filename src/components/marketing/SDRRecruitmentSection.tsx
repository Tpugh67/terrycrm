import { Handshake } from "lucide-react";
import PartnerRecruitmentSection, { PartnerPerk, PartnerStat } from "./PartnerRecruitmentSection";
import type { HeroCta } from "./HeroSection";

export default function SDRRecruitmentSection({
  title = "Become a PipeDesk sales rep",
  description,
  stats = [],
  perks,
  cta,
}: {
  title?: string;
  description: string;
  stats?: PartnerStat[];
  perks: PartnerPerk[];
  cta: HeroCta;
}) {
  return (
    <PartnerRecruitmentSection
      icon={Handshake}
      eyebrow="Sales rep program"
      title={title}
      description={description}
      stats={stats}
      perks={perks}
      cta={cta}
      accentColor="var(--color-primary)"
    />
  );
}
