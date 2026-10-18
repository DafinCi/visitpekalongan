const PEKALONGAN_CENTER = {
  lat: -6.95,
  lng: 109.6753,
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Menghitung jarak garis lurus (Great-Circle) antara dua titik koordinat
 * menggunakan rumus Haversine dalam satuan Kilometer.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Memformat angka kilometer menjadi teks yang ramah pengguna (misal: "650 m" atau "2.4 km").
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round((distanceKm * 1000) / 10) * 10);
    return `${meters} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

/**
 * Mengecek apakah posisi pengguna berada dalam radius wajar sekitar Pekalongan (~60 km)
 * agar kamera peta tidak terlempar keluar wilayah saat pengguna mengakses dari luar kota.
 */
export function isWithinPekalonganRegion(lat: number, lng: number): boolean {
  const distFromCenter = calculateDistanceKm(
    PEKALONGAN_CENTER.lat,
    PEKALONGAN_CENTER.lng,
    lat,
    lng
  );
  return distFromCenter <= 60;
}

