import type { Product } from "@/types";
import { formatINR } from "@/lib/format";

/**
 * Centralized Demo Products Dataset for NEXORA.
 * 30 Precision-Engineered Hardware Units across 6 Categories:
 * 1. Smartphones (5 units)
 * 2. Laptops (5 units)
 * 3. Audio (5 units)
 * 4. Gaming (5 units)
 * 5. Wearables (5 units)
 * 6. Accessories (5 units)
 *
 * All pricing, specifications, and availability are clearly labeled illustrative demo values.
 * Standardized on Indian Rupee (INR) formatting.
 */
export const products: Product[] = [
  // =========================================================================
  // 1. SMARTPHONES (5 Units)
  // =========================================================================
  {
    id: "prod-01",
    slug: "nexora-nova-1-pro",
    name: "NEXORA Nova 1 Pro",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Smartphones",
    categorySlug: "smartphones",
    tagline: "Neural-Core Telemetry Communicator",
    description: "Milled from a solid billet of Grade-5 aerospace titanium with an integrated cryogenic vapor chamber. Powered by the custom Neural Silicon X2 for on-device spatial tracking, 120Hz quantum OLED streaming, and quantum cryptographic security.",
    demoPrice: 129999,
    formattedPrice: formatINR(129999),
    currency: "INR",
    images: [
      { url: "/images/products/nova-1-pro-primary.svg", alt: "NEXORA Nova 1 Pro Titanium Chassis Front Elevation", isPrimary: true },
      { url: "/images/products/nova-1-pro-angle.svg", alt: "NEXORA Nova 1 Pro Tri-Lens Array 45° Perspective", isPrimary: false },
      { url: "/images/products/nova-1-pro-detail.svg", alt: "NEXORA Nova 1 Pro Neural Silicon Internal Cross-Section", isPrimary: false },
    ],
    specifications: [
      { name: "Display", value: "6.8\" 120Hz Quantum OLED (3,000 Nits)", group: "Display" },
      { name: "Processor", value: "Neural Silicon X2 • 32-Core NPU", group: "Performance" },
      { name: "Chassis", value: "Aerospace Grade-5 Titanium", group: "Materials" },
      { name: "Battery", value: "5,400mAh Solid-State Cell • 80W Mag-Induction", group: "Battery" },
      { name: "Optics", value: "Tri-Spectral 50MP Array + LIDAR Synapse", group: "Performance" },
    ],
    features: [
      { title: "Quantum Micro-OLED", description: "Color-calibrated DCI-P3 panel with sub-pixel micro-lens arrays." },
      { title: "Neural Cryptography", description: "Hardware-isolated enclave executing sub-millisecond biometric handshakes." },
      { title: "Cryogenic Heatpipe", description: "Integrated liquid-vapor channel preventing thermal throttling." },
    ],
    variants: [
      { id: "var-01a", name: "Obsidian Titanium • 256GB Unified", sku: "N1P-OBS-256", colorName: "Obsidian", colorHex: "#0F172A", storage: "256GB Unified", demoPriceDelta: 0, imageIndex: 0 },
      { id: "var-01b", name: "Electric Azure • 512GB Unified", sku: "N1P-AZR-512", colorName: "Electric Azure", colorHex: "#1E40AF", storage: "512GB Unified", demoPriceDelta: 15000, imageIndex: 1 },
      { id: "var-01c", name: "Cryo Silver • 1TB Unified", sku: "N1P-SLV-1TB", colorName: "Cryo Silver", colorHex: "#94A3B8", storage: "1TB Unified", demoPriceDelta: 30000, imageIndex: 2 },
    ],
    has3DModel: true,
    modelType: "interactive-turntable",
    modelUrl: "/models/nova-1-pro.glb",
    modelLicense: "CC0 1.0 Universal / NEXORA Showroom",
    modelSource: "NEXORA Aerospace Titanium Specimen",
    isProcedural: true,
    highlightBadge: "Flagship Mobile",
    badgeVariant: "electric",
    featured: true,
    specs: ["120Hz Quantum OLED", "Neural Silicon X2", "Titanium Aerospace Frame"],
  },
  {
    id: "prod-02",
    slug: "nexora-nova-1-ultra",
    name: "NEXORA Nova 1 Ultra",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Smartphones",
    categorySlug: "smartphones",
    tagline: "Ultra-Spectral Periscope Communicator",
    description: "Expanded 7.0-inch architectural communicator featuring dual periscope telephoto optics, 4,000 nits peak display illumination, and active micro-piezo acoustic speakers.",
    demoPrice: 149999,
    formattedPrice: formatINR(149999),
    currency: "INR",
    images: [
      { url: "/images/products/nova-1-ultra-primary.svg", alt: "NEXORA Nova 1 Ultra Periscope Array", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "7.0\" 144Hz LTPO Micro-OLED (4,000 Nits)", group: "Display" },
      { name: "Processor", value: "Neural Silicon X2 Extreme", group: "Performance" },
      { name: "Chassis", value: "Grade-5 Titanium + Ceramic Shield", group: "Materials" },
      { name: "Optics", value: "Quad-Spectral 200MP + Dual 10x Periscope", group: "Performance" },
    ],
    features: [
      { title: "Periscope Zoom", description: "Optical folded prism system delivering true 10x lossless spatial magnification." },
      { title: "Ceramic Matrix", description: "Molecularly aligned crystalline backplate impervious to scratching." },
    ],
    has3DModel: false,
    highlightBadge: "Extreme Optics",
    badgeVariant: "violet",
    featured: false,
    specs: ["144Hz LTPO OLED", "Dual 10x Periscope", "Ceramic Shield"],
  },
  {
    id: "prod-03",
    slug: "kinetic-photon-horizon",
    name: "Kinetic Photon Horizon",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Smartphones",
    categorySlug: "smartphones",
    tagline: "Sub-Pixel Holographic Spatial Handset",
    description: "Engineered in Zurich and Tokyo, the Photon Horizon integrates a light-field holographic display layer that projects tactile optical depth without specialized eyewear.",
    demoPrice: 104999,
    formattedPrice: formatINR(104999),
    currency: "INR",
    images: [
      { url: "/images/products/photon-horizon.svg", alt: "Kinetic Photon Horizon Handset", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "6.7\" Holographic Light-Field AMOLED", group: "Display" },
      { name: "Processor", value: "Kinetic Photonic Synapse K1", group: "Performance" },
      { name: "Chassis", value: "Anodized Aerospace Aluminum 7075", group: "Materials" },
    ],
    features: [
      { title: "Light-Field Projection", description: "Micro-lenticular optical array rendering real-time volumetric holograms." },
    ],
    has3DModel: false,
    highlightBadge: "Sub-Pixel Array",
    badgeVariant: "subtle",
    featured: false,
    specs: ["Light-Field AMOLED", "Photonic K1", "Anodized 7075"],
  },
  {
    id: "prod-04",
    slug: "aura-pulse-compact",
    name: "Aura Pulse Compact",
    brand: "AURA SILICON",
    brandSlug: "aura-silicon",
    category: "Smartphones",
    categorySlug: "smartphones",
    tagline: "Ergonomic 5.9-inch Neural Instrument",
    description: "Designed for one-handed operational ergonomics, the Aura Pulse Compact packages enterprise spatial telemetry into an ultra-dense 155g monolithic form factor.",
    demoPrice: 84999,
    formattedPrice: formatINR(84999),
    currency: "INR",
    images: [
      { url: "/images/products/aura-pulse.svg", alt: "Aura Pulse Compact Handset", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "5.9\" 120Hz Compact OLED", group: "Display" },
      { name: "Weight", value: "155g Precision Balanced", group: "Dimensions" },
      { name: "Processor", value: "Aura Neural Micro-Core", group: "Performance" },
    ],
    features: [
      { title: "Compact Ergonomics", description: "Contoured tactile radius engineered specifically for thumb reachability." },
    ],
    has3DModel: false,
    highlightBadge: "Compact Neural",
    badgeVariant: "electric",
    featured: false,
    specs: ["5.9\" 120Hz OLED", "155g Ultralight", "Aura Micro-Core"],
  },
  {
    id: "prod-05",
    slug: "nexora-nova-fold-spatial",
    name: "NEXORA Nova Fold Spatial",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Smartphones",
    categorySlug: "smartphones",
    tagline: "Dual-Screen Flexible Micro-OLED Book",
    description: "Unfolds from an ultra-thin 8.2mm smartphone into an 8.1-inch spatial canvas with zero crease distortion, supported by liquid metal multi-pivot geared hinges.",
    demoPrice: 189999,
    formattedPrice: formatINR(189999),
    currency: "INR",
    images: [
      { url: "/images/products/nova-fold.svg", alt: "NEXORA Nova Fold Spatial Book", isPrimary: true },
    ],
    specifications: [
      { name: "Internal Display", value: "8.1\" 120Hz Creaseless Flex-OLED", group: "Display" },
      { name: "External Display", value: "6.5\" 120Hz Cover OLED", group: "Display" },
      { name: "Hinge", value: "Titanium Liquidmetal Zero-Crease Geared", group: "Materials" },
    ],
    features: [
      { title: "Zero-Crease Hinge", description: "Waterdrop titanium gear mechanism supporting over 500,000 smooth cycles." },
    ],
    has3DModel: false,
    highlightBadge: "Dual Flexible OLED",
    badgeVariant: "violet",
    featured: false,
    specs: ["8.1\" Flexible OLED", "Liquidmetal Hinge", "Dual 120Hz"],
  },

  // =========================================================================
  // 2. LAPTOPS (5 Units)
  // =========================================================================
  {
    id: "prod-06",
    slug: "nexora-zephyr-16-studio",
    name: "NEXORA Zephyr 16 Studio",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Laptops",
    categorySlug: "laptops",
    tagline: "Dual-Touch Micro-OLED Workstation",
    description: "Dual 4K HDR touch surfaces eliminate the barrier between input stylus and spatial canvas. Powered by a 140W whisper-quiet vapor-chamber dissipation matrix and 64GB unified memory.",
    demoPrice: 289999,
    formattedPrice: formatINR(289999),
    currency: "INR",
    images: [
      { url: "/images/products/zephyr-16-primary.svg", alt: "NEXORA Zephyr 16 Studio Isometric Workstation", isPrimary: true },
      { url: "/images/products/zephyr-16-angle.svg", alt: "NEXORA Zephyr 16 Studio Side Profile & Connectivity", isPrimary: false },
      { url: "/images/products/zephyr-16-deck.svg", alt: "NEXORA Zephyr 16 Studio Tactile Deck & Thermal Vapor Matrix", isPrimary: false },
    ],
    specifications: [
      { name: "Primary Display", value: "16\" 4K HDR Micro-OLED (120Hz, 100% DCI-P3)", group: "Display" },
      { name: "Secondary Display", value: "14\" Half-Width 4K Touch Canvas", group: "Display" },
      { name: "Memory", value: "64GB Unified Low-Latency LPDDR5X", group: "Performance" },
      { name: "Cooling", value: "140W Cryogenic Vapor Loop (0 dB Idle)", group: "Materials" },
    ],
    features: [
      { title: "Dual Spatial Canvas", description: "Secondary touch surface acts as timeline, audio console, or spatial terminal." },
      { title: "Zero-Noise Cryo Loop", description: "Passive phase-change cooling maintaining full clock under continuous render." },
    ],
    variants: [
      { id: "var-06a", name: "32GB RAM • 1TB NVMe SSD", sku: "Z16-32-1T", ram: "32GB RAM", storage: "1TB SSD", demoPriceDelta: 0, imageIndex: 0 },
      { id: "var-06b", name: "64GB RAM • 2TB NVMe SSD", sku: "Z16-64-2T", ram: "64GB RAM", storage: "2TB SSD", demoPriceDelta: 40000, imageIndex: 1 },
      { id: "var-06c", name: "128GB RAM • 4TB NVMe SSD", sku: "Z16-128-4T", ram: "128GB RAM", storage: "4TB SSD", demoPriceDelta: 90000, imageIndex: 2 },
    ],
    has3DModel: false,
    highlightBadge: "Spatial Workstation",
    badgeVariant: "violet",
    featured: true,
    specs: ["Dual 4K HDR Touch Displays", "Vapor Chamber Cryo-Cooling", "64GB Unified RAM"],
  },
  {
    id: "prod-07",
    slug: "zephyr-14-carbon-mobile",
    name: "Zephyr 14 Carbon Mobile",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Laptops",
    categorySlug: "laptops",
    tagline: "Ultra-Portable 1.1kg Carbon Fiber Ultrabook",
    description: "Constructed with woven Japanese carbon fiber and magnesium alloys, delivering 18 hours of computational stamina in an impossibly light 1.1kg profile.",
    demoPrice: 219999,
    formattedPrice: formatINR(219999),
    currency: "INR",
    images: [
      { url: "/images/products/zephyr-14.svg", alt: "Zephyr 14 Carbon Mobile Ultrabook", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "14.2\" 3.2K OLED 120Hz (500 Nits)", group: "Display" },
      { name: "Weight", value: "1.1kg Woven Carbon Chassis", group: "Dimensions" },
      { name: "Battery", value: "85Wh Solid-State Cell (18 Hours)", group: "Battery" },
    ],
    features: [
      { title: "Carbon Monolith", description: "Multi-axial carbon composite yielding extraordinary torsional rigidity." },
    ],
    has3DModel: false,
    highlightBadge: "Ultralight Monolith",
    badgeVariant: "electric",
    featured: false,
    specs: ["1.1kg Carbon Frame", "3.2K 120Hz OLED", "18h Battery"],
  },
  {
    id: "prod-08",
    slug: "chrono-studio-precision-17",
    name: "Chrono Studio Precision 17",
    brand: "CHRONO RIGS",
    brandSlug: "chrono-rigs",
    category: "Laptops",
    categorySlug: "laptops",
    tagline: "Extreme 175W Fluid Dynamic Workstation",
    description: "Custom thermal engineering from Reykjavik. Houses an unthrottled 24-core neural compute core with liquid metal interface and dual optical thunderbolt buses.",
    demoPrice: 349999,
    formattedPrice: formatINR(349999),
    currency: "INR",
    images: [
      { url: "/images/products/chrono-17.svg", alt: "Chrono Studio Precision 17", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "17.3\" Mini-LED 4K 165Hz (1,600 Nits)", group: "Display" },
      { name: "Power", value: "175W Sustained Thermal Envelope", group: "Performance" },
      { name: "Memory", value: "96GB Unified ECC Bus", group: "Performance" },
    ],
    features: [
      { title: "Liquid Metal Interface", description: "Direct gallium-indium alloy heat transfer for sub-zero thermal spikes." },
    ],
    has3DModel: false,
    highlightBadge: "Cryo-Matrix Workstation",
    badgeVariant: "violet",
    featured: false,
    specs: ["175W Sustained Power", "Mini-LED 4K 165Hz", "96GB Unified ECC"],
  },
  {
    id: "prod-09",
    slug: "aura-flow-dual-book",
    name: "Aura Flow Dual-Book",
    brand: "AURA SILICON",
    brandSlug: "aura-silicon",
    category: "Laptops",
    categorySlug: "laptops",
    tagline: "Foldable Seamless OLED Dual Canvas",
    description: "Features a continuous 16.3-inch foldable OLED surface with detachable magnetic Bluetooth keyboard and haptic spatial drawing pen.",
    demoPrice: 259999,
    formattedPrice: formatINR(259999),
    currency: "INR",
    images: [
      { url: "/images/products/aura-flow.svg", alt: "Aura Flow Dual-Book", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "16.3\" Foldable Touch OLED (Fold to 12.5\")", group: "Display" },
      { name: "Stylus", value: "4,096 Levels Zero-Latency Haptic Pen", group: "Connectivity" },
    ],
    features: [
      { title: "Fluid Transition", description: "Seamlessly converts from full 16-inch vertical studio sheet to portable clam." },
    ],
    has3DModel: false,
    highlightBadge: "Dual OLED Canvas",
    badgeVariant: "subtle",
    featured: false,
    specs: ["16.3\" Foldable OLED", "Haptic Spatial Pen", "Detachable Mag-Key"],
  },
  {
    id: "prod-10",
    slug: "kinetic-compute-deck",
    name: "Kinetic Compute Deck",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Laptops",
    categorySlug: "laptops",
    tagline: "Field Engineer Cybernetic Terminal",
    description: "Ruggedized titanium-magnesium field deck with integrated hardware logic analyzer, dual optical SFP+ ports, and hot-swappable dual battery canisters.",
    demoPrice: 199999,
    formattedPrice: formatINR(199999),
    currency: "INR",
    images: [
      { url: "/images/products/compute-deck.svg", alt: "Kinetic Compute Deck Terminal", isPrimary: true },
    ],
    specifications: [
      { name: "Display", value: "13.5\" Sunlight-Readable 1,800 Nits Anti-Glare", group: "Display" },
      { name: "Chassis", value: "IP68 Sealed Magnesium-Titanium", group: "Materials" },
      { name: "I/O", value: "Dual 100Gbps Optical SFP+ Bus", group: "Connectivity" },
    ],
    features: [
      { title: "Hot-Swap Power", description: "Swap secondary battery cartridges without powering down computational jobs." },
    ],
    has3DModel: false,
    highlightBadge: "Field Computing",
    badgeVariant: "electric",
    featured: false,
    specs: ["IP68 Sealed Deck", "Dual SFP+ Optical", "Hot-Swap Power"],
  },

  // =========================================================================
  // 3. AUDIO (5 Units)
  // =========================================================================
  {
    id: "prod-11",
    slug: "vortex-resonance-planar",
    name: "Vortex Resonance Planar",
    brand: "VORTEX ACOUSTICS",
    brandSlug: "vortex-acoustics",
    category: "Audio",
    categorySlug: "audio",
    tagline: "Ultra-Linear Acoustic Reference Monitors",
    description: "Laser-etched beryllium planar diaphragms suspended in push-pull neodymium magnet arrays. Achieves less than 0.002% harmonic distortion with full-spectrum linear transparency.",
    demoPrice: 79999,
    formattedPrice: formatINR(79999),
    currency: "INR",
    images: [
      { url: "/images/products/vortex-planar-primary.svg", alt: "Vortex Resonance Planar Acoustic Elevation", isPrimary: true },
      { url: "/images/products/vortex-planar-profile.svg", alt: "Vortex Resonance Planar Open-Back Acoustic Grill & 4.4mm Balanced", isPrimary: false },
      { url: "/images/products/vortex-planar-case.svg", alt: "Vortex Resonance Planar Gimbal Articulation Matrix", isPrimary: false },
    ],
    specifications: [
      { name: "Transducer", value: "85mm Laser-Etched Beryllium Planar", group: "Acoustics" },
      { name: "Frequency Response", value: "10Hz – 48kHz (±0.5dB)", group: "Acoustics" },
      { name: "Distortion", value: "<0.002% THD at 100dB SPL", group: "Acoustics" },
      { name: "Cable", value: "Balanced 4.4mm Monocrystal Silver-Plated Copper", group: "Connectivity" },
    ],
    features: [
      { title: "Beryllium Diaphragm", description: "Ultra-rigid low-mass diaphragm eliminating cone breakup distortion." },
      { title: "Acoustic Neutrality", description: "Linear phase-aligned acoustic chamber for spatial reference mastering." },
    ],
    variants: [
      { id: "var-11a", name: "Matte Carbon", sku: "VRP-MC-01", colorName: "Matte Carbon", colorHex: "#1E293B", demoPriceDelta: 0, imageIndex: 0 },
      { id: "var-11b", name: "Anodized Cobalt", sku: "VRP-AC-02", colorName: "Anodized Cobalt", colorHex: "#1E40AF", demoPriceDelta: 0, imageIndex: 1 },
      { id: "var-11c", name: "Liquid Platinum", sku: "VRP-LP-03", colorName: "Liquid Platinum", colorHex: "#CBD5E1", demoPriceDelta: 0, imageIndex: 2 },
    ],
    has3DModel: true,
    modelType: "interactive-turntable",
    modelUrl: "/models/audio-pod.glb",
    modelLicense: "CC0 1.0 Universal / NEXORA Showroom",
    modelSource: "Vortex Planar Acoustic Chamber Specimen",
    isProcedural: true,
    highlightBadge: "Acoustic Master",
    badgeVariant: "electric",
    featured: true,
    specs: ["Beryllium Planar Drivers", "Zero-Distortion Acoustic Chamber", "Balanced 4.4mm DAC Bridge"],
  },
  {
    id: "prod-12",
    slug: "vortex-beryllium-monitor-x",
    name: "Vortex Beryllium Monitor X",
    brand: "VORTEX ACOUSTICS",
    brandSlug: "vortex-acoustics",
    category: "Audio",
    categorySlug: "audio",
    tagline: "Open-Back Spatial Acoustic Flagship",
    description: "Precision CNC-machined titanium earcups with open-back acoustic damping felt and memory lambskin earpads for infinite spatial staging.",
    demoPrice: 94999,
    formattedPrice: formatINR(94999),
    currency: "INR",
    images: [
      { url: "/images/products/vortex-monitor-x.svg", alt: "Vortex Beryllium Monitor X Open Back", isPrimary: true },
    ],
    specifications: [
      { name: "Type", value: "Circumaural Open-Back Reference", group: "Acoustics" },
      { name: "Impedance", value: "32 Ohms Flat Across Audio Band", group: "Acoustics" },
      { name: "Weight", value: "340g Carbon Suspension", group: "Dimensions" },
    ],
    features: [
      { title: "Open-Back Spatiality", description: "Zero back-wave reflection delivering genuine loudspeaker-like depth." },
    ],
    has3DModel: false,
    highlightBadge: "Reference Planar",
    badgeVariant: "violet",
    featured: false,
    specs: ["Open-Back Reference", "32 Ohms Linear", "Carbon Suspension"],
  },
  {
    id: "prod-13",
    slug: "aura-acoustic-pods-pro",
    name: "Aura Acoustic Pods Pro",
    brand: "AURA SILICON",
    brandSlug: "aura-silicon",
    category: "Audio",
    categorySlug: "audio",
    tagline: "Lossless Micro-Planar Wireless In-Ears",
    description: "Dual hybrid drivers combining a 10mm micro-planar tweeter and liquid crystal sub-bass woofer. Supported by ultra-low-latency 2.4GHz RF and lossless LDAC.",
    demoPrice: 32999,
    formattedPrice: formatINR(32999),
    currency: "INR",
    images: [
      { url: "/images/products/aura-pods.svg", alt: "Aura Acoustic Pods Pro", isPrimary: true },
    ],
    specifications: [
      { name: "Drivers", value: "Dual Hybrid Micro-Planar + LCP Dynamic", group: "Acoustics" },
      { name: "ANC", value: "Adaptive -48dB Sub-Hz Cancellation", group: "Acoustics" },
      { name: "Endurance", value: "10h Pods + 30h Titanium Case", group: "Battery" },
    ],
    features: [
      { title: "Lossless Wireless", description: "24-bit 96kHz uncompressed transmission via custom low-latency codec." },
    ],
    has3DModel: false,
    highlightBadge: "Lossless In-Ear",
    badgeVariant: "electric",
    featured: false,
    specs: ["Dual Micro-Planar", "-48dB Adaptive ANC", "40h Total Playtime"],
  },
  {
    id: "prod-14",
    slug: "kinetic-wave-dac-bridge",
    name: "Kinetic Wave DAC Bridge",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Audio",
    categorySlug: "audio",
    tagline: "Dual Mono R-2R Ladder Desktop Converter",
    description: "Discrete resistor ladder DAC converting digital audio streams with zero delta-sigma ringing. Balanced 4.4mm and XLR outputs encased in milled aluminum.",
    demoPrice: 48999,
    formattedPrice: formatINR(48999),
    currency: "INR",
    images: [
      { url: "/images/products/wave-dac.svg", alt: "Kinetic Wave DAC Bridge", isPrimary: true },
    ],
    specifications: [
      { name: "Architecture", value: "Discrete 24-Bit R-2R Resistor Ladder", group: "Acoustics" },
      { name: "Signal to Noise", value: "128dB Dynamic Range", group: "Acoustics" },
      { name: "Output", value: "Balanced 4.4mm + Dual XLR 4Vrms", group: "Connectivity" },
    ],
    features: [
      { title: "R-2R Ladder", description: "Zero digital oversampling artifacts delivering analog organic warmth." },
    ],
    has3DModel: false,
    highlightBadge: "4.4mm Balanced DAC",
    badgeVariant: "subtle",
    featured: false,
    specs: ["Discrete R-2R Ladder", "128dB Dynamic Range", "Balanced XLR/4.4mm"],
  },
  {
    id: "prod-15",
    slug: "vortex-spatial-soundstage",
    name: "Vortex Spatial Soundstage",
    brand: "VORTEX ACOUSTICS",
    brandSlug: "vortex-acoustics",
    category: "Audio",
    categorySlug: "audio",
    tagline: "Binaural Spatial Desktop Array",
    description: "High-density 12-transducer beamforming spatial soundbar projecting 3D height and surround channels using custom digital room acoustic mapping.",
    demoPrice: 62999,
    formattedPrice: formatINR(62999),
    currency: "INR",
    images: [
      { url: "/images/products/soundstage.svg", alt: "Vortex Spatial Soundstage", isPrimary: true },
    ],
    specifications: [
      { name: "Array", value: "12 Neodymium Beamforming Micro-Drivers", group: "Acoustics" },
      { name: "Subwoofer", value: "Dual Opposed Force-Canceling Passive", group: "Acoustics" },
    ],
    features: [
      { title: "Beamforming Spatial", description: "Steers acoustic waves directly around the listener without physical satellite speakers." },
    ],
    has3DModel: false,
    highlightBadge: "Binaural Field",
    badgeVariant: "violet",
    featured: false,
    specs: ["12 Beamforming Drivers", "Binaural 3D Audio", "Force-Canceling Sub"],
  },

  // =========================================================================
  // 4. GAMING & SPATIAL RIGS (5 Units)
  // =========================================================================
  {
    id: "prod-16",
    slug: "nexora-iris-pro-spatial-rig",
    name: "NEXORA Iris Pro Spatial Rig",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Gaming",
    categorySlug: "gaming",
    tagline: "8K Micro-OLED Spatial Computing Headset",
    description: "Dual 8K quantum panels with sub-millisecond infrared eye tracking, spatial audio synthesis, and custom carbon-fiber counterbalance headframe.",
    demoPrice: 249999,
    formattedPrice: formatINR(249999),
    currency: "INR",
    images: [
      { url: "/images/products/iris-pro-primary.svg", alt: "NEXORA Iris Pro Spatial Visor Assembly", isPrimary: true },
      { url: "/images/products/iris-pro-optics.svg", alt: "NEXORA Iris Pro Retinal Micro-Lens Enclave", isPrimary: false },
      { url: "/images/products/iris-pro-strap.svg", alt: "NEXORA Iris Pro Counterbalanced Suspension", isPrimary: false },
    ],
    specifications: [
      { name: "Optics", value: "Dual 8K Micro-OLED (3,840 x 3,840 per eye, 120Hz)", group: "Display" },
      { name: "FOV", value: "115° Horizontal Panoramic Field", group: "Display" },
      { name: "Tracking", value: "Sub-Millisecond Eye & Hand Gesture Telemetry", group: "Performance" },
      { name: "Chassis", value: "Carbon-Fiber Skeleton + Breathable Magnesium Rim", group: "Materials" },
    ],
    features: [
      { title: "Dual 8K Resolution", description: "Eliminates screen-door effect with 64 pixels per degree acuity." },
      { title: "Dynamic Foveated Rendering", description: "Focuses high-detail shading strictly on the viewer's gaze location." },
    ],
    variants: [
      { id: "var-16a", name: "256GB Spatial Core", sku: "IRP-256-SC", storage: "256GB Spatial Core", demoPriceDelta: 0, imageIndex: 0 },
      { id: "var-16b", name: "512GB Spatial Core", sku: "IRP-512-SC", storage: "512GB Spatial Core", demoPriceDelta: 20000, imageIndex: 1 },
    ],
    has3DModel: false,
    highlightBadge: "3D Spatial Ready",
    badgeVariant: "violet",
    featured: true,
    specs: ["Dual 8K Quantum Panels", "Sub-Millisecond Eye Tracking", "Spatial Audio Synthesis"],
  },
  {
    id: "prod-17",
    slug: "quantum-rig-01-cryo-desktop",
    name: "Quantum Rig 01 Cryo Desktop",
    brand: "CHRONO RIGS",
    brandSlug: "chrono-rigs",
    category: "Gaming",
    categorySlug: "gaming",
    tagline: "Phase-Change Cooled Personal Supercomputer",
    description: "Architectural anodized aluminum tower housing closed-loop phase-change sub-ambient cooling, dual 450W power rails, and quantum-shielded PCIe bus.",
    demoPrice: 429999,
    formattedPrice: formatINR(429999),
    currency: "INR",
    images: [
      { url: "/images/products/quantum-desktop.svg", alt: "Quantum Rig 01 Cryo Desktop", isPrimary: true },
    ],
    specifications: [
      { name: "Cooling", value: "Integrated Sub-Ambient Phase-Change Loop", group: "Materials" },
      { name: "Processor", value: "24-Core Extreme Neural Accelerator", group: "Performance" },
      { name: "Memory", value: "128GB Quad-Channel Low-Latency Bus", group: "Performance" },
    ],
    features: [
      { title: "Sub-Ambient Phase Cooling", description: "Chills core silicon under continuous 800W extreme computing load." },
    ],
    has3DModel: false,
    highlightBadge: "Extreme Silicon",
    badgeVariant: "violet",
    featured: false,
    specs: ["Sub-Zero Phase Loop", "24-Core Accelerator", "128GB Quad-Channel"],
  },
  {
    id: "prod-18",
    slug: "kinetic-synapse-controller",
    name: "Kinetic Synapse Controller",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Gaming",
    categorySlug: "gaming",
    tagline: "Voice-Coil Micro-Haptic Spatial Gamepad",
    description: "Features adaptive force-feedback trigger tensioners, magnetic Hall-effect thumbsticks with zero drift, and optical micro-switch face buttons.",
    demoPrice: 24999,
    formattedPrice: formatINR(24999),
    currency: "INR",
    images: [
      { url: "/images/products/synapse-controller.svg", alt: "Kinetic Synapse Controller", isPrimary: true },
    ],
    specifications: [
      { name: "Actuators", value: "Dual Linear Resonant Voice-Coil Haptics", group: "Performance" },
      { name: "Sticks", value: "Contactless Magnetic Hall Effect (Zero Drift)", group: "Materials" },
      { name: "Polling", value: "2,000Hz Ultra-Low Latency USB & 2.4GHz", group: "Connectivity" },
    ],
    features: [
      { title: "Hall Effect Sensors", description: "Magnetic contactless position tracking with permanent zero drift guarantee." },
    ],
    has3DModel: false,
    highlightBadge: "Haptic Actuators",
    badgeVariant: "electric",
    featured: false,
    specs: ["Hall-Effect Sticks", "2,000Hz Polling", "Voice-Coil Haptics"],
  },
  {
    id: "prod-19",
    slug: "chrono-pulse-spatial-display-32",
    name: "Chrono Pulse Spatial Display 32",
    brand: "CHRONO RIGS",
    brandSlug: "chrono-rigs",
    category: "Gaming",
    categorySlug: "gaming",
    tagline: "32-Inch 240Hz 4K Micro-OLED Monitor",
    description: "Self-lit sub-pixel OLED panel delivering instantaneous 0.03ms response time, 99.5% Adobe RGB gamut, and integrated hardware calibration sensor.",
    demoPrice: 179999,
    formattedPrice: formatINR(179999),
    currency: "INR",
    images: [
      { url: "/images/products/spatial-display.svg", alt: "Chrono Pulse Spatial Display 32", isPrimary: true },
    ],
    specifications: [
      { name: "Panel", value: "32\" 4K 240Hz Quantum Micro-OLED", group: "Display" },
      { name: "Response Time", value: "0.03ms Gray-to-Gray", group: "Display" },
      { name: "Contrast", value: "1,500,000:1 True Black HDR", group: "Display" },
    ],
    features: [
      { title: "0.03ms Response", description: "Completely eliminates motion blur during rapid spatial panning." },
    ],
    has3DModel: false,
    highlightBadge: "240Hz Micro-OLED",
    badgeVariant: "subtle",
    featured: false,
    specs: ["32\" 240Hz Micro-OLED", "0.03ms Response", "1.5M:1 True Black"],
  },
  {
    id: "prod-20",
    slug: "nexora-iris-field-sensor-bar",
    name: "NEXORA Iris Field Sensor Bar",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Gaming",
    categorySlug: "gaming",
    tagline: "Sub-Millimeter IR Spatial Hand Tracker",
    description: "Wide-angle 180° infrared time-of-flight sensor bar mounting above screens to track hand joints and finger gestures with sub-millimeter precision.",
    demoPrice: 45999,
    formattedPrice: formatINR(45999),
    currency: "INR",
    images: [
      { url: "/images/products/sensor-bar.svg", alt: "NEXORA Iris Field Sensor Bar", isPrimary: true },
    ],
    specifications: [
      { name: "Sensor", value: "Time-of-Flight Infrared 180° Panoramic", group: "Performance" },
      { name: "Precision", value: "Sub-Millimeter 0.4mm Joint Tracking", group: "Performance" },
    ],
    features: [
      { title: "Touchless Input", description: "Control 3D interfaces in mid-air with zero latency gloves or markers." },
    ],
    has3DModel: false,
    highlightBadge: "Sub-Millimeter IR",
    badgeVariant: "electric",
    featured: false,
    specs: ["180° Panoramic ToF", "0.4mm Joint Tracking", "Touchless Spatial"],
  },

  // =========================================================================
  // 5. WEARABLES (5 Units)
  // =========================================================================
  {
    id: "prod-21",
    slug: "aura-kinetic-neural-ring",
    name: "Aura Kinetic Neural Ring",
    brand: "AURA SILICON",
    brandSlug: "aura-silicon",
    category: "Wearables",
    categorySlug: "wearables",
    tagline: "Sub-Millimeter Micro-Haptic Interface",
    description: "Titanium smart ring measuring arterial blood volume pulse, electrodermal response, and finger micro-gestures for touchless device navigation.",
    demoPrice: 44999,
    formattedPrice: formatINR(44999),
    currency: "INR",
    images: [
      { url: "/images/products/aura-ring-primary.svg", alt: "Aura Kinetic Neural Ring", isPrimary: true },
    ],
    specifications: [
      { name: "Material", value: "Grade-5 Titanium + Medical Ceramic Inner", group: "Materials" },
      { name: "Sensors", value: "Continuous PPG + Electrodermal + Micro-IMU", group: "Performance" },
      { name: "Battery", value: "7-Day Solid-State Micro-Cell", group: "Battery" },
    ],
    features: [
      { title: "Gesture Telemetry", description: "Subtle finger snaps or taps trigger shortcuts across connected spatial rigs." },
      { title: "Biometric Matrix", description: "Continuous HRV and autonomic nervous system stress analysis." },
    ],
    variants: [
      { id: "var-21a", name: "Size 8 • Titanium Monocoque", sku: "AKR-SZ8-TI", size: "Size 8", colorHex: "#64748B", demoPriceDelta: 0 },
      { id: "var-21b", name: "Size 10 • Titanium Monocoque", sku: "AKR-SZ10-TI", size: "Size 10", colorHex: "#64748B", demoPriceDelta: 0 },
      { id: "var-21c", name: "Size 12 • Titanium Monocoque", sku: "AKR-SZ12-TI", size: "Size 12", colorHex: "#64748B", demoPriceDelta: 0 },
    ],
    has3DModel: false,
    highlightBadge: "Wearable Lab",
    badgeVariant: "subtle",
    featured: true,
    specs: ["Micro-Haptic Feedback", "7-Day Solid-State Battery", "Gesture Spatial Mapping"],
  },
  {
    id: "prod-22",
    slug: "chrono-pulse-telemetry-watch",
    name: "Chrono Pulse Telemetry Watch",
    brand: "CHRONO RIGS",
    brandSlug: "chrono-rigs",
    category: "Wearables",
    categorySlug: "wearables",
    tagline: "Bio-Impedance & Telemetric Chronometer",
    description: "Titanium sports chronometer with sapphire crystal display, dual-frequency multi-constellation GNSS, and lab-grade optical bio-impedance sensors.",
    demoPrice: 69999,
    formattedPrice: formatINR(69999),
    currency: "INR",
    images: [
      { url: "/images/products/telemetry-watch.svg", alt: "Chrono Pulse Telemetry Watch", isPrimary: true },
    ],
    specifications: [
      { name: "Glass", value: "Synthesized Sapphire Crystal 9H", group: "Materials" },
      { name: "Waterproof", value: "10 ATM / 100m Dive Rated", group: "Dimensions" },
      { name: "Navigation", value: "L1/L5 Dual-Band GNSS Sub-Meter", group: "Connectivity" },
    ],
    features: [
      { title: "10 ATM Water Resistance", description: "Engineered for deep-water oceanic free-diving and extreme sub-zero alpine exploration." },
    ],
    variants: [
      { id: "var-22a", name: "42mm Case • Aerospace Titanium", sku: "CPW-42-TI", size: "42mm", colorHex: "#64748B", demoPriceDelta: 0 },
      { id: "var-22b", name: "46mm Case • Aerospace Titanium", sku: "CPW-46-TI", size: "46mm", colorHex: "#475569", demoPriceDelta: 8000 },
    ],
    has3DModel: false,
    highlightBadge: "Precision Sensor",
    badgeVariant: "electric",
    featured: false,
    specs: ["Titanium Grade 5", "Continuous ECG & SpO2", "Sapphire Crystal Lens"],
  },
  {
    id: "prod-23",
    slug: "nexora-biosense-band-2",
    name: "NEXORA Biosense Band 2",
    brand: "NEXORA LABS",
    brandSlug: "nexora-labs",
    category: "Wearables",
    categorySlug: "wearables",
    tagline: "Screenless Continuous Biometric Wristband",
    description: "Screen-free minimalist fabric-silicone wrist strap dedicated to distraction-free 24/7 cardiovascular recovery analysis and sleep stage mapping.",
    demoPrice: 29999,
    formattedPrice: formatINR(29999),
    currency: "INR",
    images: [
      { url: "/images/products/biosense-band.svg", alt: "NEXORA Biosense Band 2", isPrimary: true },
    ],
    specifications: [
      { name: "Form", value: "Screenless Breathable Engineered Elastic", group: "Materials" },
      { name: "Sensors", value: "5-LED Optical Sensor + Skin Temperature Probe", group: "Performance" },
      { name: "Endurance", value: "5-Day Battery with Wireless Slide-On Battery", group: "Battery" },
    ],
    features: [
      { title: "Screen-Free Zen", description: "All telemetry syncs silently to your smartphone without notifications or screen distractions." },
    ],
    has3DModel: false,
    highlightBadge: "Continuous ECG",
    badgeVariant: "violet",
    featured: false,
    specs: ["Screenless Minimal", "5-Day Battery Pack", "Skin Temp Probe"],
  },
  {
    id: "prod-24",
    slug: "aura-neural-lens-frame",
    name: "Aura Neural Lens Frame",
    brand: "AURA SILICON",
    brandSlug: "aura-silicon",
    category: "Wearables",
    categorySlug: "wearables",
    tagline: "Prescription Spatial Audio Eyewear",
    description: "Ultra-slim 38g titanium eyewear frames integrating directional micro-acoustic speaker waveguides and discreet bone-conduction microphones.",
    demoPrice: 58999,
    formattedPrice: formatINR(58999),
    currency: "INR",
    images: [
      { url: "/images/products/neural-lens.svg", alt: "Aura Neural Lens Frame Eyewear", isPrimary: true },
    ],
    specifications: [
      { name: "Weight", value: "38g Featherweight Titanium", group: "Dimensions" },
      { name: "Audio", value: "Open-Ear Directional Acoustic Waveguides", group: "Acoustics" },
    ],
    features: [
      { title: "Directional Sound", description: "Beams private audio directly to your ear canals without sound leakage to adjacent people." },
    ],
    has3DModel: false,
    highlightBadge: "Spatial Audio Frame",
    badgeVariant: "electric",
    featured: false,
    specs: ["38g Titanium Frame", "Open-Ear Waveguides", "Bone Microphones"],
  },
  {
    id: "prod-25",
    slug: "kinetic-haptic-wrist-band",
    name: "Kinetic Haptic Wrist Band",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Wearables",
    categorySlug: "wearables",
    tagline: "Neuromuscular Spatial Impulse Band",
    description: "Emits sub-threshold micro-current nerve impulses to simulate physical touch resistance and object textures in spatial VR/AR environments.",
    demoPrice: 38999,
    formattedPrice: formatINR(38999),
    currency: "INR",
    images: [
      { url: "/images/products/haptic-band.svg", alt: "Kinetic Haptic Wrist Band", isPrimary: true },
    ],
    specifications: [
      { name: "Actuation", value: "Neuromuscular Tendon Impulse Array", group: "Performance" },
      { name: "Connectivity", value: "Low-Latency Sub-Ghz Spatial RF", group: "Connectivity" },
    ],
    features: [
      { title: "Tendon Resistance", description: "Creates illusion of weight, elasticity, and solid surface resistance in digital spaces." },
    ],
    has3DModel: false,
    highlightBadge: "Tendon Force Feedback",
    badgeVariant: "subtle",
    featured: false,
    specs: ["Tendon Micro-Impulse", "Zero-Latency RF", "Simulated Weight"],
  },

  // =========================================================================
  // 6. ACCESSORIES (5 Units)
  // =========================================================================
  {
    id: "prod-26",
    slug: "nexora-magbridge-dock",
    name: "NEXORA MagBridge Optical Dock",
    brand: "MAGBRIDGE OPTICS",
    brandSlug: "magbridge-optics",
    category: "Accessories",
    categorySlug: "accessories",
    tagline: "100Gbps Dual Optical Bus Workstation Bridge",
    description: "Solid milled aluminum desktop hub connecting dual 8K displays, 10Gbps Ethernet, high-fidelity balanced audio, and 140W magnetic power delivery through a single glass fiber cable.",
    demoPrice: 34999,
    formattedPrice: formatINR(34999),
    currency: "INR",
    images: [
      { url: "/images/products/magbridge-dock-primary.svg", alt: "NEXORA MagBridge Optical Dock", isPrimary: true },
    ],
    specifications: [
      { name: "Bandwidth", value: "100Gbps Dual Optical Channel", group: "Connectivity" },
      { name: "Displays", value: "Quad 8K 60Hz or Dual 4K 144Hz Stream", group: "Display" },
      { name: "Power", value: "140W Mag-Induction Smart Delivery", group: "Battery" },
    ],
    features: [
      { title: "Optical Pipeline", description: "Zero electromagnetic interference or signal degradation across high-bandwidth lines." },
    ],
    has3DModel: false,
    highlightBadge: "Workstation Link",
    badgeVariant: "subtle",
    featured: true,
    specs: ["100Gbps Optical Channel", "Quad 8K Display Stream", "140W Mag-Induction Power"],
  },
  {
    id: "prod-27",
    slug: "magbridge-140w-inductive-mat",
    name: "MagBridge 140W Inductive Mat",
    brand: "MAGBRIDGE OPTICS",
    brandSlug: "magbridge-optics",
    category: "Accessories",
    categorySlug: "accessories",
    tagline: "Multi-Zone Free-Positioning Wireless Surface",
    description: "Matrix of 16 overlapping magnetic coils allowing freeform placement and rapid concurrent charging for phone, smartwatch, and audio pods.",
    demoPrice: 18999,
    formattedPrice: formatINR(18999),
    currency: "INR",
    images: [
      { url: "/images/products/inductive-mat.svg", alt: "MagBridge 140W Inductive Mat", isPrimary: true },
    ],
    specifications: [
      { name: "Coils", value: "16-Coil Overlapping Matrix", group: "Battery" },
      { name: "Surface", value: "Full-Grain Italian Leather + Anodized Trim", group: "Materials" },
      { name: "Total Output", value: "140W Multi-Device Distributed Output", group: "Battery" },
    ],
    features: [
      { title: "Position Free", description: "Drop devices anywhere on the pad without hunting for exact alignment sweet spots." },
    ],
    has3DModel: false,
    highlightBadge: "Multi-Zone MagPad",
    badgeVariant: "electric",
    featured: false,
    specs: ["16-Coil Matrix", "140W Multi-Device", "Leather & Anodized"],
  },
  {
    id: "prod-28",
    slug: "kinetic-titanium-arm-mount",
    name: "Kinetic Titanium Arm Mount",
    brand: "KINETIC LABS",
    brandSlug: "kinetic-labs",
    category: "Accessories",
    categorySlug: "accessories",
    tagline: "Gas-Spring Counterbalance Spatial Arm",
    description: "Heavy-duty titanium and aircraft aluminum monitor arm with concealed cable channels and calibrated mechanical tension gauge.",
    demoPrice: 22999,
    formattedPrice: formatINR(22999),
    currency: "INR",
    images: [
      { url: "/images/products/arm-mount.svg", alt: "Kinetic Titanium Arm Mount", isPrimary: true },
    ],
    specifications: [
      { name: "Capacity", value: "Up to 18kg (Suits 49\" Curved Displays)", group: "Dimensions" },
      { name: "Material", value: "Forged Grade-5 Titanium Joints", group: "Materials" },
    ],
    features: [
      { title: "Effortless Float", description: "Fingertip spatial positioning with zero unwanted sagging or vibration wobble." },
    ],
    has3DModel: false,
    highlightBadge: "Gas-Spring Precision",
    badgeVariant: "subtle",
    featured: false,
    specs: ["18kg Heavy Load", "Forged Titanium Joints", "Cable Channel"],
  },
  {
    id: "prod-29",
    slug: "vortex-braided-silver-cable",
    name: "Vortex Braided Silver Cable 4.4mm",
    brand: "VORTEX ACOUSTICS",
    brandSlug: "vortex-acoustics",
    category: "Accessories",
    categorySlug: "accessories",
    tagline: "Monocrystal Silver-Plated Acoustic Interconnect",
    description: "8-core hand-braided OCC silver-plated copper headphone cable terminated with rhodium-plated 4.4mm balanced and dual 3.5mm connectors.",
    demoPrice: 12999,
    formattedPrice: formatINR(12999),
    currency: "INR",
    images: [
      { url: "/images/products/silver-cable.svg", alt: "Vortex Braided Silver Cable", isPrimary: true },
    ],
    specifications: [
      { name: "Conductor", value: "8-Core Monocrystal OCC Silver-Plated Copper", group: "Connectivity" },
      { name: "Plating", value: "Rhodium-Plated Brass Terminations", group: "Materials" },
    ],
    features: [
      { title: "Zero Microphonics", description: "Soft braided outer jacket completely eliminates rustling cable noise against clothing." },
    ],
    has3DModel: false,
    highlightBadge: "Monocrystal Copper",
    badgeVariant: "violet",
    featured: false,
    specs: ["8-Core OCC Silver", "Rhodium Terminations", "Zero Microphonics"],
  },
  {
    id: "prod-30",
    slug: "chrono-cryo-thermal-matrix",
    name: "Chrono Cryo-Thermal Paste Matrix",
    brand: "CHRONO RIGS",
    brandSlug: "chrono-rigs",
    category: "Accessories",
    categorySlug: "accessories",
    tagline: "Diamond-Infused Phase-Change Thermal Interface",
    description: "Solid at room temperature, liquifies under thermal load to fill microscopic silicon imperfections with non-conductive synthetic diamond nanoparticles.",
    demoPrice: 6999,
    formattedPrice: formatINR(6999),
    currency: "INR",
    images: [
      { url: "/images/products/thermal-matrix.svg", alt: "Chrono Cryo-Thermal Interface Pad", isPrimary: true },
    ],
    specifications: [
      { name: "Conductivity", value: "18.5 W/mK Thermal Transfer", group: "Materials" },
      { name: "Safety", value: "100% Electrically Non-Conductive", group: "Materials" },
    ],
    features: [
      { title: "No Pump-Out", description: "Phase-change material resists thermal cycling pump-out for 5+ years of peak conductivity." },
    ],
    has3DModel: false,
    highlightBadge: "Phase-Change Pad",
    badgeVariant: "electric",
    featured: false,
    specs: ["18.5 W/mK Transfer", "Diamond Nanoparticles", "Zero Pump-Out"],
  },
];

