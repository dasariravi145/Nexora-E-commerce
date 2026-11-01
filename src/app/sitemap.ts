import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { getAllBrands } from "@/data/brands";
import { getActivePromotions } from "@/data/promotions";
import { getValidCanonicalOrigin } from "@/config/seo";

/**
 * Next.js MetadataRoute sitemap.xml generator.
 * 
 * Rules:
 * - Emits valid public pages with real canonical origin when configured.
 * - When no valid origin is configured or indexing is disabled, returns an empty array
 *   to prevent emitting fake domains or localhost URLs.
 * - Omits lastModified per Prompt 22 specification (zero fabricated dates).
 * - Excludes private/user-state routes (/cart, /compare, query parameters).
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getValidCanonicalOrigin();

  // If no valid public production origin is configured, do not emit fake public URLs.
  if (!origin) {
    return [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${origin}`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${origin}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${origin}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/brands`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/offers`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${origin}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${origin}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${origin}/help`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${origin}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 30 Valid Product specimens
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${origin}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 6 Valid Category divisions
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${origin}/categories/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 6 Valid Artisan Brands
  const brands = getAllBrands(products);
  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${origin}/brands/${brand.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Active Demonstration Offers
  const activePromos = getActivePromotions();
  const offerRoutes: MetadataRoute.Sitemap = activePromos.map((promo) => ({
    url: `${origin}/offers/${promo.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...offerRoutes,
  ];
}
