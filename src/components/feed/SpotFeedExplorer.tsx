"use client";

import { useMemo, useState, useEffect } from "react";
import { SpotCategory, SpotListItemDTO } from "@/types/spot";
import { useSpotFilters } from "@/lib/hooks/useSpotFilters";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { searchSpotsSmart } from "@/lib/utils/smart-search";
import { calculateOpenStatus } from "@/lib/utils/opening-hours";
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
    savedOnly,
    setSavedOnly,
    view,
    setView,
    resetAllFilters,
  } = useSpotFilters();

  const { bookmarks, bookmarkCount } = useBookmarks();
  const debouncedQ = useDebounce(q, 250);

  // Status operasional dinamis mengikuti waktu pengguna saat ini di sisi klien
  const [liveSpots, setLiveSpots] = useState<SpotListItemDTO[]>(allSpots);

  useEffect(() => {
    const now = new Date();
    setLiveSpots(
      allSpots.map((spot) => {
        if (!spot.openingHours) return spot;
        const status = calculateOpenStatus(
          spot.openingHours,
          spot.lifecycleStatus,
          now,
          spot.hasFridayPrayerBreak
        );
        return {
          ...spot,
          isOpenNow: status.isOpenNow,
          statusLabel: status.statusLabel,
        };
      })
    );
  }, [allSpots]);

  // Filter spots menggunakan mesin pencarian pintar & status filter
  const filteredSpots = useMemo(() => {
    let result = liveSpots;

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

    // Filter daftar tersimpan offline
    if (savedOnly) {
      result = result.filter((s) => bookmarks.includes(s.slug));
    }

    // Pencarian pintar menggunakan debouncedQ agar tidak memicu kalkulasi & animasi peta berulang saat mengetik
    if (debouncedQ && debouncedQ.trim() !== "") {
      result = searchSpotsSmart(result, debouncedQ);
    }

    return result;
  }, [liveSpots, debouncedQ, category, regency, openNow, savedOnly, bookmarks]);

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
        savedOnly={savedOnly}
        onToggleSaved={setSavedOnly}
        bookmarkCount={bookmarkCount}
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
              hasSavedFilter={savedOnly}
              onDisableSaved={() => setSavedOnly(false)}
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
