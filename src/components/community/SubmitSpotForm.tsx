"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, ArrowLeft, RefreshCw } from "lucide-react";

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

const CATEGORY_OPTIONS = [
  {
    id: "kuliner-legendaris",
    label: "Kuliner Legendaris",
    desc: "Tauto, megono, garang asem, kopi rempah",
  },
  {
    id: "coffee-workspace",
    label: "Coffee & Work Space",
    desc: "Kedai kopi tenang, roastery, spot ramah kerja",
  },
  {
    id: "wisata-alam",
    label: "Wisata Alam",
    desc: "Curug alami, telaga, sungai Petungkriyono",
  },
  {
    id: "heritage-batik",
    label: "Heritage & Batik",
    desc: "Kampung batik, studio kriya, museum bersejarah",
  },
];

export function SubmitSpotForm() {
  const [formData, setFormData] = useState<SubmitSpotFormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Simpan riwayat submission ke local storage jika diperlukan
    try {
      const existing = JSON.parse(
        localStorage.getItem("vp_spot_submissions") || "[]",
      );
      existing.push({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem("vp_spot_submissions", JSON.stringify(existing));
    } catch {
      // Abaikan jika storage penuh atau dinonaktifkan
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="p-8 sm:p-10 rounded-card bg-surface-pure border border-border text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-status-open-bg border border-accent-sage/30 mx-auto flex items-center justify-center">
          <CheckCircle2
            className="w-8 h-8 text-accent-sage"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary tracking-tight">
            Laporan Rekomendasi Telah Diterima!
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
            Matur nuwun atas kontribusi Anda mendokumentasikan tempat autentik
            di Pekalongan. Tim kurator VisitPekalongan akan memverifikasi tempat
            ini secara mandiri tanpa pungutan biaya kepada pemilik.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-xs transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-text-primary bg-surface hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
            <span>Kirim Rekomendasi Lain</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-card bg-surface-pure border border-border space-y-6 shadow-xs"
    >
      {/* 1. Nama Tempat */}
      <div className="space-y-1.5">
        <label
          htmlFor="spot-name"
          className="block text-xs sm:text-sm font-semibold text-text-primary"
        >
          Nama Tempat atau Warung{" "}
          <span className="text-accent-terracotta">*</span>
        </label>
        <input
          id="spot-name"
          type="text"
          required
          placeholder="Contoh: Soto Tauto H. Rochmani"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta"
        />
      </div>

      {/* 2. Kategori Kurasi */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-semibold text-text-primary">
          Kategori Kurasi <span className="text-accent-terracotta">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = formData.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`p-3 rounded-button border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent-terracotta/10 border-accent-terracotta shadow-xs"
                    : "bg-canvas border-border hover:border-border-focus/50"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${isSelected ? "text-accent-terracotta" : "text-text-primary"}`}
                >
                  {cat.label}
                </span>
                <span className="text-[11px] text-text-muted leading-tight mt-1">
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Wilayah & Patokan Lokasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="spot-regency"
            className="block text-xs sm:text-sm font-semibold text-text-primary"
          >
            Wilayah Administrasi{" "}
            <span className="text-accent-terracotta">*</span>
          </label>
          <select
            id="spot-regency"
            value={formData.regency}
            onChange={(e) =>
              setFormData({ ...formData, regency: e.target.value })
            }
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-button text-text-primary focus:outline-none focus:border-accent-terracotta"
          >
            <option value="kota">
              Kota Pekalongan (Pesisir & Sentra Batik)
            </option>
            <option value="kabupaten">
              Kabupaten Pekalongan (Pegunungan & Alam)
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="spot-district"
            className="block text-xs sm:text-sm font-semibold text-text-primary"
          >
            Kecamatan atau Patokan Lokasi
          </label>
          <input
            id="spot-district"
            type="text"
            placeholder="Contoh: Kraton Kidul / Petungkriyono"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
          />
        </div>
      </div>

      {/* 4. Menu Khas / Daya Tarik Utama */}
      <div className="space-y-1.5">
        <label
          htmlFor="spot-signature"
          className="block text-xs sm:text-sm font-semibold text-text-primary"
        >
          Menu Andalan atau Daya Tarik Utama
        </label>
        <input
          id="spot-signature"
          type="text"
          placeholder="Contoh: Megono Cumi Hitam / Kopi Robusta"
          value={formData.signature}
          onChange={(e) =>
            setFormData({ ...formData, signature: e.target.value })
          }
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
        />
      </div>

      {/* 5. Cerita & Alasan Mengapa Wajib Masuk Kurasi */}
      <div className="space-y-1.5">
        <label
          htmlFor="spot-reason"
          className="block text-xs sm:text-sm font-semibold text-text-primary"
        >
          Cerita atau Alasan Rekomendasi
        </label>
        <textarea
          id="spot-reason"
          rows={3}
          placeholder="Ceritakan keunikan rasa, suasana, atau alasan tempat ini istimewa..."
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta leading-relaxed"
        />
      </div>

      {/* 6. Akun Instagram / Kontak (Opsional) */}
      <div className="space-y-1.5">
        <label
          htmlFor="spot-ig"
          className="block text-xs sm:text-sm font-semibold text-text-primary"
        >
          Akun Instagram (Opsional)
        </label>
        <div className="flex rounded-button overflow-hidden">
          <span className="inline-flex items-center px-3 text-xs sm:text-sm text-text-muted bg-surface border border-r-0 border-border select-none">
            @
          </span>
          <input
            id="spot-ig"
            type="text"
            placeholder="namatempat"
            value={formData.instagram}
            onChange={(e) =>
              setFormData({
                ...formData,
                instagram: e.target.value.replace(/^@/, ""),
              })
            }
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-r-button text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-terracotta"
          />
        </div>
      </div>

      {/* Tombol Kirim */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-xs transition-colors min-h-[48px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>Kirim Rekomendasi ke Tim Kurator</span>
        </button>
      </div>
    </form>
  );
}
