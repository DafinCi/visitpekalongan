import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  Coffee,
  Utensils,
  Mountain,
  Palette,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang VisitPekalongan - Kurasi Independen & Nilai Utama",
  description:
    "Kisah, visi, dan prinsip di balik platform kurasi independen VisitPekalongan. Menjaga otentisitas rasa, warisan kriya batik, dan alam Petungkriyono.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* Kontainer Konten Utama dengan z-10 agar menutupi Sticky Footer */}
      <div className="relative z-10 bg-canvas min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Tombol Kembali ke Katalog */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-accent-terracotta transition-colors min-h-[44px] py-2 focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Kembali ke Katalog Kurasi</span>
            </Link>
          </div>

          {/* Judul & Pengantar */}
          <div className="space-y-4 mb-12 pb-8 border-b border-border">
            <h1 className="font-serif text-3xl sm:text-5xl text-text-primary tracking-tight leading-tight">
              Mendokumentasikan apa yang jujur dan berakar di Pekalongan.
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">
              VisitPekalongan adalah ruang kurasi mandiri yang lahir dari
              keinginan sederhana: memetakan tempat-tempat berharga di pesisir
              Kota Batik hingga dataran tinggi Petungkriyono tanpa terdistraksi
              oleh ulasan berbayar atau promosi bersponsor.
            </p>
          </div>

          {/* Tiga Nilai Pokok */}
          <div className="space-y-8 mb-16">
            <h2 className="font-serif text-2xl text-text-primary tracking-tight">
              Nilai & Komitmen Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface p-6 border border-border rounded-card space-y-3">
                <div className="w-9 h-9 rounded-md bg-accent-terracotta-raw/10 text-accent-terracotta flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg text-text-primary">
                  100% Bebas Iklan
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Tidak ada warung atau kedai yang membayar untuk masuk ke dalam
                  daftar ini. Kurasi didasarkan pada rasa, sejarah, dan
                  konsistensi pelayanan.
                </p>
              </div>

              <div className="bg-surface p-6 border border-border rounded-card space-y-3">
                <div className="w-9 h-9 rounded-md bg-accent-sage/10 text-accent-sage flex items-center justify-center">
                  <Palette className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg text-text-primary">
                  Modern Heritage
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Visual antarmuka diilhami dari kehangatan serat kain mori
                  mentah, gerabah tanah liat, serta ketegasan garis cap tembaga
                  pembatik tradisional.
                </p>
              </div>

              <div className="bg-surface p-6 border border-border rounded-card space-y-3">
                <div className="w-9 h-9 rounded-md bg-accent-roast/10 text-accent-roast flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg text-text-primary">
                  Gotong Royong
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Warga lokal dapat mengajukan rekomendasi tempat baru melalui
                  halaman{" "}
                  <Link
                    href="/lapor"
                    className="text-accent-terracotta hover:underline font-medium"
                  >
                    Lapor Spot
                  </Link>
                  . Setiap data yang masuk akan diverifikasi secara langsung.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pilar Kurasi */}
          <div className="space-y-6 mb-16">
            <h2 className="font-serif text-2xl text-text-primary tracking-tight">
              Empat Pilar Kurasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-4 p-5 bg-surface border border-border rounded-card">
                <Utensils
                  className="w-5 h-5 text-accent-terracotta shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Kuliner Legendaris & Autentik
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Menelusuri Soto Tauto tauco manis, Garang Asem asam pedas,
                    Nasi Megono nangka muda gurih, dan seduhan Kopi Tahlil malam
                    hari.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-surface border border-border rounded-card">
                <Coffee
                  className="w-5 h-5 text-accent-roast shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Coffee & Work Space
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Kedai kopi specialty lokal, roastery mandiri, dan spot
                    nyaman untuk bekerja dengan sambungan internet stabil.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-surface border border-border rounded-card">
                <Mountain
                  className="w-5 h-5 text-accent-sage shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Wisata Alam & Pegunungan
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Keheningan cagar alam Petungkriyono, air terjun Curug Bajing
                    bertingkat, dan aliran jernih Welo River di tengah hutan
                    lindung.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-surface border border-border rounded-card">
                <Palette
                  className="w-5 h-5 text-text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Cagar Budaya & Seni Batik
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Gedung kolonial Museum Batik Jetayu, lorong mural Kampung
                    Pesindon, dan keanggunan rumah saudagar lawas di Kampung
                    Kauman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sticky Footer Reveal */}
      <Footer />
    </div>
  );
}
