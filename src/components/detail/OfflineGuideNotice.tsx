import { AlertTriangle, Fuel, Banknote, SignalLow } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";

interface OfflineGuideNoticeProps {
  spot: SpotDetailDTO;
}

export function OfflineGuideNotice({ spot }: OfflineGuideNoticeProps) {
  // Hanya tampilkan jika berada di wilayah alam / pegunungan Petungkriyono
  const isHighlandOrNature =
    spot.regency === "kabupaten" &&
    (spot.categorySlug === "wisata-alam" || spot.district === "petungkriyono");

  if (!isHighlandOrNature) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="p-6 rounded-card bg-surface-pure border border-border border-l-4 border-l-accent-sage">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-accent-sage" aria-hidden="true" />
          <h2 className="font-display text-lg sm:text-xl text-text-primary">
            Panduan Akses & Sinyal Jalur Pegunungan
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
          Lokasi ini berada di dataran tinggi Petungkriyono. Mengingat kontur pegunungan tropis, perhatikan panduan praktis berikut sebelum memulai perjalanan:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-button bg-canvas border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <SignalLow className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
              <span>Sinyal & Peta Offline</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Unduh peta Google Maps area Petungkriyono secara offline sebelum melewati Pasar Doro.
            </p>
          </div>

          <div className="p-3 rounded-button bg-canvas border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <Fuel className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
              <span>Bahan Bakar Penuh</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Isi penuh tangki kendaraan di SPBU Doro. Setelah tanjakan hutan, hanya tersedia bensin eceran.
            </p>
          </div>

          <div className="p-3 rounded-button bg-canvas border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <Banknote className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
              <span>Siapkan Uang Tunai</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Sebagian warung lokal mengandalkan transaksi tunai karena sinyal internet QRIS tidak selalu stabil.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

