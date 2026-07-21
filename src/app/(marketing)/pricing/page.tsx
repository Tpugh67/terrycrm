import { HeroSection, PricingSection, FAQSection, CTASection } from "../../../components/marketing";
import type { PricingPlan } from "../../../components/marketing";

// Every plan CTA routes through /login?mode=signup&plan=X — the same
// flow the homepage's pricing section already correctly uses. This is
// deliberate, not an oversight: that flow creates the Supabase account
// (auth user + profiles row) *before* redirecting to Stripe, via
// /api/checkout. A previous version of this page called Stripe checkout
// directly with no account-creation step at all — someone could pay
// successfully and then have no way to log in and use what they paid
// for, since no account existed for the webhook to attach the paid
// subscription status to. See the accompanying audit notes for the
// full trace. Billing-period selection stays purely a display feature
// here (see PricingSection's billingToggle) since /api/checkout has no
// annual-vs-monthly price distinction to route to yet regardless.
const PLANS: PricingPlan[] = [
  {
    name: "Solo",
    description: "Perfect for independent professionals",
    price: { monthly: 29, annual: 24 },
    period: "/mo",
    scale: "1 user",
    features: [
      "1 user",
      "All 18 industry pipelines",
      "Unlimited deals",
      "CSV import/export",
      "Follow-up reminders",
      "Mobile app",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "/login?mode=signup&plan=solo" },
  },
  {
    name: "Team",
    description: "For growing teams and small agencies",
    price: { monthly: 79, annual: 66 },
    period: "/mo",
    scale: "Up to 5 users",
    highlighted: true,
    features: [
      "Up to 5 users",
      "Everything in Solo",
      "Team collaboration",
      "Shared pipeline views",
      "Team activity log",
      "Priority email support",
      "Onboarding call",
    ],
    cta: { label: "Start free trial", href: "/login?mode=signup&plan=team" },
  },
  {
    name: "Business",
    description: "For established businesses",
    price: { monthly: 149, annual: 124 },
    period: "/mo",
    scale: "Up to 15 users",
    features: [
      "Up to 15 users",
      "Everything in Team",
      "Advanced reporting",
      "Custom fields",
      "Priority support",
      "Dedicated success manager",
      "Custom onboarding",
    ],
    cta: { label: "Start free trial", href: "/login?mode=signup&plan=business" },
  },
  {
    name: "Corporate",
    description: "For large organizations",
    price: "Custom",
    scale: "15+ users",
    features: [
      "Unlimited users",
      "Everything in Business",
      "White glove onboarding",
      "Dedicated support rep",
      "Custom workflows",
      "SLA guarantee",
      "Custom contract",
    ],
    cta: { label: "Contact us", href: "mailto:hello@pipedesk.app?subject=Corporate Plan Inquiry" },
  },
];

export default function PricingPage() {
  return (
    <>
      <HeroSection
        title="Simple, transparent pricing"
        description="Start free for 14 days. No charge until your trial ends."
        background="surface"
      />

      <PricingSection
        plans={PLANS}
        billingToggle
        annualSavingsLabel="Save 2 months"
        columns={4}
      />

      <FAQSection
        title="Frequently asked questions"
        faqs={[
          { question: "Can I change plans later?", answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings." },
          { question: "What happens after the free trial?", answer: "After 14 days you'll be prompted to enter payment details. No charge until then." },
          { question: "Do you offer refunds?", answer: "Yes — if you're not satisfied within 30 days of your first payment we'll refund you in full." },
          { question: "Which industries are supported?", answer: "All 18 industries — Real Estate, Insurance, Solar, Trucking, Recruiting, Healthcare, Legal, and 11 more." },
          { question: "Can I import my existing data?", answer: "Yes! PipeDesk supports CSV import on all plans so you can bring your existing deals and contacts." },
          { question: "Is there a setup fee?", answer: "No setup fees ever. Solo and Team plans you set up yourself. Business and Corporate include onboarding." },
        ]}
      />

      <CTASection
        title="Ready to close more deals?"
        description="Start your free 14-day trial. No charge until it ends."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
      />
    </>
  );
}
