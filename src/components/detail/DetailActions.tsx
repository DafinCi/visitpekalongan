"use client";

import { useState } from "react";
import { Navigation, Share2, Check, MessageSquare, ExternalLink, Bookmark } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";
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

interface DetailActionsProps {
  spot: SpotDetailDTO;
}

export function DetailActions({ spot }: DetailActionsProps) {
  const [copied, setCopied] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(spot.slug);

  const handleShare = async () => {
    const shareData = {
      title: `${spot.name} - VisitPekalongan`,
      text: `Temukan kurasi autentik ${spot.name} di Pekalongan:`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <section
        aria-label="Aksi Navigasi dan Tautan"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
      >
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Tombol Utama: 1-Tap Google Maps Intent (Desktop Saja, di Mobile tersedia via Sticky Bottom Bar) */}
          <a
            href={spot.googleMapsIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-sm transition-all min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <Navigation className="w-4 h-4 text-canvas" aria-hidden="true" />
            <span>Buka Petunjuk Arah Google Maps</span>
          </a>

          {/* Tombol Simpan Offline / Bookmark (Desktop Saja) */}
          <button
            type="button"
            onClick={() => toggleBookmark(spot.slug)}
            className={`hidden sm:inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-button border transition-colors min-h-[48px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
              saved
                ? "bg-accent-terracotta/10 border-accent-terracotta/40 text-accent-terracotta font-semibold"
                : "bg-surface-pure hover:bg-canvas border-border text-text-primary"
            }`}
            aria-pressed={saved}
            aria-label={saved ? "Hapus tempat ini dari daftar tersimpan" : "Simpan tempat ini ke daftar offline"}
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? "fill-accent-terracotta text-accent-terracotta" : "text-text-muted"}`}
              aria-hidden="true"
            />
            <span>{saved ? "Tersimpan" : "Simpan Spot"}</span>
          </button>

          {/* Tombol Ulasan Google Maps (Hanya tampil jika listing ulasan tersedia) */}
          {spot.googleMapsReviewUrl && (
            <a
              href={spot.googleMapsReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] sm:min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
            >
              <MessageSquare className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <span>Ulasan Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
            </a>
          )}

          {/* Tombol Instagram Akun Resmi (jika ada) */}
          {spot.instagramAccount && (
            <a
              href={`https://instagram.com/${spot.instagramAccount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px] sm:min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
            >
              <InstagramIcon className="w-4 h-4 text-text-muted" />
              <span>@{spot.instagramAccount}</span>
            </a>
          )}

          {/* Tombol Bagikan dengan Web Share API / Copy Link (Desktop Saja) */}
          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
            aria-label={copied ? "Tautan tersalin ke papan klip" : "Bagikan ulasan tempat ini"}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent-sage" aria-hidden="true" />
                <span className="text-accent-sage font-semibold">Tautan Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-text-muted" aria-hidden="true" />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Sticky Bottom Action Bar di Mobile (Akses Cepat 1 Ketukan untuk Rute, Simpan, dan Bagikan) */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-pure/95 backdrop-blur-md border-t border-border px-4 py-2.5 shadow-lg flex items-center gap-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label="Aksi Cepat Mobile"
      >
        {/* Tombol Utama: Buka Rute Google Maps */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 active:scale-[0.98] rounded-button shadow-xs transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-border-focus"
          aria-label={`Buka petunjuk arah Google Maps menuju ${spot.name}`}
        >
          <Navigation className="w-4 h-4 text-canvas" aria-hidden="true" />
          <span>Buka Rute Maps</span>
        </a>

        {/* Tombol Simpan / Bookmark 1 Ketukan */}
        <button
          type="button"
          onClick={() => toggleBookmark(spot.slug)}
          className={`w-11 h-[44px] flex items-center justify-center rounded-button border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus shrink-0 ${
            saved
              ? "bg-accent-terracotta/10 border-accent-terracotta/40 text-accent-terracotta"
              : "bg-surface hover:bg-canvas border-border text-text-muted hover:text-text-primary"
          }`}
          aria-pressed={saved}
          aria-label={saved ? "Hapus dari tersimpan" : "Simpan tempat"}
          title={saved ? "Tersimpan" : "Simpan"}
        >
          <Bookmark
            className={`w-4 h-4 ${saved ? "fill-accent-terracotta text-accent-terracotta" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* Tombol Bagikan Cepat */}
        <button
          type="button"
          onClick={handleShare}
          className="w-11 h-[44px] flex items-center justify-center rounded-button border border-border bg-surface hover:bg-canvas text-text-muted hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus shrink-0"
          aria-label={copied ? "Tautan tersalin" : "Bagikan spot"}
          title={copied ? "Tersalin!" : "Bagikan"}
        >
          {copied ? (
            <Check className="w-4 h-4 text-accent-sage" aria-hidden="true" />
          ) : (
            <Share2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
