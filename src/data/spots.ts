import {
  SpotCategory,
  SpotEntity,
  SpotTag,
  WeeklyOpeningHours,
} from "@/types/spot";

export const CATEGORIES: SpotCategory[] = [
  {
    id: "cat-1",
    name: "Kuliner Legendaris",
    slug: "kuliner-legendaris",
    description: "Sentra makanan autentik dan resep warisan lintas generasi.",
    displayOrder: 1,
  },
  {
    id: "cat-2",
    name: "Coffee & Work Space",
    slug: "coffee-workspace",
    description: "Kedai kopi kurasi, roastery lokal, dan spot ramah kerja.",
    displayOrder: 2,
  },
  {
    id: "cat-3",
    name: "Wisata Alam",
    slug: "wisata-alam",
    description: "Curug alami, sungai jernih, dan ketenangan pegunungan Petungkriyono.",
    displayOrder: 3,
  },
  {
    id: "cat-4",
    name: "Heritage & Batik",
    slug: "heritage-batik",
    description: "Museum, kampung batik bersejarah, dan studio kriya tradisional.",
    displayOrder: 4,
  },
];

export const VIBE_TAGS: SpotTag[] = [
  { id: "tag-1", name: "WFC Friendly", slug: "wfc-friendly" },
  { id: "tag-2", name: "Hawa Dingin", slug: "hawa-dingin" },
  { id: "tag-3", name: "Malam Hari", slug: "malam-hari" },
  { id: "tag-4", name: "Resep Warisan", slug: "resep-warisan" },
  { id: "tag-5", name: "Spot Senja", slug: "spot-senja" },
  { id: "tag-6", name: "Tenang", slug: "tenang" },
  { id: "tag-7", name: "Ramah Keluarga", slug: "ramah-keluarga" },
];

// Helper pembuat jadwal standar harian
function makeDailySchedule(
  open: string,
  close: string,
  closedDays: string[] = []
): WeeklyOpeningHours {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  const result = {} as WeeklyOpeningHours;

  for (const day of days) {
    if (closedDays.includes(day)) {
      result[day] = { slots: [], is_closed: true };
    } else {
      result[day] = {
        slots: [{ open, close }],
        is_closed: false,
      };
    }
  }

  return result;
}

// Jadwal khusus warung makan dengan jeda Sholat Jumat
function makeFoodScheduleWithFridayBreak(
  open: string,
  close: string
): WeeklyOpeningHours {
  const schedule = makeDailySchedule(open, close);
  // Khusus Jumat dibuat 2 slot: sebelum dan sesudah Sholat Jumat
  schedule.friday = {
    slots: [
      { open: open, close: "11:15" },
      { open: "13:00", close: close },
    ],
    is_closed: false,
  };
  schedule.notes = "Jumat tutup sejenak pukul 11:15 hingga 13:00 untuk ibadah Sholat Jumat";
  return schedule;
}

