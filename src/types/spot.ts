export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeSlot {
  open: string;  // "HH:mm" (24 jam), misal "06:00" atau "18:30"
  close: string; // "HH:mm" (24 jam), misal "11:00" atau "02:30"
}

export interface DaySchedule {
  slots: TimeSlot[];
  is_closed: boolean;
}

export type WeeklyOpeningHours = Record<DayOfWeek, DaySchedule> & {
  notes?: string;
};

export type PriceRange = "murah_meriah" | "terjangkau" | "kafe_spesial";

export type Regency = "kota" | "kabupaten";

export type LifecycleStatus =
  | "active"
  | "temporarily_closed"
  | "permanently_closed";

export type Facility =
  | "wifi"
  | "power_plug"
  | "outdoor_smoking"
  | "air_conditioned"
  | "prayer_room"
  | "car_parking"
  | "motorcycle_parking"
  | "scenic_view";

export interface SpotCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface SpotTag {
  id: string;
  name: string;
  slug: string;
}

export interface SpotImage {
  id: string;
  spotId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface TransitLogisticsNotice {
  lastFuelStation: {
    name: string;
    distanceKm: number;
    location: string;
    advice: string;
  };
  cellularSignal: {
    status: "spotty_telkomsel" | "no_signal";
    checkpoint: string;
    recommendedProvider: string;
    advice: string;
  };
  roadAdvice: string;
  cashAdvice: string;
}

// Entitas Database Lengkap (Model Entity)
export interface SpotEntity {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  signatureDish?: string;
  bestTimeToVisit?: string;
  address: string;
  regency: Regency;
  district: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  googleMapsReviewUrl?: string;
  instagramAccount?: string;
  priceRange: PriceRange;
  openingHours: WeeklyOpeningHours;
  hasFridayPrayerBreak?: boolean;
  facilities: Facility[];
  coverImageUrl: string;
  lifecycleStatus: LifecycleStatus;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  logisticsNotice?: TransitLogisticsNotice;
}

// Data Transfer Object: Marker Ringan Peta (< 15 KB payload)
export interface SpotMapMarkerDTO {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  regency: Regency;
  latitude: number;
  longitude: number;
  priceRange: PriceRange;
  isOpenNow: boolean;
  statusLabel: string;
}

// Data Transfer Object: Kartu Feed Grid
export interface SpotListItemDTO {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  regency: Regency;
  district: string;
  signatureDish?: string;
  description?: string;
  bestTimeToVisit?: string;
  priceRange: PriceRange;
  coverImageUrl: string;
  latitude: number;
  longitude: number;
  googleMapsIntentUrl: string;
  instagramAccount?: string;
  lifecycleStatus: LifecycleStatus;
  isOpenNow: boolean;
  statusLabel: string;
  hasFridayPrayerBreak?: boolean;
  facilities: Facility[];
  vibeTags: string[];
  openingHours?: WeeklyOpeningHours;
}

// Data Transfer Object: Ulasan Detail Lengkap
export interface SpotDetailDTO extends SpotListItemDTO {
  description: string;
  bestTimeToVisit?: string;
  address: string;
  galleryImages: {
    id: string;
    imageUrl: string;
    altText?: string;
  }[];
  weeklySchedule: WeeklyOpeningHours;
  googleMapsReviewUrl?: string;
  logisticsNotice?: TransitLogisticsNotice;
}

// Parameter Filter URL
export interface SpotFilterParams {
  q?: string;
  category?: string;
  vibe?: string;
  regency?: Regency;
  district?: string;
  openNow?: boolean;
  view?: "list" | "map";
  spot?: string;
}

