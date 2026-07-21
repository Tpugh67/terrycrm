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

export default function TermsPage() {
  return (
    <>
      <LegalDocumentHeader title="Terms of Service" lastUpdated="July 19, 2026" />
      <Section background="surface" spacing="tight">
        <Container width="narrow">
          <Sec title="1. The service">
            <p>PipeDesk is a subscription CRM platform. Plans are Solo ($29/month), Team ($79/month), and Business ($149/month), each with a 14-day free trial. A payment method is collected at signup; you will not be charged until the trial ends, and you can cancel before then at no cost.</p>
          </Sec>

          <Sec title="2. Your account">
            <p>You&apos;re responsible for keeping your login credentials secure and for the accuracy of the data you enter. You may cancel your subscription at any time from your account settings.</p>
          </Sec>

          <Sec title="3. Acceptable use">
            <p>Don&apos;t use PipeDesk to store or transmit unlawful content, to attempt to bypass its security or access controls, or to interfere with other users&apos; access to the product.</p>
          </Sec>

          <Sec title="4. Partner programs">
            <p>Sales rep, affiliate, and agency partner relationships are governed by the specific terms presented during application (see the Sales Rep Agreement for representatives). In general: commissions are recurring for as long as a referred customer remains subscribed, paid monthly, and program-specific performance requirements (where they apply) are described on the relevant application page.</p>
          </Sec>

          <Sec title="5. Payments">
            <p>Payments are processed by Stripe. Prices are as listed on our Pricing page at the time of purchase; we&apos;ll notify you of any price changes before they apply to your subscription.</p>
          </Sec>

          <Sec title="6. Termination">
            <p>You may cancel your account at any time. We may suspend or terminate accounts that violate these terms.</p>
          </Sec>

          <Sec title="7. Disclaimer and limitation of liability">
            <p>PipeDesk is provided &ldquo;as is.&rdquo; We don&apos;t guarantee the product will be uninterrupted or error-free.</p>
          </Sec>

          <Sec title="8. Changes to these terms">
            <p>We may update these terms as the product changes. We&apos;ll update the &ldquo;Last updated&rdquo; date above when we do.</p>
          </Sec>

          <Sec title="9. Contact">
            <p>
              Questions about these terms:{" "}
              <a href="mailto:hello@pipedesk.app" className="text-(--color-primary) hover:underline">hello@pipedesk.app</a>.
            </p>
          </Sec>
        </Container>
      </Section>
    </>
  );
}