export const SPOTS_DATA: SpotEntity[] = [
  {
    id: "spot-01",
    name: "Soto Tauto H. Rochmani",
    slug: "soto-tauto-h-rochmani",
    categoryId: "cat-1",
    description:
      "Warung tauto legendaris di kawasan Pasar Senggol Sugihwaras yang telah melayani penikmat kuliner sejak 1970-an. Memadukan kuah kaldu daging sapi gurih dengan sambal tauco manis khas Pekalongan beraroma sedap.",
    signatureDish: "Tauto Daging Kuah Tauco Manis Pedas",
    bestTimeToVisit: "Pagi hari pukul 09:00 sebelum jam makan siang kantor",
    address: "Kawasan Sentra Kuliner Sugihwaras, Pekalongan Timur, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_timur",
    latitude: -6.8894,
    longitude: 109.6738,
    googleMapsUrl: "https://maps.google.com/?q=-6.8894,109.6738",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Soto+Tauto+H+Rochmani+Pekalongan",
    instagramAccount: "tautorochmani",
    priceRange: "terjangkau",
    openingHours: makeFoodScheduleWithFridayBreak("08:00", "16:30"),
    facilities: ["car_parking", "motorcycle_parking", "prayer_room"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "spot-02",
    name: "Kopi Tahlil Pantura PPIP",
    slug: "kopi-tahlil-pantura-ppip",
    categoryId: "cat-1",
    description:
      "Titik kumpul malam hari paling otentik di Pekalongan. Menyajikan kopi seduh rempah tradisional (kapulaga, cengkeh, jahe, kayu manis) ditemani aneka ketan lupis gula merah dan tempe goreng tepung hangat di pelataran bersejarah Gedung PPIP.",
    signatureDish: "Kopi Tahlil Rempah & Ketan Lupis Gula Merah",
    bestTimeToVisit: "Malam hari setelah Isya sekitar pukul 20:30",
    address: "Pelataran Gedung PPIP, Jl. Agus Salim, Sugihwaras, Pekalongan Timur",
    regency: "kota",
    district: "pekalongan_timur",
    latitude: -6.8925,
    longitude: 109.6761,
    googleMapsUrl: "https://maps.google.com/?q=-6.8925,109.6761",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Kopi+Tahlil+PPIP+Pekalongan",
    priceRange: "murah_meriah",
    // Buka malam hingga dini hari (shift lewat tengah malam)
    openingHours: makeDailySchedule("18:30", "02:30"),
    facilities: ["outdoor_smoking", "motorcycle_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-12T19:00:00Z",
    updatedAt: "2026-03-02T12:00:00Z",
  },
  {
    id: "spot-03",
    name: "Nasi Megono Ibu Entun",
    slug: "nasi-megono-ibu-entun",
    categoryId: "cat-1",
    description:
      "Warung nasi megono bersahaja di sudut Kraton Kidul. Cacahan nangka muda berbumbu kelapa parut dan kecombrang gurih yang disajikan hangat di atas daun pisang bersama petai bakar dan tempe mendoan panas.",
    signatureDish: "Nasi Megono Komplit Cumi Hitam & Mendoan",
    bestTimeToVisit: "Pukul 06:30 untuk sarapan sebelum kehabisan lauk cumi",
    address: "Jl. Teratai, Kraton Kidul, Pekalongan Barat, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_barat",
    latitude: -6.8852,
    longitude: 109.6645,
    googleMapsUrl: "https://maps.google.com/?q=-6.8852,109.6645",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Nasi+Megono+Ibu+Entun+Pekalongan",
    priceRange: "murah_meriah",
    openingHours: makeFoodScheduleWithFridayBreak("06:00", "13:00"),
    facilities: ["motorcycle_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: false,
    createdAt: "2026-01-15T06:00:00Z",
    updatedAt: "2026-03-05T08:00:00Z",
  },
  {
    id: "spot-04",
    name: "Garang Asem H. Masduki",
    slug: "garang-asem-h-masduki",
    categoryId: "cat-1",
    description:
      "Ikon kuliner legendaris dekat Alun-alun Pekalongan sejak tahun 1959. Daging sapi empuk dalam kuah kluwek berpadu belimbing wuluh segar yang dimasak dalam mangkuk tanah liat.",
    signatureDish: "Garang Asem Daging Kuah Asam Pedas",
    bestTimeToVisit: "Makan siang pukul 12:30",
    address: "Jl. Jenderal Sudirman No. 169, Kebulen, Pekalongan Barat",
    regency: "kota",
    district: "pekalongan_barat",
    latitude: -6.8908,
    longitude: 109.6702,
    googleMapsUrl: "https://maps.google.com/?q=-6.8908,109.6702",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Garang+Asem+H+Masduki+Pekalongan",
    instagramAccount: "garangasemmasduki",
    priceRange: "terjangkau",
    openingHours: makeDailySchedule("07:30", "21:00"),
    facilities: ["air_conditioned", "car_parking", "motorcycle_parking", "prayer_room"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-03-10T11:00:00Z",
  },
  {
    id: "spot-05",
    name: "Omah Kopi Petung",
    slug: "omah-kopi-petung",
    categoryId: "cat-2",
    description:
      "Kedai kopi pelopor pegunungan Petungkriyono di ketinggian 1.200 mdpl. Menikmati seduhan biji kopi arabika Petung hasil panen petani hutan lindung sambil memandang lereng hijau berkabut tebal.",
    signatureDish: "Manual Brew V60 Arabika Petung Honey Process",
    bestTimeToVisit: "Sore pukul 15:30 saat kabut mulai turun perlahan",
    address: "Desa Yosorejo, Kecamatan Petungkriyono, Kabupaten Pekalongan",
    regency: "kabupaten",
    district: "petungkriyono",
    latitude: -7.1512,
    longitude: 109.7345,
    googleMapsUrl: "https://maps.google.com/?q=-7.1512,109.7345",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Omah+Kopi+Petung+Petungkriyono+Pekalongan",
    instagramAccount: "omahkopipetung",
    priceRange: "terjangkau",
    openingHours: makeDailySchedule("09:00", "18:00"),
    facilities: ["scenic_view", "outdoor_smoking", "motorcycle_parking", "car_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-03-12T14:00:00Z",
  },
  {
    id: "spot-06",
    name: "Selasar Kauman Specialty Coffee",
    slug: "selasar-kauman-specialty-coffee",
    categoryId: "cat-2",
    description:
      "Roastery dan kafe ramah kerja di tengah lorong damai Kampung Batik Kauman. Menempati rumah bergaya Indies lawas dengan koneksi internet kencang dan meja kerja bercolokan stabil.",
    signatureDish: "Es Kopi Susu Aren Gula Jawa & Single Origin Filter",
    bestTimeToVisit: "Siang pukul 13:00 untuk sesi WFC fokus dan tenang",
    address: "Jl. Kauman Gang 3 No. 12, Pekalongan Barat, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_barat",
    latitude: -6.8876,
    longitude: 109.6682,
    googleMapsUrl: "https://maps.google.com/?q=-6.8876,109.6682",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Selasar+Kauman+Pekalongan",
    instagramAccount: "selasarkauman",
    priceRange: "terjangkau",
    openingHours: makeDailySchedule("08:30", "22:00"),
    facilities: ["wifi", "power_plug", "air_conditioned", "outdoor_smoking", "prayer_room"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-22T08:30:00Z",
    updatedAt: "2026-03-14T09:00:00Z",
  },
  {
    id: "spot-07",
    name: "Curug Bajing Petungkriyono",
    slug: "curug-bajing-petungkriyono",
    categoryId: "cat-3",
    description:
      "Air terjun megah bertingkat setinggi lebih dari 70 meter di jantung cagar alam Petungkriyono. Dikelilingi hutan hujan tropis yang lebat dan suara kicauan owa jawa liar yang menenangkan jiwa.",
    signatureDish: "Teh Hangat Daun Murbei & Mendoan Desa Telagapakis",
    bestTimeToVisit: "Pagi hari pukul 08:30 sebelum curah hujan siang hari",
    address: "Desa Telagapakis, Petungkriyono, Kabupaten Pekalongan",
    regency: "kabupaten",
    district: "petungkriyono",
    latitude: -7.1648,
    longitude: 109.7212,
    googleMapsUrl: "https://maps.google.com/?q=-7.1648,109.7212",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Curug+Bajing+Petungkriyono+Pekalongan",
    priceRange: "murah_meriah",
    openingHours: makeDailySchedule("07:30", "16:30"),
    facilities: ["scenic_view", "car_parking", "motorcycle_parking", "prayer_room"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-01-25T07:30:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "spot-08",
    name: "Welo River & Tubing",
    slug: "welo-river-and-tubing",
    categoryId: "cat-3",
    description:
      "Aliran sungai alami berair hijau zamrud jernih yang mengalir di antara celah tebing batu hitam. Destinasi favorit untuk berenang santai di kolam alami dan susur sungai berpemandu.",
    signatureDish: "Kelapa Muda Segar Petikan Kebun Warga",
    bestTimeToVisit: "Pukul 10:00 saat sinar matahari menembus dasar air bening",
    address: "Desa Kayupuring, Petungkriyono, Kabupaten Pekalongan",
    regency: "kabupaten",
    district: "petungkriyono",
    latitude: -7.1284,
    longitude: 109.7156,
    googleMapsUrl: "https://maps.google.com/?q=-7.1284,109.7156",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Welo+Asri+Petungkriyono+Pekalongan",
    priceRange: "murah_meriah",
    openingHours: makeDailySchedule("08:00", "16:00"),
    facilities: ["scenic_view", "motorcycle_parking", "car_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: false,
    createdAt: "2026-01-28T08:00:00Z",
    updatedAt: "2026-03-16T11:00:00Z",
  },
  {
    id: "spot-09",
    name: "Telaga Sigebyar Mangunan",
    slug: "telaga-sigebyar-mangunan",
    categoryId: "cat-3",
    description:
      "Telaga alami tenang di kaki tebing perbukitan Rogojembangan pada elevasi 1.500 mdpl. Airnya yang bening memantulkan panorama hutan pinus, sering diselimuti kabut tebal mistis yang damai.",
    signatureDish: "Kopi Hitam Jahe Seduh Desa Tlogohendro",
    bestTimeToVisit: "Pagi buta pukul 06:00 untuk menyaksikan kabut telaga",
    address: "Dusun Mangunan, Desa Tlogohendro, Petungkriyono, Kabupaten Pekalongan",
    regency: "kabupaten",
    district: "petungkriyono",
    latitude: -7.1721,
    longitude: 109.7423,
    googleMapsUrl: "https://maps.google.com/?q=-7.1721,109.7423",
    // googleMapsReviewUrl sengaja tidak dicantumkan karena merupakan hidden gem alami tersembunyi
    priceRange: "murah_meriah",
    openingHours: makeDailySchedule("06:30", "17:00"),
    facilities: ["scenic_view", "motorcycle_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: false,
    createdAt: "2026-02-01T06:30:00Z",
    updatedAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "spot-10",
    name: "Museum Batik Pekalongan",
    slug: "museum-batik-pekalongan",
    categoryId: "cat-4",
    description:
      "Gedung peninggalan era kolonial di kawasan cagar budaya Jetayu yang menyimpan lebih dari seribu koleksi kain batik kuno Nusantara, termasuk batik pesisir dengan pengaruh Eropa, Tionghoa, dan Jepang.",
    signatureDish: "Workshop Mencanting Batik di Pendopo Kerajinan",
    bestTimeToVisit: "Pukul 10:00 untuk tur edukasi bersama pemandu kurator",
    address: "Kawasan Budaya Jetayu No. 1, Pekalongan Utara, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_utara",
    latitude: -6.8835,
    longitude: 109.6755,
    googleMapsUrl: "https://maps.google.com/?q=-6.8835,109.6755",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Museum+Batik+Pekalongan",
    instagramAccount: "museumbatikpekalongan",
    priceRange: "murah_meriah",
    openingHours: makeDailySchedule("08:00", "15:00"),
    facilities: ["air_conditioned", "car_parking", "motorcycle_parking", "prayer_room"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "spot-11",
    name: "Kampung Batik Pesindon",
    slug: "kampung-batik-pesindon",
    categoryId: "cat-4",
    description:
      "Kampung kreatif tertata asri tempat tinggal para pengrajin batik cap dan tulis generasi ketiga. Lorong-lorong kampung dihiasi mural artistik bercerita tentang tradisi pewarnaan alami mori.",
    signatureDish: "Melihat Langsung Proses Cap Tembaga Malam Panas",
    bestTimeToVisit: "Sore pukul 16:00 sambil berjalan santai di lorong mural",
    address: "Kelurahan Pesindon, Pekalongan Barat, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_barat",
    latitude: -6.8867,
    longitude: 109.6612,
    googleMapsUrl: "https://maps.google.com/?q=-6.8867,109.6612",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Kampung+Batik+Pesindon+Pekalongan",
    instagramAccount: "kampungbatikpesindon",
    priceRange: "murah_meriah",
    openingHours: makeDailySchedule("08:00", "18:00"),
    facilities: ["motorcycle_parking", "scenic_view"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: false,
    createdAt: "2026-02-08T08:00:00Z",
    updatedAt: "2026-03-22T11:00:00Z",
  },
  {
    id: "spot-12",
    name: "Kampung Batik Kauman",
    slug: "kampung-batik-kauman",
    categoryId: "cat-4",
    description:
      "Kawasan bersejarah paling tua di Pekalongan tempat bermukimnya saudagar batik masa lampau. Rumah-rumah megah berarsitektur campuran Jawa dan kolonial masih berdiri kokoh dengan galeri batik eksklusif di dalamnya.",
    signatureDish: "Kain Batik Tulis Canting Motif Jlamprang & Buketan",
    bestTimeToVisit: "Pagi hari pukul 09:30 saat toko dan rumah batik mulai dibuka",
    address: "Kawasan Kauman, Pekalongan Barat, Kota Pekalongan",
    regency: "kota",
    district: "pekalongan_barat",
    latitude: -6.8889,
    longitude: 109.6675,
    googleMapsUrl: "https://maps.google.com/?q=-6.8889,109.6675",
    googleMapsReviewUrl: "https://www.google.com/maps/search/?api=1&query=Kampung+Batik+Kauman+Pekalongan",
    priceRange: "terjangkau",
    openingHours: makeDailySchedule("08:30", "17:00"),
    facilities: ["motorcycle_parking"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
    lifecycleStatus: "active",
    isVerified: true,
    isFeatured: true,
    createdAt: "2026-02-10T08:30:00Z",
    updatedAt: "2026-03-25T14:00:00Z",
  },
];

