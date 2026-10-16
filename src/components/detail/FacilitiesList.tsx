import {
  Wifi,
  Zap,
  Wind,
  Snowflake,
  Car,
  Bike,
  Trees,
  CheckCircle,
} from "lucide-react";
import { Facility } from "@/types/spot";

interface FacilitiesListProps {
  facilities: Facility[];
}

interface FacilityMeta {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FACILITY_MAP: Record<Facility, FacilityMeta> = {
  wifi: {
    label: "Koneksi WiFi",
    icon: Wifi,
  },
  power_plug: {
    label: "Stopkontak Nyaman",
    icon: Zap,
  },
  outdoor_smoking: {
    label: "Area Luar / Merokok",
    icon: Wind,
  },
  air_conditioned: {
    label: "Ruangan Ber-AC",
    icon: Snowflake,
  },
  prayer_room: {
    label: "Mushola Nyaman",
    icon: CheckCircle,
  },
  car_parking: {
    label: "Tersedia Parkir Mobil",
    icon: Car,
  },
  motorcycle_parking: {
    label: "Parkir Motor Luas",
    icon: Bike,
  },
  scenic_view: {
    label: "Pemandangan Alam Hijau",
    icon: Trees,
  },
};

export function FacilitiesList({ facilities }: FacilitiesListProps) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="p-6 rounded-card bg-surface-pure border border-border">
        <h2 className="font-display text-xl sm:text-2xl text-text-primary mb-4">
          Fasilitas & Kenyamanan
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {facilities.map((facilityKey) => {
            const meta = FACILITY_MAP[facilityKey];
            if (!meta) return null;

            const IconComponent = meta.icon;

            return (
              <div
                key={facilityKey}
                className="flex items-center gap-2.5 p-3 rounded-button bg-canvas border border-border text-xs sm:text-sm font-medium text-text-primary"
              >
                <IconComponent className="w-4 h-4 text-accent-terracotta shrink-0" />
                <span className="truncate">{meta.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

