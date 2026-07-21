"use client";
import { HeroSection, ApplicationForm } from "../../../../components/marketing";
import type { FormFieldConfig } from "../../../../components/marketing";
import { Container, Section } from "../../../../components/ui/Container";
import { Counter } from "../../../../components/motion";

const FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
  { name: "website", label: "Website or social profile", type: "text", placeholder: "https://yourwebsite.com or @yourhandle" },
  {
    name: "platform", label: "Primary platform", type: "select", required: true,
    options: ["Blog / Website", "YouTube", "Instagram", "TikTok", "LinkedIn", "Facebook", "Twitter / X", "Email Newsletter", "Podcast", "Other"],
  },
  { name: "audience", label: "Audience size / description", type: "text", required: true, placeholder: "e.g. 5,000 email subscribers, small business owners" },
  { name: "why", label: "How will you promote PipeDesk?", type: "textarea", required: true, placeholder: "Tell us your promotion strategy...", rows: 4 },
];

async function submitApplication(values: Record<string, string>) {
  const { supabase } = await import("../../../../lib/supabase");
  const { error } = await supabase.from("affiliate_applications").insert({
    name: values.name,
    email: values.email,
    website: values.website,
    audience: values.audience,
    platform: values.platform,
    why: values.why,
    status: "pending",
  });
  if (error) throw error;

  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "affiliate_application",
      data: { name: values.name, email: values.email, platform: values.platform, audience: values.audience },
    }),
  }).catch(() => {});
}

export default function AffiliateApplyPage() {
  return (
    <>
      <HeroSection
        eyebrow="Affiliate program"
        title="Join the PipeDesk Affiliate Program"
        description="Earn 20% recurring commission on every customer you refer. Share your link, earn every month."
      />

      <Section background="surface" spacing="tight">
        <Container width="form">
          <div className="grid grid-cols-3 gap-4 mb-10 text-center">
            <div>
              <Counter value={20} suffix="%" className="text-2xl font-semibold text-(--color-success) block" />
              <div className="pd-text-caption mt-1">Recurring commission</div>
            </div>
            <div>
              <div className="pd-numeric text-2xl font-semibold text-(--color-success)">Monthly</div>
              <div className="pd-text-caption mt-1">Payout schedule</div>
            </div>
            <div>
              <div className="pd-numeric text-2xl font-semibold text-(--color-success)">Free</div>
              <div className="pd-text-caption mt-1">To join</div>
            </div>
          </div>

          <h2 className="pd-text-h2 mb-2">Apply to become an affiliate</h2>
          <p className="pd-text-body mb-8">Tell us about yourself and how you plan to promote PipeDesk.</p>

          <ApplicationForm
            fields={FIELDS}
            submitLabel="Submit application →"
            onSubmit={submitApplication}
            accentColor="var(--color-success)"
            successMessage={(v) => `We'll review your application and get back to you within 24 hours at ${v.email}. Check your spam folder if you don't hear from us.`}
          />
          <p className="pd-text-caption text-center mt-4">We review all applications within 24 hours · hello@pipedesk.app</p>
        </Container>
      </Section>
    </>
  );
}
