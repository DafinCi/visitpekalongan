import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils/url";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

