import { SpotListItemDTO } from "@/types/spot";
import { SpotCard } from "./SpotCard";

interface SpotGridProps {
  spots: SpotListItemDTO[];
}

export function SpotGrid({ spots }: SpotGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 py-6">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

