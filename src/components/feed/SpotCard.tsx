"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, MapPin, Bookmark, Share2, Check } from "lucide-react";
import { SpotListItemDTO } from "@/types/spot";
import { formatDistrict, formatPriceRange, formatRegency } from "@/lib/utils/formatters";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface SpotCardProps {
  spot: SpotListItemDTO;
}

export function SpotCard({ spot }: SpotCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(spot.slug);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/spot/${spot.slug}`
      : `https://visitpekalongan.com/spot/${spot.slug}`;

    const shareData = {
      title: `${spot.name} - VisitPekalongan`,
      text: `Rekomendasi kurasi independen: ${spot.name} di Pekalongan.`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Abaikan jika dibatalkan pengguna
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback jika clipboard dilarang
      }
    }
  };

  return (
    <article className="group bg-surface border border-border hover:border-accent-terracotta/40 rounded-card overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col h-full">
      {/* Area Klik Detail: Foto + Teks Informasi */}
      <Link
        href={`/spot/${spot.slug}`}
        className="flex-1 flex flex-col focus-visible:outline-2 focus-visible:outline-border-focus"
      >
        {/* Kontainer Foto Rasio 4:3 */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-canvas">
          <Image
            src={spot.coverImageUrl}
            alt={`Suasana tempat di ${spot.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          />

          {/* Lencana Status Operasional (Sudut Kiri Atas) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
            <div
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-badge border backdrop-blur-xs flex items-center gap-1.5 ${
                spot.lifecycleStatus === "temporarily_closed"
                  ? "bg-surface/90 text-text-muted border-border"
                  : spot.isOpenNow
                  ? "bg-status-open-bg/95 text-status-open-text border-status-open-text/20"
                  : "bg-status-closed-bg/95 text-status-closed-text border-status-closed-text/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  spot.lifecycleStatus === "temporarily_closed"
                    ? "bg-text-muted"
                    : spot.isOpenNow
                    ? "bg-status-open-text"
                    : "bg-status-closed-text"
                }`}
                aria-hidden="true"
              />
              <span>{spot.statusLabel}</span>
            </div>
          </div>

          {/* Lencana Rentang Harga Lokal (Sudut Kanan Atas) */}
          <div className="absolute top-2.5 right-2.5 pointer-events-none">
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-surface/90 border border-border-subtle rounded-badge text-text-primary backdrop-blur-xs">
              {formatPriceRange(spot.priceRange)}
            </span>
          </div>
        </div>

        {/* Badan Teks Informasi */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Label Kategori & Wilayah */}
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span className="font-semibold text-accent-terracotta uppercase tracking-wider">
                {spot.categoryName}
              </span>
              <span className="text-text-subtle">
                {formatRegency(spot.regency)}
              </span>
            </div>

            {/* Nama Tempat */}
            <h3 className="font-serif text-xl sm:text-2xl text-text-primary tracking-tight leading-snug group-hover:text-accent-terracotta transition-colors">
              {spot.name}
            </h3>

            {/* Menu Khas (Signature Dish) */}
            {spot.signatureDish && (
              <p className="text-xs text-text-muted italic line-clamp-1 pt-0.5">
                {spot.signatureDish}
              </p>
            )}

            {/* Kecamatan */}
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="w-3.5 h-3.5 text-text-subtle shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">
                Kec. {formatDistrict(spot.district)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bilah Aksi Cepat Bawah Kartu */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
        {/* Tombol Rute Google Maps Native */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={`Buka rute navigasi Google Maps menuju ${spot.name}`}
        >
          <Navigation className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          <span>Rute</span>
        </a>

        {/* Aksi Cepat Kanan: Bagikan, Simpan/Bookmark, & Instagram */}
        <div className="flex items-center gap-1.5">
          {/* Tombol Bagikan Cepat */}
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center border border-border rounded-button bg-surface-pure hover:bg-canvas text-text-muted hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
            aria-label={copied ? `Tautan ${spot.name} tersalin` : `Bagikan tautan ${spot.name}`}
            title={copied ? "Tersalin!" : "Bagikan"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-status-open-text" aria-hidden="true" />
            ) : (
              <Share2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Tombol Simpan Offline / Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(spot.slug);
            }}
            className={`w-10 h-10 flex items-center justify-center border rounded-button transition-colors min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
              saved
                ? "bg-accent-terracotta/10 border-accent-terracotta/40 text-accent-terracotta"
                : "bg-surface-pure hover:bg-canvas border-border text-text-muted hover:text-text-primary"
            }`}
            aria-label={saved ? `Hapus ${spot.name} dari daftar tersimpan` : `Simpan ${spot.name} ke daftar offline`}
            aria-pressed={saved}
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? "fill-accent-terracotta text-accent-terracotta" : ""}`}
              aria-hidden="true"
            />
          </button>

          {/* Tautan Akun Instagram */}
          {spot.instagramAccount && (
            <a
              href={`https://instagram.com/${spot.instagramAccount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
              aria-label={`Kunjungi akun Instagram @${spot.instagramAccount}`}
            >
              <InstagramIcon className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
