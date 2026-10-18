import {
  Facility,
  PriceRange,
  Regency,
  SpotDetailDTO,
  SpotListItemDTO,
} from "@/types/spot";
import { calculateDistanceKm, formatDistance } from "./geolocation";
import { formatDistrict } from "./formatters";

const STOPWORDS = new Set([
  "tempat",
  "spot",
  "warung",
  "kedai",
  "yang",
  "di",
  "ke",
  "dari",
  "ada",
  "buat",
  "untuk",
  "dengan",
  "dekat",
  "sekitar",
  "cari",
  "rekomendasi",
  "paling",
  "enak",
  "bagus",
  "nyaman",
  "daerah",
  "wilayah",
  "dan",
  "atau",
  "nya",
]);

interface IntentRule {
  keywords: string[];
  facilities?: Facility[];
  categories?: string[];
  regency?: Regency;
  priceRanges?: PriceRange[];
  expandedTerms?: string[];
}

const INTENT_RULES: IntentRule[] = [
  {
    keywords: ["nugas", "kerja", "wfc", "laptop", "laptopan", "meeting", "fokus", "produktif"],
    facilities: ["wifi", "power_plug"],
    categories: ["coffee-workspace"],
    expandedTerms: ["kerja", "wifi", "colokan", "tenang"],
  },
  {
    keywords: ["wifi", "internet", "online"],
    facilities: ["wifi"],
  },
  {
    keywords: ["colokan", "listrik", "cas", "charger", "baterai"],
    facilities: ["power_plug"],
  },
  {
    keywords: ["ac", "adem", "dingin", "ngadem", "sejuk"],
    facilities: ["air_conditioned", "scenic_view"],
    expandedTerms: ["dingin", "sejuk", "pegunungan", "ac"],
  },
  {
    keywords: ["rokok", "merokok", "smoking", "outdoor", "teras", "santai"],
    facilities: ["outdoor_smoking"],
  },
  {
    keywords: ["mushola", "musala", "sholat", "salat", "ibadah", "masjid"],
    facilities: ["prayer_room"],
  },
  {
    keywords: ["mobil", "parkir", "rombongan", "keluarga"],
    facilities: ["car_parking"],
    expandedTerms: ["keluarga", "luas"],
  },
  {
    keywords: ["motor"],
    facilities: ["motorcycle_parking"],
  },
  {
    keywords: ["alam", "gunung", "pegunungan", "hutan", "curug", "curuk", "air", "terjun", "sungai", "pemandangan", "view", "kabut", "asri"],
    facilities: ["scenic_view"],
    categories: ["wisata-alam"],
    regency: "kabupaten",
    expandedTerms: ["curug", "petungkriyono", "alam", "hutan", "sungai"],
  },
  {
    keywords: ["kopi", "ngopi", "kafe", "cafe", "coffee", "nongkrong", "espresso", "latte", "manual", "roastery", "tahlil"],
    categories: ["coffee-workspace"],
    expandedTerms: ["kopi", "kafe", "roastery"],
  },
  {
    keywords: ["makan", "kuliner", "sarapan", "siang", "malam", "lapar", "tauto", "soto", "megono", "megana", "garang", "asem", "pindang", "tetel", "nasi", "legendaris"],
    categories: ["kuliner-legendaris"],
    expandedTerms: ["tauto", "megono", "kuliner", "soto"],
  },
  {
    keywords: ["batik", "museum", "sejarah", "budaya", "heritage", "kampung", "kriya", "tulis", "cap", "kauman", "pesindon"],
    categories: ["heritage-batik"],
    expandedTerms: ["batik", "sejarah", "kampung", "museum"],
  },
  {
    keywords: ["murah", "hemat", "merakyat", "terjangkau", "ekonomis"],
    priceRanges: ["murah_meriah", "terjangkau"],
  },
  {
    keywords: ["buka", "sekarang", "ready"],
    expandedTerms: ["buka"],
  },
];

/**
 * Menghitung jarak Levenshtein sederhana untuk mendeteksi typo ringan (1-2 huruf)
 */
function levenshteinDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function isFuzzyMatch(token: string, targetText: string): boolean {
  if (token.length < 4) return false;
  const maxDist = token.length >= 7 ? 2 : 1;
  const words = targetText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  return words.some((word) => {
    if (word.startsWith(token) || token.startsWith(word)) return true;
    return levenshteinDistance(token, word) <= maxDist;
  });
}

/**
 * Mesin Pencarian Pintar (Smart Search):
 * Mendukung bahasa alami, multi-kata, kamus sinonim niat lokal, dan toleransi salah ketik (typo).
 */
export function searchSpotsSmart(
  spots: SpotListItemDTO[],
  rawQuery: string
): SpotListItemDTO[] {
  const cleanQuery = rawQuery.toLowerCase().trim();
  if (!cleanQuery) return spots;

  // 1. Jika frasa utuh langsung cocok, beri prioritas utama
  const rawTokens = cleanQuery
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Pisahkan stopwords namun jika semua kata adalah stopwords, gunakan rawTokens
  const meaningfulTokens = rawTokens.filter((t) => !STOPWORDS.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  const scoredSpots = spots.map((spot) => {
    let totalScore = 0;
    let matchedTokenCount = 0;

    const nameLower = spot.name.toLowerCase();
    const dishLower = (spot.signatureDish || "").toLowerCase();
    const districtLower = spot.district.toLowerCase();
    const regencyText =
      spot.regency === "kota"
        ? "kota pekalongan pesisir"
        : "kabupaten pekalongan petungkriyono kajen";
    const categoryLower = `${spot.categoryName} ${spot.categorySlug}`.toLowerCase();
    const descLower = `${spot.description || ""} ${spot.bestTimeToVisit || ""}`.toLowerCase();
    const combinedSearchable = `${nameLower} ${dishLower} ${districtLower} ${regencyText} ${categoryLower} ${descLower}`;

    // Bonus jika frasa lengkap cocok langsung
    if (nameLower.includes(cleanQuery)) {
      totalScore += 30;
    } else if (dishLower.includes(cleanQuery) || districtLower.includes(cleanQuery)) {
      totalScore += 20;
    }

    for (const token of tokens) {
      let tokenScore = 0;

      // A. Pencocokan Kolom Utama (Exact / Substring)
      if (nameLower.includes(token)) {
        tokenScore += 12;
      }
      if (dishLower.includes(token)) {
        tokenScore += 10;
      }
      if (districtLower.includes(token) || regencyText.includes(token)) {
        tokenScore += 8;
      }
      if (categoryLower.includes(token)) {
        tokenScore += 7;
      }
      if (descLower.includes(token)) {
        tokenScore += 5;
      }

      // B. Pencocokan Niat & Sinonim Lokal (Intent Expansion)
      for (const rule of INTENT_RULES) {
        const matchesIntentKeyword = rule.keywords.some(
          (k) => k === token || (token.length >= 4 && k.startsWith(token))
        );
        if (matchesIntentKeyword) {
          if (
            rule.facilities &&
            rule.facilities.some((f) => spot.facilities.includes(f))
          ) {
            // Bonus ekstra jika cocok semua fasilitas (misal Wi-Fi + Colokan untuk WFC)
            const matchedFacCount = rule.facilities.filter((f) =>
              spot.facilities.includes(f)
            ).length;
            tokenScore += matchedFacCount * 5;
          }
          if (
            rule.categories &&
            rule.categories.includes(spot.categorySlug)
          ) {
            tokenScore += 7;
          }
          if (rule.regency && spot.regency === rule.regency) {
            tokenScore += 5;
          }
          if (
            rule.priceRanges &&
            rule.priceRanges.includes(spot.priceRange)
          ) {
            tokenScore += 6;
          }
          if (
            rule.expandedTerms &&
            rule.expandedTerms.some((term) => combinedSearchable.includes(term))
          ) {
            tokenScore += 4;
          }
        }
      }

      // C. Toleransi Salah Ketik (Fuzzy Match) jika belum cocok langsung
      if (tokenScore === 0 && isFuzzyMatch(token, combinedSearchable)) {
        tokenScore += 4;
      }

      if (tokenScore > 0) {
        matchedTokenCount += 1;
        totalScore += tokenScore;
      }
    }

    // Untuk kalimat multi-kata, pastikan mayoritas kata kunci bermakna terpenuhi
    const minRequiredMatches =
      tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.6);

    const isRelevant = matchedTokenCount >= minRequiredMatches && totalScore > 0;

    return {
      spot,
      score: isRelevant ? totalScore : 0,
    };
  });

  return scoredSpots
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.spot);
}

