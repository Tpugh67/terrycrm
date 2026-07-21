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

export default function PrivacyPage() {
  return (
    <>
      <LegalDocumentHeader title="Privacy Policy" lastUpdated="July 19, 2026" />
      <Section background="surface" spacing="tight">
        <Container width="narrow">
          <Sec title="1. What we collect">
            <p>When you create a PipeDesk account, we collect your email address and the password you choose (handled by our authentication provider, Supabase, which stores it in encrypted form — PipeDesk never sees or stores your plain-text password).</p>
            <p>As you use PipeDesk, you may enter contact information, deal details, and notes about your own leads and customers into the product. This data is yours; we store it so the product can function.</p>
            <p>If you subscribe to a paid plan, payment is processed by Stripe. PipeDesk does not receive or store your full card number &mdash; Stripe handles that directly.</p>
            <p>If you apply to become a sales rep, affiliate, or agency partner, we collect the information you submit in that application (name, email, phone, and the other fields on the relevant application form).</p>
          </Sec>

          <Sec title="2. How we use it">
            <p>We use your data to operate the product: to authenticate you, to store and display the contacts, deals, and tasks you create, to process payments, and to send you account-related emails (via Resend, our transactional email provider).</p>
            <p>If you were referred to PipeDesk by a partner&apos;s referral link, we record which partner referred you so commissions can be calculated correctly.</p>
          </Sec>

          <Sec title="3. Third parties we share data with">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> &mdash; database hosting and authentication.</li>
              <li><strong>Stripe</strong> &mdash; payment processing.</li>
              <li><strong>Resend</strong> &mdash; transactional email delivery.</li>
              <li><strong>Uppercut</strong> &mdash; affiliate referral tracking (a script loaded on our site to attribute signups to affiliates).</li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>
          </Sec>

          <Sec title="4. Cookies and local storage">
            <p>PipeDesk uses browser local storage to remember a referral code if you arrived via a partner&apos;s link, and relies on Supabase&apos;s session mechanism (cookies and local storage) to keep you signed in.</p>
          </Sec>

          <Sec title="5. Your choices">
            <p>You can delete your account at any time from Settings &rarr; Account. This is a permanent action.</p>
            <p>
              You can contact us at{" "}
              <a href="mailto:hello@pipedesk.app" className="text-(--color-primary) hover:underline">hello@pipedesk.app</a>
              {" "}with any question about your data.
            </p>
          </Sec>

          <Sec title="6. Changes to this policy">
            <p>We may update this policy as the product changes. We&apos;ll update the &ldquo;Last updated&rdquo; date above when we do.</p>
          </Sec>
        </Container>
      </Section>
    </>
  );
}
