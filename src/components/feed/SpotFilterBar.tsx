import { Search, X, MapPin } from "lucide-react";
import { Regency, SpotCategory } from "@/types/spot";
import { VibePills } from "./VibePills";

interface SpotFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRegency: Regency | null;
  onSelectRegency: (regency: Regency | null) => void;
  categories: SpotCategory[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  openNowOnly: boolean;
  onToggleOpenNow: (openNow: boolean) => void;
  totalFilteredSpots: number;
}

export function SpotFilterBar({
  searchQuery,
  onSearchChange,
  selectedRegency,
  onSelectRegency,
  categories,
  activeCategory,
  onSelectCategory,
  openNowOnly,
  onToggleOpenNow,
  totalFilteredSpots,
}: SpotFilterBarProps) {
  return (
    <div className="sticky top-16 z-30 w-full bg-canvas/95 backdrop-blur-sm border-b border-border py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Baris 1: Kolom Pencarian & Pemilih Teritori */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Kolom Pencarian Teks Instan */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tauto, kopi tahlil, curug, atau nama kecamatan..."
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-surface border border-border rounded-button text-text-primary placeholder:text-text-subtle focus:bg-surface-pure focus:outline-none focus:border-border-focus transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-sm focus-visible:outline-2 focus-visible:outline-border-focus min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Control Teritori Makro */}
          <div className="inline-flex bg-surface p-1 border border-border rounded-button self-start sm:self-auto min-h-[44px]">
            <button
              type="button"
              onClick={() => onSelectRegency(null)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-badge transition-colors flex items-center focus-visible:outline-2 focus-visible:outline-border-focus ${
                selectedRegency === null
                  ? "bg-surface-pure text-text-primary shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>Semua Teritori</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectRegency("kota")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-badge transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-border-focus ${
                selectedRegency === "kota"
                  ? "bg-surface-pure text-text-primary shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <MapPin className="w-3 h-3 text-accent-terracotta" aria-hidden="true" />
              <span>Kota</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectRegency("kabupaten")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-badge transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-border-focus ${
                selectedRegency === "kabupaten"
                  ? "bg-surface-pure text-text-primary shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <MapPin className="w-3 h-3 text-accent-sage" aria-hidden="true" />
              <span>Kabupaten</span>
            </button>
          </div>
        </div>

        {/* Baris 2: Pil Kategori & Toggle Buka */}
        <VibePills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          openNowOnly={openNowOnly}
          onToggleOpenNow={onToggleOpenNow}
        />

        {/* Penghitung Hasil Kurasi */}
        <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
          <span>
            Menampilkan <strong className="text-text-primary">{totalFilteredSpots}</strong> tempat terkurasi
          </span>
          {openNowOnly && (
            <span className="text-status-open-text font-medium">
              Hanya menampilkan yang sedang buka
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

