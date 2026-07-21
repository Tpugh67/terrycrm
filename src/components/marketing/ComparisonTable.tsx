import { Check, X } from "lucide-react";
import { Container, Section } from "../ui/Container";

export type ComparisonRow = {
  feature: string;
  /** One entry per column, in the same order as `columns`. */
  values: (boolean | string)[];
};

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={18} className="text-(--color-success) inline-block" aria-label="Included" />
    ) : (
      <X size={18} className="text-(--color-foreground-subtle) inline-block" aria-label="Not included" />
    );
  }
  return <span className="pd-numeric text-sm">{value}</span>;
}

export default function ComparisonTable({
  title,
  columns,
  rows,
}: {
  title?: string;
  columns: string[];
  rows: ComparisonRow[];
}) {
  return (
    <Section background="alt">
      <Container width="content">
        {title && <h2 className="pd-text-h1 text-center mb-12">{title}</h2>}
        <div className="overflow-x-auto rounded-[var(--radius-2xl)] border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-(--color-border)">
                <th className="p-4 text-sm font-semibold text-(--color-foreground-muted)">Feature</th>
                {columns.map((col) => (
                  <th key={col} className="p-4 text-sm font-semibold text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-(--color-border) last:border-0">
                  <td className="p-4 text-sm text-(--color-foreground)">{row.feature}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      <Cell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
