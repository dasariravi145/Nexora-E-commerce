import type { MetadataRoute } from "next";
import { isIndexingEnabled, getCanonicalUrl } from "@/config/seo";

/**
 * Next.js MetadataRoute robots.txt generator.
 * 
 * Policy:
 * - Local / Preview environments: Conservative disallow all to prevent crawler leakage.
 * - Owner-approved production (SEO_INDEXING_ENABLED + valid origin): Allow public pages,
 *   disallow private/user-state routes (/cart, /compare), and provide sitemap URL.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const indexing = isIndexingEnabled();

  if (!indexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const sitemapUrl = getCanonicalUrl("/sitemap.xml");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/compare", "/api/"],
    },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
