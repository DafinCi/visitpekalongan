import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getRecommendedSpots,
  searchSpotsSmart,
} from "../smart-search.ts";
import type { SpotDetailDTO, SpotListItemDTO } from "../../../types/spot.ts";

const mockSpots: SpotListItemDTO[] = [
  {
    id: "spot-1",
    name: "Tauto H. Rochmani",
    slug: "tauto-h-rochmani",
    categoryName: "Kuliner Legendaris",
    categorySlug: "kuliner-legendaris",
    regency: "kota",
    district: "pekalongan_barat",
    signatureDish: "Tauto Daging Kerbau & Usus Kering",
    description: "Warung soto tauto tauco legendaris sejak puluhan tahun di kawasan Pasar Senggol Kurinci.",
    priceRange: "murah_meriah",
    coverImageUrl: "/images/tauto.jpg",
    latitude: -6.889,
    longitude: 109.671,
    googleMapsIntentUrl: "https://maps.google.com/?q=-6.889,109.671",
    lifecycleStatus: "active",
    facilities: ["car_parking", "motorcycle_parking"],
    vibeTags: ["legendaris", "sarapan", "ramah-keluarga"],
  },
  {
    id: "spot-2",
    name: "Kopi Tahlil PPIP",
    slug: "kopi-tahlil-ppip",
    categoryName: "Coffee & Workspace",
    categorySlug: "coffee-workspace",
    regency: "kota",
    district: "pekalongan_timur",
    signatureDish: "Kopi Seduh Rempah Jahe Kapulaga",
    description: "Kedai kopi rempah tradisional yang buka hingga larut malam di Jalan Agus Salim.",
    priceRange: "murah_meriah",
    coverImageUrl: "/images/kopi-tahlil.jpg",
    latitude: -6.892,
    longitude: 109.678,
    googleMapsIntentUrl: "https://maps.google.com/?q=-6.892,109.678",
    lifecycleStatus: "active",
    facilities: ["outdoor_smoking", "motorcycle_parking"],
    vibeTags: ["ngopi-malam", "hangat", "merakyat"],
  },
  {
    id: "spot-3",
    name: "Ruang Teduh Coffee & Co",
    slug: "ruang-teduh-coffee",
    categoryName: "Coffee & Workspace",
    categorySlug: "coffee-workspace",
    regency: "kota",
    district: "pekalongan_barat",
    signatureDish: "Manual Brew & Croissant",
    description: "Kafe tenang dengan koneksi internet kencang dan banyak colokan listrik, cocok untuk nugas dan WFC.",
    priceRange: "terjangkau",
    coverImageUrl: "/images/ruang-teduh.jpg",
    latitude: -6.891,
    longitude: 109.673,
    googleMapsIntentUrl: "https://maps.google.com/?q=-6.891,109.673",
    lifecycleStatus: "active",
    facilities: ["wifi", "power_plug", "air_conditioned", "motorcycle_parking"],
    vibeTags: ["wfc", "tenang", "produktif"],
  },
  {
    id: "spot-4",
    name: "Curug Bajing Petungkriyono",
    slug: "curug-bajing-petungkriyono",
    categoryName: "Wisata Alam",
    categorySlug: "wisata-alam",
    regency: "kabupaten",
    district: "petungkriyono",
    signatureDish: "Tempe Mendoan Panas & Kopi Owa",
    description: "Air terjun alami di kawasan hutan lindung pegunungan Petungkriyono yang asri dan sejuk.",
    priceRange: "murah_meriah",
    coverImageUrl: "/images/curug-bajing.jpg",
    latitude: -7.145,
    longitude: 109.712,
    googleMapsIntentUrl: "https://maps.google.com/?q=-7.145,109.712",
    lifecycleStatus: "active",
    facilities: ["scenic_view", "car_parking", "motorcycle_parking", "prayer_room"],
    vibeTags: ["alam", "air-terjun", "sejuk", "healing"],
  },
  {
    id: "spot-5",
    name: "Museum Batik Pekalongan",
    slug: "museum-batik-pekalongan",
    categoryName: "Heritage & Batik",
    categorySlug: "heritage-batik",
    regency: "kota",
    district: "pekalongan_utara",
    signatureDish: "Koleksi Batik Tulis Pesisiran",
    description: "Pusat edukasi sejarah dan budaya batik Pekalongan di kawasan cagar budaya Jetayu.",
    priceRange: "terjangkau",
    coverImageUrl: "/images/museum-batik.jpg",
    latitude: -6.885,
    longitude: 109.676,
    googleMapsIntentUrl: "https://maps.google.com/?q=-6.885,109.676",
    lifecycleStatus: "active",
    facilities: ["air_conditioned", "car_parking", "prayer_room"],
    vibeTags: ["sejarah", "budaya", "edukasi"],
  },
];

