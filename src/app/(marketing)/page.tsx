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
  AISection,
  TrustSection,
  PricingSection,
  AffiliateSection,
  SDRRecruitmentSection,
  TestimonialsSection,
  CTASection,
} from "../../components/marketing";

export default function HomePage() {
  return (
    <>

      <HeroSection
        eyebrow="Trusted by growing sales teams"
        title="The CRM built to help you close more deals"
        description="Stop wrestling with generic tools. PipeDesk gives you one clean pipeline, automatic follow-up reminders, and an AI assistant built into every deal — everything you need to close more, without the busywork."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
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
          { icon: Workflow, headline: "A pipeline built for how you sell", description: "Custom stages and fields that match your sales process — not a generic funnel forced onto your business." },
          { icon: Rocket, headline: "Simple onboarding", description: "Pick your industry, and your pipeline is ready — no configuration required." },
          { icon: DollarSign, headline: "Affordable pricing", description: "Plans start at $29/month, with every feature included, not paywalled." },
          { icon: Timer, headline: "Fast setup", description: "Import your contacts and start working deals the same day you sign up." },
        ]}
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

      <CTASection
        eyebrow="Ready when you are"
        title="Start your free trial today"
        description="No charge for 14 days. Cancel anytime."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
      />
    </>
  );
}