/**
 * Utility query helpers for the centralized product catalogue.
 */
export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

/**
 * Deterministically retrieves related products from the centralized catalogue.
 * Excludes the current product. Prioritizes units from the same category,
 * followed by the same brand, followed by other featured hardware units.
 */
export function getRelatedProducts(currentProduct: Product, limit = 4): Product[] {
  const otherProducts = products.filter((p) => p.slug !== currentProduct.slug);

  // 1. Same category first
  const sameCategory = otherProducts.filter(
    (p) => p.categorySlug.toLowerCase() === currentProduct.categorySlug.toLowerCase()
  );

  // 2. Same brand next
  const sameBrand = otherProducts.filter(
    (p) =>
      p.brandSlug.toLowerCase() === currentProduct.brandSlug.toLowerCase() &&
      p.categorySlug.toLowerCase() !== currentProduct.categorySlug.toLowerCase()
  );

  // 3. Featured flagships from other divisions
  const featured = otherProducts.filter(
    (p) =>
      p.featured &&
      p.categorySlug.toLowerCase() !== currentProduct.categorySlug.toLowerCase() &&
      p.brandSlug.toLowerCase() !== currentProduct.brandSlug.toLowerCase()
  );

  const combined = [...sameCategory, ...sameBrand, ...featured, ...otherProducts];
  const uniqueMap = new Map<string, Product>();
  for (const item of combined) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }

  return Array.from(uniqueMap.values()).slice(0, limit);
}

