import "./globals.css";
import Script from "next/script";
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
      <head>
        {/* Uppercut affiliate network tracking — attributes signups to network affiliates */}
        <Script
          src="https://uppercut.co/uc.js"
          data-uppercut="d5dd8a2c-ed8f-42e6-816d-8a33ad6759c5"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-white text-slate-900">
        <ReferralCapture />
        <AuthGate>
          <AppLayout>{children}</AppLayout>
        </AuthGate>
      </body>
    </html>
  );
}
