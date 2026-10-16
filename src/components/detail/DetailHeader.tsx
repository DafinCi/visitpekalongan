import { MapPin, CheckCircle2, CircleDollarSign } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";
import { formatPriceRange } from "@/lib/utils/formatters";

interface DetailHeaderProps {
  spot: SpotDetailDTO;
}

export function DetailHeader({ spot }: DetailHeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      {/* Baris Status & Harga */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Status Operasional */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-button border ${
            spot.isOpenNow
              ? "bg-status-open-bg text-status-open-text border-status-open-text/20"
              : "bg-status-closed-bg text-status-closed-text border-status-closed-text/20"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              spot.isOpenNow ? "bg-status-open-text animate-pulse" : "bg-status-closed-text"
            }`}
            aria-hidden="true"
          />
          <span>{spot.statusLabel}</span>
        </span>

        {/* Rentang Harga */}
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-surface-pure text-text-muted border border-border rounded-button">
          <CircleDollarSign className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          <span>{formatPriceRange(spot.priceRange)}</span>
        </span>

        {/* Lencana Kurasi Terverifikasi */}
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-accent-sage bg-status-open-bg/50 border border-accent-sage/20 rounded-button">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-sage" aria-hidden="true" />
          <span>Terverifikasi Kurator</span>
        </span>
      </div>

      {/* Judul Utama Spot dalam Instrument Serif */}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight leading-tight mb-3">
        {spot.name}
      </h1>

      {/* Alamat Lengkap */}
      <div className="flex items-start gap-2 text-text-muted text-sm leading-relaxed max-w-3xl">
        <MapPin className="w-4 h-4 text-accent-terracotta shrink-0 mt-0.5" aria-hidden="true" />
        <p>{spot.address}</p>
      </div>
    </header>
  );
}

