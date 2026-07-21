"use client";
import { useState } from "react";
import { Card, Badge } from "../ui";
import type { DemoDeal } from "../../lib/industryPages";

const STAGE_TONE_CYCLE: Array<"neutral" | "info" | "warning" | "primary" | "success"> = [
  "neutral", "info", "warning", "primary", "success",
];

/**
 * The interactive "click a stage, filter the board" demo that existed,
 * hand-duplicated with slightly different field names, on all 18 original
 * industry pages. One component now, driven entirely by config — see
 * src/lib/industryPages.ts for the real per-industry data it renders.
 *
 * Explicitly labeled as a demo (not a live customer's real pipeline) in
 * its own heading, same as the original pages did — this stays honest
 * about what it is rather than implying real usage data.
 */
export default function IndustryDemoBoard({
  stages,
  deals,
  headlineLabel,
  accentColor,
}: {
  stages: string[];
  deals: DemoDeal[];
  headlineLabel: string;
  accentColor: string;
}) {
  const [activeStage, setActiveStage] = useState("All");
  const filtered = activeStage === "All" ? deals : deals.filter((d) => d.stage === activeStage);
  const hotCount = deals.filter((d) => d.hot).length;
  const overdueCount = deals.filter((d) => d.followUp === "Overdue").length;

  return (
    <div>
      <div className="text-center mb-10">
        <Badge tone="success" className="mb-3">Demo pipeline — interactive</Badge>
        <h2 className="pd-text-h1 mb-2">This is what your dashboard looks like</h2>
        <p className="pd-text-body">Click a stage to filter — try it.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total deals", value: String(deals.length) },
          { label: "Hot deals", value: String(hotCount) },
          { label: "Overdue follow-ups", value: String(overdueCount) },
          { label: "Stages", value: String(stages.length) },
        ].map((s) => (
          <Card key={s.label}>
            <div className="pd-numeric text-2xl font-semibold" style={{ color: accentColor }}>{s.value}</div>
            <div className="pd-text-caption mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...stages].map((stage) => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className={`text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] transition-colors ${
              activeStage === stage
                ? "text-white"
                : "bg-(--color-surface) border border-(--color-border) text-(--color-foreground-muted) hover:border-(--color-border-strong)"
            }`}
            style={activeStage === stage ? { background: accentColor } : undefined}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((deal, i) => {
          const stageIndex = stages.indexOf(deal.stage);
          return (
            <Card key={`${deal.title}-${i}`} hoverLift>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {deal.hot && <Badge tone="danger">Hot deal</Badge>}
                    <Badge tone={STAGE_TONE_CYCLE[stageIndex % STAGE_TONE_CYCLE.length]}>{deal.stage}</Badge>
                  </div>
                  <div className="font-semibold text-(--color-foreground)">{deal.title}</div>
                  <div className="text-sm text-(--color-foreground-muted)">{deal.subtitle}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="pd-text-caption">{headlineLabel}</div>
                  <div className="pd-numeric text-xl font-semibold" style={{ color: accentColor }}>{deal.headlineValue}</div>
                  {deal.detail && <div className="pd-text-caption mt-0.5">{deal.detail}</div>}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-(--color-border) text-xs font-medium">
                <span className={deal.followUp === "Overdue" ? "text-(--color-danger)" : "text-(--color-foreground-subtle)"}>
                  {deal.followUp === "Overdue" ? "Follow-up overdue" : `Follow-up: ${deal.followUp}`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
