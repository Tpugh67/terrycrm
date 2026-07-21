import { Container, Section } from "../ui/Container";
import Card from "../ui/Card";
import { StaggerGroup } from "../motion";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  avatarInitials?: string;
};

/**
 * Renders only real testimonials passed in. Ships with no default data
 * and must never be seeded with fabricated quotes, names, or companies —
 * that's a standing project rule, not just a style preference. If no
 * testimonials exist yet, don't call this component on a page.
 */
export default function TestimonialsSection({
  title,
  testimonials,
}: {
  title?: string;
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <Section background="surface">
      <Container width="content">
        {title && <h2 className="pd-text-h1 text-center mb-16">{title}</h2>}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <p className="pd-text-body mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-(--color-primary-light) text-(--color-primary) flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {t.avatarInitials ?? t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="pd-text-caption">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
