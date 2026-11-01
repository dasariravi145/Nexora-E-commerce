/**
 * Centralized TypeScript Models for NEXORA Product Catalogue.
 * Defines the single source of truth for products, categories, specifications,
 * images, and variants across the application.
 */

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
  group?: "Display" | "Performance" | "Materials" | "Acoustics" | "Battery" | "Connectivity" | "Dimensions";
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  colorName?: string;
  colorHex?: string;
  storage?: string;
  ram?: string;
  size?: string;
  configuration?: string;
  demoPriceDelta?: number;
  isAvailableDemo?: boolean;
  imageIndex?: number;
  imageUrl?: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  origin: string;
  specialization: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  iconName: "Smartphone" | "Laptop" | "Headphones" | "Gamepad2" | "Watch" | "Cable";
  itemCount: number;
  accentColor: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  tagline: string;
  description: string;
  demoPrice: number;
  formattedPrice: string;
  currency: "INR";
  images: ProductImage[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  variants?: ProductVariant[];
  has3DModel?: boolean;
  modelType?: "interactive-turntable" | "procedural-scene" | "gltf-model" | "none";
  modelUrl?: string;
  modelLicense?: string;
  modelSource?: string;
  isProcedural?: boolean;
  highlightBadge?: string;
  badgeVariant?: "electric" | "violet" | "subtle";
  featured?: boolean;
  /** Backward-compatible shorthand array of key technical bullet points */
  specs: string[];
}

/** Backward-compatibility alias for Product */
export type ProductItem = Product;

/**
 * Compact AI Agent Product Summary for local n8n / AI Agent integrations.
 * Strictly uses real catalogue values without fabricated stock or availability.
 */
export interface CompactAiProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  tagline: string;
  demoPrice: number;
  formattedPrice: string;
  currency: "INR";
  specifications: string[];
  url: string;
}

/**
 * Envelope for GET /api/ai/products responses.
 */
export interface AiProductsApiResponse {
  count: number;
  totalAvailable: number;
  filtersApplied: {
    category?: string;
    maxPrice?: number;
    search?: string;
    limit: number;
  };
  products: CompactAiProduct[];
}

