/**
 * Typed Demo Promotions & Offers Data Model for NEXORA.
 * Defines structure for honest demonstration incentives linked to centralized products.
 */

export type PromotionType =
  | "direct-discount"
  | "bundle-tier"
  | "lab-incentive"
  | "seasonal-showcase";

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  promotionType: PromotionType;
  badgeText: string;
  badgeVariant?: "electric" | "violet" | "subtle";
  categorySlug: string; // "smartphones" | "laptops" | "audio" | "gaming" | "wearables" | "accessories"
  categoryName: string;
  featured: boolean;
  displayPriority: number;
  enabled: boolean;
  eligibleProductIds: string[]; // Stable product IDs referencing src/data/products.ts
  promotionalPrice: number; // Demo discounted price in INR
  originalPrice: number; // Baseline demo price in INR
  savingsAmount: number; // originalPrice - promotionalPrice
  savingsPercent: number; // Math.round((savingsAmount / originalPrice) * 100)
  formattedPromotionalPrice: string;
  formattedOriginalPrice: string;
  formattedSavingsAmount: string;
  eligibilityRules: string[];
  termsAndConditions: string[];
  applicableVariantsNote?: string;
}
