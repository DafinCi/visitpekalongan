import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="h-dvh flex flex-col bg-canvas text-text-primary overflow-hidden">
      <Header showSearch={false} backUrl="/" backLabel="Katalog" />

      <div className="app-scroll-container flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-lg w-full text-center space-y-6 bg-surface-pure border border-border rounded-card p-8 sm:p-12 shadow-xs">
            {/* Ikon Kompas Aksen Terakota */}
            <div className="w-16 h-16 rounded-full bg-accent-terracotta/10 border border-accent-terracotta/25 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8 text-accent-terracotta" aria-hidden="true" />
            </div>

            {/* Kode & Judul Editorial */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-terracotta">
                Kesalahan 404
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
                Halaman Belum Masuk Kurasi
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                Waduh, tempat atau halaman yang Anda tuju mungkin salah ketik atau belum
                tercatat dalam panduan kurasi independen kami.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-xs transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Katalog</span>
              </Link>

              <Link
                href="/lapor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-text-primary bg-surface hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
              >
                <span>Lapor Hidden Gem</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

