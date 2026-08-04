import Link from "next/link";
import { Container } from "../ui/Container";
import Button from "../ui/Button";
import Logo from "../Logo";

export type NavLink = { label: string; href: string };

export default function PublicHeader({
  links = [
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
  ],
}: {
  links?: NavLink[];
}) {
  return (
    <header className="border-b border-(--color-border) sticky top-0 bg-(--color-surface)/95 backdrop-blur z-50">
      <Container width="wide" className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} withWordmark wordmarkClassName="pd-text-h3 text-base" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-(--color-foreground-muted)">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-(--color-foreground) transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-(--color-foreground-muted) hover:text-(--color-foreground) transition-colors hidden sm:block">
            Log in
          </Link>
          <Button href="/login?mode=signup" size="sm">
            Start free trial
          </Button>
        </div>
      </Container>
    </header>
  );
}
