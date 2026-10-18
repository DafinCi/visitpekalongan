"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Navigation,
  MapPin,
  Bookmark,
  Share2,
  Check,
  MoreVertical,
  Copy,
} from "lucide-react";
import { SpotListItemDTO } from "@/types/spot";
import { formatDistrict, formatPriceRange, formatRegency } from "@/lib/utils/formatters";
import { formatOpenStatus } from "@/lib/utils/opening-hours";
import { useOpenStatus } from "@/lib/hooks/useOpenStatus";
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

interface SpotListCardProps {
  spot: SpotListItemDTO;
  eager?: boolean;
}

export function SpotListCard({ spot, eager = false }: SpotListCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const openStatus = useOpenStatus(
    spot.openingHours,
    spot.lifecycleStatus,
    spot.hasFridayPrayerBreak
  );
  const statusCopy = openStatus ? formatOpenStatus(openStatus) : null;
  const isOpen = openStatus?.isOpenNow ?? false;
  const isTemporarilyClosed = spot.lifecycleStatus === "temporarily_closed";
  const saved = isBookmarked(spot.slug);
  const [copied, setCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Tutup menu titik tiga jika klik di luar atau tekan tombol ESC
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

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

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        const fullAddress = spot.address
          ? `${spot.name}, ${spot.address}`
          : `${spot.name}, Kec. ${formatDistrict(spot.district)}, ${formatRegency(spot.regency)}`;
        await navigator.clipboard.writeText(fullAddress);
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 2000);
      } catch {
        // Fallback jika clipboard dilarang
      }
    }
  };

  return (
    <article className="group bg-surface border border-border hover:border-accent-terracotta/40 rounded-card p-3 sm:p-4 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 sm:gap-4 relative">
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
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

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
            {statusCopy && (
              <div
                className={`inline-flex max-w-full items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-badge border ${
                  isTemporarilyClosed
                    ? "bg-surface text-text-muted border-border"
                    : isOpen
                      ? "bg-status-open-bg text-status-open-text border-status-open-text/20"
                      : "bg-status-closed-bg text-status-closed-text border-status-closed-text/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 shrink-0 rounded-full ${
                    isTemporarilyClosed
                      ? "bg-text-muted"
                      : isOpen
                        ? "bg-status-open-text"
                        : "bg-status-closed-text"
                  }`}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">{statusCopy.cardLabel}</span>
              </div>
            )}

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

      {/* Bilah Tombol Aksi Cepat Sisi Kanan: Vertikal di Mobile, Horizontal di Desktop */}
      <div className="flex flex-col justify-between items-center self-stretch shrink-0 pl-2 py-0.5 border-l border-border/50 sm:flex-row sm:items-center sm:gap-1.5 sm:self-center sm:py-0 sm:pl-1">
        {/* Tombol Titik Tiga Kebab Menu (Mobile Saja: Pojok Kanan Atas) */}
        <div className="relative sm:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="w-11 h-11 sm:w-9 sm:h-9 rounded-button text-text-muted hover:text-text-primary hover:bg-canvas border border-transparent hover:border-border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
            aria-label={`Menu opsi lainnya untuk ${spot.name}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <MoreVertical className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Menu Dropdown Opsi Titik Tiga di Mobile */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 py-1 bg-surface-pure border border-border rounded-card shadow-lg z-30 animate-in fade-in zoom-in-95 duration-150 divide-y divide-border/40 text-xs text-text-primary"
              role="menu"
              aria-label={`Opsi untuk ${spot.name}`}
            >
              {/* Opsi 1: Rute Google Maps */}
              <div className="py-1">
                <a
                  href={spot.googleMapsIntentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 transition-colors font-medium text-text-primary hover:text-accent-terracotta"
                  role="menuitem"
                >
                  <Navigation className="w-3.5 h-3.5 text-accent-terracotta shrink-0" aria-hidden="true" />
                  <span>Buka Rute</span>
                </a>
              </div>

              {/* Opsi 2: Bagikan & Salin Alamat */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={(e) => {
                    handleShare(e);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-status-open-text shrink-0" aria-hidden="true" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
                  )}
                  <span>{copied ? "Tautan Tersalin!" : "Bagikan"}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    handleCopyAddress(e);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  {addressCopied ? (
                    <Check className="w-3.5 h-3.5 text-status-open-text shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
                  )}
                  <span>{addressCopied ? "Alamat Tersalin!" : "Salin Alamat"}</span>
                </button>
              </div>

              {/* Opsi 3: Instagram (jika ada) */}
              {spot.instagramAccount && (
                <div className="py-1">
                  <a
                    href={`https://instagram.com/${spot.instagramAccount}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 transition-colors"
                    role="menuitem"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">Instagram @{spot.instagramAccount}</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tombol Rute Maps (Desktop Saja) */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3 text-xs font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={`Buka rute navigasi menuju ${spot.name}`}
          title="Buka Rute"
        >
          <Navigation className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          <span className="hidden md:inline">Rute</span>
        </a>

        {/* Tombol Bagikan (Desktop Saja) */}
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

        {/* Tombol Simpan / Bookmark (Mobile: Pojok Kanan Bawah, 1 Ketukan; Desktop: Sejajar) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(spot.slug);
          }}
          className={`w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border rounded-button transition-colors sm:min-h-[44px] sm:min-w-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
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

