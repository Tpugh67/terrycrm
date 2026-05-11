"use client";
import { useRef, useState } from "react";

type Deal = {
  id?: number;
  title: string;
  seller: string;
  stage: string;
  address?: string;
  arv?: string;
  offer?: string;
  amount?: string;
  contact_email?: string;
  next_follow_up?: string;
  created_at?: string;
};

interface CsvToolsProps {
  deals: Deal[];
  industry: string;
  onImport: (deals: Omit<Deal, "id" | "created_at">[]) => Promise<void>;
}

const FIELDS = ["title","seller","stage","address","arv","offer","amount","contact_email","next_follow_up"];

function toCSV(deals: Deal[]): string {
  const header = FIELDS.join(",");
  const rows = deals.map(d =>
    FIELDS.map(f => {
      const val = (d as any)[f] || "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function parseCSV(text: string): Omit<Deal, "id" | "created_at">[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
  return lines.slice(1).map(line => {
    const vals = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || "").replace(/^"|"$/g, "").trim();
    });
    return {
      title: obj.title || obj.property || obj.name || "Untitled",
      seller: obj.seller || obj.contact || obj.client || "",
      stage: obj.stage || "New Leads",
      address: obj.address || "",
      arv: obj.arv || obj.value || "",
      offer: obj.offer || obj.price || "",
      amount: obj.amount || obj.revenue || "",
      contact_email: obj.contact_email || obj.email || "",
      next_follow_up: obj.next_follow_up || obj.followup || obj.follow_up || "",
    };
  });
}

export default function CsvTools({ deals, industry, onImport }: CsvToolsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  function handleExport() {
    const csv = toCSV(deals);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipedesk-${industry}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportStatus("");
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setImportStatus("❌ No valid rows found in CSV.");
        setImporting(false);
        return;
      }
      await onImport(parsed);
      setImportStatus(`✅ Imported ${parsed.length} deals successfully!`);
    } catch (err) {
      setImportStatus("❌ Import failed. Check your CSV format.");
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Export */}
      <button
        onClick={handleExport}
        disabled={deals.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        ⬇️ Export CSV
        {deals.length > 0 && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{deals.length}</span>}
      </button>

      {/* Import */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={importing}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-sm font-semibold rounded-xl transition shadow-sm"
      >
        {importing ? "⏳ Importing..." : "⬆️ Import CSV"}
      </button>
      <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />

      {/* Template download */}
      <button
        onClick={() => {
          const template = FIELDS.join(",") + "\n" +
            `"123 Main St","John Smith","New Leads","123 Main St","285000","195000","","john@email.com","2026-06-01"`;
          const blob = new Blob([template], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `pipedesk-import-template.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="text-xs text-blue-600 hover:underline"
      >
        Download template
      </button>

      {importStatus && (
        <span className={`text-xs font-medium px-3 py-1.5 rounded-xl ${importStatus.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {importStatus}
        </span>
      )}
    </div>
  );
}
