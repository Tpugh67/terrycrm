import {
  Workflow, Rocket, DollarSign, Timer, TrendingUp as GrowthIcon,
  MailPlus, ClipboardList, Target, MessageSquareText,
  Building, ShieldCheck as TrustShield, CloudCog, CalendarClock, Tag,
} from "lucide-react";
import {
  HeroSection,
  HeroVisual,
  DashboardPreview,
  FeatureGrid,
  IndustryGrid,
  AISection,
  TrustSection,
  PricingSection,
  AffiliateSection,
  SDRRecruitmentSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from "../../components/marketing";
import type { Industry } from "../../components/marketing";
import { INDUSTRY_PAGES, INDUSTRY_SLUGS } from "../../lib/industryPages";

// Derived from the same config the industry pages themselves render from
// (src/lib/industryPages.ts) — previously this array was hardcoded here
// separately, which is exactly the kind of duplication Pass 5's industry
// architecture work was meant to eliminate.
const INDUSTRIES: Industry[] = INDUSTRY_SLUGS.map((slug) => {
  const page = INDUSTRY_PAGES[slug as keyof typeof INDUSTRY_PAGES];
  return {
    icon: page.icon,
    label: page.label,
    href: `/${page.slug}`,
    color: page.color,
    description: page.eyebrow,
  };
});

export default function HomePage() {
  return (
    <>

      <HeroSection
        eyebrow="Built for real professionals · 18 industries"
        title="The CRM built for your industry"
        description="Stop configuring generic tools. PipeDesk gives you a pipeline built exactly for how your industry works — stages, terminology, and workflows included."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
        secondaryCta={{ label: "Choose your industry", href: "#industries" }}
        visual={
          <HeroVisual
            variant="pipeline-cards"
            overlay
            pipelineCards={[
              { title: "Oak Street Duplex", amount: "$18,400", stage: "Offer made" },
              { title: "Maple Ave Listing", amount: "$9,200", stage: "Contacted" },
              { title: "Riverside Policy", amount: "$4,750", stage: "Closed won" },
            ]}
          />
        }
      />

      <DashboardPreview
        eyebrow="See it before you read about it"
        title="Your whole pipeline, one screen"
        description="Every deal, every stage, every follow-up — organized the way your industry actually works."
      />

      {/* "Why PipeDesk" — outcome-level, answers "why not a generic CRM"
          before the deeper feature/AI/industry sections make the case in
          detail. Intentionally lighter than a full feature grid: no
          descriptions, no screenshots — five plain reasons, not a pitch. */}
      <FeatureGrid
        title="Why PipeDesk instead of a generic CRM"
        description="Not more features. The right ones, built for how you actually sell."
        columns={4}
        features={[
          { icon: Workflow, headline: "Industry-specific pipelines", description: "Stages and fields built for your industry, not a generic sales funnel." },
          { icon: Rocket, headline: "Simple onboarding", description: "Pick your industry, and your pipeline is ready — no configuration required." },
          { icon: DollarSign, headline: "Affordable pricing", description: "Plans start at $29/month, with every feature included, not paywalled." },
          { icon: Timer, headline: "Fast setup", description: "Import your contacts and start working deals the same day you sign up." },
        ]}
      />

      <IndustryGrid
        title="Built for your industry, not a generic pipeline"
        description="Pick your industry and PipeDesk sets up the right stages, terminology, and fields automatically."
        industries={INDUSTRIES}
      />

      <AISection
        title="An AI assistant that actually knows the deal"
        description="Built into every deal card — grounded in that deal's real notes and numbers, not generic prompts."
        capabilities={[
          { icon: MailPlus, label: "Draft a follow-up email", description: "Written from the deal's actual stage and history." },
          { icon: Target, label: "Suggest the next action", description: "One clear, specific next step — not a generic checklist." },
          { icon: ClipboardList, label: "Summarize a deal in seconds", description: "Status, key numbers, and risks in four bullet points." },
          { icon: GrowthIcon, label: "Estimate close probability", description: "An honest read on the deal's odds, with reasoning." },
          { icon: MessageSquareText, label: "Prep for objections", description: "The most likely pushback, and how to answer it." },
        ]}
      />

      {/* Trust, without fabricated proof — every point here is true today,
          not aspirational. Sits right before Pricing, so confidence is
          established immediately before the visitor is asked to commit. */}
      <TrustSection
        points={[
          { icon: Building, label: "Built for growing businesses" },
          { icon: TrustShield, label: "Industry-specific workflows" },
          { icon: Tag, label: "Transparent pricing" },
          { icon: CalendarClock, label: "14-day free trial" },
          { icon: CloudCog, label: "Cloud-based, work from anywhere" },
        ]}
      />

      <PricingSection
        title="Simple pricing, all plans included"
        description="Every plan includes a 14-day free trial. Cancel anytime."
        plans={[
          {
            name: "Solo",
            price: "$29",
            period: "/month",
            description: "For one person running their own pipeline.",
            features: ["1 user", "Unlimited deals", "CSV import/export"],
            cta: { label: "Start free trial", href: "/login?mode=signup&plan=solo" },
          },
          {
            name: "Team",
            price: "$79",
            period: "/month",
            description: "For small teams working deals together.",
            features: ["5 users", "Unlimited deals", "AI deal assistant"],
            cta: { label: "Start free trial", href: "/login?mode=signup&plan=team" },
            highlighted: true,
          },
          {
            name: "Business",
            price: "$149",
            period: "/month",
            description: "For growing teams that need visibility.",
            features: ["Unlimited users", "Priority support", "Admin analytics"],
            cta: { label: "Start free trial", href: "/login?mode=signup&plan=business" },
          },
        ]}
      />

      <AffiliateSection
        description="Share your link, earn 20% recurring commission on every customer who signs up through it — for as long as they stay."
        stats={[{ value: 20, suffix: "%", label: "Recurring commission" }]}
        perks={[
          { title: "Free to join", description: "No cost, no minimum audience size required." },
          { title: "Monthly payouts", description: "Paid out automatically once you hit the threshold." },
          { title: "Your own link", description: "Every signup through it is tracked and attributed to you." },
        ]}
        cta={{ label: "Become an affiliate", href: "/affiliate/apply" }}
      />

      <SDRRecruitmentSection
        description="Refer businesses to PipeDesk and earn 30% recurring commission every month they stay a customer."
        stats={[{ value: 30, suffix: "%", label: "Recurring commission" }]}
        perks={[
          { title: "Commission-only, no cap", description: "Earn on every customer you close, every month they stay." },
          { title: "Free CRM access", description: "Use PipeDesk yourself to manage your own leads." },
          { title: "Sales training included", description: "Scripts and objection handling, ready to use." },
        ]}
        cta={{ label: "Become a sales rep", href: "/reps" }}
      />

      {/* Renders nothing until real customer testimonials exist — kept in
          the page structure per the no-fabrication policy, so real quotes
          can be added later with zero layout change. */}
      <TestimonialsSection testimonials={[]} />

      <FAQSection
        title="Frequently asked questions"
        faqs={[
          { question: "What is PipeDesk?", answer: "PipeDesk is a multi-industry CRM platform built for businesses that manage leads, clients, and sales pipelines. It serves 18 industries including real estate, insurance, mortgage, solar, legal, and healthcare." },
          { question: "How much does PipeDesk cost?", answer: "PipeDesk offers three plans: Solo at $29/month, Team at $79/month, and Business at $149/month. All plans include a free 14-day trial." },
          { question: "Is there a free trial?", answer: "Yes — every plan includes a free 14-day trial." },
          { question: "Do I need a credit card to start?", answer: "We collect your card at signup, but you won't be charged until your 14-day trial ends. Cancel anytime before then and you won't be billed." },
          { question: "Can I cancel anytime?", answer: "Yes. You can cancel your subscription at any time from your account settings, with no cancellation fees." },
        ]}
      />

      <CTASection
        eyebrow="Ready when you are"
        title="Start your free trial today"
        description="No charge for 14 days. Cancel anytime."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
      />
    </>
  );
}
