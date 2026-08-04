import { FAQSection } from "../../../components/marketing";

export default function FAQPage() {
  return (
    <FAQSection
      title="Frequently asked questions"
      faqs={[
        { question: "What is PipeDesk?", answer: "PipeDesk is a multi-industry CRM platform built for businesses that manage leads, clients, and sales pipelines. It serves 18 industries including real estate, insurance, mortgage, solar, legal, and healthcare, with stages and terminology built for how each industry actually works." },
        { question: "How much does PipeDesk cost?", answer: "PipeDesk offers three plans: Solo at $29/month, Team at $79/month, and Business at $149/month. All plans include every core feature — nothing is paywalled behind a higher tier." },
        { question: "Is there a free trial?", answer: "Yes — every plan includes a free 14-day trial, no exceptions." },
        { question: "Do I need a credit card to start?", answer: "We collect your card at signup, but you won't be charged until your 14-day trial ends. You can cancel anytime before then and you won't be billed at all." },
        { question: "Can I cancel anytime?", answer: "Yes. You can cancel your subscription at any time from your account settings, with no cancellation fees." },
        { question: "What's your refund policy?", answer: "Because every plan includes a full 14-day trial before any charge occurs, we don't offer refunds once a subscription charge has been made. See our Refund Policy page for the full details." },
        { question: "Which industries does PipeDesk support?", answer: "18 industries today, including real estate, insurance, mortgage, automotive, solar, financial services, legal, recruiting, healthcare, construction, consulting, e-commerce, property management, trucking, dental, fitness, nonprofit, and education — each with its own pipeline stages and terminology out of the box." },
        { question: "Can I import my existing contacts and deals?", answer: "Yes, PipeDesk supports CSV import and export so you can bring your existing data in and take it with you if you ever need to." },
        { question: "Can multiple people on my team use PipeDesk?", answer: "Yes — the Team plan supports up to 5 users and the Business plan supports up to 15, with shared pipeline views and a team activity log." },
        { question: "Is my data secure?", answer: "Yes. Your data is stored in a secure, access-controlled database, and authentication is handled through industry-standard secure login." },
        { question: "What kind of support do you offer?", answer: "All plans include email support. Team and Business plans include priority support, and Business includes a dedicated success manager." },
        { question: "How do I get help if I have a question?", answer: "Visit our Help Center, or reach out directly at hello@pipedesk.app." },
      ]}
    />
  );
}
