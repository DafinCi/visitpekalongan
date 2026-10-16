import { MapPin, Sparkles, Clock, ShieldCheck } from "lucide-react";

export function EditorialMasthead() {
  return (
    <section className="border-b border-border bg-surface/50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tag Penanda Sastra Editorial */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface border border-border-subtle rounded-badge text-[11px] font-semibold text-text-muted mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta" aria-hidden="true" />
            <span>Dokumentasi Budaya & Alam Pekalongan</span>
          </div>

          {/* Judul Masthead Utama */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight leading-[1.15] mb-4">
            Menemukan jejak rasa dan ketenangan tersembunyi.
          </h1>

          {/* Deskripsi Naratif Bersahaja */}
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-8 max-w-2xl">
            Panduan kurasi independen yang memetakan kedai kopi kurasi, kuliner legendaris
            berusia puluhan tahun, hingga sejuknya pegunungan Petungkriyono. Dirancang
            ringan dan jujur, tanpa sponsor komersial.
          </p>

          {/* Fakta Nyata Kurasi (C-5: Evidence Over Claims) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-accent-terracotta shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-text-primary">12 Lokasi</div>
                <div className="text-[11px] text-text-muted">Kota & Kabupaten</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-accent-roast shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-text-primary">Waktu Nyata</div>
                <div className="text-[11px] text-text-muted">Status Buka Otomatis</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-accent-sage shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-text-primary">4 Kategori</div>
                <div className="text-[11px] text-text-muted">Kuliner hingga Alam</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-status-open-text shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-text-primary">Kurasi Mandiri</div>
                <div className="text-[11px] text-text-muted">Bebas Iklan Berbayar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

