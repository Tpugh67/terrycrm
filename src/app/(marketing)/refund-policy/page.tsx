import { LegalDocumentHeader } from "../../../components/marketing";
import { Container, Section } from "../../../components/ui/Container";

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="pd-text-h3 mb-3">{title}</h2>
      <div className="pd-text-body space-y-3">{children}</div>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <>
      <LegalDocumentHeader title="Refund Policy" lastUpdated="August 4, 2026" />
      <Section background="surface" spacing="tight">
        <Container width="narrow">
          <Sec title="1. Free trial — no risk, no charge">
            <p>Every PipeDesk plan includes a 14-day free trial. We collect a payment method at signup, but you are not charged anything until the trial ends. You can cancel at any time during the 14 days, at no cost, directly from your account settings.</p>
          </Sec>

          <Sec title="2. Once your trial ends">
            <p>If you don&apos;t cancel before your trial ends, your subscription begins and your card is charged the plan price shown on our <a href="/pricing" className="text-(--color-primary) hover:underline">Pricing</a> page at the time of signup.</p>
          </Sec>

          <Sec title="3. Our refund policy">
            <p>Because every plan includes a full 14-day trial to evaluate PipeDesk before any charge occurs, <strong>we do not offer refunds once a subscription charge has been made</strong>. We encourage you to use the trial period to confirm PipeDesk is the right fit before it converts to a paid subscription.</p>
          </Sec>

          <Sec title="4. Canceling your subscription">
            <p>You can cancel your subscription at any time from your account settings. Canceling stops future billing; it does not retroactively refund charges already made, per §3 above. Your access continues through the end of the billing period you&apos;ve already paid for.</p>
          </Sec>

          <Sec title="5. Billing errors">
            <p>If you believe you were charged in error — for example, a duplicate charge or a charge after you canceled — contact us and we&apos;ll investigate and correct genuine billing mistakes.</p>
          </Sec>

          <Sec title="6. Changes to this policy">
            <p>We may update this policy as the product changes. We&apos;ll update the &ldquo;Last updated&rdquo; date above when we do.</p>
          </Sec>

          <Sec title="7. Contact">
            <p>
              Questions about billing or this policy:{" "}
              <a href="mailto:hello@pipedesk.app" className="text-(--color-primary) hover:underline">hello@pipedesk.app</a>.
            </p>
          </Sec>
        </Container>
      </Section>
    </>
  );
}
