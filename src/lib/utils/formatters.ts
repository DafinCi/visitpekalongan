import { PriceRange, Regency } from "@/types/spot";

export function formatPriceRange(priceRange: PriceRange): string {
  switch (priceRange) {
    case "murah_meriah":
      return "< Rp 15rb";
    case "terjangkau":
      return "Rp 15rb - 35rb";
    case "kafe_spesial":
      return "> Rp 35rb";
    default:
      return "Terjangkau";
  }
}

export function formatRegency(regency: Regency): string {
  return regency === "kota" ? "Kota Pekalongan" : "Kabupaten Pekalongan";
}

export function formatDistrict(district: string): string {
  const map: Record<string, string> = {
    pekalongan_barat: "Pekalongan Barat",
    pekalongan_timur: "Pekalongan Timur",
    pekalongan_utara: "Pekalongan Utara",
    pekalongan_selatan: "Pekalongan Selatan",
    petungkriyono: "Petungkriyono",
    doro: "Doro",
    kajen: "Kajen",
    wiradesa: "Wiradesa",
    kedungwuni: "Kedungwuni",
    karanganyar: "Karanganyar",
    kesesi: "Kesesi",
  };

  return map[district] || district;
}

