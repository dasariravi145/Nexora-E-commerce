import type {
  AboutCoreValue,
  AboutPhilosophyPillar,
  AboutExperiencePrinciple,
  AboutDemoFeature,
  AboutFutureVision,
  AboutTrustPillar,
} from "@/types/about";

/**
 * Editorial content and architectural models for the NEXORA About experience.
 * Formulated strictly without fabricated corporate claims, fake employees,
 * awards, or invented manufacturer partnerships.
 */

export const brandManifesto = {
  eyebrow: "Architectural Concept & Philosophy",
  title: "The Architecture of Next-Generation Hardware Discovery",
  tagline: "Bridging industrial electronics engineering with spatial digital exploration.",
  mission:
    "NEXORA was conceived as an avant-garde digital storefront and architectural case study in premium electronics retail. We explore how consumer hardware—from spatial communicators to planar acoustic monitors—can be experienced digitally with the same physical presence, technical rigor, and aesthetic honesty found in world-class industrial design studios.",
  thesis:
    "Traditional e-commerce often obscures hardware reality behind low-resolution thumbnails, confusing variant configurations, and deceptive scarcity tactics. NEXORA demonstrates an alternative standard: transparent engineering data, real-time 3D orbital inspection, single-source-of-truth pricing, and an interface built from ground-level design tokens.",
};

export const coreValues: AboutCoreValue[] = [
  {
    id: "value-thoughtful-design",
    title: "Thoughtful Design",
    tagline: "Form strictly serving acoustic and thermal utility.",
    description:
      "We believe digital interfaces and physical electronics share a single mandate: deliberate simplicity. Every surface, chamfer, and interface interaction exists for ergonomic comfort, heat dissipation, or intuitive clarity.",
    iconName: "Compass",
    pillLabel: "Ergonomic & Thermal Intent",
  },
  {
    id: "value-product-clarity",
    title: "Product Clarity",
    tagline: "Uncompromising technical transparency.",
    description:
      "Every specification in our catalogue—from planar driver diaphragm thickness to silicon coprocessor frequencies—is documented with full architectural precision. We reject buzzword inflation and hidden compromises.",
    iconName: "Eye",
    pillLabel: "Zero Fabricated Specs",
  },
  {
    id: "value-accessible-technology",
    title: "Accessible Technology",
    tagline: "Universal access through inclusive engineering.",
    description:
      "True luxury is effortless for every human. Our digital storefront enforces semantic HTML5 structure, WAI-ARIA tablist protocols, high-contrast typography, keyboard navigation, and full prefers-reduced-motion honor.",
    iconName: "Accessibility",
    pillLabel: "WCAG 2.1 AA Compliance",
  },
  {
    id: "value-effortless-discovery",
    title: "Effortless Discovery",
    tagline: "Fluid, multi-parametric hardware navigation.",
    description:
      "Navigating complex hardware should feel intuitive. With multi-angle views, side-by-side specification matrices, division filters, and real-time 3D model interaction, discovering hardware is seamless.",
    iconName: "Sparkles",
    pillLabel: "Multi-Parametric Flow",
  },
];

