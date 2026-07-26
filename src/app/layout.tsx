import "./globals.css";
import Script from "next/script";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import ReferralCapture from "../components/ReferralCapture";

// PipeDesk brand type system: Space Grotesk (display) + Inter (body) +
// IBM Plex Mono (every number/data point — see .pd-numeric in globals.css).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://pipedesk.app"),
  title: "PipeDesk — Multi-Industry CRM",
  description: "PipeDesk gives 18 industries a purpose-built CRM pipeline.",
  openGraph: {
    title: "PipeDesk — Multi-Industry CRM",
    description: "PipeDesk gives 18 industries a purpose-built CRM pipeline.",
    url: "https://pipedesk.app",
    siteName: "PipeDesk",
    images: [
      {
        url: "/brand/pipedesk-og-image.png",
        width: 1200,
        height: 630,
        alt: "PipeDesk — The multi-industry CRM built for how you sell",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PipeDesk — Multi-Industry CRM",
    description: "PipeDesk gives 18 industries a purpose-built CRM pipeline.",
    images: ["/brand/pipedesk-og-image.png"],
  },
};

// Deliberately minimal — see docs/adr/0001-public-app-layout-split.md.
// AuthGate and AppLayout used to live here, wrapping every route
// (public and authenticated alike) and shipping their JS everywhere.
// They now live in (app)/layout.tsx, mounted only for authenticated
// routes. This root layout only owns what every single page genuinely
// needs: fonts, global CSS, the skip link, and referral-link capture
// (which has to run on any page a rep's link might point to, public or
// not).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <head>
        {/* Uppercut affiliate network tracking — attributes signups to network affiliates */}
        <Script
          src="https://uppercut.co/uc.js"
          data-uppercut="d5dd8a2c-ed8f-42e6-816d-8a33ad6759c5"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-white text-slate-900">
        <a href="#pd-main" className="pd-skip-link">Skip to content</a>
        <ReferralCapture />
        {children}
      </body>
    </html>
  );
}
