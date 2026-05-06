import "./globals.css";
import AuthGate from "../components/AuthGate";
import AppLayout from "../components/AppLayout";

export const metadata = {
  title: "PipeDesk",
  description: "PipeDesk — Multi-Industry CRM Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <AuthGate>
          <AppLayout>{children}</AppLayout>
        </AuthGate>
      </body>
    </html>
  );
}
