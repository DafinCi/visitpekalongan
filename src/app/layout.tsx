import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PortalIntroOverlay } from "@/components/brand/PortalIntroOverlay";
import { getBaseUrl } from "@/lib/utils/url";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "VisitPekalongan - Kurasi Cerita & Hidden Gems Pekalongan",
  description:
    "Panduan kurasi independen untuk mendokumentasikan dan memetakan hidden gems di seluruh penjuru Pekalongan, mulai dari pesisir Kota Batik hingga pegunungan Petungkriyono.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${instrumentSerif.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-canvas text-text-primary selection:bg-accent-terracotta selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-accent-terracotta focus:text-canvas focus:rounded-button focus:shadow-md focus:font-semibold text-xs focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          Lewati ke konten utama
        </a>
        <noscript>
          <style>{`.portal-intro-overlay{display:none!important}`}</style>
        </noscript>
        <PortalIntroOverlay />
        <div id="app-content" className="contents">
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </body>
    </html>
  );
}
