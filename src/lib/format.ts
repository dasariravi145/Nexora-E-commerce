import type { Product, ProductVariant } from "@/types/product";

/**
 * Utility functions for currency and numerical formatting.
 * NEXORA standardizes on Indian Rupee (INR) for all illustrative demo prices.
 */

/**
 * Formats a numerical amount to standard Indian Rupee (INR) currency format.
 * Example: 129999 -> "₹1,29,999.00"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Determines whether a variant attribute/descriptor (such as storage capacity,
 * memory, or size) is already represented within the variant's display name,
 * avoiding duplicate labels like "512GB Unified • 512GB Unified" or "32GB RAM • 32GB RAM".
 */
export function isDescriptorRedundant(
  descriptor?: string | null,
  variantName?: string | null
): boolean {
  if (!descriptor || !descriptor.trim()) {
    return true; // Nothing meaningful to display
  }
  if (!variantName || !variantName.trim()) {
    return false;
  }

  const normDesc = descriptor.toLowerCase().trim();
  const normName = variantName.toLowerCase().trim();

  // 1. Direct substring match (e.g., "512gb unified" inside "electric azure • 512gb unified")
  if (normName.includes(normDesc)) {
    return true;
  }

  // 2. Capacity / measurement token match (e.g., "512gb", "1tb", "2tb", "4tb", "32gb", "64gb", "128gb", "42mm", "46mm")
  const measurementMatch = normDesc.match(/\b\d+(?:\.\d+)?\s*(?:gb|tb|mb|mm|ghz|k)\b/i);
  if (measurementMatch) {
    const compactToken = measurementMatch[0].replace(/\s+/g, "");
    const spacedToken = measurementMatch[0];
    const normNameCompact = normName.replace(/\s+/g, "");
    if (normName.includes(spacedToken) || normNameCompact.includes(compactToken)) {
      return true;
    }
  }

  // 3. Numbered size match (e.g., "size 8", "size 10", "size 12")
  const sizeMatch = normDesc.match(/\bsize\s*\d+\b/i);
  if (sizeMatch) {
    const compactSize = sizeMatch[0].replace(/\s+/g, "");
    const normNameCompact = normName.replace(/\s+/g, "");
    if (normName.includes(sizeMatch[0]) || normNameCompact.includes(compactSize)) {
      return true;
    }
  }

  return false;
}

/**
 * Formats a clean, non-duplicated specification label for a product variant.
 * If attributes like storage or RAM are already present in the variant name,
 * they are omitted to avoid repetitive text.
 */
export function formatVariantLabel(variant: ProductVariant): string {
  const parts: string[] = [variant.name];
  if (variant.size && !isDescriptorRedundant(variant.size, variant.name)) {
    parts.push(variant.size);
  }
  if (variant.ram && !isDescriptorRedundant(variant.ram, variant.name)) {
    parts.push(variant.ram);
  }
  if (variant.storage && !isDescriptorRedundant(variant.storage, variant.name)) {
    parts.push(variant.storage);
  }
  return parts.join(" • ");
}

export interface ProductStartingPriceInfo {
  /** True if the product has multiple purchasable variants with differing prices */
  hasPriceRange: boolean;
  /** Lowest purchasable price among product and its variants */
  minPrice: number;
  /** Highest purchasable price among product and its variants */
  maxPrice: number;
  /** Formatted minimum price in INR (e.g., "₹1,29,999.00") */
  formattedMinPrice: string;
  /** Complete display price string (e.g., "From ₹1,29,999.00" or "₹79,999.00") */
  displayPrice: string;
}

/**
 * Calculates starting price details for a product.
 * - When a product has multiple purchasable variants with differing prices, displays "From ₹XX,XXX".
 * - For products with a single fixed price, retains "₹XX,XXX".
 * - For multiple variants with identical prices, retains "₹XX,XXX" without misleading "From".
 */
export function getProductStartingPrice(product: Product): ProductStartingPriceInfo {
  const basePrice = product.demoPrice;
  const variants = product.variants;

  if (!variants || variants.length <= 1) {
    const formatted = product.formattedPrice || formatINR(basePrice);
    return {
      hasPriceRange: false,
      minPrice: basePrice,
      maxPrice: basePrice,
      formattedMinPrice: formatted,
      displayPrice: formatted,
    };
  }

  const prices = variants.map((v) => basePrice + (v.demoPriceDelta ?? 0));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasPriceRange = minPrice !== maxPrice;
  const formattedMinPrice = formatINR(minPrice);

  return {
    hasPriceRange,
    minPrice,
    maxPrice,
    formattedMinPrice,
    displayPrice: hasPriceRange ? `From ${formattedMinPrice}` : formattedMinPrice,
  };
}

