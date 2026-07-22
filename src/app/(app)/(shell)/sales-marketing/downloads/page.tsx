type DownloadItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const DOWNLOADS: DownloadItem[] = [
  { id: "brochure", title: "PDF Brochure", description: "A one-page overview of PipeDesk, ideal for leaving behind after an in-person meeting.", icon: "📄" },
  { id: "feature-sheet", title: "Feature Sheet", description: "Full breakdown of features by plan tier.", icon: "📋" },
  { id: "pricing-sheet", title: "Pricing Sheet", description: "Printable pricing comparison for Solo, Team, and Business plans.", icon: "💵" },
  { id: "faq-pdf", title: "FAQ Handout", description: "The most common prospect questions, answered — printable format.", icon: "❔" },
  { id: "one-pager", title: "One Pager", description: "The elevator-pitch version of PipeDesk in a single page.", icon: "📝" },
  { id: "roi-calculator", title: "ROI Calculator", description: "A simple spreadsheet prospects can use to estimate time saved.", icon: "🧮" },
  { id: "logos", title: "PipeDesk Logos", description: "Official logo files in multiple formats and colors.", icon: "🎨" },
  { id: "brand-guide", title: "Brand Guide", description: "Colors, fonts, and usage guidelines for anything co-branded.", icon: "📘" },
  { id: "sales-deck", title: "Sales Deck", description: "Full slide deck for presentations and larger pitches.", icon: "📊" },
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📥 Downloads</h1>
        <p className="text-slate-600 mt-1">Brochures, pricing sheets, and brand assets to share with prospects.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <span className="font-semibold">Note:</span> the actual files for these downloads haven't been created yet.
        This page shows what's planned for the Downloads library — check back soon, or reach out if you need
        one of these sooner and we'll prioritize it.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOWNLOADS.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-6 opacity-75">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-sm text-slate-600 mb-3">{item.description}</p>
            <button disabled className="bg-slate-200 text-slate-500 text-sm font-semibold px-3 py-1.5 rounded-lg cursor-not-allowed">
              Coming soon
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
