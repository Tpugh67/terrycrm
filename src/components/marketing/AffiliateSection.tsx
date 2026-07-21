import { Megaphone } from "lucide-react";
import PartnerRecruitmentSection, { PartnerPerk, PartnerStat } from "./PartnerRecruitmentSection";
import type { HeroCta } from "./HeroSection";

export default function AffiliateSection({
  title = "Earn recurring commission promoting PipeDesk",
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
      icon={Megaphone}
      eyebrow="Affiliate program"
      title={title}
      description={description}
      stats={stats}
      perks={perks}
      cta={cta}
      accentColor="var(--color-success)"
    />
  );
}
