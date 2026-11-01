/**
 * NEXORA — Technical SEO Configuration & Policy
 * 
 * Centralized SEO architecture managing canonical origins, indexing policies,
 * metadata fallbacks, and environment safety for the demonstration storefront.
 * 
 * Rules:
 * 1. Fictional live domains are NEVER hardcoded as active production origins.
 * 2. Origin validation strictly rejects localhost, 127.0.0.1, private LAN hosts,
 *    and malformed URLs for public canonicals.
 * 3. Default policy is conservative NOINDEX for local dev and preview deployments.
 * 4. Production public indexing is strictly opt-in via validated environment flags:
 *    - `NEXT_PUBLIC_SITE_URL` (valid https origin)
 *    - `SEO_INDEXING_ENABLED="true"` or `NEXT_PUBLIC_SEO_INDEXING_ENABLED="true"`
 */

export interface SeoConfig {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultSocialImage: string;
  locale: string;
  twitterHandle: string;
  author: string;
  publisher: string;
}

export const seoConfig: SeoConfig = {
  siteName: "NEXORA",
  siteTagline: "Next-Generation Electronics & Spatial Computing",
  siteDescription:
    "Original, premium futuristic electronics retail platform featuring spatial computing hardware, acoustic engineering, and 3D product previews.",
  defaultTitle: "NEXORA — Premium Next-Gen Electronics & Spatial Computing",
  titleTemplate: "%s | NEXORA",
  defaultSocialImage: "/images/og-nexora.png",
  locale: "en_US",
  twitterHandle: "@nexora_tech",
  author: "NEXORA Engineering",
  publisher: "NEXORA Technologies Inc.",
};

/**
 * Validates a candidate canonical origin string.
 * Rejects localhost, IPv4/IPv6 private loops, invalid protocols, and malformed strings.
 * 
 * @param candidate Raw origin string, e.g. process.env.NEXT_PUBLIC_SITE_URL
 * @returns Clean, normalized origin string without trailing slash, or null if invalid.
 */
export function validateCanonicalOrigin(candidate?: string | null): string | null {
  if (!candidate || typeof candidate !== "string") {
    return null;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Reject localhost and IP loopbacks
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "0.0.0.0"
    ) {
      return null;
    }

    // Reject private/development top-level domains
    if (
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".lan") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".example") ||
      hostname.endsWith(".invalid")
    ) {
      return null;
    }

    // Reject private RFC 1918 IPv4 ranges
    if (
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return null;
    }

    // Must have a valid dot-separated domain (e.g. nexora-store.com)
    if (!hostname.includes(".")) {
      return null;
    }

    // Return origin without trailing slash
    return parsed.origin;
  } catch {
    return null;
  }
}

/**
 * Resolves the active validated canonical origin from environment variables.
 * Returns null if no valid public production origin is configured by the owner.
 */
export function getValidCanonicalOrigin(): string | null {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL;
  return validateCanonicalOrigin(envUrl);
}

/**
 * Determines whether search engine indexing is active.
 * Strict Environment Safety:
 * - Local development: false
 * - Preview environments: false by default
 * - Production: true ONLY when explicitly enabled via env flag AND valid canonical origin exists.
 */
export function isIndexingEnabled(): boolean {
  const explicitFlag =
    process.env.SEO_INDEXING_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_SEO_INDEXING_ENABLED === "true";

  const hasValidOrigin = getValidCanonicalOrigin() !== null;

  return explicitFlag && hasValidOrigin;
}

/**
 * Generates an absolute canonical URL if a valid canonical origin is configured.
 * If no valid origin is configured, returns undefined to avoid emitting fake public URLs.
 * 
 * @param path Relative path, e.g. "/products/nexora-nova-1-pro"
 */
export function getCanonicalUrl(path: string): string | undefined {
  const origin = getValidCanonicalOrigin();
  if (!origin) {
    return undefined;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Normalize root path
  if (cleanPath === "/") {
    return origin;
  }
  return `${origin}${cleanPath}`;
}

/**
 * Returns metadataBase URL object if a valid canonical origin is configured, or undefined.
 */
export function getMetadataBase(): URL | undefined {
  const origin = getValidCanonicalOrigin();
  if (origin) {
    try {
      return new URL(origin);
    } catch {
      return undefined;
    }
  }
  return undefined;
}
