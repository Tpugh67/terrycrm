import "./globals.css";
import AuthGate from "../components/AuthGate";
import AppLayout from "../components/AppLayout";
import ReferralCapture from "../components/ReferralCapture";

export const metadata = {
  title: "PipeDesk — Multi-Industry CRM",
  description: "PipeDesk gives 18 industries a purpose-built CRM pipeline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <ReferralCapture />
        <AuthGate>
          <AppLayout>{children}</AppLayout>
        </AuthGate>
      </body>
    </html>
  );
}
