"use client";
import { Mail, Clock } from "lucide-react";
import Link from "next/link";
import { HeroSection, ApplicationForm } from "../../../components/marketing";
import type { FormFieldConfig } from "../../../components/marketing";
import { Container, Section } from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";

const FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
  {
    name: "topic", label: "What's this about?", type: "select", required: true,
    options: ["General question", "Sales / pricing", "Support", "Partnership / affiliate", "Press", "Other"],
  },
  { name: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help?", rows: 5 },
];

async function submitContact(values: Record<string, string>) {
  const res = await fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "contact", data: values }),
  });
  const data = await res.json();
  if (!data.sent) throw new Error("Failed to send");
}

export default function ContactPage() {
  return (
    <>
      <HeroSection
        title="Get in touch"
        description="Questions about PipeDesk? We'll get back to you as soon as we can."
        background="surface"
      />

      <Section background="surface" spacing="tight">
        <Container width="content">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <Mail size={22} className="text-(--color-primary) mx-auto mb-3" />
              <div className="font-semibold text-sm mb-1">Email us directly</div>
              <a href="mailto:hello@pipedesk.app" className="text-sm text-(--color-primary) hover:underline">hello@pipedesk.app</a>
            </Card>
            <Card className="text-center">
              <Clock size={22} className="text-(--color-primary) mx-auto mb-3" />
              <div className="font-semibold text-sm mb-1">Response time</div>
              <div className="pd-text-caption">Within 24 hours</div>
            </Card>
            <Card className="text-center">
              <Mail size={22} className="text-(--color-primary) mx-auto mb-3" />
              <div className="font-semibold text-sm mb-1">Need help with your account?</div>
              <Link href="/help" className="text-sm text-(--color-primary) hover:underline">Visit the Help Center</Link>
            </Card>
          </div>

          <div className="max-w-xl mx-auto">
            <ApplicationForm
              fields={FIELDS}
              submitLabel="Send message"
              onSubmit={submitContact}
              successTitle="Message sent!"
              successMessage={(v) => `Thanks, ${v.name.split(" ")[0]} — we'll get back to you at ${v.email} within 24 hours.`}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
