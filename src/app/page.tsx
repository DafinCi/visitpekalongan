import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { SpotFeedExplorer } from "@/components/feed/SpotFeedExplorer";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { spotRepository } from "@/lib/repositories/spot-repository";

export default async function Home() {
  const [categories, spots] = await Promise.all([
    spotRepository.getCategories(),
    spotRepository.getSpots(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* Konten Utama dengan z-10 bg-canvas untuk menutupi Sticky Footer di bawahnya */}
      <div className="relative z-10 bg-canvas min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Feed Kurasi Dibungkus Suspense Sesuai Arsitektur Next.js 16 */}
          <Suspense fallback={<FeedSkeleton />}>
            <SpotFeedExplorer categories={categories} allSpots={spots} />
          </Suspense>
        </main>
      </div>

      {/* Sticky Curtain Reveal Footer */}
      <Footer />
    </div>
  );
}
