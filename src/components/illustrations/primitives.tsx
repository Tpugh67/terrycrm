/**
 * Shared visual language for the PipeDesk illustration system: nodes
 * connected by flowing lines, echoing the brand's "pipeline" concept.
 * Every illustration component in this folder composes these primitives
 * rather than drawing bespoke shapes, so the illustration style stays
 * consistent across hero, feature, industry, and dashboard contexts.
 */
export function PipelineNode({
  cx,
  cy,
  r = 6,
  color = "var(--color-primary)",
  filled = true,
}: {
  cx: number | string;
  cy: number | string;
  r?: number | string;
  color?: string;
  filled?: boolean;
}) {
  return filled ? (
    <circle cx={cx} cy={cy} r={r} style={{ fill: color }} />
  ) : (
    <circle cx={cx} cy={cy} r={r} style={{ fill: "none", stroke: color, strokeWidth: 2 }} />
  );
}

export function PipelineLine({
  x1,
  y1,
  x2,
  y2,
  color = "var(--color-border-strong)",
  dashed = false,
}: {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={{ stroke: color, strokeWidth: 2 }}
      strokeDasharray={dashed ? "4 6" : undefined}
      strokeLinecap="round"
    />
  );
}

export const ILLUSTRATION_GRADIENT_ID = "pd-illustration-gradient";

/** Drop into any illustration's <defs> once to make the shared gradient available. */
export function PipelineGradientDef() {
  return (
    <linearGradient id={ILLUSTRATION_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2e3192" />
      <stop offset="55%" stopColor="#4c51d6" />
      <stop offset="100%" stopColor="#ff6b4a" />
    </linearGradient>
  );
}
