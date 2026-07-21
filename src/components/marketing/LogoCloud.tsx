import { Container, Section } from "../ui/Container";

export type LogoCloudItem = { name: string; src?: string };

/**
 * Renders whatever logos are passed in — nothing is hardcoded, and this
 * component ships with no default data. Per the standing project rule,
 * never populate this with fabricated customer logos; only call it with
 * real, confirmed customer/partner marks once they exist.
 */
export default function LogoCloud({
  label,
  logos,
}: {
  label?: string;
  logos: LogoCloudItem[];
}) {
  if (logos.length === 0) return null;

  return (
    <Section background="surface" spacing="tight">
      <Container width="content">
        {label && (
          <p className="pd-text-caption text-center mb-8 uppercase tracking-wider">{label}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
          {logos.map((logo) =>
            logo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.name} src={logo.src} alt={logo.name} className="h-6 w-auto grayscale" />
            ) : (
              <span key={logo.name} className="pd-text-h3 text-(--color-foreground-subtle)">
                {logo.name}
              </span>
            )
          )}
        </div>
      </Container>
    </Section>
  );
}