export const philosophyPillars: AboutPhilosophyPillar[] = [
  {
    id: "pillar-material-integrity",
    number: "01",
    title: "Monolithic Physicality",
    subtitle: "Aerospace Metallurgy & Acoustic Mastery",
    description:
      "We design hardware around uncompromising materials: Grade-5 titanium chassis, precision-machined aluminum unibodies, and ultra-thin beryllium diaphragms. Instead of concealing interior engineering, our aesthetics celebrate raw structural honesty and purposeful cooling geometry.",
    keyPoints: [
      "Precision cold-forged Grade-5 titanium and 6000-series aluminum alloys",
      "Field-replaceable thermal conduits and vapor chambers",
      "Beryllium and neodymium acoustic transducer assemblies",
      "Anti-reflective nano-textured ceramic display coatings",
    ],
    accentColor: "electric",
  },
  {
    id: "pillar-spatial-interfaces",
    number: "02",
    title: "Spatial-First Digital Architecture",
    subtitle: "Beyond Flat 2D Thumbnails",
    description:
      "Electronics exist in three physical dimensions; their digital discovery should too. NEXORA pioneers interactive WebGL orbital models that let customers inspect tactile finishes, camera bezels, and cooling vents from any vantage point with zero input latency.",
    keyPoints: [
      "Procedural Three.js rendering optimized for low GPU thermals",
      "Dynamic variant material finish switching (Obsidian, Azure, Silver)",
      "True-to-scale digital calipers and dimension overlays",
      "Graceful degradation on low-power devices and reduced motion",
    ],
    accentColor: "violet",
  },
  {
    id: "pillar-honest-commerce",
    number: "03",
    title: "Demystified Silicon & Honest Pricing",
    subtitle: "Transparent Engineering Over Marketing Hype",
    description:
      "We present raw architectural specifications rather than marketing hyperbole. Every price in our demonstration catalogue is standardized in Indian Rupees (INR) with single-source-of-truth calculations, zero artificial urgency badges, and zero manipulated review scores.",
    keyPoints: [
      "Full architecture disclosures: thermal TDP, memory bandwidth, driver impedance",
      "Calculated percentage savings strictly derived from real baseline prices",
      "Zero fabricated countdown timers or artificial scarcity prompts",
      "Explicit demonstration storefront notices across all promotional touchpoints",
    ],
    accentColor: "cyan",
  },
];

export const customerPrinciples: AboutExperiencePrinciple[] = [
  {
    id: "principle-sensory-inspection",
    title: "Sensory Digital Inspection",
    description:
      "Experience hardware through multi-perspective retina visuals, detailed material breakdown callouts, and interactive orbital 3D models running at smooth frame rates.",
    iconName: "Boxes",
    practicalBenefit: "360-degree spatial familiarity before selection.",
  },
  {
    id: "principle-parametric-comparison",
    title: "Direct Parametric Comparison",
    description:
      "Stack up to four hardware units side-by-side in a synchronized technical matrix. Quickly isolate differentiating attributes without jumping between browser tabs.",
    iconName: "Scale",
    practicalBenefit: "Objective specification analysis across categories.",
  },
  {
    id: "principle-division-organization",
    title: "Discipline-Specific Exploration",
    description:
      "Browse hardware segmented into six dedicated engineering divisions: Smartphones, Laptops, Audio, Gaming, Wearables, and Connectivity Accessories.",
    iconName: "SlidersHorizontal",
    practicalBenefit: "Zero cross-category clutter or irrelevant recommendations.",
  },
  {
    id: "principle-concierge-support",
    title: "Dedicated Engineering Concierge",
    description:
      "Access clear, direct inquiry channels for hardware telemetry, configuration advice, and demonstration feedback without automated chatbot walls.",
    iconName: "Headphones",
    practicalBenefit: "Direct human communication pathways.",
  },
];

