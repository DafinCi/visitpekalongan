"use client";

import { useEffect } from "react";
import { X, MapPin, Clock, Check, Bookmark } from "lucide-react";
import { Regency, SpotCategory } from "@/types/spot";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

interface SpotFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SpotCategory[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  selectedRegency: Regency | null;
  onSelectRegency: (regency: Regency | null) => void;
  openNowOnly: boolean;
  onToggleOpenNow: (openNow: boolean) => void;
  savedOnly: boolean;
  onToggleSaved: (saved: boolean) => void;
  bookmarkCount: number;
  totalFilteredSpots: number;
  onResetAll: () => void;
  activeFilterCount: number;
}

export function SpotFilterDrawer({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  selectedRegency,
  onSelectRegency,
  openNowOnly,
  onToggleOpenNow,
  savedOnly,
  onToggleSaved,
  bookmarkCount,
  totalFilteredSpots,
  onResetAll,
  activeFilterCount,
}: SpotFilterDrawerProps) {
  useScrollLock(isOpen);

  // Handle tombol ESC untuk menutup drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      {/* Latar Belakang Redup (Backdrop) */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
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
              Saring berdasarkan kategori, teritori, jam buka, dan daftar simpanan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetAll}
                className="text-xs font-semibold text-accent-terracotta hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary rounded-button hover:bg-surface-pure min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
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
            <div className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
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
                    openNowOnly ? "bg-accent-sage" : "bg-text-subtle"
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

          {/* Bagian 4: Daftar Tersimpan Offline */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              <Bookmark className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
              <span>Daftar Tersimpan Offline</span>
            </div>
            <button
              type="button"
              onClick={() => onToggleSaved(!savedOnly)}
              className={`w-full flex items-center justify-between p-3.5 rounded-button border transition-colors min-h-[48px] cursor-pointer ${
                savedOnly
                  ? "bg-accent-terracotta/10 border-accent-terracotta text-text-primary font-semibold"
                  : "bg-surface-pure border-border text-text-secondary hover:bg-canvas"
              }`}
            >
              <div className="flex items-center gap-2.5 text-left">
                <Bookmark
                  className={`w-4 h-4 shrink-0 ${
                    savedOnly ? "fill-accent-terracotta text-accent-terracotta" : "text-text-subtle"
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-text-primary">
                    Hanya Spot yang Disimpan ({bookmarkCount})
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Akses cepat daftar rencana perjalanan Anda tanpa login
                  </p>
                </div>
              </div>

              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  savedOnly ? "bg-accent-terracotta" : "bg-border"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-canvas transition-transform transform ${
                    savedOnly ? "translate-x-4" : "translate-x-0"
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
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-xs transition-colors min-h-[48px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <span>Terapkan Filter ({totalFilteredSpots} Tempat)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
