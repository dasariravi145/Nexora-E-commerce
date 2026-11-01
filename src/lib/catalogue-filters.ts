import type { Product } from "@/types";

/**
 * Supported Catalogue Sort Options
 */
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface SortDefinition {
  id: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortDefinition[] = [
  { id: "featured", label: "Featured Flagships" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
  { id: "name-desc", label: "Name: Z to A" },
];

/**
 * Filter state representation
 */
export interface CatalogueFilterState {
  query: string;
  category: string; // "all" or specific categorySlug
  brands: string[]; // selected brand slugs or names
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
}

export interface BrandOption {
  name: string;
  slug: string;
  count: number;
}

export interface PriceBounds {
  min: number;
  max: number;
}

export const DEFAULT_FILTER_STATE: CatalogueFilterState = {
  query: "",
  category: "all",
  brands: [],
  minPrice: undefined,
  maxPrice: undefined,
  sort: "featured",
};

/**
 * Extract unique brands dynamically from the centralized product dataset.
 */
export function getAvailableBrands(products: Product[]): BrandOption[] {
  const brandMap = new Map<string, { name: string; slug: string; count: number }>();

  for (const product of products) {
    const slug = product.brandSlug.toLowerCase();
    const existing = brandMap.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      brandMap.set(slug, {
        name: product.brand,
        slug,
        count: 1,
      });
    }
  }

  return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calculate dynamic min and max price bounds across the centralized product dataset.
 */
export function getPriceBounds(products: Product[]): PriceBounds {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  let min = products[0].demoPrice;
  let max = products[0].demoPrice;

  for (const p of products) {
    if (p.demoPrice < min) min = p.demoPrice;
    if (p.demoPrice > max) max = p.demoPrice;
  }

  return { min, max };
}

/**
 * Helper to tokenize text into distinct clean words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Compute search relevance score for a product given a query string.
 * Higher score indicates stronger semantic alignment with the search terms.
 */
export function getSearchRelevance(product: Product, cleanQuery: string): number {
  if (!cleanQuery) return 1;

  const nameLower = product.name.toLowerCase();
  const brandLower = product.brand.toLowerCase();
  const categoryLower = product.category.toLowerCase();
  const taglineLower = product.tagline.toLowerCase();
  const descLower = product.description.toLowerCase();

  let score = 0;

  // 1. Exact phrase matches (highest priority)
  if (nameLower === cleanQuery) score += 1000;
  else if (nameLower.startsWith(cleanQuery)) score += 600;
  else if (nameLower.includes(cleanQuery)) score += 400;

  if (brandLower === cleanQuery) score += 300;
  else if (brandLower.includes(cleanQuery)) score += 150;

  if (categoryLower === cleanQuery) score += 200;
  if (taglineLower.includes(cleanQuery)) score += 120;
  if (descLower.includes(cleanQuery)) score += 80;

  // 2. Token-level matching
  const queryTokens = tokenize(cleanQuery);
  const nameTokens = tokenize(nameLower);
  const descTokens = tokenize(descLower);
  const specText = [
    ...product.specs,
    ...product.specifications.map((s) => `${s.name} ${s.value}`),
    ...(product.images?.map((i) => i.alt) || []),
  ]
    .join(" ")
    .toLowerCase();
  const specTokens = tokenize(specText);

  for (const token of queryTokens) {
    // Word boundary or prefix matching
    if (nameTokens.some((t) => t === token)) {
      score += 50;
    } else if (nameTokens.some((t) => t.startsWith(token))) {
      score += 25;
    }

    if (specTokens.some((t) => t === token)) {
      score += 15;
    } else if (specTokens.some((t) => t.startsWith(token))) {
      score += 8;
    }

    if (descTokens.some((t) => t === token)) {
      score += 10;
    }
  }

  return score;
}

/**
 * Check if a product satisfies the text search query.
 * Case-insensitive, trims whitespace, handles multi-token queries safely.
 */
export function matchesSearchQuery(product: Product, query: string): boolean {
  const clean = query.trim().toLowerCase();
  if (!clean) return true;

  // Build comprehensive searchable corpus
  const corpus = [
    product.name,
    product.brand,
    product.category,
    product.tagline,
    product.description,
    ...product.specs,
    ...product.specifications.map((s) => `${s.name} ${s.value}`),
    ...(product.variants?.map((v) => `${v.name} ${v.colorName || ""} ${v.storage || ""}`) || []),
    ...(product.images?.map((i) => i.alt) || []),
  ]
    .join(" ")
    .toLowerCase();

  // Multi-term token matching (all tokens must exist in corpus)
  const tokens = clean.split(/\s+/).filter(Boolean);
  return tokens.every((token) => corpus.includes(token));
}

/**
 * Filter and sort products deterministically using the centralized pipeline.
 */
export function filterAndSortProducts(
  products: Product[],
  filters: CatalogueFilterState
): {
  results: Product[];
  totalMatches: number;
  appliedFilterCount: number;
  isPriceRangeInvalid: boolean;
} {
  let appliedFilterCount = 0;
  const cleanQuery = filters.query ? filters.query.trim().toLowerCase() : "";

  // Check query
  if (cleanQuery.length > 0) {
    appliedFilterCount += 1;
  }

  // Check category
  if (filters.category && filters.category.toLowerCase() !== "all") {
    appliedFilterCount += 1;
  }

  // Check brands
  if (filters.brands && filters.brands.length > 0) {
    appliedFilterCount += filters.brands.length;
  }

  // Check price range
  const hasMinPrice = typeof filters.minPrice === "number" && !isNaN(filters.minPrice);
  const hasMaxPrice = typeof filters.maxPrice === "number" && !isNaN(filters.maxPrice);

  if (hasMinPrice) appliedFilterCount += 1;
  if (hasMaxPrice) appliedFilterCount += 1;

  // Check for invalid price range (min > max)
  const isPriceRangeInvalid =
    hasMinPrice && hasMaxPrice && (filters.minPrice as number) > (filters.maxPrice as number);

  // If price range is invalid, return empty result set with flag
  if (isPriceRangeInvalid) {
    return {
      results: [],
      totalMatches: 0,
      appliedFilterCount,
      isPriceRangeInvalid: true,
    };
  }

  // Execute filtering pipeline
  const filtered = products.filter((product) => {
    // 1. Text search
    if (cleanQuery && !matchesSearchQuery(product, cleanQuery)) {
      return false;
    }

    // 2. Category division
    if (filters.category && filters.category.toLowerCase() !== "all") {
      if (product.categorySlug.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // 3. Brand filtering (supports multiple brand selections)
    if (filters.brands && filters.brands.length > 0) {
      const matchBrand = filters.brands.some(
        (b) =>
          b.toLowerCase() === product.brandSlug.toLowerCase() ||
          b.toLowerCase() === product.brand.toLowerCase()
      );
      if (!matchBrand) return false;
    }

    // 4. Price minimum
    if (hasMinPrice && product.demoPrice < (filters.minPrice as number)) {
      return false;
    }

    // 5. Price maximum
    if (hasMaxPrice && product.demoPrice > (filters.maxPrice as number)) {
      return false;
    }

    return true;
  });

  // Execute deterministic, non-mutating sort
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.demoPrice - b.demoPrice;
      case "price-desc":
        return b.demoPrice - a.demoPrice;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "featured":
      default: {
        // If a search query is active, sort by relevance score first
        if (cleanQuery) {
          const scoreA = getSearchRelevance(a, cleanQuery);
          const scoreB = getSearchRelevance(b, cleanQuery);
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
        }
        // Then featured flagships first, then deterministic fallback by ID
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id.localeCompare(b.id);
      }
    }
  });

  return {
    results: sorted,
    totalMatches: sorted.length,
    appliedFilterCount,
    isPriceRangeInvalid: false,
  };
}

/**
 * Safely parse URLSearchParams or Next.js searchParams dictionary into CatalogueFilterState.
 */
export function parseFilterParams(
  rawParams: { [key: string]: string | string[] | undefined } | URLSearchParams
): CatalogueFilterState {
  const getParam = (key: string): string | undefined => {
    if (rawParams instanceof URLSearchParams) {
      return rawParams.get(key) || undefined;
    }
    const val = rawParams[key];
    if (Array.isArray(val)) return val[0];
    return val || undefined;
  };

  const getArrayParam = (key: string): string[] => {
    if (rawParams instanceof URLSearchParams) {
      const all = rawParams.getAll(key);
      if (all.length > 0) {
        return all.flatMap((item) => item.split(",")).map((s) => s.trim().toLowerCase()).filter(Boolean);
      }
      return [];
    }
    const val = rawParams[key];
    if (Array.isArray(val)) {
      return val.flatMap((item) => item.split(",")).map((s) => s.trim().toLowerCase()).filter(Boolean);
    }
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    }
    return [];
  };

  const q = getParam("q")?.trim() || "";
  const category = getParam("category")?.trim().toLowerCase() || "all";
  const brands = getArrayParam("brand");

  const minRaw = getParam("minPrice");
  const maxRaw = getParam("maxPrice");

  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  if (minRaw !== undefined) {
    const parsed = Number(minRaw);
    if (!isNaN(parsed) && parsed >= 0) {
      minPrice = parsed;
    }
  }

  if (maxRaw !== undefined) {
    const parsed = Number(maxRaw);
    if (!isNaN(parsed) && parsed >= 0) {
      maxPrice = parsed;
    }
  }

  const rawSort = getParam("sort")?.toLowerCase();
  const validSorts: SortOption[] = ["featured", "price-asc", "price-desc", "name-asc", "name-desc"];
  const sort: SortOption = validSorts.includes(rawSort as SortOption)
    ? (rawSort as SortOption)
    : "featured";

  return {
    query: q,
    category,
    brands,
    minPrice,
    maxPrice,
    sort,
  };
}

/**
 * Format filter state into standard URL search query string.
 */
export function toQueryString(filters: Partial<CatalogueFilterState>): string {
  const params = new URLSearchParams();

  if (filters.query && filters.query.trim()) {
    params.set("q", filters.query.trim());
  }

  if (filters.category && filters.category.toLowerCase() !== "all") {
    params.set("category", filters.category.toLowerCase());
  }

  if (filters.brands && filters.brands.length > 0) {
    params.set("brand", filters.brands.join(","));
  }

  if (typeof filters.minPrice === "number" && !isNaN(filters.minPrice)) {
    params.set("minPrice", filters.minPrice.toString());
  }

  if (typeof filters.maxPrice === "number" && !isNaN(filters.maxPrice)) {
    params.set("maxPrice", filters.maxPrice.toString());
  }

  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  const str = params.toString();
  return str ? `?${str}` : "";
}
