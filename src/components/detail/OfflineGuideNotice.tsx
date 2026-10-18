import { AlertTriangle, Fuel, Banknote, SignalLow, Compass } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";

interface OfflineGuideNoticeProps {
  spot: SpotDetailDTO;
}

export function OfflineGuideNotice({ spot }: OfflineGuideNoticeProps) {
  // Hanya tampilkan jika berada di wilayah alam / pegunungan Petungkriyono atau memiliki logisticsNotice eksplisit
  const isHighlandOrNature =
    Boolean(spot.logisticsNotice) ||
    (spot.regency === "kabupaten" &&
      (spot.categorySlug === "wisata-alam" || spot.district === "petungkriyono"));

  if (!isHighlandOrNature) {
    return null;
  }

  const notice = spot.logisticsNotice;
  const fuelName = notice?.lastFuelStation?.name || "SPBU 44.511.08 Doro";
  const fuelDist = notice?.lastFuelStation?.distanceKm ? ` (${notice.lastFuelStation.distanceKm} km dari titik ini)` : "";
  const signalCheckpoint = notice?.cellularSignal?.checkpoint || "Pasar Doro";
  const provider = notice?.cellularSignal?.recommendedProvider || "Telkomsel";

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="p-6 rounded-card bg-surface-pure border border-border border-l-4 border-l-accent-sage">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-accent-sage shrink-0" aria-hidden="true" />
          <h2 className="font-display text-lg sm:text-xl text-text-primary">
            Panduan Logistik & Sinyal Jalur Petungkriyono
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
          Kawasan pegunungan Petungkriyono berada di koridor hutan lindung dengan keterbatasan fasilitas umum. Perhatikan titik logistik riil berikut sebelum menanjak:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Titik SPBU Riil */}
          <div className="p-3.5 rounded-button bg-canvas border border-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
                <Fuel className="w-3.5 h-3.5 text-accent-terracotta shrink-0" aria-hidden="true" />
                <span>SPBU Terakhir: {fuelName}</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                {notice?.lastFuelStation?.advice ||
                  `Isi penuh tangki di Doro${fuelDist}. Setelah tanjakan gerbang hutan, tidak ada SPBU resmi lagi, hanya bensin eceran warga.`}
              </p>
            </div>
          </div>

          {/* Sinyal & Peta Offline */}
          <div className="p-3.5 rounded-button bg-canvas border border-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
                <SignalLow className="w-3.5 h-3.5 text-accent-terracotta shrink-0" aria-hidden="true" />
                <span>Titik 4G Terakhir: {signalCheckpoint}</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                {notice?.cellularSignal?.advice ||
                  `Sinyal 4G stabil seluruh operator berakhir di Doro. Di pegunungan hanya ${provider} yang sesekali aktif, sementara dasar lembah curug adalah area blank spot total.`}
              </p>
            </div>
          </div>

          {/* Uang Tunai & Persiapan Jalan */}
          <div className="p-3.5 rounded-button bg-canvas border border-border space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
                <Banknote className="w-3.5 h-3.5 text-accent-terracotta shrink-0" aria-hidden="true" />
                <span>Siapkan Uang Tunai di Doro</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                {notice?.cashAdvice ||
                  "Tarik tunai di ATM Pasar Doro. Retribusi tiket curug dan warung kopi warga mengutamakan tunai karena sinyal QRIS tidak selalu terhubung."}
              </p>
            </div>
          </div>
        </div>

        {/* Catatan Keselamatan Jalan */}
        <div className="mt-3 pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-text-muted">
          <Compass className="w-3.5 h-3.5 text-accent-terracotta shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            {notice?.roadAdvice ||
              "Kondisi Jalan: Jalur aspal menanjak dan berliku sempit. Pastikan kampas rem dan pendingin kendaraan dalam kondisi prima. Hindari berkendara malam hari karena minim penerangan jalan umum dan sering berkabut lebat."}
          </p>
        </div>
      </div>
    </section>
  );
}
