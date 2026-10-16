import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
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
      <body className="min-h-full flex flex-col font-sans bg-canvas text-text-primary">
        {children}
      </body>
    </html>
  );
}
