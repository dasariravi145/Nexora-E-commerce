import type { ProductCategory, Product } from "@/types";

/**
 * Centralized Category Dataset for NEXORA.
 * 6 Core Categories: Smartphones, Laptops, Audio, Gaming, Wearables, Accessories.
 */
export const categories: ProductCategory[] = [
  {
    id: "cat-smartphones",
    slug: "smartphones",
    name: "Smartphones",
    tagline: "Neural-Core Telemetry",
    description: "Spatial mobile communicators with titanium chassis and micro-OLED quantum displays.",
    iconName: "Smartphone",
    itemCount: 5,
    accentColor: "from-blue-600/30 via-blue-500/10 to-transparent",
  },
  {
    id: "cat-laptops",
    slug: "laptops",
    name: "Laptops",
    tagline: "Liquid Vapor Architecture",
    description: "Dual-touch OLED workstations powered by cryogenic thermal vapor chambers.",
    iconName: "Laptop",
    itemCount: 5,
    accentColor: "from-indigo-600/30 via-indigo-500/10 to-transparent",
  },
  {
    id: "cat-audio",
    slug: "audio",
    name: "Audio",
    tagline: "Planar Magnetic Physics",
    description: "Ultra-linear acoustic monitors and beryllium driver headphones with spatial staging.",
    iconName: "Headphones",
    itemCount: 5,
    accentColor: "from-purple-600/30 via-purple-500/10 to-transparent",
  },
  {
    id: "cat-gaming",
    slug: "gaming",
    name: "Gaming",
    tagline: "Sub-Millisecond Synapse",
    description: "Ultra-low latency custom spatial rigs, haptic peripherals, and neural feedback devices.",
    iconName: "Gamepad2",
    itemCount: 5,
    accentColor: "from-blue-600/30 via-purple-500/10 to-transparent",
  },
  {
    id: "cat-wearables",
    slug: "wearables",
    name: "Wearables",
    tagline: "Continuous Biometric Matrix",
    description: "Tactile haptic rings, telemetry wrist units, and spatial gesture optical sensors.",
    iconName: "Watch",
    itemCount: 5,
    accentColor: "from-violet-600/30 via-blue-500/10 to-transparent",
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    tagline: "High-Bandwidth Interconnects",
    description: "100Gbps optical bridges, magnetic induction power blocks, and precision desktop mounts.",
    iconName: "Cable",
    itemCount: 5,
    accentColor: "from-slate-600/30 via-blue-500/10 to-transparent",
  },
];

/**
 * Category-specific visual identity configurations.
 * Adheres strictly to NEXORA's luxury dark palette with tailored division accents.
 */
export interface CategoryVisualTheme {
  accentColor: string;
  badgeVariant: "electric" | "violet" | "subtle";
  glowColor: string;
  heroGradient: string;
  accentText: string;
  borderColor: string;
  taglineColor: string;
  discipline: string;
}

export const CATEGORY_THEMES: Record<string, CategoryVisualTheme> = {
  smartphones: {
    accentColor: "blue",
    badgeVariant: "electric",
    glowColor: "rgba(59, 130, 246, 0.15)",
    heroGradient: "from-blue-600/25 via-blue-950/20 to-transparent",
    accentText: "text-blue-400",
    borderColor: "border-blue-500/30",
    taglineColor: "text-blue-300",
    discipline: "Mobile Telemetry & Quantum Silicon",
  },
  laptops: {
    accentColor: "violet",
    badgeVariant: "violet",
    glowColor: "rgba(139, 92, 246, 0.15)",
    heroGradient: "from-violet-600/25 via-purple-950/20 to-transparent",
    accentText: "text-violet-400",
    borderColor: "border-violet-500/30",
    taglineColor: "text-violet-300",
    discipline: "Dual-Display Spatial Workstations",
  },
  audio: {
    accentColor: "cyan",
    badgeVariant: "electric",
    glowColor: "rgba(6, 182, 212, 0.15)",
    heroGradient: "from-cyan-600/25 via-slate-950/20 to-transparent",
    accentText: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    taglineColor: "text-cyan-300",
    discipline: "Planar Driver & Acoustic Physics",
  },
  gaming: {
    accentColor: "indigo",
    badgeVariant: "violet",
    glowColor: "rgba(99, 102, 241, 0.15)",
    heroGradient: "from-indigo-600/25 via-purple-950/20 to-transparent",
    accentText: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    taglineColor: "text-indigo-300",
    discipline: "Sub-Millisecond Neural Haptics",
  },
  wearables: {
    accentColor: "sky",
    badgeVariant: "electric",
    glowColor: "rgba(14, 165, 233, 0.15)",
    heroGradient: "from-sky-600/25 via-blue-950/20 to-transparent",
    accentText: "text-sky-400",
    borderColor: "border-sky-500/30",
    taglineColor: "text-sky-300",
    discipline: "Continuous Biometric Architecture",
  },
  accessories: {
    accentColor: "slate",
    badgeVariant: "subtle",
    glowColor: "rgba(148, 163, 184, 0.15)",
    heroGradient: "from-slate-600/25 via-slate-950/20 to-transparent",
    accentText: "text-slate-300",
    borderColor: "border-slate-500/30",
    taglineColor: "text-slate-400",
    discipline: "Precision Hardware Interconnects",
  },
};

/**
 * Lookup helper: finds category by slug (case-insensitive).
 */
export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  if (!slug) return undefined;
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Dynamically counts items for a category from an array of products.
 * Guarantees zero hardcoded count desynchronization.
 */
export function getCategoryItemCount(categorySlug: string, products: Product[]): number {
  return products.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase()).length;
}