export const demoFeatureShowcases: AboutDemoFeature[] = [
  {
    id: "feature-3d-viewer",
    title: "Interactive 3D Hardware Inspection",
    badge: "Three.js & WebGL 2.0",
    badgeVariant: "electric",
    description:
      "Inspect authentic 3D models with smooth orbit controls, studio daylight and accent point lights, camera distance boundaries, and instant material finish toggling.",
    implementationDetail:
      "Active on flagship specimens including NEXORA Nova 1 Pro (Smartphones) and Vortex Planar (Audio).",
    routeHref: "/products/nexora-nova-1-pro",
    routeLabel: "Inspect Nova 1 Pro in 3D",
    isImplemented: true,
  },
  {
    id: "feature-comparison-matrix",
    title: "Multi-Device Hardware Comparison",
    badge: "Parametric Matrix",
    badgeVariant: "violet",
    description:
      "Compare two to four devices simultaneously with unified spec taxonomy, category compatibility enforcement, and a 'Highlight Differences' toggle.",
    implementationDetail:
      "Supports all 30 centralized catalogue products with persistent client-side comparison state.",
    routeHref: "/compare",
    routeLabel: "Launch Comparison Suite",
    isImplemented: true,
  },
  {
    id: "feature-category-brand-discovery",
    title: "Category & Brand Lab Explorers",
    badge: "6 Divisions & 6 Labs",
    badgeVariant: "success",
    description:
      "Filter through 6 core hardware categories and 6 specialized brand laboratories with live search, price sliders, dynamic item counts, and sorted listings.",
    implementationDetail:
      "Includes dynamic route generation for /categories/[slug] and /brands/[slug] with rich telemetry.",
    routeHref: "/categories",
    routeLabel: "Explore Categories",
    isImplemented: true,
  },
  {
    id: "feature-promotions-showcase",
    title: "Honest Promotional Discovery",
    badge: "Mathematically Verified",
    badgeVariant: "outline",
    description:
      "Discover active promotional incentives with transparent mathematical savings, clear eligibility terms, and explicit demonstration storefront disclosures.",
    implementationDetail:
      "Driven by centralized promotion models with single-source INR pricing formulas.",
    routeHref: "/offers",
    routeLabel: "View Demo Offers",
    isImplemented: true,
  },
];

export const futureVisionPillars: AboutFutureVision[] = [
  {
    id: "vision-spatial-telemetry",
    conceptTitle: "Spatial Audio Telemetry & Neural Acoustics",
    category: "Acoustics & Spatial Computing",
    horizon: "Phase 5 Exploration",
    description:
      "Investigating real-time HRTF (head-related transfer function) calibration directly in the browser to preview how planar headphones image 3D acoustic soundscapes.",
    architecturalGoal: "Personalized spatial sound rendering without proprietary hardware dongles.",
  },
  {
    id: "vision-modular-metallurgy",
    conceptTitle: "Circular Metallurgy & Modular Enclosures",
    category: "Materials Science",
    horizon: "Architectural Roadmap",
    description:
      "Advancing chassis designs using 100% recycled aerospace titanium with tool-less internal snap-rails for modular thermal conduits and battery replacement.",
    architecturalGoal: "Extending device lifespans to a 10-year service benchmark.",
  },
  {
    id: "vision-local-silicon",
    conceptTitle: "Air-Gapped Local-First Architecture",
    category: "Computing & Security",
    horizon: "Conceptual Study",
    description:
      "Designing next-generation desktop and mobile workstations that prioritize strictly localized on-device inference, zero telemetry leakage, and hardware cryptographic kill-switches.",
    architecturalGoal: "Total sovereign control over personal hardware and computations.",
  },
];

export const trustPillars: AboutTrustPillar[] = [
  {
    id: "trust-single-source-pricing",
    title: "Transparent Demo Pricing",
    description:
      "All prices are catalogued in Indian Rupees (INR) and calculated from a single source of truth. Discounts are computed strictly from real catalogue prices.",
    iconName: "Coins",
    evidenceText: "Mathematical delta = Original Price - Promo Price.",
  },
  {
    id: "trust-verified-specs",
    title: "Authentic Technical Specs",
    description:
      "No fabricated benchmark numbers or exaggerated claims. Every product specification represents cohesive, engineering-grounded hardware profiles.",
    iconName: "FileCheck2",
    evidenceText: "Standardized across all 30 catalogue units.",
  },
  {
    id: "trust-navigable-systems",
    title: "Consistent & Working Navigation",
    description:
      "Zero dead buttons, broken links, or non-functional placeholder routes. Every category, brand, product, and filter pathway is fully operational.",
    iconName: "Layers",
    evidenceText: "Over 65 statically verified Next.js routes.",
  },
  {
    id: "trust-honest-messaging",
    title: "Honest Demonstration Disclosures",
    description:
      "We prominently disclose that NEXORA is a fictional portfolio storefront. We do not invent customer reviews, awards, or fake corporate history.",
    iconName: "MessageSquareCode",
    evidenceText: "Clear demo indicators across all views.",
  },
];
