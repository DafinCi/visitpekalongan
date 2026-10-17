"use client";

import { useMemo } from "react";
import { SpotCategory, SpotListItemDTO } from "@/types/spot";
import { useSpotFilters } from "@/lib/hooks/useSpotFilters";
import { Header } from "@/components/layout/Header";
import { SpotGrid } from "./SpotGrid";
import { EmptyState } from "./EmptyState";
import { FloatingViewSwitch } from "./FloatingViewSwitch";
import { SpotMapLazy } from "@/components/map/SpotMapLazy";

interface SpotFeedExplorerProps {
  categories: SpotCategory[];
  allSpots: SpotListItemDTO[];
}

export function SpotFeedExplorer({
  categories,
  allSpots,
}: SpotFeedExplorerProps) {
  const {
    q,
    setQ,
    category,
    setCategory,
    regency,
    setRegency,
    openNow,
    setOpenNow,
    view,
    setView,
    resetAllFilters,
  } = useSpotFilters();

  // Filter spots berdasarkan query string
  const filteredSpots = useMemo(() => {
    let result = allSpots;

    // Filter teks pencarian
    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.signatureDish?.toLowerCase().includes(keyword) ||
          s.district.toLowerCase().includes(keyword)
      );
    }

    // Filter kategori
    if (category && category !== "all") {
      result = result.filter((s) => s.categorySlug === category);
    }

    // Filter teritori (kota / kabupaten)
    if (regency) {
      result = result.filter((s) => s.regency === regency);
    }

    // Filter buka sekarang
    if (openNow) {
      result = result.filter((s) => s.isOpenNow);
    }

    return result;
  }, [allSpots, q, category, regency, openNow]);

  return (
    <div className="w-full">
      {/* Unified Sticky Header dengan Search & Filter Pill */}
      <Header
        showSearch
        searchQuery={q}
        onSearchChange={setQ}
        selectedRegency={regency}
        onSelectRegency={setRegency}
        categories={categories}
        activeCategory={category}
        onSelectCategory={setCategory}
        openNowOnly={openNow}
        onToggleOpenNow={setOpenNow}
        totalFilteredSpots={filteredSpots.length}
      />

      {/* Konten Utama: Mode Daftar vs Peta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        {view === "list" ? (
          filteredSpots.length > 0 ? (
            <SpotGrid spots={filteredSpots} />
          ) : (
            <EmptyState
              hasOpenNowFilter={openNow}
              onDisableOpenNow={() => setOpenNow(false)}
              hasRegencyFilter={regency !== null}
              onResetRegency={() => setRegency(null)}
              hasSearchQuery={q !== ""}
              onClearSearch={() => setQ("")}
              onResetAll={resetAllFilters}
            />
          )
        ) : (
          /* Tampilan Peta Interaktif MapLibre GL */
          <div className="py-2">
            <SpotMapLazy spots={filteredSpots} />
          </div>
        )}
      </section>

      {/* Floating Controller Bawah Layar */}
      <FloatingViewSwitch currentView={view} onViewChange={setView} />
    </div>
  );
}

