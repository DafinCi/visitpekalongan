import { Utensils, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";

interface StorySectionProps {
  spot: SpotDetailDTO;
}

export function StorySection({ spot }: StorySectionProps) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Narasi Kurasi (2 kolom di layar besar) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-accent-terracotta font-semibold">
                Catatan Kurator
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-text-primary tracking-tight mb-4">
              Cerita & Rasa di Balik Tempat Ini
            </h2>
            <div className="prose prose-neutral max-w-none text-text-secondary text-base leading-relaxed space-y-4">
              <p>{spot.description}</p>
            </div>
          </div>

          {/* Kartu Menu Andalan (Signature Dish) */}
          {spot.signatureDish && (
            <div className="p-5 rounded-card bg-surface-pure border border-border border-l-4 border-l-accent-terracotta">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-terracotta mb-1.5">
                <Utensils className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Menu Wajib Coba</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl text-text-primary mb-1">
                {spot.signatureDish}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Rekomendasi utama kurator kami untuk mencicipi rasa paling
                autentik dari tempat ini.
              </p>
            </div>
          )}
        </div>

        {/* Kolom Informasi Tambahan (1 kolom di layar besar) */}
        <div className="space-y-4">
          {/* Waktu Berkunjung Terbaik */}
          {spot.bestTimeToVisit && (
            <div className="p-5 rounded-card bg-surface-pure border border-border">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                <Clock
                  className="w-3.5 h-3.5 text-accent-terracotta"
                  aria-hidden="true"
                />
                <span>Waktu Terbaik Berkunjung</span>
              </div>
              <p className="text-sm font-medium text-text-primary leading-relaxed">
                {spot.bestTimeToVisit}
              </p>
            </div>
          )}

          {/* Kartu Ulasan Publik Google Maps vs Hidden Gem Murni */}
          {spot.googleMapsReviewUrl ? (
            <div className="p-5 rounded-card bg-surface-pure border border-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <MessageSquare
                  className="w-3.5 h-3.5 text-accent-terracotta"
                  aria-hidden="true"
                />
                <span>Ulasan Publik & Pengunjung</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ingin melihat foto menu makanan terkini dan ulasan ratusan
                pengunjung lainnya di Google Maps?
              </p>
              <a
                href={spot.googleMapsReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-terracotta hover:underline"
              >
                <span>Buka ulasan di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <div className="p-5 rounded-card bg-surface-pure border border-border border-l-4 border-l-accent-sage space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-sage">
                <span>Hidden Gem Belum Terjamah</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tempat ini adalah penemuan otentik yang belum banyak diulas di
                peta publik. Nikmati ketenangan dan keaslian suasananya.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
