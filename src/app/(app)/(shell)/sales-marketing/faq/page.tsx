type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "How much commission do affiliates earn?",
    answer: "Affiliates earn 20% recurring commission on every customer who signs up through their link, for as long as that customer stays subscribed.",
  },
  {
    question: "How much commission do sales reps earn?",
    answer: "Sales reps earn 30% recurring commission on every customer they close, every month that customer stays a subscriber.",
  },
  {
    question: "When do I get paid?",
    answer: "Payouts happen monthly, once you cross the payout threshold. Check the Payments page in your Partner Portal for your current balance and next payout date.",
  },
  {
    question: "Do I need to be a PipeDesk customer myself to be a rep or affiliate?",
    answer: "No — but reps get free CRM access included, so you can use PipeDesk yourself to manage your own leads and referrals while you sell it.",
  },
  {
    question: "What if a customer I referred cancels?",
    answer: "Recurring commission is tied to active subscriptions — once a customer cancels, commission on that account stops from that point forward. Commission already earned isn't clawed back.",
  },
  {
    question: "Can I use the scripts and templates exactly as written?",
    answer: "Yes — copy and adapt them to your own voice. They're meant as a strong starting point, not a rigid script to read word-for-word.",
  },
  {
    question: "Is there a minimum number of referrals required?",
    answer: "No minimum — affiliates and reps earn on whatever they bring in, with no quota or audience-size requirement to join.",
  },
  {
    question: "Where can I track my referrals and leads?",
    answer: "The Dashboard and Leads pages in your Partner Portal show real-time tracking of every referral tied to your link, plus their current status.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">❓ FAQ</h1>
        <p className="text-slate-600 mt-1">Common questions about the rep and affiliate program.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} className="bg-white rounded-2xl shadow p-5 group">
            <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between">
              <span>{faq.question}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
