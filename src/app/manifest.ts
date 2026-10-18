import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VisitPekalongan - Kurasi Cerita & Hidden Gems Pekalongan",
    short_name: "VisitPekalongan",
    description:
      "Panduan kurasi independen untuk mendokumentasikan dan memetakan hidden gems di seluruh penjuru Pekalongan, mulai dari pesisir Kota Batik hingga pegunungan Petungkriyono.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#C05621",
    lang: "id",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

