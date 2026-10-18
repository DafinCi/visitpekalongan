"use client";

import { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, LngLatBounds, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Tetapkan worker URL eksplisit untuk kompatibilitas Web Worker pada Next.js Turbopack
if (typeof window !== "undefined") {
  setWorkerUrl("/maplibre-gl-worker.mjs");
}
import Link from "next/link";
import Image from "next/image";
import { Navigation, ArrowRight, X, Sparkles, MapPin, LocateFixed, Loader2 } from "lucide-react";
import { SpotListItemDTO } from "@/types/spot";
import { formatDistrict, formatPriceRange, formatRegency } from "@/lib/utils/formatters";
import {
  calculateDistanceKm,
  formatDistance,
  isWithinPekalonganRegion,
} from "@/lib/utils/geolocation";

interface SpotMapProps {
  spots: SpotListItemDTO[];
  selectedSpotId?: string | null;
  onSelectSpot?: (spot: SpotListItemDTO | null) => void;
}

export function SpotMap({
  spots,
  selectedSpotId,
  onSelectSpot,
}: SpotMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);

  const [activeSpot, setActiveSpot] = useState<SpotListItemDTO | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "active" | "error">("idle");
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Inisialisasi Peta MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Ambil API key CARTO dari environment variable jika tersedia
    const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
    const keyParam = cartoKey ? `?key=${cartoKey}` : "";

    // Gaya vektor CARTO Positron untuk rendering WebGL ultra tajam pada layar ponsel
    const vectorStyleUrl = `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json${keyParam}`;

    // Titik pusat Pekalongan (antara pesisir kota dan pegunungan Petungkriyono)
    const map = new Map({
      container: mapContainerRef.current,
      style: vectorStyleUrl,
      center: [109.6753, -6.95],
      zoom: 11,
      maxZoom: 18,
      minZoom: 9,
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers ketika daftar spots berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Bersihkan marker lama
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (spots.length === 0) return;

    const bounds = new LngLatBounds();

    spots.forEach((spot) => {
      // Buat elemen penanda kustom (Custom HTML Marker)
      const el = document.createElement("button");
      el.type = "button";
      el.className = "group relative flex items-center justify-center cursor-pointer focus:outline-none";
      el.setAttribute("aria-label", `Pilih spot ${spot.name}`);

      // Styling Pin Terakota
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-accent-terracotta border-2 border-canvas shadow-md flex items-center justify-center transition-transform transform group-hover:scale-110 active:scale-95">
          <span class="w-2.5 h-2.5 rounded-full bg-canvas"></span>
        </div>
        <div class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-charcoal/90 text-canvas text-[11px] font-medium rounded-button shadow-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          ${spot.name}
        </div>
      `;

      el.addEventListener("click", () => {
        setActiveSpot(spot);
        if (onSelectSpot) onSelectSpot(spot);
        map.flyTo({
          center: [spot.longitude, spot.latitude],
          zoom: Math.max(map.getZoom(), 13),
          duration: 800,
        });
      });

      const marker = new Marker({ element: el })
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([spot.longitude, spot.latitude]);
    });

    // Sesuaikan kamera agar seluruh spot terlihat dengan nyaman
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 120, left: 40, right: 40 },
        maxZoom: 14,
        duration: 800,
      });
    }
  }, [spots, onSelectSpot]);

  // Sinkronisasi spotId yang dipilih dari luar
  useEffect(() => {
    if (!selectedSpotId) {
      setActiveSpot(null);
      return;
    }

    const found = spots.find((s) => s.id === selectedSpotId);
    if (found) {
      setActiveSpot(found);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [found.longitude, found.latitude],
          zoom: 14,
          duration: 800,
        });
      }
    }
  }, [selectedSpotId, spots]);

  // Handler deteksi lokasi pengguna saat tombol Lokasi Saya ditekan
  const handleLocateUser = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("error");
      setGeoMessage("Browser Anda tidak mendukung fitur geolokasi.");
      return;
    }

    setGeoStatus("loading");
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setGeoStatus("active");

        const map = mapRef.current;
        if (map) {
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Buat penanda titik biru berdenyut untuk posisi pengguna
          const userEl = document.createElement("div");
          userEl.className = "relative flex items-center justify-center";
          userEl.innerHTML = `
            <span class="absolute w-7 h-7 rounded-full bg-blue-500/30 animate-ping"></span>
            <span class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></span>
          `;

          userMarkerRef.current = new Marker({ element: userEl })
            .setLngLat([lng, lat])
            .addTo(map);

          if (isWithinPekalonganRegion(lat, lng)) {
            map.flyTo({
              center: [lng, lat],
              zoom: 13,
              duration: 900,
            });
            setGeoMessage("Menampilkan titik posisi Anda di Pekalongan.");
          } else {
            setGeoMessage("Anda berada di luar Pekalongan. Jarak ke tiap spot tetap dihitung.");
          }
        }
      },
      () => {
        setGeoStatus("error");
        setGeoMessage("Izin lokasi tidak diaktifkan. Aktifkan izin lokasi di browser Anda.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const activeSpotDistance =
    activeSpot && userLocation
      ? formatDistance(
          calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            activeSpot.latitude,
            activeSpot.longitude
          )
        )
      : null;

  return (
    <div className="relative w-full h-[600px] sm:h-[680px] rounded-card border border-border overflow-hidden bg-surface-pure shadow-xs">
      {/* Kontainer Kanvas Peta MapLibre */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Bilah Atas: Info Titik & Tombol Lokasi Saya */}
      <div className="absolute top-4 left-4 right-14 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-canvas/95 backdrop-blur-xs text-text-primary text-xs font-medium border border-border rounded-button shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-accent-terracotta shrink-0" aria-hidden="true" />
          <span>Menampilkan {spots.length} titik kurasi di Pekalongan</span>
        </div>

        <button
          type="button"
          onClick={handleLocateUser}
          disabled={geoStatus === "loading"}
          className={`pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-button border shadow-xs backdrop-blur-xs transition-colors min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-border-focus ${
            geoStatus === "active"
              ? "bg-accent-terracotta text-canvas border-accent-terracotta"
              : "bg-canvas/95 text-text-primary border-border hover:bg-surface-pure"
          }`}
          aria-label="Deteksi lokasi saya saat ini di peta"
        >
          {geoStatus === "loading" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{geoStatus === "active" ? "Lokasi Aktif" : "Lokasi Saya"}</span>
        </button>

        {geoMessage && (
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-canvas/95 backdrop-blur-xs text-text-secondary text-[11px] border border-border rounded-button shadow-xs">
            <span>{geoMessage}</span>
            <button
              type="button"
              onClick={() => setGeoMessage(null)}
              className="text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
              aria-label="Tutup pesan lokasi"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Pratinjau Spot yang Dipilih (Preview Card Overlay) */}
      {activeSpot && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-canvas border border-border rounded-card p-4 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                <Sparkles className="w-3 h-3 text-accent-terracotta" aria-hidden="true" />
                <span className="font-semibold uppercase tracking-wider">{activeSpot.categoryName}</span>
                <span>•</span>
                <span>{formatDistrict(activeSpot.district)}</span>
              </div>
              <h3 className="font-display text-lg text-text-primary leading-snug">
                {activeSpot.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveSpot(null);
                if (onSelectSpot) onSelectSpot(null);
              }}
              className="p-1 text-text-muted hover:text-text-primary rounded-button hover:bg-surface-pure min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-border-focus cursor-pointer"
              aria-label="Tutup pratinjau tempat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Foto Kecil & Info Harga/Status/Jarak */}
          <div className="flex items-center gap-3 my-3">
            <div className="relative w-16 h-16 rounded-button overflow-hidden shrink-0 border border-border bg-surface-pure">
              <Image
                src={activeSpot.coverImageUrl}
                alt={activeSpot.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSpot.isOpenNow ? "bg-status-open-text" : "bg-status-closed-text"
                  }`}
                />
                <span className="font-medium text-text-primary">{activeSpot.statusLabel}</span>
              </div>
              <p className="text-text-muted">{formatPriceRange(activeSpot.priceRange)}</p>
              <div className="flex items-center gap-1.5 text-text-muted">
                <span>{formatRegency(activeSpot.regency)}</span>
                {activeSpotDistance && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-accent-terracotta">
                      {activeSpotDistance} dari Anda
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Aksi: Google Maps Intent & Buka Halaman Ulasan */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <a
              href={activeSpot.googleMapsIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-canvas bg-accent-terracotta hover:bg-accent-terracotta/90 rounded-button transition-colors min-h-[44px]"
            >
              <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Petunjuk Arah</span>
            </a>

            <Link
              href={`/spot/${activeSpot.slug}`}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-text-primary bg-surface-pure hover:bg-canvas border border-border rounded-button transition-colors min-h-[44px]"
            >
              <span>Ulasan</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
