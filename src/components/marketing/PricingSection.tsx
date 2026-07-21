"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Container, Section } from "../ui/Container";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { StaggerGroup } from "../motion";

export type PricingPlan = {
  name: string;
  description?: string;
  /** Either a fixed label ("Custom") or numeric monthly/annual amounts for the billing toggle. */
  price: string | { monthly: number; annual: number };
  /** Shown under numeric prices, e.g. "/mo". Ignored for string prices. */
  period?: string;
  /** e.g. "1 user", "Up to 5 users" — shown under the price. */
  scale?: string;
  features: string[];
  /**
   * Either a static link, or an onClick handler that receives the active
   * billing period — the latter is how a real checkout flow selects the
   * right Stripe price ID for the plan currently being viewed.
   */
  cta: { label: string; href?: string; onClick?: (billing: "monthly" | "annual") => void };
  highlighted?: boolean;
};

export default function PricingSection({
  title,
  description,
  plans,
  billingToggle = false,
  annualSavingsLabel = "Save 2 months",
  columns,
}: {
  title?: string;
  description?: string;
  plans: PricingPlan[];
  /** Shows a Monthly/Annual switch above the plans and toggles numeric prices. */
  billingToggle?: boolean;
  annualSavingsLabel?: string;
  columns?: 3 | 4;
}) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const colClass = (columns ?? (plans.length >= 4 ? 4 : 3)) === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <Section background="surface" id="pricing">
      <Container width="content">
        {(title || description) && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            {title && <h2 className="pd-text-h1 mb-4">{title}</h2>}
            {description && <p className="pd-text-body-lg">{description}</p>}
          </div>
        )}

        {billingToggle && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 bg-(--color-surface-alt) rounded-[var(--radius-full)] p-1">
              {(["monthly", "annual"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setBilling(period)}
                  className={`px-5 py-2 rounded-[var(--radius-full)] text-sm font-semibold transition-colors ${
                    billing === period ? "bg-(--color-surface) shadow-[var(--shadow-sm)] text-(--color-foreground)" : "text-(--color-foreground-muted)"
                  }`}
                >
                  {period === "monthly" ? "Monthly" : (
                    <>Annual <span className="text-(--color-success-text) font-bold ml-1">{annualSavingsLabel}</span></>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <StaggerGroup className={`grid grid-cols-1 ${colClass} gap-6 items-start`}>
          {plans.map((plan) => {
            const isNumeric = typeof plan.price === "object";
            const displayPrice = isNumeric
              ? (plan.price as { monthly: number; annual: number })[billing]
              : (plan.price as string);

            return (
              <Card
                key={plan.name}
                variant={plan.highlighted ? "elevated" : "default"}
                className={plan.highlighted ? "border-2 border-(--color-primary) relative flex flex-col" : "relative flex flex-col"}
              >
                {plan.highlighted && (
                  <Badge tone="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most popular
                  </Badge>
                )}
                <h3 className="pd-text-h3 mb-1">{plan.name}</h3>
                {plan.description && <p className="pd-text-body text-sm mb-4">{plan.description}</p>}
                <div className="mb-6">
                  <span className="pd-numeric text-4xl font-semibold">
                    {isNumeric ? `$${displayPrice}` : displayPrice}
                  </span>
                  {plan.period && <span className="pd-text-body text-sm ml-1">{plan.period}</span>}
                  {plan.scale && <div className="pd-text-caption mt-2">{plan.scale}</div>}
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-(--color-foreground-muted)">
                      <Check size={16} className="text-(--color-success) flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.cta.href ? (
                  <Button href={plan.cta.href} variant={plan.highlighted ? "primary" : "outline"} className="w-full">
                    {plan.cta.label}
                  </Button>
                ) : (
                  <Button
                    onClick={() => plan.cta.onClick?.(billing)}
                    variant={plan.highlighted ? "primary" : "outline"}
                    className="w-full"
                  >
                    {plan.cta.label}
                  </Button>
                )}
              </Card>
            );
          })}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
