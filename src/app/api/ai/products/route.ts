import { getAllProducts } from "@/data/products";
import { matchesSearchQuery } from "@/lib/catalogue-filters";
import { validateAgentApiKey } from "@/lib/server/agent-auth";
import type { CompactAiProduct, AiProductsApiResponse } from "@/types";

/**
 * Server-only route handler.
 * Dynamically inspects request headers and searchParams on every incoming request.
 */
const NO_CACHE_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * GET /api/ai/products
 *
 * Secure, read-only product catalogue endpoint designed specifically for local
 * n8n / AI Agent integrations.
 *
 * Requirements:
 * - Header: X-Nexora-Agent-Key matching server environment variable NEXORA_AGENT_API_KEY.
 * - Optional Query Params:
 *   - category (string): case-insensitive category slug or name
 *   - maxPrice (number): maximum numeric price in INR (demoPrice)
 *   - search (string): text search query across title, description, and specs
 *   - limit (number): result pagination cap (1 - 30, default 10)
 */
export const dynamic = "force-static";

export async function GET(request?: Request): Promise<Response> {
  if (process.env.NEXT_EXPORT === "true" || !request) {
    return Response.json({
      status: "static_export_showcase",
      message: "NEXORA catalogue query API is unavailable in static export mode.",
      products: [],
    });
  }

  // 1. Authenticate Request (Fail-closed on missing env or invalid key)
  const authHeader = request.headers.get("x-nexora-agent-key");
  const auth = validateAgentApiKey(authHeader);

  if (!auth.authorized) {
    return Response.json(
      {
        error: auth.errorMessage,
        code: auth.errorCode,
      },
      {
        status: auth.status || 401,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  // 2. Parse and Validate Query Parameters
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const maxPriceParam = searchParams.get("maxPrice");
  const searchParam = searchParams.get("search");
  const limitParam = searchParams.get("limit");

  let maxPrice: number | undefined = undefined;
  if (maxPriceParam !== null && maxPriceParam.trim() !== "") {
    const parsedPrice = Number(maxPriceParam);
    if (isNaN(parsedPrice) || !isFinite(parsedPrice) || parsedPrice < 0) {
      return Response.json(
        {
          error: "Invalid 'maxPrice' parameter: must be a non-negative number.",
          code: "INVALID_PARAMETER",
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    maxPrice = parsedPrice;
  }

  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 30; // Matches total items in centralized demo catalogue
  let limit = DEFAULT_LIMIT;
  if (limitParam !== null && limitParam.trim() !== "") {
    const parsedLimit = Number(limitParam);
    if (isNaN(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return Response.json(
        {
          error: "Invalid 'limit' parameter: must be a positive integer between 1 and 30.",
          code: "INVALID_PARAMETER",
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    limit = Math.min(parsedLimit, MAX_LIMIT);
  }

  // 3. Query Catalogue Single Source of Truth
  const allProducts = getAllProducts();
  let filtered = allProducts;

  // Filter: Category (matches categorySlug or display name, case-insensitively)
  if (categoryParam && categoryParam.trim().length > 0) {
    const cleanCategory = categoryParam.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.categorySlug.toLowerCase() === cleanCategory ||
        p.category.toLowerCase() === cleanCategory
    );
  }

  // Filter: Max Price (exact numeric INR price threshold)
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.demoPrice <= maxPrice);
  }

  // Filter: Search (case-insensitive multi-field search)
  if (searchParam && searchParam.trim().length > 0) {
    filtered = filtered.filter((p) => matchesSearchQuery(p, searchParam.trim()));
  }

  const totalAvailable = filtered.length;
  const paginated = filtered.slice(0, limit);

  // 4. Map to Compact AI Agent Payload (Strictly real data; zero fabricated stock/availability)
  const compactProducts: CompactAiProduct[] = paginated.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    categorySlug: product.categorySlug,
    tagline: product.tagline,
    demoPrice: product.demoPrice,
    formattedPrice: product.formattedPrice,
    currency: product.currency,
    specifications: product.specs,
    url: `/products/${product.slug}`,
  }));

  const responsePayload: AiProductsApiResponse = {
    count: compactProducts.length,
    totalAvailable,
    filtersApplied: {
      category: categoryParam && categoryParam.trim() ? categoryParam.trim() : undefined,
      maxPrice,
      search: searchParam && searchParam.trim() ? searchParam.trim() : undefined,
      limit,
    },
    products: compactProducts,
  };

  return Response.json(responsePayload, {
    status: 200,
    headers: NO_CACHE_HEADERS,
  });
}
