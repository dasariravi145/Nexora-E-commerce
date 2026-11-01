import type { Product, Promotion } from "@/types";
import { formatINR } from "@/lib/format";
import { promotions } from "@/data/promotions";
import { getProductById } from "@/data/products";

export interface CalculatedSavings {
  savingsAmount: number;
  savingsPercent: number;
  formattedSavings: string;
  isValid: boolean;
}

/**
 * Validates and calculates demo savings strictly from original and promotional prices.
 * Defensively handles inverted or invalid pricing without fabricating numbers.
 */
export function calculateSavings(
  originalPrice: number,
  promotionalPrice: number
): CalculatedSavings {
  if (
    typeof originalPrice !== "number" ||
    typeof promotionalPrice !== "number" ||
    isNaN(originalPrice) ||
    isNaN(promotionalPrice) ||
    originalPrice <= 0 ||
    promotionalPrice <= 0 ||
    promotionalPrice >= originalPrice
  ) {
    return {
      savingsAmount: 0,
      savingsPercent: 0,
      formattedSavings: formatINR(0),
      isValid: false,
    };
  }

  const savingsAmount = originalPrice - promotionalPrice;
  const savingsPercent = Math.round((savingsAmount / originalPrice) * 100);

  return {
    savingsAmount,
    savingsPercent,
    formattedSavings: formatINR(savingsAmount),
    isValid: true,
  };
}

/**
 * Determines whether a product qualifies for a specific promotion.
 * Rules:
 * 1. Both product and promotion must be defined.
 * 2. Promotion must be actively enabled (enabled: true).
 * 3. Product ID must be listed in promotion.eligibleProductIds.
 * 4. Product categorySlug must match promotion categorySlug.
 */
export function isProductEligibleForPromotion(
  product: Product | null | undefined,
  promotion: Promotion | null | undefined
): boolean {
  if (!product || !promotion) return false;
  if (!promotion.enabled) return false;
  if (!Array.isArray(promotion.eligibleProductIds)) return false;

  const hasIdMatch = promotion.eligibleProductIds.includes(product.id);
  const hasCategoryMatch =
    product.categorySlug.toLowerCase() === promotion.categorySlug.toLowerCase();

  return hasIdMatch && hasCategoryMatch;
}

/**
 * Returns all active promotions applicable to a specific product ID.
 */
export function getPromotionsForProduct(
  productId: string,
  promos: Promotion[] = promotions
): Promotion[] {
  if (!productId) return [];
  return promos.filter(
    (promo) => promo.enabled && promo.eligibleProductIds.includes(productId)
  );
}

/**
 * Resolves all eligible product objects for a promotion from the centralized dataset.
 * Safely prunes any non-existent, deleted, or corrupted product IDs.
 */
export function getPromotionEligibleProducts(
  promotion: Promotion,
  allProducts?: Product[]
): Product[] {
  if (!promotion || !Array.isArray(promotion.eligibleProductIds)) return [];

  const resolved: Product[] = [];
  for (const id of promotion.eligibleProductIds) {
    if (typeof id === "string") {
      let p: Product | undefined;
      if (allProducts && allProducts.length > 0) {
        p = allProducts.find((item) => item.id === id);
      } else {
        p = getProductById(id);
      }
      if (p) {
        resolved.push(p);
      }
    }
  }

  return resolved;
}
