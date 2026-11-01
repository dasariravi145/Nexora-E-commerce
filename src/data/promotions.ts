import type { Promotion } from "@/types";
import { formatINR } from "@/lib/format";

/**
 * Standard disclaimer terms shared across all demonstration promotions.
 */
const BASE_TERMS: string[] = [
  "This is an illustrative demonstration offer engineered for the NEXORA portfolio showcase.",
  "No actual financial transaction, payment gateway, or commercial purchase is completed.",
  "Demo pricing reflects illustrative laboratory incentive tiers calculated strictly against base catalogue prices in Indian Rupees (INR).",
  "Promotional allocations are simulated for user experience testing and architecture evaluation.",
  "Variant selections with additional memory or storage configurations may incur standard demo price deltas.",
];

/**
 * Centralized Demo Promotions Dataset for NEXORA.
 * 6 Active Promotions covering all 6 Core Hardware Divisions, plus 1 Disabled Promotion for defensive lifecycle testing.
 * References existing products by stable IDs (prod-XX) without duplicating product data.
 */
export const promotions: Promotion[] = [
  // 1. SMARTPHONES
  {
    id: "promo-01",
    slug: "nova-flagship-founders-tier",
    title: "NEXORA Nova 1 Pro • Founders Tier Demo",
    tagline: "Introductory Demonstration Allocation for Titanium Neural Communicator",
    description:
      "Milled Grade-5 titanium chassis paired with the 32-core Neural Silicon X2 and quantum micro-OLED panel. Configured under the NEXORA introductory demonstration drop with verified laboratory incentive pricing.",
    promotionType: "lab-incentive",
    badgeText: "Founders Tier Demo",
    badgeVariant: "electric",
    categorySlug: "smartphones",
    categoryName: "Smartphones",
    featured: true,
    displayPriority: 1,
    enabled: true,
    eligibleProductIds: ["prod-01"],
    originalPrice: 129999,
    promotionalPrice: 114999,
    savingsAmount: 15000,
    savingsPercent: 12,
    formattedPromotionalPrice: formatINR(114999),
    formattedOriginalPrice: formatINR(129999),
    formattedSavingsAmount: formatINR(15000),
    eligibilityRules: [
      "Applies specifically to the base 256GB Unified Obsidian Titanium configuration.",
      "Single demonstration reservation per developer account.",
      "Requires verified laboratory telemetry profile.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Demonstration incentive is non-transferable and holds zero redeemable cash value.",
    ],
    applicableVariantsNote: "Promotional pricing applies specifically to the Obsidian Titanium base configuration.",
  },

  // 2. LAPTOPS
  {
    id: "promo-02",
    slug: "zephyr-creator-studio-pass",
    title: "Zephyr 16 Studio • Workstation Creator Pass",
    tagline: "Dual 4K HDR Micro-OLED Workstation Demonstration Incentive",
    description:
      "Complete creative computing rig featuring dual touch surfaces, 140W whisper-quiet cryogenic vapor loop, and 64GB unified memory. Packaged with illustrative demonstration creator pass pricing.",
    promotionType: "direct-discount",
    badgeText: "Creator Pass Demo",
    badgeVariant: "violet",
    categorySlug: "laptops",
    categoryName: "Laptops",
    featured: true,
    displayPriority: 2,
    enabled: true,
    eligibleProductIds: ["prod-06"],
    originalPrice: 289999,
    promotionalPrice: 259999,
    savingsAmount: 30000,
    savingsPercent: 10,
    formattedPromotionalPrice: formatINR(259999),
    formattedOriginalPrice: formatINR(289999),
    formattedSavingsAmount: formatINR(30000),
    eligibilityRules: [
      "Configured for base 32GB RAM / 1TB NVMe SSD production tier.",
      "Includes complimentary high-bandwidth spatial stylus accessory demo.",
      "Active spatial studio seat certification required.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Upgrades to 64GB or 128GB configurations apply standard variant price deltas.",
    ],
    applicableVariantsNote: "Configured for base 32GB RAM / 1TB NVMe SSD specification.",
  },

  // 3. AUDIO
  {
    id: "promo-03",
    slug: "vortex-planar-soundstage-tier",
    title: "Vortex Resonance • Planar Soundstage Tier",
    tagline: "Ultra-Linear Planar Magnetic Acoustic Demonstration",
    description:
      "Beryllium diaphragms and acoustic waveguide chassis engineered in Berlin. Designed for master audio monitoring and spatial soundstage depth with introductory laboratory incentive.",
    promotionType: "seasonal-showcase",
    badgeText: "Acoustic Lab Demo",
    badgeVariant: "electric",
    categorySlug: "audio",
    categoryName: "Audio",
    featured: false,
    displayPriority: 3,
    enabled: true,
    eligibleProductIds: ["prod-11"],
    originalPrice: 89999,
    promotionalPrice: 79999,
    savingsAmount: 10000,
    savingsPercent: 11,
    formattedPromotionalPrice: formatINR(79999),
    formattedOriginalPrice: formatINR(89999),
    formattedSavingsAmount: formatINR(10000),
    eligibilityRules: [
      "Applies to Matte Carbon reference finish.",
      "Includes 4.4mm balanced silver-plated interconnect cable demo.",
      "Subject to demonstration laboratory acoustic batch release schedules.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Demonstration package includes reference soundstage measurement curve.",
    ],
    applicableVariantsNote: "Applies to Matte Carbon reference finish.",
  },

  // 4. GAMING
  {
    id: "promo-04",
    slug: "chrono-spatial-accelerator-pack",
    title: "Chrono Spatial Rig • Accelerator Pack",
    tagline: "Sub-Millisecond Synapse Gaming Rig Demonstration",
    description:
      "Dual liquid-metal cooling loops, unthrottled GPU pipeline, and active haptic integration for extreme low-latency spatial simulations.",
    promotionType: "direct-discount",
    badgeText: "Synapse Rig Demo",
    badgeVariant: "violet",
    categorySlug: "gaming",
    categoryName: "Gaming",
    featured: false,
    displayPriority: 4,
    enabled: true,
    eligibleProductIds: ["prod-16"],
    originalPrice: 249999,
    promotionalPrice: 219999,
    savingsAmount: 30000,
    savingsPercent: 12,
    formattedPromotionalPrice: formatINR(219999),
    formattedOriginalPrice: formatINR(249999),
    formattedSavingsAmount: formatINR(30000),
    eligibilityRules: [
      "Applies to Liquid-Chilled Apex Edition.",
      "Calibrated for sub-millisecond tactile haptic response.",
      "Includes virtual simulation developer toolkit demo.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Cooling fluid requires periodic benchmark inspection in production.",
    ],
    applicableVariantsNote: "Applies to Liquid-Chilled Apex Edition.",
  },

  // 5. WEARABLES
  {
    id: "promo-05",
    slug: "aura-biometric-telemetry-suite",
    title: "Aura Ring Pro • Biometric Telemetry Suite",
    tagline: "Continuous Medical-Grade Spatial Health Monitoring",
    description:
      "Titanium-ceramic biometric ring with medical-grade photoplethysmography and optical sensor matrix. Early adopter prototype demonstration bundle.",
    promotionType: "bundle-tier",
    badgeText: "Biometric Suite Demo",
    badgeVariant: "subtle",
    categorySlug: "wearables",
    categoryName: "Wearables",
    featured: false,
    displayPriority: 5,
    enabled: true,
    eligibleProductIds: ["prod-21"],
    originalPrice: 34999,
    promotionalPrice: 29999,
    savingsAmount: 5000,
    savingsPercent: 14,
    formattedPromotionalPrice: formatINR(29999),
    formattedOriginalPrice: formatINR(34999),
    formattedSavingsAmount: formatINR(5000),
    eligibilityRules: [
      "Valid for Size 10 Obsidian Black finish.",
      "Includes magnetic induction wireless charging puck demo.",
      "Biometric telemetry API key provisioned on enrollment.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Sizing fit kit recommendation precedes physical unit calibration.",
    ],
    applicableVariantsNote: "Valid for Size 10 Obsidian Black finish.",
  },

  // 6. ACCESSORIES
  {
    id: "promo-06",
    slug: "magbridge-optical-interconnect-suite",
    title: "MagBridge 100G • Modular Interconnect Suite",
    tagline: "Gallium Nitride & 100Gbps Optical Bus Demonstration",
    description:
      "High-bandwidth photonic interconnect hub with GaN power regulation and magnetic quick-release interface for spatial workstations.",
    promotionType: "bundle-tier",
    badgeText: "Optical Hub Demo",
    badgeVariant: "electric",
    categorySlug: "accessories",
    categoryName: "Accessories",
    featured: false,
    displayPriority: 6,
    enabled: true,
    eligibleProductIds: ["prod-26"],
    originalPrice: 24999,
    promotionalPrice: 19999,
    savingsAmount: 5000,
    savingsPercent: 20,
    formattedPromotionalPrice: formatINR(19999),
    formattedOriginalPrice: formatINR(24999),
    formattedSavingsAmount: formatINR(5000),
    eligibilityRules: [
      "Applies to standard Studio Silver edition.",
      "Compatible with all USB4 and Thunderbolt 4/5 optical interconnects.",
    ],
    termsAndConditions: [
      ...BASE_TERMS,
      "Includes 2.0-meter multi-core active optical patch cable demo.",
    ],
    applicableVariantsNote: "Applies to standard Studio Silver edition.",
  },

  // 7. DISABLED PROMOTION (Defensive Lifecycle Testing)
  {
    id: "promo-07",
    slug: "archived-prototype-pilot",
    title: "Archived Prototype Pilot • Allocation Closed",
    tagline: "Concluded Batch Allocation",
    description:
      "Prior demonstration allocation currently inactive. Stored for historical architectural validation and defensive lifecycle testing.",
    promotionType: "lab-incentive",
    badgeText: "Archived Demo",
    badgeVariant: "subtle",
    categorySlug: "gaming",
    categoryName: "Gaming",
    featured: false,
    displayPriority: 99,
    enabled: false,
    eligibleProductIds: ["prod-17"],
    originalPrice: 189999,
    promotionalPrice: 169999,
    savingsAmount: 20000,
    savingsPercent: 11,
    formattedPromotionalPrice: formatINR(169999),
    formattedOriginalPrice: formatINR(189999),
    formattedSavingsAmount: formatINR(20000),
    eligibilityRules: ["Batch allocation is archived."],
    termsAndConditions: [...BASE_TERMS],
  },
];

/**
 * Returns all active (enabled: true) promotions sorted by displayPriority.
 */
export function getActivePromotions(): Promotion[] {
  return promotions
    .filter((p) => p.enabled)
    .sort((a, b) => a.displayPriority - b.displayPriority);
}

/**
 * Returns a promotion by its unique ID.
 */
export function getPromotionById(id: string): Promotion | undefined {
  if (!id) return undefined;
  return promotions.find((p) => p.id === id);
}

/**
 * Returns a promotion by its URL-friendly slug.
 */
export function getPromotionBySlug(slug: string): Promotion | undefined {
  if (!slug) return undefined;
  const clean = slug.trim().toLowerCase();
  return promotions.find((p) => p.slug.toLowerCase() === clean);
}

/**
 * Returns active promotions for a specific hardware category slug.
 */
export function getPromotionsByCategory(categorySlug: string): Promotion[] {
  if (!categorySlug || categorySlug === "all") {
    return getActivePromotions();
  }
  const clean = categorySlug.trim().toLowerCase();
  return getActivePromotions().filter((p) => p.categorySlug.toLowerCase() === clean);
}
