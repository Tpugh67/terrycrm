"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Section } from "../ui/Container";

export type FAQItem = { question: string; answer: string };
export type FAQCategory = { category: string; items: FAQItem[] };

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = open === item.question;
        return (
          <div
            key={item.question}
            className="rounded-[var(--radius-lg)] border border-(--color-border) bg-(--color-surface) overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : item.question)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-semibold text-sm">{item.question}</span>
              <span
                className={`text-(--color-foreground-subtle) ml-4 flex-shrink-0 transition-transform duration-(--duration-base) ${isOpen ? "rotate-180" : ""}`}
              >
                <ChevronDown size={18} />
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pd-text-body border-t border-(--color-border) pt-3">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Two modes on one component rather than a second one: pass `faqs` for a
 * simple flat accordion (homepage, pricing — most pages only have a
 * handful of questions), or `categories` when there's enough content to
 * need a category browser (Help Center). Same visual language either
 * way — one component, not two diverging implementations.
 */
export default function FAQSection({
  title,
  faqs,
  categories,
}: {
  title?: string;
  faqs?: FAQItem[];
  categories?: FAQCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState(categories?.[0]?.category ?? "");
  const currentItems = categories?.find((c) => c.category === activeCategory)?.items ?? [];

  if (categories && categories.length > 0) {
    return (
      <Section background="alt" id="faq">
        <Container width="wide">
          {title && <h2 className="pd-text-h1 text-center mb-12">{title}</h2>}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-48 flex-shrink-0">
              <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {categories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`text-left px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === cat.category
                        ? "bg-(--color-primary) text-white"
                        : "text-(--color-foreground-muted) hover:bg-(--color-surface-sunken)"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="pd-text-h3 mb-6">{activeCategory}</h3>
              <FAQAccordion items={currentItems} />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="alt" id="faq">
      <Container width="narrow">
        {title && <h2 className="pd-text-h1 text-center mb-12">{title}</h2>}
        <FAQAccordion items={faqs ?? []} />
      </Container>
    </Section>
  );
}
