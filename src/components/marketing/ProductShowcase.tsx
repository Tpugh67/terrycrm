import type { LucideIcon } from "lucide-react";
import { Container, Section } from "../ui/Container";
import ProductScreenshot from "../mockups/ProductScreenshot";
import { Reveal } from "../motion";
import type { HeroCta } from "./HeroSection";

export type ShowcaseArea =
  | "pipeline"
  | "contacts"
  | "tasks"
  | "calendar"
  | "reporting"
  | "ai-assistant"
  | "affiliate-portal"
  | "sdr-portal"
  | "admin-dashboard";

/**
 * The reusable structure behind every "here's a real part of the product"
 * section — Pipeline View, Contact Profile, Task Management, Calendar,
 * Reporting, AI Assistant, Affiliate Portal, SDR Portal, Admin Dashboard,
 * and any future one. One component, one `area` id for tracking/analytics
 * purposes, real content supplied per call site.
 *
 * Every call renders through `ProductScreenshot`, so it inherits the same
 * honest-fallback behavior: omit `screenshotSrc` and it shows the
 * abstract illustration rather than a fabricated or broken image. Swap in
 * a real screenshot later by adding one prop — no layout changes.
 */
export default function ProductShowcase({
  area,
  icon: Icon,
  eyebrow,
  title,
  description,
  screenshotSrc,
  screenshotAlt,
  frame = "browser",
  mode = "light",
  reverse = false,
  cta,
}: {
  area: ShowcaseArea;
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  screenshotSrc?: string;
  screenshotAlt?: string;
  frame?: "browser" | "desktop" | "laptop" | "tablet" | "phone";
  mode?: "light" | "dark";
  /** Alternates copy/screenshot sides when showcase sections repeat down a page. */
  reverse?: boolean;
  cta?: HeroCta;
}) {
  return (
    <Section background="surface" id={`showcase-${area}`}>
      <Container width="wide">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <Reveal effect="slide-up">
            <div>
              {Icon && (
                <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-(--color-primary-light) flex items-center justify-center mb-5">
                  <Icon size={22} color="var(--color-primary)" strokeWidth={2} />
                </div>
              )}
              {eyebrow && <p className="pd-text-caption uppercase tracking-wider mb-3">{eyebrow}</p>}
              <h2 className="pd-text-h1 mb-4">{title}</h2>
              <p className="pd-text-body-lg mb-6">{description}</p>
              {cta && (
                <a href={cta.href} className="text-sm font-semibold text-(--color-primary) hover:underline">
                  {cta.label} →
                </a>
              )}
            </div>
          </Reveal>
          <Reveal effect="reveal" delayMs={150}>
            <ProductScreenshot
              src={screenshotSrc}
              alt={screenshotAlt ?? title}
              frame={frame}
              mode={mode}
              url={`pipedesk.app/${area}`}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
