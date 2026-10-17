import { CATEGORIES, SPOTS_DATA } from "@/data/spots";
import {
  calculateOpenStatus,
  getGoogleMapsIntentUrl,
} from "@/lib/utils/opening-hours";
import {
  SpotCategory,
  SpotDetailDTO,
  SpotFilterParams,
  SpotListItemDTO,
  SpotMapMarkerDTO,
} from "@/types/spot";

export interface SpotRepository {
  getMapMarkers(filter?: SpotFilterParams): Promise<SpotMapMarkerDTO[]>;
  getSpots(filter?: SpotFilterParams): Promise<SpotListItemDTO[]>;
  getSpotBySlug(slug: string): Promise<SpotDetailDTO | null>;
  getCategories(): Promise<SpotCategory[]>;
}

export class LocalSpotRepository implements SpotRepository {
  async getCategories(): Promise<SpotCategory[]> {
    return CATEGORIES;
  }

  async getMapMarkers(filter?: SpotFilterParams): Promise<SpotMapMarkerDTO[]> {
    const spots = await this.getFilteredEntities(filter);

    return spots.map((spot) => {
      const category = CATEGORIES.find((c) => c.id === spot.categoryId);
      const openStatus = calculateOpenStatus(spot.openingHours, spot.lifecycleStatus);

      return {
        id: spot.id,
        name: spot.name,
        slug: spot.slug,
        categorySlug: category?.slug || "",
        regency: spot.regency,
        latitude: spot.latitude,
        longitude: spot.longitude,
        priceRange: spot.priceRange,
        isOpenNow: openStatus.isOpenNow,
        statusLabel: openStatus.statusLabel,
      };
    });
  }

  async getSpots(filter?: SpotFilterParams): Promise<SpotListItemDTO[]> {
    const spots = await this.getFilteredEntities(filter);

    return spots.map((spot) => {
      const category = CATEGORIES.find((c) => c.id === spot.categoryId);
      const openStatus = calculateOpenStatus(spot.openingHours, spot.lifecycleStatus);

      return {
        id: spot.id,
        name: spot.name,
        slug: spot.slug,
        categoryName: category?.name || "Kurasi Khusus",
        categorySlug: category?.slug || "",
        regency: spot.regency,
        district: spot.district,
        signatureDish: spot.signatureDish,
        priceRange: spot.priceRange,
        coverImageUrl: spot.coverImageUrl,
        latitude: spot.latitude,
        longitude: spot.longitude,
        googleMapsIntentUrl: getGoogleMapsIntentUrl(spot.latitude, spot.longitude),
        instagramAccount: spot.instagramAccount,
        lifecycleStatus: spot.lifecycleStatus,
        isOpenNow: openStatus.isOpenNow,
        statusLabel: openStatus.statusLabel,
        facilities: spot.facilities,
        vibeTags: [category?.name || "", spot.regency === "kota" ? "Kota" : "Pegunungan"],
      };
    });
  }

  async getSpotBySlug(slug: string): Promise<SpotDetailDTO | null> {
    const spot = SPOTS_DATA.find(
      (s) => s.slug === slug && s.lifecycleStatus !== "permanently_closed"
    );

    if (!spot) {
      return null;
    }

    const category = CATEGORIES.find((c) => c.id === spot.categoryId);
    const openStatus = calculateOpenStatus(spot.openingHours, spot.lifecycleStatus);

    return {
      id: spot.id,
      name: spot.name,
      slug: spot.slug,
      categoryName: category?.name || "Kurasi Khusus",
      categorySlug: category?.slug || "",
      regency: spot.regency,
      district: spot.district,
      signatureDish: spot.signatureDish,
      priceRange: spot.priceRange,
      coverImageUrl: spot.coverImageUrl,
      latitude: spot.latitude,
      longitude: spot.longitude,
      googleMapsIntentUrl: getGoogleMapsIntentUrl(spot.latitude, spot.longitude),
      instagramAccount: spot.instagramAccount,
      lifecycleStatus: spot.lifecycleStatus,
      isOpenNow: openStatus.isOpenNow,
      statusLabel: openStatus.statusLabel,
      facilities: spot.facilities,
      vibeTags: [category?.name || "", spot.regency === "kota" ? "Kota" : "Pegunungan"],
      description: spot.description,
      bestTimeToVisit: spot.bestTimeToVisit,
      address: spot.address,
      galleryImages: [
        {
          id: `${spot.id}-img-1`,
          imageUrl: spot.coverImageUrl,
          altText: `Suasana di ${spot.name}`,
        },
      ],
      weeklySchedule: spot.openingHours,
      googleMapsReviewUrl: spot.googleMapsReviewUrl,
    };
  }

  private async getFilteredEntities(filter?: SpotFilterParams) {
    let result = SPOTS_DATA.filter(
      (spot) => spot.lifecycleStatus !== "permanently_closed" && spot.isVerified
    );

    if (!filter) {
      return result;
    }

    // Filter teks pencarian (q)
    if (filter.q && filter.q.trim() !== "") {
      const keyword = filter.q.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.signatureDish?.toLowerCase().includes(keyword) ||
          s.district.toLowerCase().includes(keyword) ||
          s.description.toLowerCase().includes(keyword)
      );
    }

    // Filter kategori
    if (filter.category && filter.category !== "all") {
      const targetCategory = CATEGORIES.find((c) => c.slug === filter.category);
      if (targetCategory) {
        result = result.filter((s) => s.categoryId === targetCategory.id);
      }
    }

    // Filter teritori (regency: kota | kabupaten)
    if (filter.regency) {
      result = result.filter((s) => s.regency === filter.regency);
    }

    // Filter buka sekarang
    if (filter.openNow) {
      result = result.filter((s) => {
        const status = calculateOpenStatus(s.openingHours, s.lifecycleStatus);
        return status.isOpenNow;
      });
    }

    return result;
  }
}

// Singleton repository instance
export const spotRepository: SpotRepository = new LocalSpotRepository();

