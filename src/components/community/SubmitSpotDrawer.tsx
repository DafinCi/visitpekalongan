"use client";

import { useState, useEffect } from "react";
import { X, Plus, Sparkles, CheckCircle2, ShieldCheck, Send } from "lucide-react";

interface SubmitSpotFormData {
  name: string;
  category: string;
  regency: string;
  district: string;
  signature: string;
  reason: string;
  instagram: string;
}

const INITIAL_FORM: SubmitSpotFormData = {
  name: "",
  category: "kuliner-legendaris",
  regency: "kota",
  district: "",
  signature: "",
  reason: "",
  instagram: "",
};

export function SubmitSpotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SubmitSpotFormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  // Kunci scroll halaman ketika modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.signature.trim()) return;

    // Simulasi penyimpanan laporan lokal
    try {
      const existing = JSON.parse(localStorage.getItem("vp_community_submissions") || "[]");
      existing.push({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem("vp_community_submissions", JSON.stringify(existing));
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }

    setSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setFormData(INITIAL_FORM);
    }, 300);
  };

  return (
    <>
      {/* Tombol Pemicu di Antarmuka */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-terracotta bg-accent-terracotta/10 hover:bg-accent-terracotta/20 border border-accent-terracotta/20 rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
        aria-label="Buka formulir Lapor Hidden Gem"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Lapor Hidden Gem</span>
      </button>

      {/* Modal / Slide-over Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Latar Belakang Redup (Backdrop) */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel Konten Modal */}
          <div className="relative w-full max-w-lg bg-canvas border border-border rounded-card p-6 shadow-xl z-10 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-terracotta uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Kurasi Komunitas</span>
                </div>
                <h2 id="drawer-title" className="font-display text-2xl text-text-primary">
                  Lapor Hidden Gem Pekalongan
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1 text-text-muted hover:text-text-primary rounded-button hover:bg-surface-pure min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-border-focus"
                aria-label="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              /* State Sukses */
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-status-open-bg border border-accent-sage/30 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-accent-sage" />
                </div>
                <h3 className="font-display text-xl text-text-primary">
                  Laporan Berhasil Dicatat!
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Terima kasih atas rekomendasi autentik Anda. Tim kurator VisitPekalongan akan memverifikasi tempat ini secara independen tanpa sponsor.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-xs font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button transition-colors min-h-[44px]"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              /* Formulir Input */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Komitmen Kurasi */}
                <div className="flex items-start gap-2.5 p-3 rounded-button bg-surface-pure border border-border text-xs text-text-muted leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-accent-sage shrink-0 mt-0.5" />
                  <p>
                    VisitPekalongan menolak segala bentuk iklan berbayar. Kami hanya mendokumentasikan tempat dengan kualitas rasa autentik dan cerita nyata.
                  </p>
                </div>

                {/* Nama Tempat */}
                <div>
                  <label htmlFor="spot-name" className="block text-xs font-semibold text-text-primary mb-1">
                    Nama Tempat / Warung *
                  </label>
                  <input
                    id="spot-name"
                    type="text"
                    required
                    placeholder="Contoh: Kopi Tahlil Pantura PPIP"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
                  />
                </div>

                {/* Kategori & Teritori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="spot-cat" className="block text-xs font-semibold text-text-primary mb-1">
                      Kategori *
                    </label>
                    <select
                      id="spot-cat"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary focus:outline-none focus:border-accent-terracotta"
                    >
                      <option value="kuliner-legendaris">Kuliner Legendaris</option>
                      <option value="coffee-workspace">Coffee & Work Space</option>
                      <option value="wisata-alam">Wisata Alam</option>
                      <option value="heritage-batik">Heritage & Batik</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="spot-regency" className="block text-xs font-semibold text-text-primary mb-1">
                      Wilayah *
                    </label>
                    <select
                      id="spot-regency"
                      value={formData.regency}
                      onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary focus:outline-none focus:border-accent-terracotta"
                    >
                      <option value="kota">Kota Pekalongan</option>
                      <option value="kabupaten">Kabupaten Pekalongan</option>
                    </select>
                  </div>
                </div>

                {/* Kecamatan / Patokan Alamat */}
                <div>
                  <label htmlFor="spot-district" className="block text-xs font-semibold text-text-primary mb-1">
                    Kecamatan / Patokan Lokasi
                  </label>
                  <input
                    id="spot-district"
                    type="text"
                    placeholder="Contoh: Belakang Pasar Senggol Sugihwaras, Pekalongan Timur"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
                  />
                </div>

                {/* Hidangan / Daya Tarik Utama */}
                <div>
                  <label htmlFor="spot-signature" className="block text-xs font-semibold text-text-primary mb-1">
                    Menu Wajib Coba / Daya Tarik Utama *
                  </label>
                  <input
                    id="spot-signature"
                    type="text"
                    required
                    placeholder="Contoh: Nasi Megono Cumi Hitam & Kopi Jahe"
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
                  />
                </div>

                {/* Alasan Kenapa Istimewa */}
                <div>
                  <label htmlFor="spot-reason" className="block text-xs font-semibold text-text-primary mb-1">
                    Kenapa Tempat Ini Wajib Masuk Kurasi?
                  </label>
                  <textarea
                    id="spot-reason"
                    rows={3}
                    placeholder="Ceritakan rasa, resep turun-temurun, atau suasana uniknya..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
                  />
                </div>

                {/* Akun Instagram (Opsional) */}
                <div>
                  <label htmlFor="spot-instagram" className="block text-xs font-semibold text-text-primary mb-1">
                    Akun Instagram Tempat (Opsional)
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-canvas border border-r-0 border-border rounded-l-button text-xs text-text-muted">
                      @
                    </span>
                    <input
                      id="spot-instagram"
                      type="text"
                      placeholder="namatempat"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, "") })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-pure border border-border rounded-r-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
                    >
                    </input>
                  </div>
                </div>

                {/* Tombol Kirim */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Kurator</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

