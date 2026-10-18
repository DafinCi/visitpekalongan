"use client";

import { useMemo, useState, useEffect } from "react";
import { SpotCategory, SpotListItemDTO } from "@/types/spot";
import { useSpotFilters } from "@/lib/hooks/useSpotFilters";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { searchSpotsSmart } from "@/lib/utils/smart-search";
import { calculateOpenStatus } from "@/lib/utils/opening-hours";
import { LayoutGrid, List, Map, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SpotGrid } from "./SpotGrid";
import { SpotList } from "./SpotList";
import { EmptyState } from "./EmptyState";
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

  const activeFilterCount =
    (category !== "all" && Boolean(category) ? 1 : 0) +
    (regency !== null ? 1 : 0) +
    (openNow ? 1 : 0) +
    (savedOnly ? 1 : 0);

  const PAGE_SIZE = 9;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Reset pagination saat filter atau query pencarian berubah
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedQ, category, regency, openNow, savedOnly]);

  // Slicing data khusus untuk tampilan feed daftar/grid
  const paginatedSpots = useMemo(() => {
    return filteredSpots.slice(0, visibleCount);
  }, [filteredSpots, visibleCount]);

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        {/* Toolbar Kontrol Feed: Info Hasil Kurasi & Switch Tampilan [Daftar | Peta] */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-border/70">
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm font-medium text-text-muted">
              {/* Teks lengkap di desktop */}
              <span className="hidden sm:inline">
                Menampilkan{" "}
                <span className="text-text-primary font-semibold">
                  {view === "map" || filteredSpots.length <= PAGE_SIZE
                    ? filteredSpots.length
                    : `${Math.min(visibleCount, filteredSpots.length)} dari ${filteredSpots.length}`}
                </span>{" "}
                tempat kurasi
              </span>
              {/* Teks ringkas di mobile agar tidak bertabrakan dengan segmented switch */}
              <span className="sm:hidden text-text-muted">
                <span className="text-text-primary font-semibold">
                  {view === "map" || filteredSpots.length <= PAGE_SIZE
                    ? filteredSpots.length
                    : `${Math.min(visibleCount, filteredSpots.length)}/${filteredSpots.length}`}
                </span>{" "}
                tempat
              </span>
            </p>
            {activeFilterCount > 0 && (
              <span className="hidden sm:inline-flex text-[11px] font-semibold text-accent-terracotta bg-accent-terracotta/10 px-2 py-0.5 rounded-badge border border-accent-terracotta/20">
                {activeFilterCount} filter aktif
              </span>
            )}
          </div>

          {/* Switch Segmented Kontrol In-Flow: [Grid | List | Peta] */}
          <div
            className="flex items-center p-0.5 bg-surface-pure border border-border rounded-button"
            role="tablist"
            aria-label="Peralihan Tampilan"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "grid"}
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-badge transition-all min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
                view === "grid"
                  ? "bg-text-primary text-canvas shadow-xs"
                  : "text-text-muted hover:text-text-primary hover:bg-canvas"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grid</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-badge transition-all min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
                view === "list"
                  ? "bg-text-primary text-canvas shadow-xs"
                  : "text-text-muted hover:text-text-primary hover:bg-canvas"
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>List</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-badge transition-all min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
                view === "map"
                  ? "bg-text-primary text-canvas shadow-xs"
                  : "text-text-muted hover:text-text-primary hover:bg-canvas"
              }`}
            >
              <Map className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Peta</span>
            </button>
          </div>
        </div>

        {view === "map" ? (
          /* Tampilan Peta Interaktif MapLibre GL */
          <div className="py-2">
            <SpotMapLazy spots={filteredSpots} />
          </div>
        ) : filteredSpots.length > 0 ? (
          <>
            {view === "grid" ? (
              <SpotGrid spots={paginatedSpots} />
            ) : (
              <SpotList spots={paginatedSpots} />
            )}

            {/* Tombol Muat Lebih Banyak */}
            {visibleCount < filteredSpots.length && (
              <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-text-primary bg-surface hover:bg-canvas border border-border hover:border-accent-terracotta rounded-button transition-colors shadow-xs min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
                  aria-label={`Muat ${Math.min(PAGE_SIZE, filteredSpots.length - visibleCount)} tempat lagi`}
                >
                  <span>Muat Lebih Banyak Tempat</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" aria-hidden="true" />
                </button>
                <p className="text-[11px] sm:text-xs text-text-muted">
                  Menampilkan {paginatedSpots.length} dari {filteredSpots.length} tempat kurasi
                </p>
              </div>
            )}

            {/* Status Akhir Kurasi jika semua sudah termuat */}
            {visibleCount >= filteredSpots.length && filteredSpots.length > PAGE_SIZE && (
              <div className="mt-8 sm:mt-12 text-center py-4 border-t border-border/50">
                <p className="text-xs text-text-muted">
                  Seluruh {filteredSpots.length} tempat kurasi telah ditampilkan.
                </p>
              </div>
            )}
          </>
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
        )}
      </section>
    </div>
  );
}
