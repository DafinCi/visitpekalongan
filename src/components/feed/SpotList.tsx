import { SpotListItemDTO } from "@/types/spot";
import { SpotListCard } from "./SpotListCard";

interface SpotListProps {
  spots: SpotListItemDTO[];
}

export function SpotList({ spots }: SpotListProps) {
  return (
    <div
      className="space-y-3"
      role="feed"
      aria-label="Daftar tempat terkurasi mode list"
    >
      {spots.map((spot) => (
        <SpotListCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

