import * as React from "react";
import type { Product } from "@/types/product";
import { seoConfig, getCanonicalUrl } from "@/config/seo";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Generates Schema.org WebSite structured data.
 * Purely truthful information without fake search action endpoints.
 */
export function generateWebSiteSchema() {
  const canonicalUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    alternateName: "NEXORA Electronics",
    description: seoConfig.siteDescription,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 * Maps exact route paths to positional ListItems.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const canonical = getCanonicalUrl(item.path);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: canonical || item.path,
      };
    }),
  };
}

/**
 * Generates Schema.org Product structured data for a hardware specimen.
 * 
 * STRICT COMPLIANCE RULE:
 * This is an exploratory hardware portfolio demonstration.
 * We strictly omit commercial Offer, AggregateRating, Review, and real availability fields
 * to avoid misleading search engines with fabricated commercial inventory.
 */
export function generateProductSchema(product: Product) {
  const canonicalUrl = getCanonicalUrl(`/products/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.images.map((img) => img.url),
    sku: product.id,
    model: product.slug,
    disambiguatingDescription:
      "Demonstration hardware specimen from NEXORA exploratory electronics catalogue. Illustrative demonstration pricing only; not a transactional commercial purchase offer.",
    additionalProperty: product.specifications.slice(0, 8).map((spec) => ({
      "@type": "PropertyValue",
      name: spec.name,
      value: spec.value,
    })),
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };
}

/**
 * Safe JSON-LD script renderer for Next.js App Router.
 * Escapes closing angle brackets to prevent script injection.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null | undefined }) {
  if (!data) return null;

  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
