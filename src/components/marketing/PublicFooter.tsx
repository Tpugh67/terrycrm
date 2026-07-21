import Link from "next/link";
import { Container } from "../ui/Container";
import Logo from "../Logo";

export default function PublicFooter() {
  return (
    <footer className="border-t border-(--color-border) py-10">
      <Container width="wide" className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={24} withWordmark wordmarkClassName="font-semibold text-sm" />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-(--color-foreground-muted)">
            <Link href="/about" className="hover:text-(--color-foreground) transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-(--color-foreground) transition-colors">Pricing</Link>
            <Link href="/partners" className="hover:text-(--color-foreground) transition-colors">Partners</Link>
            <Link href="/reps" className="hover:text-(--color-foreground) transition-colors">Become a rep</Link>
            <Link href="/help" className="hover:text-(--color-foreground) transition-colors">Help Center</Link>
            <Link href="/contact" className="hover:text-(--color-foreground) transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-(--color-border)">
          <p className="pd-text-caption">© {new Date().getFullYear()} PipeDesk</p>
          <nav className="flex items-center gap-5 text-xs text-(--color-foreground-subtle)">
            <Link href="/privacy" className="hover:text-(--color-foreground-muted) transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-(--color-foreground-muted) transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
