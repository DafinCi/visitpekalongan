import { ImageResponse } from "next/og";
import { spotRepository } from "@/lib/repositories/spot-repository";
import { formatDistrict, formatPriceRange, formatRegency } from "@/lib/utils/formatters";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  const spots = await spotRepository.getSpots();
  return spots.map((spot) => ({
    slug: spot.slug,
  }));
}

export default async function SpotOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spot = await spotRepository.getSpotBySlug(slug);

  if (!spot) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FBF9F5",
            fontFamily: "serif",
          }}
        >
          <h1 style={{ fontSize: "48px", color: "#1E1B18" }}>VisitPekalongan</h1>
          <p style={{ fontSize: "20px", color: "#70675D", fontFamily: "sans-serif" }}>
            Kurasi Autentik Pekalongan
          </p>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#FBF9F5",
          padding: "48px 56px",
          border: "12px solid #F0ECE4",
          position: "relative",
          gap: "40px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dekorasi Garis Terakota Atas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#C05621",
          }}
        />

        {/* Kolom Kiri: Informasi Kurasi Detail (Lebar ~640px) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            height: "100%",
          }}
        >
          {/* Header Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "9999px",
                backgroundColor: "#C05621",
              }}
            />
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                fontFamily: "serif",
                color: "#1E1B18",
                letterSpacing: "-0.02em",
              }}
            >
              VisitPekalongan
            </span>
          </div>

          {/* Konten Utama Spot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Tag Kategori & Wilayah */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "#C05621",
                  color: "#FFFFFF",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {spot.categoryName}
              </div>
              <span style={{ fontSize: "14px", color: "#70675D", fontWeight: 500 }}>
                Kec. {formatDistrict(spot.district)} • {formatRegency(spot.regency)}
              </span>
            </div>

            {/* Nama Tempat */}
            <h1
              style={{
                fontSize: spot.name.length > 25 ? "42px" : "48px",
                fontWeight: 700,
                fontFamily: "serif",
                lineHeight: 1.15,
                color: "#1E1B18",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {spot.name}
            </h1>

            {/* Menu Andalan */}
            {spot.signatureDish && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2D9CE",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  alignSelf: "flex-start",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#C05621" }}>
                  Menu Wajib:
                </span>
                <span style={{ fontSize: "14px", color: "#1E1B18", fontStyle: "italic" }}>
                  {spot.signatureDish}
                </span>
              </div>
            )}

            {/* Snippet Deskripsi */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.45,
                color: "#574E45",
                margin: 0,
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {spot.description.slice(0, 150)}...
            </p>
          </div>

          {/* Footer Info & Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid #E2D9CE",
              fontSize: "13px",
              color: "#70675D",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: 600, color: "#1E1B18" }}>
                {formatPriceRange(spot.priceRange)}
              </span>
              <span>•</span>
              <span style={{ color: "#70675D" }}>
                Jam operasional dalam WIB
              </span>
            </div>

            <span style={{ fontWeight: 500 }}>visitpekalongan.com</span>
          </div>
        </div>

        {/* Kolom Kanan: Foto Dokumentasi Tempat (Lebar ~440px) */}
        <div
          style={{
            width: "440px",
            height: "100%",
            display: "flex",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #E2D9CE",
            backgroundColor: "#E2D9CE",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={spot.coverImageUrl}
            alt={spot.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

