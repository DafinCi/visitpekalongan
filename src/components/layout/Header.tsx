import Link from "next/link";
import { Compass, PlusCircle } from "lucide-react";

interface HeaderProps {
  onOpenSubmitDrawer?: () => void;
}

export function Header({ onOpenSubmitDrawer }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Sisi Kiri: Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-baseline gap-2.5 group focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm py-1"
          >
            <span className="font-serif text-2xl tracking-tight text-text-primary group-hover:text-accent-terracotta transition-colors">
              VisitPekalongan
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-surface border border-border-subtle rounded-sm text-text-muted">
              Kurasi Independen
            </span>
          </Link>
        </div>

        {/* Sisi Kanan: Menu Navigasi & Aksi */}
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Navigasi Utama">
          <Link
            href="/"
            className="px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-border-focus rounded-button min-h-[44px] flex items-center"
          >
            <Compass className="w-4 h-4 mr-1.5 text-accent-terracotta" aria-hidden="true" />
            <span>Katalog</span>
          </Link>

          <Link
            href="/about"
            className="px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-border-focus rounded-button min-h-[44px] flex items-center"
          >
            <span>Tentang</span>
          </Link>

          {/* Tombol Aksi Kontribusi Warga */}
          <button
            type="button"
            onClick={onOpenSubmitDrawer}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-surface-pure hover:bg-surface border border-border text-text-primary shadow-xs rounded-button transition-all focus-visible:outline-2 focus-visible:outline-border-focus min-h-[44px]"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-accent-terracotta" aria-hidden="true" />
            <span>Lapor Spot</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

