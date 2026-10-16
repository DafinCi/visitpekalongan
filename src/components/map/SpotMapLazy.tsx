"use client";

import dynamic from "next/dynamic";
import { SpotListItemDTO } from "@/types/spot";
import { MapPin } from "lucide-react";

interface SpotMapLazyProps {
  spots: SpotListItemDTO[];
  selectedSpotId?: string | null;
  onSelectSpot?: (spot: SpotListItemDTO | null) => void;
}

function MapSkeleton() {
  return (
    <div className="relative w-full h-[600px] sm:h-[680px] rounded-card border border-border overflow-hidden bg-surface-pure flex flex-col items-center justify-center p-6 text-center shadow-xs">
      {/* Background Grid Pattern Skeleton */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5A6B5C_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center animate-pulse">
          <MapPin className="w-6 h-6 text-accent-terracotta" />
        </div>
        <p className="font-display text-lg text-text-primary">
          Menyiapkan Peta Kurasi Pekalongan...
        </p>
        <p className="text-xs text-text-muted max-w-sm">
          Memuat visualisasi titik koordinat dan jalur pegunungan Petungkriyono.
        </p>
      </div>
    </div>
  );
}

const DynamicSpotMap = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

export function SpotMapLazy(props: SpotMapLazyProps) {
  return <DynamicSpotMap {...props} />;
}

