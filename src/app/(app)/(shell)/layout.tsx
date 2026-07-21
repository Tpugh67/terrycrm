import AppLayout from "../../../components/AppLayout";

// Nested one level inside (app)/, so pages here get AuthGate (from the
// parent layout) AND the sidebar/nav shell (from AppLayout here).
// Dashboard, Pipeline, Contacts, Tasks, Settings, and Admin all want this
// shared chrome — rep-portal and affiliate/dashboard deliberately don't,
// so they stay one level up, outside this group.
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
