import { AlertTriangle } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Card from "../ui/Card";

/**
 * Shared wrapper for legal documents (Privacy Policy, Terms of Service).
 * Renders a visible, on-page draft disclaimer — not just a note in a
 * chat response — because a legal document that looks finished but
 * hasn't been reviewed by an attorney is a real liability risk if it
 * ships without anyone noticing the difference.
 */
export default function LegalDocumentHeader({
  title,
  lastUpdated,
}: {
  title: string;
  lastUpdated: string;
}) {
  return (
    <Section background="surface" spacing="tight">
      <Container width="narrow">
        <h1 className="pd-text-h1 mb-2">{title}</h1>
        <p className="pd-text-caption mb-6">Last updated: {lastUpdated}</p>
        <Card variant="bordered" className="border-(--color-warning) bg-(--color-warning-light) flex items-start gap-3">
          <AlertTriangle size={20} className="text-(--color-warning-text) flex-shrink-0 mt-0.5" />
          <p className="text-sm text-(--color-warning-text)">
            <strong>Draft — not yet reviewed by an attorney.</strong> This document is
            grounded in PipeDesk&apos;s actual technical setup (Supabase, Stripe, Resend)
            but has not been reviewed by qualified legal counsel. Do not treat it as
            legally binding or complete until it has been.
          </p>
        </Card>
      </Container>
    </Section>
  );
}
