"use client";

import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal, MapPin, Check, Sparkles, Clock } from "lucide-react";
import { Regency, SpotCategory } from "@/types/spot";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hitung berapa banyak filter aktif (di luar pencarian teks)
  const activeFilterCount =
    (activeCategory !== "all" ? 1 : 0) +
    (selectedRegency !== null ? 1 : 0) +
    (openNowOnly ? 1 : 0);

  // Kunci scroll halaman ketika drawer filter terbuka
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  // Handle tombol ESC untuk menutup drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  const handleResetFilters = () => {
    onSelectCategory("all");
    onSelectRegency(null);
    onToggleOpenNow(false);
  };

  return (
    <>
      {/* Toolbar 1 Baris Ringkas & Ramping (Sticky di bawah Header) */}
      <div className="sticky top-16 z-30 w-full bg-canvas/95 backdrop-blur-sm border-b border-border py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Input Pencarian Fleksibel */}
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
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-focus transition-all min-h-[44px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-sm focus-visible:outline-2 focus-visible:outline-border-focus min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tombol Pemicu Bottom Sheet Filter */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-button border transition-colors min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus shrink-0 ${
                activeFilterCount > 0
                  ? "bg-accent-terracotta text-canvas border-accent-terracotta shadow-xs"
                  : "bg-surface-pure text-text-primary border-border hover:bg-canvas"
              }`}
              aria-label={`Buka filter kurasi, ${activeFilterCount} filter aktif`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-canvas text-accent-terracotta text-[11px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Indikator Jumlah Hasil (Tampil di Layar Sedang/Besar) */}
            <div className="hidden md:flex items-center text-xs text-text-muted pl-2 border-l border-border shrink-0">
              <span className="font-semibold text-text-primary mr-1">{totalFilteredSpots}</span>
              <span>spot kurasi</span>
            </div>
          </div>

          {/* Baris Chip Filter Aktif (Hanya muncul jika ada filter yang sedang aktif) */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50 mt-2">
              <span className="text-[11px] text-text-muted mr-0.5">Filter aktif:</span>

              {activeCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => onSelectCategory("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-accent-terracotta/10 border border-accent-terracotta/30 text-accent-terracotta rounded-button hover:bg-accent-terracotta/20 cursor-pointer transition-colors"
                  aria-label="Hapus filter kategori"
                >
                  <span>{categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedRegency !== null && (
                <button
                  type="button"
                  onClick={() => onSelectRegency(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-surface-pure border border-border text-text-primary rounded-button hover:bg-canvas cursor-pointer transition-colors"
                  aria-label="Hapus filter wilayah"
                >
                  <span>{selectedRegency === "kota" ? "Kota Pekalongan" : "Kabupaten"}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {openNowOnly && (
                <button
                  type="button"
                  onClick={() => onToggleOpenNow(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-status-open-bg border border-accent-sage/30 text-status-open-text rounded-button hover:bg-canvas cursor-pointer transition-colors"
                  aria-label="Hapus filter buka sekarang"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-sage" />
                  <span>Buka Sekarang</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-text-muted hover:text-accent-terracotta underline ml-1 cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet / Tray Drawer Filter (Pola Nielsen Norman Group) */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-drawer-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        >
          {/* Latar Belakang Redup (Backdrop) */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Panel Konten Bottom Sheet */}
          <div className="relative w-full max-w-lg bg-canvas border-t sm:border border-border rounded-t-card sm:rounded-card shadow-2xl z-10 max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-250">
            {/* Handle Drag Bar Dekoratif di Layar Ponsel */}
            <div className="sm:hidden w-full flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-12 h-1.5 rounded-full bg-border" />
            </div>

            {/* Header Drawer */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 id="filter-drawer-title" className="font-display text-xl text-text-primary">
                  Filter Kurasi Tempat
                </h2>
                <p className="text-xs text-text-muted">
                  Saring berdasarkan kategori, teritori, dan jam buka
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-accent-terracotta hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-text-muted hover:text-text-primary rounded-button hover:bg-surface-pure min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
                  aria-label="Tutup jendela filter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Area Konten Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Bagian 1: Kategori Kurasi */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
                  <span>Kategori Kurasi</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCategory("all")}
                    className={`flex items-center justify-between p-3 text-xs font-medium rounded-button border text-left transition-colors min-h-[44px] cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta font-semibold"
                        : "bg-surface-pure text-text-secondary border-border hover:bg-canvas"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    {activeCategory === "all" && <Check className="w-3.5 h-3.5 text-accent-terracotta" />}
                  </button>

                  {categories.map((cat) => {
                    const isSelected = activeCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelectCategory(cat.slug)}
                        className={`flex items-center justify-between p-3 text-xs font-medium rounded-button border text-left transition-colors min-h-[44px] cursor-pointer ${
                          isSelected
                            ? "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta font-semibold"
                            : "bg-surface-pure text-text-secondary border-border hover:bg-canvas"
                        }`}
                      >
                        <span className="truncate pr-1">{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-terracotta shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bagian 2: Wilayah / Teritori */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                  <MapPin className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
                  <span>Wilayah & Geografis</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectRegency(null)}
                    className={`p-2.5 text-center text-xs font-medium rounded-button border transition-colors min-h-[44px] cursor-pointer flex flex-col items-center justify-center ${
                      selectedRegency === null
                        ? "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta font-semibold"
                        : "bg-surface-pure text-text-secondary border-border hover:bg-canvas"
                    }`}
                  >
                    <span>Semua Wilayah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectRegency("kota")}
                    className={`p-2.5 text-center text-xs font-medium rounded-button border transition-colors min-h-[44px] cursor-pointer flex flex-col items-center justify-center ${
                      selectedRegency === "kota"
                        ? "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta font-semibold"
                        : "bg-surface-pure text-text-secondary border-border hover:bg-canvas"
                    }`}
                  >
                    <span className="font-semibold">Kota</span>
                    <span className="text-[10px] text-text-muted">Pesisir Batik</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectRegency("kabupaten")}
                    className={`p-2.5 text-center text-xs font-medium rounded-button border transition-colors min-h-[44px] cursor-pointer flex flex-col items-center justify-center ${
                      selectedRegency === "kabupaten"
                        ? "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta font-semibold"
                        : "bg-surface-pure text-text-secondary border-border hover:bg-canvas"
                    }`}
                  >
                    <span className="font-semibold">Kabupaten</span>
                    <span className="text-[10px] text-text-muted">Petungkriyono</span>
                  </button>
                </div>
              </div>

              {/* Bagian 3: Status Operasional Waktu Nyata */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                  <Clock className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
                  <span>Jam Operasional</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleOpenNow(!openNowOnly)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-button border transition-colors min-h-[48px] cursor-pointer ${
                    openNowOnly
                      ? "bg-status-open-bg/50 border-accent-sage text-text-primary font-semibold"
                      : "bg-surface-pure border-border text-text-secondary hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        openNowOnly ? "bg-accent-sage animate-pulse" : "bg-text-subtle"
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-text-primary">
                        Hanya Tempat yang Buka Sekarang
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Menyesuaikan otomatis dengan zona waktu WIB saat ini
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-6 rounded-full p-1 transition-colors ${
                      openNowOnly ? "bg-accent-sage" : "bg-border"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-canvas transition-transform transform ${
                        openNowOnly ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Sticky Bottom CTA: Terapkan Filter */}
            <div className="p-4 border-t border-border bg-surface-pure">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-sm transition-colors min-h-[48px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
              >
                <span>Terapkan Filter ({totalFilteredSpots} Tempat)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
