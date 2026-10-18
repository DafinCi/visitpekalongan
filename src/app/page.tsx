import { Suspense } from "react";
import { SpotFeedExplorer } from "@/components/feed/SpotFeedExplorer";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { spotRepository } from "@/lib/repositories/spot-repository";

export default async function Home() {
  const [categories, spots] = await Promise.all([
    spotRepository.getCategories(),
    spotRepository.getSpots(),
  ]);

  return (
    <div className="min-h-screen md:h-dvh flex flex-col bg-canvas text-text-primary md:overflow-hidden">
      <Suspense fallback={<FeedSkeleton />}>
        <SpotFeedExplorer categories={categories} allSpots={spots} />
      </Suspense>
    </div>
  );
}
