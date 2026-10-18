import { SpotCard } from "@/components/feed/SpotCard";
import { RecommendedSpotDTO } from "@/lib/utils/smart-search";

interface RelatedSpotsSectionProps {
  recommendations: RecommendedSpotDTO[];
  currentSpotName: string;
}

export function RelatedSpotsSection({
  recommendations,
  currentSpotName,
}: RelatedSpotsSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <section
      aria-labelledby="related-spots-heading"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4"
    >
      <div className="border-t border-border pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <h2
              id="related-spots-heading"
              className="font-serif text-2xl sm:text-3xl text-text-primary tracking-tight"
            >
              Tempat Serupa & Searah dari {currentSpotName}
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Dipilih berdasarkan kemiripan suasana, fasilitas, dan jarak rute
            terdekat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map(({ spot, matchReason }) => (
            <div key={spot.id} className="flex flex-col h-full">
              {/* Lencana Alasan Rekomendasi Pintar */}
              <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-button bg-accent-terracotta/10 border border-accent-terracotta/25 text-[11px] font-medium text-accent-terracotta w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta shrink-0" />
                <span className="line-clamp-1">{matchReason}</span>
              </div>

              <div className="flex-1">
                <SpotCard spot={spot} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
