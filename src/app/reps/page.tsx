"use client";

export default function RepsPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const background = (form.elements.namedItem("background") as HTMLTextAreaElement).value.trim();
    const why = (form.elements.namedItem("why") as HTMLTextAreaElement).value.trim();

    const mailto = `mailto:terry@pipedesk.app?subject=Rep Application – ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0ASales Background:%0A${encodeURIComponent(background)}%0A%0AWhy Interested:%0A${encodeURIComponent(why)}`;
    window.open(mailto);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-[#0d1f3c] text-white rounded-2xl p-10 text-center">
          <h1 className="text-3xl font-semibold mb-3">Become a PipeDesk Sales Rep</h1>
          <p className="text-white/70 text-base leading-relaxed">
            Earn 30% recurring commission every month — for every client you bring in,
            for as long as they stay.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-medium mb-4">Commission structure</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { clients: "10 clients", amount: "$87", label: "per month" },
              { clients: "100 clients", amount: "$870", label: "per month" },
              { clients: "500 clients", amount: "$4,350", label: "per month" },
            ].map((row) => (
              <div key={row.clients} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{row.clients}</div>
                <div className="text-2xl font-semibold text-[#1a5fa8]">{row.amount}</div>
                <div className="text-xs text-gray-400 mt-1">{row.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Based on Solo plan ($29/mo). Higher plans earn more. Commission stacks every month.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-medium mb-4">How it works</h2>
          <ul className="space-y-3">
            {[
              "You refer businesses to PipeDesk — we handle onboarding and support",
              "Earn 30% of their monthly subscription, every month they stay active",
              "Close a minimum of 10 new paying clients per month to stay active",
              "If you close fewer than 10 clients for 3 consecutive months, the agreement is terminated",
              "Upon termination, commissions on existing accounts continue for 90 days, then revert to PipeDesk",
              "All clients remain the permanent property of PipeDesk",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                <span className="text-[#1a5fa8] font-medium shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-medium mb-4">Apply now</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">Full name</label>
              <input name="name" type="text" required placeholder="Your name"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[#1a5fa8] focus:ring-2 focus:ring-[#1a5fa8]/10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">Email</label>
              <input name="email" type="email" required placeholder="you@email.com"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[#1a5fa8] focus:ring-2 focus:ring-[#1a5fa8]/10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">Sales background</label>
              <textarea name="background" required rows={3} placeholder="Brief summary of your sales experience..."
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[#1a5fa8] focus:ring-2 focus:ring-[#1a5fa8]/10 resize-y" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">Why are you interested?</label>
              <textarea name="why" required rows={3} placeholder="What excites you about this opportunity?"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[#1a5fa8] focus:ring-2 focus:ring-[#1a5fa8]/10 resize-y" />
            </div>
            <div className="flex gap-3 pt-1">
              <a href="/sales-rep-agreement.pdf" download
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                ↓ Download rep agreement
              </a>
              <button type="submit"
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#0d1f3c] text-white text-sm font-medium hover:bg-[#1a3a6e] transition-colors">
                Submit application ↗
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Commission-only role. No salary or guarantee. Full terms in the rep agreement above.
          </p>
        </div>

      </div>
    </main>
  );
}
