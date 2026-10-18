import type { MetadataRoute } from "next";
import { spotRepository } from "@/lib/repositories/spot-repository";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://visitpekalongan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spots = await spotRepository.getSpots();

  const spotUrls: MetadataRoute.Sitemap = spots.map((spot) => ({
    url: `${BASE_URL}/spot/${spot.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...spotUrls,
  ];
}

