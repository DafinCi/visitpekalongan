import { MapPin, CheckCircle2, CircleDollarSign } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";
import { formatPriceRange } from "@/lib/utils/formatters";
import { OpenStatusPanel } from "./OpenStatusPanel";

interface DetailHeaderProps {
  spot: SpotDetailDTO;
}

export function DetailHeader({ spot }: DetailHeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      <h1 className="font-display text-[28px] sm:text-4xl md:text-5xl text-text-primary tracking-tight leading-[34px] sm:leading-tight mb-2.5">
        {spot.name}
      </h1>

      <OpenStatusPanel
        schedule={spot.weeklySchedule}
        lifecycleStatus={spot.lifecycleStatus}
        hasFridayPrayerBreak={spot.hasFridayPrayerBreak}
      />

      <div className="mt-3 flex items-start gap-2 text-text-muted text-sm leading-relaxed max-w-3xl">
        <MapPin className="w-4 h-4 text-accent-terracotta shrink-0 mt-0.5" aria-hidden="true" />
        <p>{spot.address}</p>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1 text-text-primary font-medium">
          <CircleDollarSign className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          {formatPriceRange(spot.priceRange)}
        </span>
        <span className="inline-flex items-center gap-1 text-accent-sage">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          Terverifikasi kurator
        </span>
      </div>
    </header>
  );
}

