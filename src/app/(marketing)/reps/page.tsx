"use client";
import { Download } from "lucide-react";
import { Repeat, Target, DollarSign, Rocket, Home as HomeIcon, Smartphone } from "lucide-react";
import { HeroSection, ApplicationForm, TimelineSection, FeatureGrid } from "../../../components/marketing";
import type { FormFieldConfig } from "../../../components/marketing";
import { Container, Section } from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";
import { INDUSTRY_SLUGS, INDUSTRY_PAGES } from "../../../lib/industryPages";

// Industry options reuse the same canonical list every industry page and
// the homepage grid already derive from — not a separately maintained
// list (see ADR 0002).
const INDUSTRY_OPTIONS = INDUSTRY_SLUGS.map((slug) => INDUSTRY_PAGES[slug as keyof typeof INDUSTRY_PAGES].label);

const FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
  { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "(555) 000-0000" },
  { name: "linkedin", label: "LinkedIn URL", type: "text", placeholder: "linkedin.com/in/yourname" },
  { name: "industry", label: "Strongest industry network", type: "select", required: true, options: INDUSTRY_OPTIONS, placeholder: "Select your industry" },
  { name: "background", label: "Sales background", type: "textarea", required: true, placeholder: "Brief summary of your sales experience...", rows: 3 },
  { name: "why", label: "Why are you interested?", type: "textarea", required: true, placeholder: "What excites you about this opportunity?", rows: 3 },
];

// Real commission math: 30% of each real plan price (Solo $29, Team $79,
// Business $149 — see PricingSection), plus tiered client-count examples.
const COMMISSION_ROWS = [
  { clients: "10 clients", monthly: "$87", annual: "$1,044" },
  { clients: "25 clients", monthly: "$217.50", annual: "$2,610" },
  { clients: "100 clients", monthly: "$870", annual: "$10,440" },
  { clients: "500 clients", monthly: "$4,350", annual: "$52,200" },
];

const PLAN_COMMISSIONS = [
  { plan: "Solo", price: "$29/mo", commission: "$8.70/mo" },
  { plan: "Team", price: "$79/mo", commission: "$23.70/mo" },
  { plan: "Business", price: "$149/mo", commission: "$44.70/mo" },
];

const WHY_DIFFERENT = [
  { icon: Repeat, headline: "Recurring commission", description: "You earn every month as long as your customer stays. One sale keeps paying you." },
  { icon: Target, headline: "Easy to sell", description: "18 industry-specific pipelines means everyone you talk to has a demo built for their exact business." },
  { icon: DollarSign, headline: "Multiple price points", description: "Solo $29/mo, Team $79/mo, Business $149/mo — bigger clients mean bigger commissions." },
  { icon: Rocket, headline: "Ground floor opportunity", description: "Get in early as PipeDesk grows across 18 industries." },
  { icon: HomeIcon, headline: "Work from anywhere", description: "100% remote. Sell by phone, email, LinkedIn, or in person, on your own schedule." },
  { icon: Smartphone, headline: "Free trial closes deals", description: "14-day free trial, no charge until day 14 — an easy, low-pressure close." },
];

const HOW_IT_WORKS = [
  { title: "Refer businesses to PipeDesk", description: "We handle onboarding and support — you focus on the referral." },
  { title: "Earn 30% every month they stay active", description: "Commission is recurring, not a one-time payout." },
  { title: "Stay active with 10+ new clients per month", description: "A warning is issued after 2 consecutive months below the minimum; the agreement ends after 3." },
  { title: "Existing commissions continue for 90 days after termination", description: "Then revert to PipeDesk. All clients remain PipeDesk's permanent property throughout." },
];

async function submitApplication(values: Record<string, string>) {
  const { supabase } = await import("../../../lib/supabase");
  const ref_code = values.name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 900 + 100);

  // The `reps` table has no `industry` column (confirmed against the real
  // schema, not assumed) — folded into sales_background as a labeled
  // prefix instead of silently dropping the field or guessing a schema
  // change. Add a real `industry` column via migration if this should
  // become structured/queryable data.
  const background = `Primary industry: ${values.industry}\n\n${values.background}`;

  const { error } = await supabase.from("reps").insert({
    name: values.name,
    email: values.email,
    phone: values.phone,
    linkedin: values.linkedin,
    sales_background: background,
    why_interested: values.why,
    ref_code,
    status: "pending",
  });
  if (error) throw error;

  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "rep_application",
      data: { name: values.name, email: values.email, phone: values.phone, linkedin: values.linkedin },
    }),
  }).catch(() => {});
}