export interface RecommendedSpotDTO {
  spot: SpotListItemDTO;
  matchReason: string;
  distanceFormatted: string;
  score: number;
}

/**
 * Mesin Rekomendasi Pintar (Multi-Factor Similarity & Proximity Engine):
 * Menghitung kemiripan berdasarkan kategori, kedekatan geografis (Haversine),
 * irisan fasilitas (Jaccard), dan kesetaraan harga, lengkap dengan alasan rekomendasi.
 */
export function getRecommendedSpots(
  currentSpot: SpotDetailDTO,
  allSpots: SpotListItemDTO[],
  limit = 3
): RecommendedSpotDTO[] {
  const candidates = allSpots.filter((s) => s.slug !== currentSpot.slug);

  const scored = candidates.map((candidate) => {
    let score = 0;

    // 1. Kesamaan Kategori (Bobot Utama: +35 poin)
    const isSameCategory = candidate.categorySlug === currentSpot.categorySlug;
    if (isSameCategory) {
      score += 35;
    }

    // 2. Kedekatan Jarak Geografis / Haversine (Maks +25 poin)
    const distanceKm = calculateDistanceKm(
      currentSpot.latitude,
      currentSpot.longitude,
      candidate.latitude,
      candidate.longitude
    );
    const distanceFormatted = formatDistance(distanceKm);

    if (distanceKm <= 2.5) {
      score += 25;
    } else if (distanceKm <= 6) {
      score += 18;
    } else if (distanceKm <= 15) {
      score += 10;
    } else if (candidate.regency === currentSpot.regency) {
      score += 6;
    }

    // 3. Kemiripan Fasilitas / Jaccard Overlap (Maks +25 poin)
    const sharedFacilities = candidate.facilities.filter((f) =>
      currentSpot.facilities.includes(f)
    );
    const unionSize = new Set([
      ...currentSpot.facilities,
      ...candidate.facilities,
    ]).size;
    if (unionSize > 0) {
      score += Math.round((sharedFacilities.length / unionSize) * 25);
    }

    // 4. Kesamaan Rentang Harga & Jam Buka (Maks +15 poin)
    if (candidate.priceRange === currentSpot.priceRange) {
      score += 10;
    }
    if (candidate.isOpenNow) {
      score += 5;
    }

    // Susun Alasan Rekomendasi yang Jelas & Informatif bagi Pengguna
    let matchReason = "";
    const hasWfcBoth =
      sharedFacilities.includes("wifi") &&
      sharedFacilities.includes("power_plug");

    if (isSameCategory && distanceKm <= 3.5) {
      matchReason = `${candidate.categoryName} terdekat (${distanceFormatted} dari sini)`;
    } else if (hasWfcBoth && isSameCategory) {
      matchReason = `Sama-sama ramah WFC (Wi-Fi & Colokan)`;
    } else if (
      candidate.district.toLowerCase() === currentSpot.district.toLowerCase()
    ) {
      matchReason = `Satu kawasan di Kec. ${formatDistrict(candidate.district)} (${distanceFormatted})`;
    } else if (isSameCategory) {
      matchReason = `${candidate.categoryName} serupa (${distanceFormatted})`;
    } else if (distanceKm <= 4) {
      matchReason = `Searah rute perjalanan (${distanceFormatted} dari sini)`;
    } else {
      matchReason = `Pilihan populer di ${
        candidate.regency === "kota" ? "Kota Pekalongan" : "Kabupaten Pekalongan"
      }`;
    }

    return {
      spot: candidate,
      matchReason,
      distanceFormatted,
      score,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

