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
} from "lucide-react";
import { SubmitSpotDrawer } from "@/components/community/SubmitSpotDrawer";
import { SpotFilterDrawer } from "@/components/feed/SpotFilterDrawer";
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
      <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Sisi Kiri: Brand & Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-baseline group focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm py-1"
            >
              <span className="font-serif text-lg sm:text-2xl tracking-tight text-text-primary group-hover:text-accent-terracotta transition-colors">
                VisitPekalongan
              </span>
            </Link>
          </div>

          {/* Tengah: Search & Filter Pill Terpadu (Hanya muncul jika mode showSearch aktif) */}
          {showSearch && onSearchChange && (
            <div className="relative w-full">
              <div className="relative flex items-center bg-surface-pure border border-border focus-within:ring-border-focus rounded-button transition-all h-9 sm:h-10 shadow-2xs">
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
                    className="p-1 text-text-muted hover:text-text-primary rounded-sm mr-1 cursor-pointer shrink-0"
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
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-full rounded-r-button text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
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
                      className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-accent-terracotta cursor-pointer transition-colors"
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
                          className="p-1 text-text-muted hover:text-text-primary rounded-sm cursor-pointer shrink-0 ml-2"
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
            {!showSearch && (
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
            <SubmitSpotDrawer />
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
