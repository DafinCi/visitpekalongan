import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubmitSpotForm } from "@/components/community/SubmitSpotForm";

export const metadata: Metadata = {
  title:
    "Lapor Hidden Gem - Rekomendasikan Tempat Lokal Pekalongan | VisitPekalongan",
  description:
    "Ajukan warung kuliner legendaris, kedai kopi tenang ramah kerja, bentang alam asri, atau sentra kriya batik di Pekalongan untuk diverifikasi oleh tim kurator independen.",
};

export default function LaporPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* Kontainer Halaman Utama dengan z-10 agar menutupi Sticky Footer */}
      <div className="relative z-10 bg-canvas min-h-screen flex flex-col">
        <Header showSearch={false} />

        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full">
          {/* Tombol Navigasi Kembali */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-accent-terracotta transition-colors min-h-[44px] py-2 focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Kembali ke Katalog Kurasi</span>
            </Link>
          </div>

          {/* Header Editorial */}
          <div className="space-y-3 mb-10 pb-6 border-b border-border">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary tracking-tight leading-tight">
              Rekomendasikan Tempat Autentik di Pekalongan
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              Punya warung tauto langganan di sudut gang yang belum banyak orang
              tahu? Atau kedai kopi teduh di kaki bukit Petungkriyono? Bantu
              kami mendokumentasikan tempat-tempat terbaik tanpa polesan iklan
              berbayar.
            </p>
          </div>

          {/* Tata Letak Dua Kolom: Panduan & Formulir */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Kolom Kiri: Prinsip Kurasi & Bantuan */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-card bg-surface border border-border space-y-4">
                <div className="flex items-center gap-2.5 text-text-primary font-semibold text-sm">
                  <ShieldCheck
                    className="w-4 h-4 text-accent-terracotta"
                    aria-hidden="true"
                  />
                  <span>Prinsip Kurasi Independen</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-accent-sage shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-text-primary">
                        100% Bebas Biaya:
                      </strong>{" "}
                      Pemilik tempat tidak dipungut biaya sepeser pun. Kurasi
                      ini murni dedikasi dokumentasi lokal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-accent-sage shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-text-primary">
                        Rasa & Karakter Otentik:
                      </strong>{" "}
                      Kami mengutamakan konsistensi rasa, nilai sejarah,
                      keramahan lokal, atau keasrian bentang alam.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-accent-sage shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-text-primary">
                        Verifikasi Mandiri:
                      </strong>{" "}
                      Tim VisitPekalongan mengecek rute akses, jam operasional,
                      dan kepastian lokasi sebelum masuk katalog.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-card bg-surface-pure border border-border space-y-3">
                <div className="flex items-center gap-2 text-text-primary font-semibold text-xs sm:text-sm">
                  <BookOpen
                    className="w-4 h-4 text-text-muted"
                    aria-hidden="true"
                  />
                  <span>Tips Memberi Rekomendasi</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Semakin spesifik patokan lokasi dan menu andalan yang Anda
                  cantumkan, semakin cepat tim kami dapat melakukan pengecekan
                  lapangan.
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Formulir Interaktif */}
            <div className="lg:col-span-7">
              <SubmitSpotForm />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
