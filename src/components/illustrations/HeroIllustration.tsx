import { PipelineGradientDef, PipelineLine, PipelineNode, ILLUSTRATION_GRADIENT_ID } from "./primitives";

/**
 * Large-format abstract composition for hero sections: a branching pipeline
 * flowing left to right, nodes sized by "deal stage." Purely decorative —
 * no real data. Pass a `className` to control width/height from the caller.
 */
export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      role="img"
      aria-label="Abstract illustration of deals flowing through a pipeline"
    >
      <defs>
        <PipelineGradientDef />
      </defs>
      <rect x="0" y="0" width="480" height="360" rx="24" fill="var(--color-surface-alt)" />

      <PipelineLine x1="60" y1="180" x2="180" y2="100" />
      <PipelineLine x1="60" y1="180" x2="180" y2="180" />
      <PipelineLine x1="60" y1="180" x2="180" y2="260" />
      <PipelineLine x1="180" y1="100" x2="320" y2="90" />
      <PipelineLine x1="180" y1="180" x2="320" y2="180" />
      <PipelineLine x1="180" y1="260" x2="320" y2="270" />
      <PipelineLine x1="320" y1="180" x2="420" y2="180" color={`url(#${ILLUSTRATION_GRADIENT_ID})`} />

      <PipelineNode cx={60} cy={180} r={10} color="var(--color-secondary)" />
      <PipelineNode cx={180} cy={100} r={7} color="var(--color-border-strong)" filled={false} />
      <PipelineNode cx={180} cy={180} r={9} color="var(--color-primary)" />
      <PipelineNode cx={180} cy={260} r={7} color="var(--color-border-strong)" filled={false} />
      <PipelineNode cx={320} cy={90} r={7} color="var(--color-border-strong)" filled={false} />
      <PipelineNode cx={320} cy={180} r={11} color="var(--color-primary)" />
      <PipelineNode cx={320} cy={270} r={7} color="var(--color-warning)" />
      <PipelineNode cx={420} cy={180} r={14} color="var(--color-accent)" />
    </svg>
  );
}
