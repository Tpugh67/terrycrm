import AuthGate from "../../components/AuthGate";

// Every page under (app)/ requires authentication (AuthGate), but not
// every authenticated page wants the generic sidebar shell — rep-portal
// and affiliate/dashboard have their own bespoke full-page designs. Pages
// that do want the shared sidebar/nav live one level deeper, under
// (app)/(shell)/, which adds AppLayout on top of this AuthGate wrapper.
// See docs/adr/0001-public-app-layout-split.md.
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
