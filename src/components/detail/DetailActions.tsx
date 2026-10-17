"use client";

import { useState } from "react";
import { Navigation, Share2, Check, MessageSquare, ExternalLink } from "lucide-react";
import { SpotDetailDTO } from "@/types/spot";

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
    <section
      aria-label="Aksi Navigasi dan Tautan"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Tombol Utama: 1-Tap Google Maps Intent */}
        <a
          href={spot.googleMapsIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button shadow-sm transition-all min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          <Navigation className="w-4 h-4 text-canvas" aria-hidden="true" />
          <span>Buka Petunjuk Arah Google Maps</span>
        </a>

        {/* Tombol Ulasan Google Maps (Hanya tampil jika listing ulasan tersedia) */}
        {spot.googleMapsReviewUrl && (
          <a
            href={spot.googleMapsReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
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
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <InstagramIcon className="w-4 h-4 text-text-muted" />
            <span>@{spot.instagramAccount}</span>
          </a>
        )}

        {/* Tombol Bagikan dengan Web Share API / Copy Link */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-border-focus"
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
  );
}

