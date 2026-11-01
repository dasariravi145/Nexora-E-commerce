import type { Product } from "@/types";

export interface BrandMetadata {
  slug: string;
  name: string;
  origin: string;
  focus: string;
  tagline: string;
  description: string;
  insignia: string;
  accentGradient: string;
  accentBorder: string;
  accentText: string;
}

/**
 * Curated brand metadata definitions.
 * Mapped to the exact brand slugs found in the centralized product catalogue.
 */
export const BRANDS_DIRECTORY: Record<string, BrandMetadata> = {
  "nexora-labs": {
    slug: "nexora-labs",
    name: "NEXORA LABS",
    origin: "Kyoto / Bangalore",
    focus: "Neural Silicon & Spatial Titanium Flagships",
    tagline: "Pioneering Spatial Computing & Neural Enclaves",
    description:
      "NEXORA's core advanced research laboratory developing custom neural silicon, aerospace titanium communicators, and holographic optical arrays.",
    insignia: "NX",
    accentGradient: "from-blue-600/25 via-blue-900/10 to-transparent",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    accentText: "text-blue-400",
  },
  "kinetic-labs": {
    slug: "kinetic-labs",
    name: "KINETIC LABS",
    origin: "Tokyo / Zurich",
    focus: "Spatial Display Optics & Cybernetic Compute Decks",
    tagline: "Fluid Dynamic Computing & Holographic Interfaces",
    description:
      "Engineering tactile mechanical surfaces, dual-screen spatial decks, and active matrix projection systems for creative technologists.",
    insignia: "KN",
    accentGradient: "from-cyan-600/25 via-blue-950/20 to-transparent",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    accentText: "text-cyan-400",
  },
  "vortex-acoustics": {
    slug: "vortex-acoustics",
    name: "VORTEX ACOUSTICS",
    origin: "Berlin",
    focus: "Beryllium Diaphragms & Planar Driver Physics",
    tagline: "Ultra-Linear Acoustic Reference Science",
    description:
      "Dedicated exclusively to high-fidelity audio transducers, beryllium planar diaphragms, and harmonic distortion cancellation.",
    insignia: "VX",
    accentGradient: "from-purple-600/25 via-indigo-950/20 to-transparent",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    accentText: "text-purple-400",
  },
  "aura-silicon": {
    slug: "aura-silicon",
    name: "AURA SILICON",
    origin: "Stockholm",
    focus: "Ultra-Low-Power Neural Modules & Biometric Peripherals",
    tagline: "Micro-Architectural Biometric Sensors",
    description:
      "Innovators in micro-watt ambient computing, continuous cardiovascular sensors, and kinetic neural telemetry rings.",
    insignia: "AU",
    accentGradient: "from-sky-600/25 via-emerald-950/20 to-transparent",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    accentText: "text-sky-400",
  },
  "chrono-rigs": {
    slug: "chrono-rigs",
    name: "CHRONO RIGS",
    origin: "Reykjavik",
    focus: "Cryo-Cooled Workstations & Phase-Change Thermal Pads",
    tagline: "Extreme Thermal Dispersion & Micro-Mechanical Enclosures",
    description:
      "Specialized in sub-zero vapor matrix loops, phase-change alloy pads, and aerospace chassis for mission-critical compute.",
    insignia: "CR",
    accentGradient: "from-indigo-600/25 via-violet-950/20 to-transparent",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    accentText: "text-indigo-400",
  },
  "magbridge-optics": {
    slug: "magbridge-optics",
    name: "MAGBRIDGE OPTICS",
    origin: "San Francisco",
    focus: "Liquid-Crystal Micro-Prisms & High-Speed Optical Cables",
    tagline: "Photonic Data Interconnects & Magnetic Interfaces",
    description:
      "Architects of ultra-high-speed 100Gbps optical interconnects, magnetic modular docking bridges, and gallium nitride power matrices.",
    insignia: "MB",
    accentGradient: "from-slate-600/25 via-slate-950/20 to-transparent",
    accentBorder: "border-slate-500/30 hover:border-slate-400/60",
    accentText: "text-slate-300",
  },
};

export interface BrandEntry extends BrandMetadata {
  itemCount: number;
  products: Product[];
}

/**
 * Dynamically extract all brands present in the product catalogue.
 * Automatically synchronizes counts with products in real time.
 */
export function getAllBrands(products: Product[]): BrandEntry[] {
  const brandMap = new Map<string, { name: string; slug: string; products: Product[] }>();

  for (const product of products) {
    const slug = product.brandSlug.toLowerCase();
    const existing = brandMap.get(slug);
    if (existing) {
      existing.products.push(product);
    } else {
      brandMap.set(slug, {
        name: product.brand,
        slug,
        products: [product],
      });
    }
  }

  const results: BrandEntry[] = [];

  for (const [slug, data] of brandMap.entries()) {
    const meta = BRANDS_DIRECTORY[slug] || {
      slug,
      name: data.name,
      origin: "Global Partner Lab",
      focus: "Precision Electronics",
      tagline: "Artisan Hardware Design",
      description: "Collaborative hardware lab crafting precision components for the NEXORA ecosystem.",
      insignia: data.name.slice(0, 2).toUpperCase(),
      accentGradient: "from-blue-600/20 to-transparent",
      accentBorder: "border-white/10 hover:border-blue-500/40",
      accentText: "text-blue-400",
    };

    results.push({
      ...meta,
      name: data.name,
      itemCount: data.products.length,
      products: data.products,
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get single brand entry by slug.
 */
export function getBrandBySlug(slug: string, products: Product[]): BrandEntry | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase();
  const all = getAllBrands(products);
  return all.find((b) => b.slug.toLowerCase() === cleanSlug);
}

/**
 * Get all products belonging to a brand slug.
 */
export function getProductsByBrand(brandSlug: string, products: Product[]): Product[] {
  if (!brandSlug) return [];
  const clean = brandSlug.toLowerCase();
  return products.filter((p) => p.brandSlug.toLowerCase() === clean);
}
