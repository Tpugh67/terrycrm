import { Check, Flame, Phone, Calendar, ClipboardList, BarChart3, ShieldCheck, RefreshCw, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import HeroSection from "./HeroSection";
import HeroVisual from "./HeroVisual";
import { FeatureGrid } from "./FeatureGrid";
import CTASection from "./CTASection";
import { Container, Section } from "../ui/Container";
import IndustryDemoBoard from "./IndustryDemoBoard";
import type { IndustryPageData } from "../../lib/industryPages";

// Lightweight keyword match so each extracted feature gets a relevant
// icon rather than the same generic checkmark repeated six times.
const KEYWORD_ICONS: Array<[string, LucideIcon]> = [
  ["hot deal", Flame], ["alert", Flame],
  ["activity log", Phone], ["call", Phone],
  ["follow-up", Calendar], ["renewal", Calendar],
  ["pipeline", ClipboardList], ["stage", ClipboardList],
  ["dashboard", BarChart3],
  ["policy", ShieldCheck], ["tracking", ShieldCheck],
  ["renewal pipeline", RefreshCw],
  ["commission", DollarSign], ["calculator", DollarSign], ["spread", DollarSign],
];

function iconFor(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const [keyword, icon] of KEYWORD_ICONS) {
    if (lower.includes(keyword)) return icon;
  }
  return Check;
}

/**
 * The single template every industry page renders through — one
 * component, 18 data files, zero duplicated layout code (the Pass 1
 * audit finding this directly resolves). See docs/adr/0002 for the
 * architecture decision behind this and src/lib/industryPages.ts for the
 * real per-industry content it renders.
 */
export default function IndustryPageTemplate({ data }: { data: IndustryPageData }) {
  return (
    <>
      <HeroSection
        eyebrow={data.eyebrow}
        title={data.heroTitle}
        description={data.heroDescription}
        primaryCta={{ label: "Start free trial", href: `/login?mode=signup&industry=${data.slug}` }}
        visual={<HeroVisual variant="illustration" />}
      />

      <Section background="alt">
        <Container width="wide">
          <IndustryDemoBoard
            stages={data.stages}
            deals={data.demoDeals}
            headlineLabel={data.headlineLabel}
            accentColor={data.color}
          />
        </Container>
      </Section>

      {data.features.length > 0 && (
        <FeatureGrid
          title={`Built for ${data.label.toLowerCase()}, not generic sales`}
          features={data.features.map((f) => ({
            icon: iconFor(f.title),
            headline: f.title,
            description: f.description,
          }))}
          columns={3}
        />
      )}

      <CTASection
        title={data.ctaHeadline}
        description="No charge for 14 days. Cancel anytime."
        primaryCta={{ label: "Start free trial", href: `/login?mode=signup&industry=${data.slug}` }}
      />
    </>
  );
}
