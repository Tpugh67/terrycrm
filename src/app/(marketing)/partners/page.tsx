"use client";
import { Handshake, Megaphone, Building, Puzzle, Check } from "lucide-react";
import { HeroSection, FAQSection, CTASection } from "../../../components/marketing";
import { Container, Section } from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const PARTNER_TYPES = [
  {
    icon: Handshake,
    color: "var(--color-primary)",
    tone: "primary" as const,
    title: "Sales Representative",
    subtitle: "I want to sell PipeDesk",
    description: "Earn 30% recurring commission on every customer you close. Work remotely, set your own schedule, and build a growing monthly income.",
    perks: ["30% recurring monthly commission", "Free CRM access", "Sales training provided", "Unique referral link"],
    cta: "Apply as sales rep",
    href: "/reps",
  },
  {
    icon: Megaphone,
    color: "var(--color-success)",
    tone: "success" as const,
    title: "Affiliate Partner",
    subtitle: "I want to promote PipeDesk",
    description: "Share your referral link with your audience and earn recurring commissions. Perfect for bloggers, influencers, consultants, and content creators.",
    perks: ["20% recurring commission", "Marketing assets provided", "AI content assistant", "Real-time analytics"],
    cta: "Join affiliate program",
    href: "/affiliate/apply",
  },
  {
    icon: Building,
    color: "var(--color-warning)",
    tone: "warning" as const,
    title: "Agency Partner",
    subtitle: "I have clients",
    description: "Resell PipeDesk to your clients under your agency brand. White-label options available. Earn revenue share on every client you manage.",
    perks: ["25% revenue share", "White-label options", "Dedicated account manager", "Priority support"],
    cta: "Apply as agency partner",
    href: "/agency/apply",
  },
  {
    icon: Puzzle,
    color: "var(--color-foreground-subtle)",
    tone: "neutral" as const,
    title: "Technology Partner",
    subtitle: "I want to integrate my software",
    description: "Build integrations, plugins, and workflows on top of PipeDesk. Join our technology ecosystem and reach thousands of businesses.",
    perks: ["API access", "Co-marketing opportunities", "Partner badge", "Early feature access"],
    cta: "Coming soon",
    href: "#",
    disabled: true,
  },
];

// Real, verifiable facts only — no partner-count claim, since the actual
// number of active partners is small and specific counts change; these
// four are all program terms that are true regardless of partner volume.
const STATS = [
  { value: "18", label: "Industries served" },
  { value: "30%", label: "Max commission rate" },
  { value: "$29+", label: "Starting plan price" },
  { value: "Monthly", label: "Payout schedule" },
];

export default function PartnersPage() {
  return (
    <>
      <HeroSection
        eyebrow="PipeDesk partner program"
        title="Grow with PipeDesk. Earn recurring income."
        description="Sell, promote, or integrate PipeDesk — the multi-industry CRM built for 18 business types — and earn monthly recurring commissions."
        background="dark"
      />

      <Section background="surface" spacing="tight">
        <Container width="narrow" className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-(--color-foreground-muted)">
            {["Free to join", "Recurring commissions", "Real-time tracking", "Monthly payouts"].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <Check size={15} className="text-(--color-success)" /> {f}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="surface">
        <Container width="wide">
          <div className="text-center mb-12">
            <h2 className="pd-text-h1 mb-3">Choose your partnership type</h2>
            <p className="pd-text-body-lg">Select the option that best describes how you want to work with PipeDesk.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PARTNER_TYPES.map((p) => (
              <Card key={p.title} hoverLift={!p.disabled} className={p.disabled ? "opacity-70" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: p.color }}>
                    <p.icon size={22} color="white" strokeWidth={2} />
                  </div>
                  <Badge tone={p.tone}>{p.subtitle}</Badge>
                </div>
                <h3 className="pd-text-h3 mb-2">{p.title}</h3>
                <p className="pd-text-body mb-5">{p.description}</p>
                <ul className="space-y-2 mb-6">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-(--color-foreground)">
                      <Check size={16} className="text-(--color-success)" strokeWidth={2.5} />
                      {perk}
                    </li>
                  ))}
                </ul>
                {p.disabled ? (
                  <Button disabled className="w-full">{p.cta}</Button>
                ) : (
                  <Button href={p.href} className="w-full">{p.cta} →</Button>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="alt" spacing="tight">
        <Container width="content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="pd-numeric text-3xl font-semibold text-(--color-primary) mb-1">{s.value}</div>
                <div className="pd-text-caption">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <FAQSection
        title="Partner FAQ"
        faqs={[
          { question: "Is it free to join?", answer: "Yes — all partner programs are completely free to join. No upfront costs, no monthly fees." },
          { question: "When do I get paid?", answer: "Commissions are paid monthly. You need to reach the minimum payout threshold of $50 before receiving payment." },
          { question: "Can I be both a sales rep and an affiliate?", answer: "Yes. You can apply for multiple partner types and earn commissions from each program." },
          { question: "How is my referral tracked?", answer: "Each partner receives a unique referral link. When someone signs up through your link, the referral is automatically tracked and attributed to you." },
          { question: "What happens if a customer cancels?", answer: "Commissions are recurring — meaning if a customer cancels their subscription, you stop earning commission for that customer." },
        ]}
      />

      <CTASection
        title="Ready to start earning?"
        description="Join the PipeDesk Partner Program today — free to join, no commitment required."
        primaryCta={{ label: "Become a sales rep", href: "/reps" }}
        secondaryCta={{ label: "Join as affiliate", href: "/affiliate/apply" }}
        background="dark"
      />
    </>
  );
}
