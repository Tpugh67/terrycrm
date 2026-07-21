import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import HeroIllustration from "../illustrations/HeroIllustration";
import BackgroundIllustration from "../illustrations/BackgroundIllustration";
import AIIllustration from "../illustrations/AIIllustration";
import ProductScreenshot from "../mockups/ProductScreenshot";
import Card from "../ui/Card";
import { Counter, Float } from "../motion";

export type HeroStat = { value: number; prefix?: string; suffix?: string; label: string };
export type HeroPipelineCard = { title: string; amount: string; stage: string };
export type HeroAICapability = { icon: LucideIcon; label: string };

type Variant =
  | "illustration"
  | "gradient-shape"
  | "product"
  | "floating-stats"
  | "pipeline-cards"
  | "ai-preview";

/**
 * The visual centerpiece of the homepage hero. One component, several
 * variants — every future page reaches for a HeroVisual variant instead
 * of hand-assembling a bespoke hero graphic, which is what keeps every
 * hero on the site feeling like the same product.
 *
 * `overlay` adds a low-opacity BackgroundIllustration behind any variant
 * for extra depth — optional, off by default so it stays a deliberate
 * choice per page rather than automatic clutter.
 */
export default function HeroVisual({
  variant = "illustration",
  screenshotSrc,
  screenshotAlt,
  screenshotFrame = "browser",
  mode = "light",
  stats,
  pipelineCards,
  aiCapabilities,
  overlay = false,
  className = "",
}: {
  variant?: Variant;
  screenshotSrc?: string;
  screenshotAlt?: string;
  screenshotFrame?: "browser" | "desktop" | "laptop" | "tablet" | "phone";
  mode?: "light" | "dark";
  /** floating-stats variant only — 1–3 real stats, no fabricated numbers. */
  stats?: HeroStat[];
  /** pipeline-cards variant only. */
  pipelineCards?: HeroPipelineCard[];
  /** ai-preview variant only. */
  aiCapabilities?: HeroAICapability[];
  overlay?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {overlay && <BackgroundIllustration variant="centered" />}
      <div className="relative z-10">
        {variant === "product" && (
          <ProductScreenshot
            src={screenshotSrc}
            alt={screenshotAlt ?? "PipeDesk product dashboard"}
            frame={screenshotFrame}
            mode={mode}
            url="pipedesk.app/pipeline"
          />
        )}

        {variant === "illustration" && (
          <HeroIllustration className="w-full h-auto rounded-[var(--radius-2xl)]" />
        )}

        {variant === "gradient-shape" && (
          <div
            className="aspect-square rounded-[var(--radius-2xl)] pd-animate-gradient"
            style={{ background: "var(--gradient-pipeline)" }}
            aria-hidden="true"
          />
        )}

        {variant === "floating-stats" && (
          <div className="relative">
            <ProductScreenshot
              src={screenshotSrc}
              alt={screenshotAlt ?? "PipeDesk product dashboard"}
              frame={screenshotFrame}
              mode={mode}
              url="pipedesk.app/pipeline"
            />
            {(stats ?? []).slice(0, 2).map((stat, i) => (
              <Float
                key={stat.label}
                delayMs={i * 400}
                className={`absolute ${i === 0 ? "-top-6 -left-6" : "-bottom-6 -right-6"} hidden sm:block`}
              >
                <Card variant="elevated" className="p-4 min-w-[140px]">
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-xl font-semibold block"
                  />
                  <div className="pd-text-caption mt-0.5">{stat.label}</div>
                </Card>
              </Float>
            ))}
          </div>
        )}

        {variant === "pipeline-cards" && (
          <div className="relative py-8">
            {(pipelineCards ?? []).slice(0, 3).map((card, i) => (
              <Float
                key={card.title}
                delayMs={i * 350}
                className="mb-4 last:mb-0"
              >
                <Card
                  variant="elevated"
                  hoverLift
                  className={`max-w-xs ${i === 1 ? "ml-8" : i === 2 ? "ml-16" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{card.title}</span>
                    <span className="pd-text-caption">{card.stage}</span>
                  </div>
                  <span className="pd-numeric text-lg font-semibold text-(--color-primary)">
                    {card.amount}
                  </span>
                </Card>
              </Float>
            ))}
          </div>
        )}

        {variant === "ai-preview" && (
          <div className="relative flex items-center justify-center py-8">
            <AIIllustration className="w-64 h-64" />
            <Float className="absolute -bottom-4 -right-4 sm:right-0 max-w-xs">
              <Card variant="elevated">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-(--color-accent)" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
                    AI assistant
                  </span>
                </div>
                <div className="space-y-2">
                  {(aiCapabilities ?? []).slice(0, 3).map((cap) => (
                    <div key={cap.label} className="flex items-center gap-2 text-sm">
                      <cap.icon size={15} className="text-(--color-primary)" />
                      {cap.label}
                    </div>
                  ))}
                </div>
              </Card>
            </Float>
          </div>
        )}
      </div>
    </div>
  );
}
