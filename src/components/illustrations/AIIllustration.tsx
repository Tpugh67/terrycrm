import { PipelineGradientDef, ILLUSTRATION_GRADIENT_ID } from "./primitives";

/**
 * Abstract mark for AI-related surfaces (AISection, DealAI, help-center AI
 * tab). A radiating node pattern in the pipeline gradient — distinct from
 * the connected-node motif used elsewhere so AI moments read as a
 * distinct-but-related capability, not a generic sparkle icon.
 */
export default function AIIllustration({ className = "" }: { className?: string }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { x: 60 + Math.cos(angle) * 34, y: 60 + Math.sin(angle) * 34 };
  });

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Abstract AI assistant illustration">
      <defs>
        <PipelineGradientDef />
      </defs>
      {points.map((p, i) => (
        <line
          key={i}
          x1={60}
          y1={60}
          x2={p.x}
          y2={p.y}
          style={{ stroke: "var(--color-border)", strokeWidth: 1.5 }}
        />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} style={{ fill: "var(--color-border-strong)" }} />
      ))}
      <circle cx={60} cy={60} r={16} fill={`url(#${ILLUSTRATION_GRADIENT_ID})`} />
    </svg>
  );
}
