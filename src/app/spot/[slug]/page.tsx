import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DetailHero } from "@/components/detail/DetailHero";
import { DetailHeader } from "@/components/detail/DetailHeader";
import { DetailActions } from "@/components/detail/DetailActions";
import { StorySection } from "@/components/detail/StorySection";
import { FacilitiesList } from "@/components/detail/FacilitiesList";
import { ScheduleTable } from "@/components/detail/ScheduleTable";
import { OfflineGuideNotice } from "@/components/detail/OfflineGuideNotice";
import { RelatedSpotsSection } from "@/components/detail/RelatedSpotsSection";
import { DetailSkeleton } from "@/components/detail/DetailSkeleton";
import { spotRepository } from "@/lib/repositories/spot-repository";
import { getRecommendedSpots } from "@/lib/utils/smart-search";

interface SpotPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const spots = await spotRepository.getSpots();
  return spots.map((spot) => ({
    slug: spot.slug,
  }));
}

export async function generateMetadata({
  params,
}: SpotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = await spotRepository.getSpotBySlug(slug);

  if (!spot) {
    return {
      title: "Spot Tidak Ditemukan - VisitPekalongan",
    };
  }

  return {
    title: `${spot.name} - Kurasi Autentik Pekalongan`,
    description: spot.description,
    openGraph: {
      title: `${spot.name} - VisitPekalongan`,
      description: spot.description,
      images: [
        {
          url: spot.coverImageUrl,
          width: 1200,
          height: 630,
          alt: `Suasana di ${spot.name}`,
        },
      ],
    },
  };
}

async function SpotDetailContent({ params }: SpotPageProps) {
  const { slug } = await params;
  const [spot, allSpots] = await Promise.all([
    spotRepository.getSpotBySlug(slug),
    spotRepository.getSpots(),
  ]);

  if (!spot) {
    notFound();
  }

  const recommendations = getRecommendedSpots(spot, allSpots, 3);

  const isFoodOrCafe =
    spot.categorySlug === "kuliner-legendaris" ||
    spot.categorySlug === "coffee-workspace";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isFoodOrCafe ? "FoodEstablishment" : "TouristAttraction",
    name: spot.name,
    description: spot.description,
    image: [spot.coverImageUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: spot.address,
      addressLocality: spot.district,
      addressRegion:
        spot.regency === "kota" ? "Kota Pekalongan" : "Kabupaten Pekalongan",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: spot.latitude,
      longitude: spot.longitude,
    },
    ...(isFoodOrCafe && {
      servesCuisine: spot.signatureDish || "Kuliner Khas Pekalongan",
      priceRange: spot.priceRange,
    }),
  };

  return (
    <main className="flex-1 pb-28 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <DetailHero spot={spot} />
      <DetailHeader spot={spot} />
      <DetailActions spot={spot} />
      <StorySection spot={spot} />
      <FacilitiesList facilities={spot.facilities} />
      <ScheduleTable schedule={spot.weeklySchedule} />
      <OfflineGuideNotice spot={spot} />
      <RelatedSpotsSection
        recommendations={recommendations}
        currentSpotName={spot.name}
      />
    </main>
  );
}

export default function SpotDetailPage({ params }: SpotPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* Konten Utama dengan z-10 bg-canvas untuk menutupi Sticky Reveal Footer di bawahnya */}
      <div className="relative z-10 bg-canvas min-h-screen flex flex-col">
        <Header backUrl="/" backLabel="Kurasi" />

        <Suspense fallback={<DetailSkeleton />}>
          <SpotDetailContent params={params} />
        </Suspense>
      </div>

      {/* Sticky Curtain Reveal Footer */}
      <Footer />
    </div>
  );
}
