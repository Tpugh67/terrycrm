import { PipelineLine, PipelineNode } from "./primitives";

/**
 * A wide, low-contrast horizontal pipeline pattern meant to sit behind
 * section content at very low opacity — distinct from
 * `BackgroundIllustration`'s soft color blobs, this one is literally the
 * brand's "deals flowing through stages" motif, so it reinforces the
 * pipeline identity without competing with foreground content.
 *
 * Always render behind a `relative z-10` content wrapper, and keep
 * opacity low (the default 0.08 is deliberate) — this is texture, not a
 * illustration in its own right.
 */
export default function PipelineFlowBackground({
  className = "",
  opacity = 0.08,
  animate = false,
}: {
  className?: string;
  opacity?: number;
  /** Adds a subtle "deals flowing forward" motion along the dashed lines. */
  animate?: boolean;
}) {
  const stageX = [40, 220, 400, 580, 760, 940];
  const y = 60;

  return (
    <svg
      viewBox="0 0 1000 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <g className={animate ? "pd-animate-flow" : ""}>
        {stageX.slice(0, -1).map((x, i) => (
          <PipelineLine key={i} x1={x} y1={y} x2={stageX[i + 1]} y2={y} color="var(--color-primary)" dashed />
        ))}
      </g>
      {stageX.map((x, i) => (
        <PipelineNode key={x} cx={x} cy={y} r={i === stageX.length - 1 ? 8 : 5} color="var(--color-primary)" />
      ))}
    </svg>
  );
}