describe("smart-search utility", () => {
  describe("searchSpotsSmart", () => {
    it("returns all spots when query is empty or only whitespace", () => {
      assert.equal(searchSpotsSmart(mockSpots, "").length, mockSpots.length);
      assert.equal(searchSpotsSmart(mockSpots, "   ").length, mockSpots.length);
    });

    it("prioritizes exact spot name matches", () => {
      const results = searchSpotsSmart(mockSpots, "Tauto H. Rochmani");
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "tauto-h-rochmani");
    });

    it("finds spot by signature dish name", () => {
      const results = searchSpotsSmart(mockSpots, "kopi rempah");
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "kopi-tahlil-ppip");
    });

    it("maps WFC / nugas intent to coffee workspace spots with wifi and power plugs", () => {
      const results = searchSpotsSmart(mockSpots, "tempat nugas laptopan");
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "ruang-teduh-coffee");
      assert.ok(results[0].facilities.includes("wifi"));
      assert.ok(results[0].facilities.includes("power_plug"));
    });

    it("maps nature and mountain intent to kabupaten natural attractions", () => {
      const results = searchSpotsSmart(mockSpots, "curug air terjun pemandangan");
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "curug-bajing-petungkriyono");
      assert.equal(results[0].regency, "kabupaten");
    });

    it("filters out conversational stopwords and focuses on meaningful keywords", () => {
      const results = searchSpotsSmart(
        mockSpots,
        "rekomendasi tempat kuliner soto tauto yang enak di daerah pekalongan"
      );
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "tauto-h-rochmani");
    });

    it("handles slight typographical errors with fuzzy matching", () => {
      // "patungkriono" (typo for petungkriyono)
      const results = searchSpotsSmart(mockSpots, "petungkriono");
      assert.ok(results.length > 0);
      assert.equal(results[0].slug, "curug-bajing-petungkriyono");
    });

    it("returns empty array when query does not match any spots", () => {
      const results = searchSpotsSmart(mockSpots, "pizza pasta spageti keju");
      assert.equal(results.length, 0);
    });
  });

  describe("getRecommendedSpots", () => {
    const currentSpotDetail: SpotDetailDTO = {
      ...mockSpots[2], // Ruang Teduh Coffee & Co (Coffee & Workspace, Pekalongan Barat, lat: -6.891, lng: 109.673)
      description: "Kafe tenang untuk nugas.",
      address: "Jl. Hayam Wuruk No. 12, Pekalongan",
      galleryImages: [],
      weeklySchedule: {} as any,
    };

    it("excludes the current spot itself from recommendations", () => {
      const recommendations = getRecommendedSpots(currentSpotDetail, mockSpots);
      assert.ok(
        recommendations.every((rec) => rec.spot.slug !== currentSpotDetail.slug)
      );
    });

    it("respects the custom limit parameter", () => {
      const recsLimit2 = getRecommendedSpots(currentSpotDetail, mockSpots, 2);
      assert.equal(recsLimit2.length, 2);

      const recsLimit1 = getRecommendedSpots(currentSpotDetail, mockSpots, 1);
      assert.equal(recsLimit1.length, 1);
    });

    it("prioritizes same-category spots with high proximity", () => {
      const recommendations = getRecommendedSpots(currentSpotDetail, mockSpots);
      assert.ok(recommendations.length > 0);

      // Kopi Tahlil PPIP is in the same category ("coffee-workspace") and within ~1 km
      const firstRec = recommendations[0];
      assert.equal(firstRec.spot.categorySlug, currentSpotDetail.categorySlug);
      assert.ok(firstRec.score > 35);
      assert.ok(firstRec.matchReason.length > 0);
      assert.ok(firstRec.distanceFormatted.length > 0);
    });

    it("generates contextual matchReason explaining why the spot was recommended", () => {
      const recommendations = getRecommendedSpots(currentSpotDetail, mockSpots);
      for (const rec of recommendations) {
        assert.ok(typeof rec.matchReason === "string");
        assert.ok(rec.matchReason.length > 5);
      }
    });
  });
});

