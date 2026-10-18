import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function RootOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FBF9F5",
          padding: "56px 64px",
          border: "12px solid #F0ECE4",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Dekorasi Aksen Sudut Terakota */}
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

        {/* Header Kartu: Brand VisitPekalongan Bersih */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "9999px",
                backgroundColor: "#C05621",
              }}
            />
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1E1B18",
                letterSpacing: "-0.03em",
              }}
            >
              VisitPekalongan
            </span>
          </div>

          <span
            style={{
              fontSize: "18px",
              fontFamily: "sans-serif",
              color: "#70675D",
              fontWeight: 500,
            }}
          >
            visitpekalongan.com
          </span>
        </div>

        {/* Bagian Tengah: Judul Kurasi & Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <h1
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#1E1B18",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Dokumentasi & Panduan Kurasi Hidden Gems Pekalongan
          </h1>
          <p
            style={{
              fontSize: "24px",
              fontFamily: "sans-serif",
              lineHeight: 1.4,
              color: "#574E45",
              margin: 0,
            }}
          >
            Menemukan keaslian kuliner legendaris, kedai kopi pilihan, ketenangan alam
            pegunungan Petungkriyono, serta denyut tradisi batik pesisir.
          </p>
        </div>

        {/* Footer Kartu: Pilar-Pilar Kurasi */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingTop: "24px",
            borderTop: "1px solid #E2D9CE",
            fontFamily: "sans-serif",
          }}
        >
          {[
            "Kuliner Legendaris",
            "Coffee & Work Space",
            "Wisata Alam Petungkriyono",
            "Heritage & Batik",
          ].map((category) => (
            <div
              key={category}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2D9CE",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1E1B18",
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