const AGREEMENT_TEXT = (
  <>
    <div>
      <h3 className="font-bold text-(--color-foreground) text-base mb-2">1. Agreement overview</h3>
      <p>This agreement outlines the terms, expectations, and compensation structure for PipeDesk Sales Representatives. By accepting this role, the representative agrees to the terms below.</p>
    </div>
    <div>
      <h3 className="font-bold text-(--color-foreground) text-base mb-2">2. Compensation structure</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Commission rate: 30% recurring on every active subscription closed by the representative.</li>
        <li>Commission is paid monthly on all active accounts attributed to the representative.</li>
        <li>No salary, no base pay, no cap on earnings.</li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold text-(--color-foreground) text-base mb-2">3. Performance expectations</h3>
      <p>Each active representative is expected to close a minimum of 10 new paying clients per month. Representatives are responsible for their own outreach, prospecting, and pipeline management. PipeDesk provides demo access, sales materials, and onboarding support.</p>
    </div>
    <div>
      <h3 className="font-bold text-(--color-foreground) text-base mb-2">4. Inactivity and termination policy</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Fewer than 10 new clients for 2 consecutive months results in a written warning.</li>
        <li>Fewer than 10 new clients for 3 consecutive months ends the agreement.</li>
        <li>Upon termination, recurring commissions on existing active accounts continue for 90 days, then revert fully to PipeDesk.</li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold text-(--color-foreground) text-base mb-2">5. Client ownership</h3>
      <p>All clients closed by the representative are and remain the sole property of PipeDesk. Representatives may not solicit PipeDesk clients for competing products or redirect them away from PipeDesk for any reason.</p>
    </div>
  </>
);

export default function RepsPage() {
  return (
    <>
      <HeroSection
        eyebrow="Sales rep program"
        title="Become a PipeDesk sales rep"
        description="Earn 30% recurring commission every month — for every client you bring in, for as long as they stay."
        background="dark"
      />

      <Section background="alt" spacing="tight">
        <Container width="content">
          <h2 className="pd-text-h3 text-center mb-2">How much can you earn?</h2>
          <p className="pd-text-body text-center mb-8">Commission stacks — every new client adds to your monthly recurring income.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMMISSION_ROWS.map((row) => (
              <Card key={row.clients} className="text-center">
                <div className="pd-numeric text-2xl font-semibold text-(--color-primary)">{row.clients.split(" ")[0]}</div>
                <div className="pd-text-caption mb-2">active clients</div>
                <div className="pd-numeric text-lg font-semibold text-(--color-success)">{row.monthly}</div>
                <div className="pd-text-caption">/month · {row.annual}/yr</div>
              </Card>
            ))}
          </div>
          <p className="pd-text-caption text-center mt-4">Based on the Solo plan ($29/mo) at 30% commission. Team and Business plans earn more.</p>
        </Container>
      </Section>

      <FeatureGrid
        title="Why this opportunity is different"
        features={WHY_DIFFERENT}
        columns={3}
      />

      <Section background="alt" spacing="tight">
        <Container width="content">
          <h2 className="pd-text-h3 text-center mb-2">Commission structure</h2>
          <p className="pd-text-body text-center mb-8">Simple, transparent, recurring.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PLAN_COMMISSIONS.map((p) => (
              <Card key={p.plan} className="text-center">
                <div className="font-semibold text-(--color-foreground) mb-1">{p.plan}</div>
                <div className="pd-text-caption mb-3">{p.price} per customer</div>
                <div className="pd-numeric text-2xl font-semibold text-(--color-success)">{p.commission}</div>
                <div className="pd-text-caption mt-1">per customer per month</div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <TimelineSection title="How it works" steps={HOW_IT_WORKS} />

      <Section background="alt" spacing="tight">
        <Container width="form">
          <div className="text-center mb-6">
            <a
              href="/sales-rep-agreement.pdf"
              download
              className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-foreground-muted) hover:text-(--color-foreground)"
            >
              <Download size={14} /> Download the full rep agreement (PDF)
            </a>
          </div>

          <h2 className="pd-text-h3 mb-6">Apply now</h2>
          <ApplicationForm
            fields={FIELDS}
            submitLabel="Submit application →"
            onSubmit={submitApplication}
            successTitle="Application received!"
            successMessage={() => "We'll review your application and be in touch within 48 hours."}
            agreement={{
              label: "I have read and agree to the PipeDesk Sales Representative Agreement. I understand this is a commission-only role with a minimum of 10 new clients per month, and that all clients belong permanently to PipeDesk.",
              expandableContent: AGREEMENT_TEXT,
            }}
          />
          <p className="pd-text-caption text-center mt-4">Commission-only role. No salary or guarantee.</p>
        </Container>
      </Section>
    </>
  );
}
