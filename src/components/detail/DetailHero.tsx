import Image from "next/image";
import { MapPin } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";
import { formatDistrict, formatRegency } from "@/lib/utils/formatters";

interface DetailHeroProps {
  spot: SpotDetailDTO;
}

export function DetailHero({ spot }: DetailHeroProps) {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
      {/* Frame Foto Sampul Rasio 16:9 / 16:10 */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-card overflow-hidden border border-border bg-surface-pure">
        <Image
          src={spot.coverImageUrl}
          alt={`Suasana dan foto di ${spot.name}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
          className="object-cover"
        />

        {/* Gradien Halus Pelindung Kontras */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-black/20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Lencana Kategori & Teritori di atas Foto */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 sm:top-4 sm:left-4">
          <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-canvas/90 backdrop-blur-xs text-text-primary border border-border rounded-button shadow-xs">
            <span>{spot.categoryName}</span>
          </span>

          <span className="hidden items-center gap-1 px-3 py-1 text-xs font-medium bg-canvas/90 backdrop-blur-xs text-text-muted border border-border rounded-button shadow-xs sm:inline-flex">
            <MapPin className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <span>{formatDistrict(spot.district)}, {formatRegency(spot.regency)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

