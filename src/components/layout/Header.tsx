"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Search, SlidersHorizontal, X } from "lucide-react";
import { SubmitSpotDrawer } from "@/components/community/SubmitSpotDrawer";
import { SpotFilterDrawer } from "@/components/feed/SpotFilterDrawer";
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
  totalFilteredSpots = 0,
}: HeaderProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Hitung jumlah filter aktif (di luar query teks pencarian)
  const activeFilterCount =
    (activeCategory !== "all" ? 1 : 0) +
    (selectedRegency !== null ? 1 : 0) +
    (openNowOnly ? 1 : 0);

  const handleResetFilters = () => {
    onSelectCategory?.("all");
    onSelectRegency?.(null);
    onToggleOpenNow?.(false);
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
            <div className="flex-1 max-w-sm sm:max-w-md mx-1 sm:mx-3 min-w-0">
              <div className="relative flex items-center bg-surface-pure border border-border hover:border-border-focus focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus rounded-button transition-all h-9 sm:h-10 shadow-2xs">
                <Search
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-subtle ml-2.5 sm:ml-3 shrink-0"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari tauto, kopi, curug..."
                  className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-text-primary placeholder:text-text-subtle focus:outline-none min-w-0"
                  aria-label="Pencarian kurasi tempat"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    className="p-1 text-text-muted hover:text-text-primary rounded-sm mr-1 cursor-pointer shrink-0"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}

                {/* Pemisah Vertikal Halus */}
                <div className="h-4 w-px bg-border shrink-0 my-auto" aria-hidden="true" />

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
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent-terracotta text-canvas text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sisi Kanan: Menu Navigasi & Aksi */}
          <nav className="flex items-center gap-1 sm:gap-3 shrink-0" aria-label="Navigasi Utama">
            {!showSearch && (
              <Link
                href="/"
                className="px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-border-focus rounded-button min-h-[44px] flex items-center"
              >
                <Compass className="w-4 h-4 mr-1.5 text-accent-terracotta" aria-hidden="true" />
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
          totalFilteredSpots={totalFilteredSpots}
          onResetAll={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />
      )}
    </>
  );
}
