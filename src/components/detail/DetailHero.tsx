import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";
import { formatDistrict, formatRegency } from "@/lib/utils/formatters";

interface DetailHeroProps {
  spot: SpotDetailDTO;
}

export function DetailHero({ spot }: DetailHeroProps) {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Tombol Kembali ke Feed Kurasi */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Kurasi</span>
        </Link>
      </div>

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
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-canvas/90 backdrop-blur-xs text-text-primary border border-border rounded-button shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
            <span>{spot.categoryName}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-canvas/90 backdrop-blur-xs text-text-muted border border-border rounded-button shadow-xs">
            <MapPin className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <span>{formatDistrict(spot.district)}, {formatRegency(spot.regency)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

