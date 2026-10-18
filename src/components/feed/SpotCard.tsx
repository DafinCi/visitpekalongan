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
  ExternalLink,
} from "lucide-react";
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

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
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
      } catch {}
    }
  };

  return (
    <article className="group bg-surface border border-border hover:border-accent-terracotta/40 rounded-card overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col h-full relative">
      {/* Kontainer Foto Rasio 4:3 */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-canvas">
        <Link
          href={`/spot/${spot.slug}`}
          className="block w-full h-full relative focus:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={spot.coverImageUrl}
            alt={`Suasana tempat di ${spot.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          />
        </Link>

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

          {/* Tombol Titik Tiga Kebab Menu (Sudut Kanan Atas) */}
          <div className="absolute top-2.5 right-2.5 z-20" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="w-8 h-8 rounded-full bg-surface/85 hover:bg-surface border border-border/60 text-text-primary flex items-center justify-center backdrop-blur-xs transition-colors shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus"
              aria-label={`Menu opsi lainnya untuk ${spot.name}`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <MoreVertical className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Menu Dropdown Opsi Titik Tiga */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 py-1 bg-surface-pure border border-border rounded-card shadow-lg z-30 animate-in fade-in zoom-in-95 duration-150 divide-y divide-border/40 text-xs text-text-primary"
                role="menu"
                aria-label={`Opsi untuk ${spot.name}`}
              >
                <div className="py-1">
                  {/* Opsi 1: Bagikan */}
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
                    <span>{copied ? "Tautan Tersalin!" : "Bagikan Tempat"}</span>
                  </button>

                  {/* Opsi 2: Salin Alamat Lengkap */}
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
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 transition-colors"
                      role="menuitem"
                    >
                      <InstagramIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate">Instagram @{spot.instagramAccount}</span>
                    </a>
                  </div>
                )}

                {/* Opsi 4: Buka Google Maps langsung */}
                <div className="py-1">
                  <a
                    href={spot.googleMapsIntentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 text-left hover:bg-canvas flex items-center gap-2.5 transition-colors text-accent-terracotta font-medium"
                    role="menuitem"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Buka Google Maps</span>
                  </a>
                </div>
              </div>
            )}
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
              <Link
                href={`/spot/${spot.slug}`}
                className="focus-visible:outline-2 focus-visible:outline-border-focus rounded-sm"
              >
                {spot.name}
              </Link>
            </h3>

            {/* Menu Khas (Signature Dish) */}
            {spot.signatureDish && (
              <p className="text-xs text-text-muted italic line-clamp-1 pt-0.5">
                {spot.signatureDish}
              </p>
            )}

            {/* Kecamatan & Rentang Harga */}
            <div className="flex items-center justify-between text-xs text-text-muted pt-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-text-subtle shrink-0" aria-hidden="true" />
                <span className="truncate">
                  Kec. {formatDistrict(spot.district)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-text-primary bg-canvas border border-border px-1.5 py-0.5 rounded shrink-0 ml-2">
                {formatPriceRange(spot.priceRange)}
              </span>
            </div>
          </div>
        </div>

      {/* Bilah Aksi Cepat Bawah Kartu: Rute & Bookmark Saja */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
        {/* Tombol Rute Google Maps Native */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-text-primary bg-surface-pure hover:bg-canvas border border-border hover:border-accent-terracotta rounded-button transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={`Buka rute navigasi Google Maps menuju ${spot.name}`}
        >
          <Navigation className="w-3.5 h-3.5 text-accent-terracotta" aria-hidden="true" />
          <span>Buka Rute</span>
        </a>

        {/* Tombol Simpan Offline / Bookmark (1 Ketukan Langsung) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(spot.slug);
          }}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold border rounded-button transition-colors min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
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
          <span className="text-xs">{saved ? "Tersimpan" : "Simpan"}</span>
        </button>
      </div>
    </article>
  );
}
