import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative h-[560px] sm:h-[480px] md:h-[440px] w-full"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      aria-label="Informasi Penutup & Navigasi Kaki"
    >
      {/* Kontainer Fixed Pembentuk Efek Sticky Curtain */}
      <div className="fixed bottom-0 left-0 w-full h-[560px] sm:h-[480px] md:h-[440px] bg-text-primary text-canvas flex flex-col justify-between p-6 sm:p-10 md:p-12 z-0">
        {/* Bagian Atas: Brand & Tautan Kurasi */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto w-full">
          {/* Kolom 1: Manifesto Singkat */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-canvas tracking-tight">
                VisitPekalongan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-canvas/70 leading-relaxed max-w-md">
              Platform kurasi independen yang mendokumentasikan rasa, warisan
              kriya, dan bentang alam Pekalongan. Bebas dari ulasan pesanan,
              iklan komersial berbayar, maupun sponsor pihak ketiga.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-canvas/50">
              Navigasi Halaman
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent-terracotta transition-colors inline-flex items-center gap-1 text-canvas/80"
                >
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Katalog Tempat Terkurasi</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent-terracotta transition-colors inline-flex items-center gap-1 text-canvas/80"
                >
                  <span>Manifesto & Nilai Utama</span>
                  <ArrowUpRight
                    className="w-3 h-3 text-canvas/50"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Teritori Wilayah */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-canvas/50">
              Jangkauan Kurasi
            </div>
            <p className="text-xs text-canvas/70 leading-relaxed">
              Mencakup pesisir Kota Pekalongan (Pekalongan Barat, Timur, Utara)
              hingga dataran tinggi Kabupaten Pekalongan (lereng hutan lindung
              Petungkriyono dan perbukitan Doro).
            </p>
            <div className="text-[11px] text-canvas/50 pt-1">
              Punya usulan tempat tersembunyi? Ajukan lewat tombol Lapor Spot di
              atas.
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Display Teks Besar & Hak Cipta */}
        <div className="max-w-7xl mx-auto w-full pt-6 border-t border-canvas/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-canvas/60">
          <div className="flex items-center gap-1.5"></div>

          <div>&copy; 2026 VisitPekalongan. Hak cipta dilindungi.</div>
        </div>
      </div>
    </footer>
  );
}
