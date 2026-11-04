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
// The annual toggle is hidden until annual billing exists, so this page never
// shows a price (such as $24/mo) that checkout will not actually charge.
const PLANS: PricingPlan[] = [
  {
    name: "Solo",
    description: "Perfect for independent professionals",
    price: "$29",
    period: "/mo",
    scale: "1 user",
    features: [
      "1 user",
      "Flexible, customizable pipelines",
      "Unlimited deals",
      "CSV import/export",
      "Follow-up reminders",
      "Works on phone and desktop browsers",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "/login?mode=signup&plan=solo" },
  },
  {
    name: "Team",
    description: "Multi-user accounts for small teams. Coming soon.",
    price: "$79",
    period: "/mo",
    scale: "Coming soon · join the waitlist",
    highlighted: true,
    features: [
      "Up to 5 users (in development)",
      "Everything in Solo",
      "Team collaboration (in development)",
      "Shared pipeline views (in development)",
      "Team activity log (in development)",
    ],
    cta: { label: "Join the waitlist", href: "mailto:hello@pipedesk.app?subject=Team%20Plan%20Waitlist" },
  },
  {
    name: "Business",
    description: "Larger multi-user accounts. Coming soon.",
    price: "$149",
    period: "/mo",
    scale: "Coming soon · join the waitlist",
    features: [
      "Up to 15 users (in development)",
      "Everything in Team",
      "Advanced reporting (in development)",
      "Custom fields (in development)",
    ],
    cta: { label: "Join the waitlist", href: "mailto:hello@pipedesk.app?subject=Business%20Plan%20Waitlist" },
  },
  {
    name: "Corporate",
    description: "For large organizations. Tell us what you need.",
    price: "Custom",
    scale: "Custom setup · in development",
    features: [
      "Multi-user accounts (in development)",
      "Setup and onboarding tailored to your organization",
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

      <PricingSection plans={PLANS} columns={4} />

      <FAQSection
        title="Frequently asked questions"
        faqs={[
          { question: "Can I change plans later?", answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings." },
          { question: "What happens after the free trial?", answer: "We collect your card when you sign up, but you will not be charged until your 14-day trial ends. Cancel anytime before then and you will not be billed." },
          { question: "Do you offer refunds?", answer: "There are no refunds once you've been charged, but you can cancel free anytime during your 14-day trial. See our Refund Policy for full details." },
          { question: "Is PipeDesk right for my business?", answer: "Yes. PipeDesk isn't locked to a fixed set of industries — start from a template built for your business." },
          { question: "Can I import my existing data?", answer: "Yes! PipeDesk supports CSV import so you can bring your existing deals and contacts." },
          { question: "Is there a setup fee?", answer: "No setup fees ever. You set up Solo yourself in a few minutes." },
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
