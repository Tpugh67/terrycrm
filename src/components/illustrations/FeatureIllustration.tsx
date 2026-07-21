import { PipelineLine, PipelineNode } from "./primitives";

const VARIANTS = {
  flow: (
    <>
      <PipelineLine x1="10" y1="40" x2="30" y2="20" />
      <PipelineLine x1="10" y1="40" x2="30" y2="40" />
      <PipelineLine x1="10" y1="40" x2="30" y2="60" />
      <PipelineNode cx={10} cy={40} r={5} color="var(--color-primary)" />
      <PipelineNode cx={30} cy={20} r={4} filled={false} />
      <PipelineNode cx={30} cy={40} r={4} color="var(--color-accent)" />
      <PipelineNode cx={30} cy={60} r={4} filled={false} />
    </>
  ),
  radar: (
    <>
      <circle cx="40" cy="40" r="26" style={{ fill: "none", stroke: "var(--color-border-strong)", strokeWidth: 2 }} />
      <circle cx="40" cy="40" r="14" style={{ fill: "none", stroke: "var(--color-border-strong)", strokeWidth: 2 }} />
      <PipelineNode cx={40} cy={40} r={5} color="var(--color-primary)" />
      <PipelineNode cx={58} cy={28} r={4} color="var(--color-accent)" />
    </>
  ),
  stack: (
    <>
      <rect x="12" y="46" width="56" height="10" rx="4" style={{ fill: "var(--color-border)" }} />
      <rect x="16" y="32" width="48" height="10" rx="4" style={{ fill: "var(--color-primary-light)" }} />
      <rect x="20" y="18" width="40" height="10" rx="4" style={{ fill: "var(--color-primary)" }} />
    </>
  ),
  bolt: (
    <>
      <PipelineNode cx={40} cy={40} r={22} filled={false} color="var(--color-border-strong)" />
      <path d="M44 24 L32 42 H40 L36 56 L50 36 H42 Z" style={{ fill: "var(--color-accent)" }} />
    </>
  ),
};

export default function FeatureIllustration({
  variant = "flow",
  className = "",
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 80 80" className={className} width={40} height={40} aria-hidden="true">
      {VARIANTS[variant]}
    </svg>
  );
}
