import PublicHeader from "../../components/marketing/PublicHeader";
import PublicFooter from "../../components/marketing/PublicFooter";

// Every page under (marketing)/ inherits header, footer, and a real
// <main id="pd-main"> landmark automatically — pages no longer need to
// import PublicHeader/PublicFooter themselves (see ADR 0001). This
// layout imports nothing from the authenticated app: no Supabase client,
// no AuthGate, no AppLayout, no role/sidebar logic.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main id="pd-main">{children}</main>
      <PublicFooter />
    </>
  );
}
