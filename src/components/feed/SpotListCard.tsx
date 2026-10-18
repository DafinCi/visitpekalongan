"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, MapPin, Bookmark, Share2, Check } from "lucide-react";
import { SpotListItemDTO } from "@/types/spot";
import { formatDistrict, formatPriceRange, formatRegency } from "@/lib/utils/formatters";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

interface SpotListCardProps {
  spot: SpotListItemDTO;
}

export function SpotListCard({ spot }: SpotListCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(spot.slug);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl =
      typeof window !== "undefined"
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
        // Fallback jika clipboard tidak diizinkan
      }
    }
  };

  return (
    <article className="group bg-surface border border-border hover:border-accent-terracotta/40 rounded-card p-3 sm:p-4 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 sm:gap-4">
      {/* Area Klik Detail: Foto + Teks Informasi */}
      <Link
        href={`/spot/${spot.slug}`}
        className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 focus-visible:outline-2 focus-visible:outline-border-focus rounded-button"
      >
        {/* Thumbnail Foto Kotak */}
        <div className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-canvas shrink-0">
          <Image
            src={spot.coverImageUrl}
            alt={`Foto suasana ${spot.name}`}
            fill
            sizes="(max-width: 640px) 90px, 112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Dot Status Operasional Mini pada Thumbnail */}
          <div className="absolute top-1.5 left-1.5 sm:hidden">
            <span
              className={`block w-2.5 h-2.5 rounded-full border border-canvas shadow-xs ${
                spot.lifecycleStatus === "temporarily_closed"
                  ? "bg-text-muted"
                  : spot.isOpenNow
                  ? "bg-status-open-text"
                  : "bg-status-closed-text"
              }`}
              title={spot.statusLabel}
            />
          </div>
        </div>

        {/* Konten Teks Informasi */}
        <div className="flex-1 min-w-0 py-0.5 space-y-1">
          {/* Label Kategori & Wilayah */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-text-muted">
            <span className="font-semibold text-accent-terracotta uppercase tracking-wider truncate">
              {spot.categoryName}
            </span>
            <span className="text-text-subtle">•</span>
            <span className="text-text-subtle truncate">
              {formatRegency(spot.regency)}
            </span>
          </div>

          {/* Nama Tempat */}
          <h3 className="font-serif text-base sm:text-lg text-text-primary tracking-tight leading-snug truncate group-hover:text-accent-terracotta transition-colors font-medium">
            {spot.name}
          </h3>

          {/* Menu Khas / Daya Tarik Utama */}
          {spot.signatureDish && (
            <p className="text-xs text-text-muted italic truncate">
              {spot.signatureDish}
            </p>
          )}

          {/* Baris Meta: Status, Kecamatan, & Rentang Harga */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 text-xs text-text-muted">
            {/* Lencana Status Operasional di Desktop */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-badge border ${
                spot.lifecycleStatus === "temporarily_closed"
                  ? "bg-surface text-text-muted border-border"
                  : spot.isOpenNow
                  ? "bg-status-open-bg text-status-open-text border-status-open-text/20"
                  : "bg-status-closed-bg text-status-closed-text border-status-closed-text/20"
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

            {/* Kecamatan */}
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <MapPin className="w-3 h-3 text-text-subtle shrink-0" aria-hidden="true" />
              <span className="truncate">Kec. {formatDistrict(spot.district)}</span>
            </div>

            {/* Rentang Harga */}
            <span className="text-[11px] font-medium text-text-primary bg-canvas px-1.5 py-0.5 rounded border border-border-subtle">
              {formatPriceRange(spot.priceRange)}
            </span>
          </div>
        </div>
      </Link>

      {/* Bilah Tombol Aksi Cepat Sisi Kanan */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1 border-l border-border/50">
        {/* Tombol Rute Maps */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3 text-xs font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={`Buka rute navigasi menuju ${spot.name}`}
          title="Buka Rute"
        >
          <Navigation className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          <span className="hidden md:inline">Rute</span>
        </a>

        {/* Tombol Bagikan */}
        <button
          type="button"
          onClick={handleShare}
          className="w-10 h-10 hidden sm:flex items-center justify-center border border-border rounded-button bg-surface-pure hover:bg-canvas text-text-muted hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={copied ? `Tautan ${spot.name} tersalin` : `Bagikan tautan ${spot.name}`}
          title={copied ? "Tersalin!" : "Bagikan"}
        >
          {copied ? (
            <Check className="w-4 h-4 text-status-open-text" aria-hidden="true" />
          ) : (
            <Share2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* Tombol Simpan / Bookmark */}
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
          title={saved ? "Tersimpan" : "Simpan"}
        >
          <Bookmark
            className={`w-4 h-4 ${saved ? "fill-accent-terracotta text-accent-terracotta" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

