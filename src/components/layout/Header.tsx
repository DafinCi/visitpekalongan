"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  SlidersHorizontal,
  X,
  History,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { SpotFilterDrawer } from "@/components/feed/SpotFilterDrawer";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useRecentSearches } from "@/lib/hooks/useRecentSearches";
import { Regency, SpotCategory } from "@/types/spot";

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  selectedRegency?: Regency | null;
  onSelectRegency?: (regency: Regency | null) => void;
  categories?: SpotCategory[];
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  openNowOnly?: boolean;
  onToggleOpenNow?: (openNow: boolean) => void;
  savedOnly?: boolean;
  onToggleSaved?: (saved: boolean) => void;
  bookmarkCount?: number;
  totalFilteredSpots?: number;
  backUrl?: string;
  backLabel?: string;
}

export function Header({
  showSearch = false,
  searchQuery = "",
  onSearchChange,
  selectedRegency = null,
  onSelectRegency,
  categories = [],
  activeCategory = "all",
  onSelectCategory,
  openNowOnly = false,
  onToggleOpenNow,
  savedOnly = false,
  onToggleSaved,
  bookmarkCount = 0,
  totalFilteredSpots = 0,
  backUrl,
  backLabel = "Kembali",
}: HeaderProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  // Hitung jumlah filter aktif (di luar query teks pencarian)
  const activeFilterCount =
    (activeCategory !== "all" ? 1 : 0) +
    (selectedRegency !== null ? 1 : 0) +
    (openNowOnly ? 1 : 0) +
    (savedOnly ? 1 : 0);

  const handleResetFilters = () => {
    onSelectCategory?.("all");
    onSelectRegency?.(null);
    onToggleOpenNow?.(false);
    onToggleSaved?.(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length >= 2) {
      addRecentSearch(searchQuery);
      setIsSearchFocused(false);
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <header className="sticky top-0 md:flex-none z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Sisi Kiri: Brand & Logo (dengan Tombol Kembali jika backUrl tersedia) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {backUrl && (
              <Link
                href={backUrl}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-text-primary hover:text-accent-terracotta hover:bg-canvas transition-colors min-h-11 min-w-11 sm:min-h-10"
                aria-label={backLabel}
                title={backLabel}
              >
                <ArrowLeft
                  className="w-6 h-6 sm:w-4 sm:h-5 text-accent-terracotta"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            )}

            <Link
              href="/"
              aria-label="VisitPekalongan, kembali ke beranda"
              className={`flex min-h-11 items-center ${
                showSearch ? "sm:gap-2" : "gap-2"
              } group focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm py-1`}
            >
              <BrandLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <span
                className={`${
                  showSearch ? "hidden sm:inline" : "inline"
                } font-serif text-base sm:text-2xl tracking-tight text-text-primary group-hover:text-accent-terracotta transition-colors`}
              >
                VisitPekalongan
              </span>
            </Link>
          </div>

          {/* Tengah: Search & Filter Pill Terpadu (Hanya muncul jika mode showSearch aktif) */}
          {showSearch && onSearchChange && (
            <div className="relative w-full">
              <div className="relative flex items-center bg-surface-pure border border-border focus-within:border-border-focus focus-within:ring-border-focus rounded-button transition-all h-11 sm:h-10 shadow-2xs">
                <Search
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-subtle ml-2.5 sm:ml-3 shrink-0"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    if (searchQuery.trim().length >= 2) {
                      addRecentSearch(searchQuery);
                    }
                    setIsSearchFocused(false);
                  }}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari tauto, kopi, curug..."
                  className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-text-primary placeholder:text-text-subtle focus:outline-none min-w-0"
                  aria-label="Pencarian kurasi tempat"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSearchChange("")}
                    className="flex min-h-11 min-w-11 items-center justify-center text-text-muted hover:text-text-primary rounded-sm cursor-pointer shrink-0"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}

                {/* Pemisah Vertikal Halus */}
                <div
                  className="h-4 w-px bg-border shrink-0 my-auto"
                  aria-hidden="true"
                />

                {/* Tombol Pemicu Bottom Sheet Filter */}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className={`inline-flex min-w-11 items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-full rounded-r-button text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    activeFilterCount > 0
                      ? "text-accent-terracotta bg-accent-terracotta/10 hover:bg-accent-terracotta/20 font-bold"
                      : "text-text-secondary hover:text-text-primary hover:bg-canvas"
                  }`}
                  aria-label={`Buka filter kurasi, ${activeFilterCount} filter aktif`}
                >
                  <SlidersHorizontal
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent-terracotta text-canvas text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Panel Dropdown Riwayat Pencarian Terakhir */}
              {isSearchFocused && recentSearches.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Riwayat pencarian terakhir"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-canvas border border-border rounded-card shadow-lg z-50 py-2 overflow-hidden animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between px-3 pb-1.5 mb-1 border-b border-border/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Pencarian Terakhir
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => clearRecentSearches()}
                      className="inline-flex min-h-11 items-center gap-1 text-[11px] text-text-muted hover:text-accent-terracotta cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      <span>Hapus Semua</span>
                    </button>
                  </div>

                  <div className="divide-y divide-border/40">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between px-3 py-2 hover:bg-surface-pure transition-colors"
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onSearchChange(item);
                            addRecentSearch(item);
                            setIsSearchFocused(false);
                          }}
                          className="flex-1 flex items-center gap-2 text-left text-xs sm:text-sm text-text-primary cursor-pointer min-w-0"
                        >
                          <History
                            className="w-3.5 h-3.5 text-text-subtle shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{item}</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => removeRecentSearch(item)}
                          className="ml-2 flex min-h-11 min-w-11 items-center justify-center text-text-muted hover:text-text-primary rounded-sm cursor-pointer shrink-0"
                          aria-label={`Hapus riwayat pencarian ${item}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sisi Kanan: Menu Navigasi & Aksi */}
          <nav
            className="flex items-center gap-1 sm:gap-3 shrink-0"
            aria-label="Navigasi Utama"
          >
            {!showSearch && !backUrl && (
              <Link
                href="/"
                className="px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-border-focus rounded-button min-h-[44px] flex items-center"
              >
                <Compass
                  className="w-4 h-4 mr-1.5 text-accent-terracotta"
                  aria-hidden="true"
                />
                <span>Katalog</span>
              </Link>
            )}

            <Link
              href="/about"
              className="hidden md:flex px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-border-focus rounded-button min-h-[44px] items-center"
            >
              <span>Tentang</span>
            </Link>

            {/* Tombol Lapor Hidden Gem Komunitas */}
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-xs transition-colors cursor-pointer min-h-11 focus-visible:outline-2 focus-visible:outline-border-focus"
              aria-label="Buka formulir Lapor Hidden Gem"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Lapor Spot</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Filter Bottom Sheet Drawer */}
      {showSearch && categories.length > 0 && (
        <SpotFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory || (() => {})}
          selectedRegency={selectedRegency}
          onSelectRegency={onSelectRegency || (() => {})}
          openNowOnly={openNowOnly}
          onToggleOpenNow={onToggleOpenNow || (() => {})}
          savedOnly={savedOnly}
          onToggleSaved={onToggleSaved || (() => {})}
          bookmarkCount={bookmarkCount}
          totalFilteredSpots={totalFilteredSpots}
          onResetAll={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />
      )}
    </>
  );
}
