"use client";

import { useMemo } from "react";
import { SpotCategory, SpotListItemDTO } from "@/types/spot";
import { useSpotFilters } from "@/lib/hooks/useSpotFilters";
import { SpotFilterBar } from "./SpotFilterBar";
import { SpotGrid } from "./SpotGrid";
import { EmptyState } from "./EmptyState";
import { FloatingViewSwitch } from "./FloatingViewSwitch";
import { MapPin, Compass } from "lucide-react";

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
      {/* Sticky Filter Toolbar */}
      <SpotFilterBar
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
          /* Placeholder Mode Peta Interaktif (Akan dihubungkan ke MapLibre GL pada Tahap 5) */
          <div className="w-full min-h-[500px] sm:min-h-[600px] my-6 bg-surface border border-border rounded-card p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-serif text-2xl text-text-primary">
                Peta Sebaran {filteredSpots.length} Spot Terkurasi
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Menampilkan koordinat spot aktif di Kota Pekalongan dan lereng Petungkriyono.
                Engine MapLibre GL dengan tile kanvas mori akan dipasang pada Tahap 5.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg pt-2">
              {filteredSpots.slice(0, 6).map((spot) => (
                <span
                  key={spot.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-surface-pure border border-border rounded-badge text-text-primary"
                >
                  <MapPin className="w-3 h-3 text-accent-terracotta" aria-hidden="true" />
                  <span>{spot.name}</span>
                </span>
              ))}
              {filteredSpots.length > 6 && (
                <span className="text-xs text-text-muted px-2 py-1">
                  +{filteredSpots.length - 6} lainnya
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Floating Controller Bawah Layar */}
      <FloatingViewSwitch currentView={view} onViewChange={setView} />
    </div>
  );
}

