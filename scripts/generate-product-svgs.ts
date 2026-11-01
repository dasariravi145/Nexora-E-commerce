import fs from "fs";
import path from "path";

interface SvgConfig {
  filename: string;
  title: string;
  subtitle: string;
  category: "smartphone" | "laptop" | "audio" | "gaming" | "wearable" | "accessory";
  accentColor: string; // e.g. #3B82F6
  glowColor: string; // e.g. rgba(59, 130, 246, 0.4)
  angle?: string;
  badge?: string;
}

const images: SvgConfig[] = [
  // Smartphones
  {
    filename: "nova-1-pro-primary.svg",
    title: "NEXORA NOVA 1 PRO",
    subtitle: "AEROSPACE TITANIUM • 120HZ MICRO-OLED",
    category: "smartphone",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.45)",
    angle: "FRONT CHASSIS ELEVATION",
    badge: "FLAGSHIP MOBILE",
  },
  {
    filename: "nova-1-pro-angle.svg",
    title: "NEXORA NOVA 1 PRO",
    subtitle: "TRI-SPECTRAL 50MP • PERISCOPE ARRAY",
    category: "smartphone",
    accentColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.4)",
    angle: "45° ISOMETRIC PERSPECTIVE",
    badge: "OPTICAL CLUSTER",
  },
  {
    filename: "nova-1-pro-detail.svg",
    title: "NEXORA NOVA 1 PRO",
    subtitle: "NEURAL SILICON X2 • CRYOGENIC VAPOR CHAMBER",
    category: "smartphone",
    accentColor: "#93C5FD",
    glowColor: "rgba(147, 197, 253, 0.35)",
    angle: "INTERNAL ENCLAVE CROSS-SECTION",
    badge: "SILICON ARCHITECTURE",
  },
  {
    filename: "nova-1-ultra-primary.svg",
    title: "NEXORA NOVA 1 ULTRA",
    subtitle: "PERISCOPE DUAL 10X • 4000 NITS DISPLAY",
    category: "smartphone",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.45)",
    angle: "ULTRA QUAD-LENS ASSEMBLY",
    badge: "EXTREME OPTICS",
  },
  {
    filename: "photon-horizon.svg",
    title: "KINETIC PHOTON HORIZON",
    subtitle: "SUB-PIXEL HOLOGRAPHIC LIGHT-FIELD",
    category: "smartphone",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    angle: "HOLOGRAPHIC VOLUMETRIC EMITTER",
    badge: "LIGHT-FIELD ARRAY",
  },
  {
    filename: "aura-pulse.svg",
    title: "AURA PULSE COMPACT",
    subtitle: "5.9-INCH COMPACT • 155G MONOLITH",
    category: "smartphone",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    angle: "TACTILE CONTOURED RADIUS",
    badge: "COMPACT ERGONOMIC",
  },
  {
    filename: "nova-fold.svg",
    title: "NEXORA NOVA FOLD SPATIAL",
    subtitle: "DUAL-SYNAPSE HINGE • 8.1\" IMMERSIVE BOOK",
    category: "smartphone",
    accentColor: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.45)",
    angle: "DUAL-DISPLAY CONTINUUM",
    badge: "SPATIAL FOLDABLE",
  },

  // Laptops
  {
    filename: "zephyr-16-primary.svg",
    title: "NEXORA ZEPHYR 16 STUDIO",
    subtitle: "NEURAL M4 MAX ARCHITECTURE • 16\" MINI-LED",
    category: "laptop",
    accentColor: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.45)",
    angle: "ISOMETRIC WORKSTATION PROFILE",
    badge: "STUDIO REFERENCE",
  },
  {
    filename: "zephyr-16-angle.svg",
    title: "NEXORA ZEPHYR 16 STUDIO",
    subtitle: "THUNDERBOLT 5 MATRIX • MAG-SAFE DISPATCH",
    category: "laptop",
    accentColor: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.4)",
    angle: "SIDE PROFILE & CONNECTIVITY",
    badge: "PORT ARRAY",
  },
  {
    filename: "zephyr-16-deck.svg",
    title: "NEXORA ZEPHYR 16 STUDIO",
    subtitle: "CRYOGENIC COPPER HEATPIPE • HAPTIC KEYPAD",
    category: "laptop",
    accentColor: "#4F46E5",
    glowColor: "rgba(79, 70, 229, 0.4)",
    angle: "TACTILE DECK & THERMAL EXHAUST",
    badge: "VAPOR MATRIX",
  },
  {
    filename: "zephyr-14.svg",
    title: "ZEPHYR 14 CARBON MOBILE",
    subtitle: "FORGED CARBON COMPOSITE • 980G WEIGHT",
    category: "laptop",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    angle: "FEATHERWEIGHT CARBON MONOCOQUE",
    badge: "CARBON ULTRABOOK",
  },
  {
    filename: "chrono-17.svg",
    title: "CHRONO STUDIO PRECISION 17",
    subtitle: "4K DCI-P3 HARDWARE CALIBRATED • 17.3\"",
    category: "laptop",
    accentColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    angle: "COLOR-CRITICAL REFERENCE DISPLAY",
    badge: "PRECISION RIG",
  },
  {
    filename: "aura-flow.svg",
    title: "AURA FLOW DUAL-BOOK",
    subtitle: "TWIN 14\" TOUCH OLED • CONTINUOUS WORKSPACE",
    category: "laptop",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    angle: "DUAL-OLED SPATIAL WORKFLOW",
    badge: "DUAL DISPLAY",
  },
  {
    filename: "compute-deck.svg",
    title: "KINETIC COMPUTE DECK",
    subtitle: "MODULAR CARTRIDGE EXPANSION • HOT-SWAP",
    category: "laptop",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    angle: "MODULAR SWAPPABLE BUS CHASSIS",
    badge: "MODULAR TERMINAL",
  },

  // Audio
  {
    filename: "vortex-planar-primary.svg",
    title: "VORTEX RESONANCE PLANAR",
    subtitle: "100MM PLANAR MAGNETIC • BERYLLIUM FOIL",
    category: "audio",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.45)",
    angle: "ACOUSTIC CHAMBER ELEVATION",
    badge: "AUDIOPHILE FLAGSHIP",
  },
  {
    filename: "vortex-planar-profile.svg",
    title: "VORTEX RESONANCE PLANAR",
    subtitle: "OPEN-BACK TITANIUM GRILL • 4.4MM BALANCED",
    category: "audio",
    accentColor: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.4)",
    angle: "LATERAL YOKE & DRIVER BAFFLE",
    badge: "OPEN-BACK ACOUSTICS",
  },
  {
    filename: "vortex-planar-case.svg",
    title: "VORTEX RESONANCE PLANAR",
    subtitle: "MILLED ANODIZED CHASSIS • LAMBSKIN PADS",
    category: "audio",
    accentColor: "#7C3AED",
    glowColor: "rgba(124, 58, 237, 0.4)",
    angle: "GIMBAL ARTICULATION MATRIX",
    badge: "PRECISION SUSPENSION",
  },
  {
    filename: "vortex-monitor-x.svg",
    title: "VORTEX BERYLLIUM MONITOR X",
    subtitle: "ZERO-DISTORTION STUDIO REFERENCE MONITOR",
    category: "audio",
    accentColor: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.4)",
    angle: "ACOUSTIC TRANSDUCER ASSEMBLY",
    badge: "STUDIO MONITOR",
  },
  {
    filename: "aura-pods.svg",
    title: "AURA ACOUSTIC PODS PRO",
    subtitle: "TRUE BALANCED ARMATURE • ACTIVE CANCEL",
    category: "audio",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    angle: "MICRO-ACOUSTIC RESONANCE POD",
    badge: "SPATIAL PODS",
  },
  {
    filename: "wave-dac.svg",
    title: "KINETIC WAVE DAC BRIDGE",
    subtitle: "DUAL ESS SABRE 9038PRO • 32-BIT/768KHZ",
    category: "audio",
    accentColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    angle: "DISCRETE R-2R RESISTOR LADDER",
    badge: "REFERENCE DAC",
  },
  {
    filename: "soundstage.svg",
    title: "VORTEX SPATIAL SOUNDSTAGE",
    subtitle: "12-TRANSDUCER DOLBY ATMOS BEAMFORMER",
    category: "audio",
    accentColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    angle: "PARAMETRIC BEAM-STEERED ARRAY",
    badge: "IMMERSIVE THEATRE",
  },

  // Gaming
  {
    filename: "iris-pro-primary.svg",
    title: "NEXORA IRIS PRO SPATIAL RIG",
    subtitle: "DUAL 4K MICRO-OLED • SUB-MILLIMETER TRACKING",
    category: "gaming",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.5)",
    angle: "OPTICAL VISOR ASSEMBLY",
    badge: "SPATIAL HARDWARE",
  },
  {
    filename: "iris-pro-optics.svg",
    title: "NEXORA IRIS PRO SPATIAL RIG",
    subtitle: "PANCAKE OPTICAL MATRIX • 120° FIELD OF VIEW",
    category: "gaming",
    accentColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.4)",
    angle: "INTERNAL RETINAL PROJECTION ENCLAVE",
    badge: "RETINAL MICRO-LENS",
  },
  {
    filename: "iris-pro-strap.svg",
    title: "NEXORA IRIS PRO SPATIAL RIG",
    subtitle: "COUNTERBALANCED REAR BATTERY POD • HAPTICS",
    category: "gaming",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    angle: "ERGONOMIC CRANIAL SUSPENSION",
    badge: "WEIGHT DISTRIBUTION",
  },
  {
    filename: "quantum-desktop.svg",
    title: "QUANTUM RIG 01 CRYO DESKTOP",
    subtitle: "CLOSED-LOOP LIQUID HELIUM HYBRID CHILLER",
    category: "gaming",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.45)",
    angle: "CRYOGENIC CHASSIS MANIFOLD",
    badge: "EXTREME COMPUTING",
  },
  {
    filename: "synapse-controller.svg",
    title: "KINETIC SYNAPSE CONTROLLER",
    subtitle: "HALL-EFFECT GIMBALS • DUAL FORCE HAPTICS",
    category: "gaming",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    angle: "TACTILE NEURAL INTERFACE",
    badge: "ZERO-DRIFT GIMBALS",
  },
  {
    filename: "spatial-display.svg",
    title: "CHRONO PULSE SPATIAL DISPLAY 32",
    subtitle: "32\" 8K AUTOSCEREOSCOPIC GLASS-FREE 3D",
    category: "gaming",
    accentColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    angle: "LENTICULAR VOLUMETRIC PANEL",
    badge: "SPATIAL MONITOR",
  },
  {
    filename: "sensor-bar.svg",
    title: "NEXORA IRIS FIELD SENSOR BAR",
    subtitle: "SUB-MM TIME-OF-FLIGHT SENSOR MATRIX",
    category: "gaming",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    angle: "INFRARED PHOTON DETECTOR ARRAY",
    badge: "ROOM-SCALE TRACKER",
  },

  // Wearables
  {
    filename: "aura-ring-primary.svg",
    title: "AURA KINETIC NEURAL RING",
    subtitle: "TITANIUM Grade-5 • PHOTOPLETHYSMOGRAPHY",
    category: "wearable",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.45)",
    angle: "CIRCULAR TORUS CROSS-SECTION",
    badge: "NEURAL TELEMETRY",
  },
  {
    filename: "telemetry-watch.svg",
    title: "CHRONO PULSE TELEMETRY WATCH",
    subtitle: "SAPPHIRE CRYSTAL • CONTINUOUS ECG SENSOR",
    category: "wearable",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.45)",
    angle: "CHRONOGRAPH DIAL & SENSOR DOME",
    badge: "PRECISION CHRONO",
  },
  {
    filename: "biosense-band.svg",
    title: "NEXORA BIOSENSE BAND 2",
    subtitle: "FLEXIBLE ELECTROCHEMICAL METABOLIC BIO-STRIP",
    category: "wearable",
    accentColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    angle: "EPIDERMAL BIO-SENSOR STRIP",
    badge: "METABOLIC BAND",
  },
  {
    filename: "neural-lens.svg",
    title: "AURA NEURAL LENS FRAME",
    subtitle: "MICRO-WAVEGUIDE HUD • BONE CONDUCTION AUDIO",
    category: "wearable",
    accentColor: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.4)",
    angle: "TITANIUM OPTICAL FRAME",
    badge: "AUGMENTED FRAME",
  },
  {
    filename: "haptic-band.svg",
    title: "KINETIC HAPTIC WRIST BAND",
    subtitle: "VIBRO-TACTILE MATRIX • MOTOR ACTUATORS",
    category: "wearable",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    angle: "SURFACE HAPTIC TRANSDUCER",
    badge: "TACTILE ACTUATOR",
  },

  // Accessories
  {
    filename: "magbridge-dock-primary.svg",
    title: "NEXORA MAGBRIDGE DOCK",
    subtitle: "100GBPS OPTICAL BUS • 240W GAN INDUCTION",
    category: "accessory",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.45)",
    angle: "ALUMINUM EXTRUDED MONOLITH",
    badge: "HIGH-SPEED HUB",
  },
  {
    filename: "inductive-mat.svg",
    title: "MAGBRIDGE 140W INDUCTIVE MAT",
    subtitle: "MULTI-COIL FREE-POSITION CHARGING SURFACE",
    category: "accessory",
    accentColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    angle: "PLANAR INDUCTION GRID",
    badge: "INDUCTION MAT",
  },
  {
    filename: "arm-mount.svg",
    title: "KINETIC TITANIUM ARM MOUNT",
    subtitle: "GAS-SPRING BALANCED FLUID COUNTERWEIGHT",
    category: "accessory",
    accentColor: "#64748B",
    glowColor: "rgba(100, 116, 139, 0.4)",
    angle: "COUNTERBALANCED ARTICULATED JOINT",
    badge: "TITANIUM MOUNT",
  },
  {
    filename: "silver-cable.svg",
    title: "VORTEX BRAIDED SILVER CABLE",
    subtitle: "OCC 99.9999% PURIFIED MONOCRYSTALLINE SILVER",
    category: "accessory",
    accentColor: "#E2E8F0",
    glowColor: "rgba(226, 232, 240, 0.4)",
    angle: "8-CORE LITZ SHIELDED WEAVE",
    badge: "SILVER INTERCONNECT",
  },
  {
    filename: "thermal-matrix.svg",
    title: "CHRONO CRYO-THERMAL MATRIX",
    subtitle: "GRAPHENE-ENHANCED PHASE CHANGE INTERFACE",
    category: "accessory",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    angle: "HEXAGONAL MOLECULAR MATRIX",
    badge: "THERMAL PAD",
  },
];

function generateSvgContent(cfg: SvgConfig): string {
  // Category silhouette
  let silhouette = "";
  if (cfg.category === "smartphone") {
    silhouette = `
      <!-- Smartphone Silhouette -->
      <g transform="translate(250, 150)">
        <rect x="0" y="0" width="300" height="500" rx="36" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="4" />
        <rect x="12" y="14" width="276" height="472" rx="28" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.4" />
        <!-- Screen Reflection & Circuit Line -->
        <path d="M 30 50 L 270 450" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.3" />
        <!-- Camera Island -->
        <rect x="25" y="30" width="80" height="170" rx="20" fill="#060C1B" stroke="${cfg.accentColor}" stroke-width="2" />
        <circle cx="65" cy="65" r="24" fill="#0D1D40" stroke="${cfg.accentColor}" stroke-width="3" />
        <circle cx="65" cy="65" r="10" fill="${cfg.accentColor}" fill-opacity="0.6" />
        <circle cx="65" cy="125" r="22" fill="#0D1D40" stroke="${cfg.accentColor}" stroke-width="2.5" />
        <circle cx="65" cy="125" r="8" fill="${cfg.accentColor}" fill-opacity="0.5" />
        <circle cx="65" cy="172" r="14" fill="#0D1D40" stroke="${cfg.accentColor}" stroke-width="2" />
        <!-- Micro Speaker / Dynamic Island -->
        <rect x="110" y="24" width="80" height="16" rx="8" fill="#040814" stroke="${cfg.accentColor}" stroke-width="1" />
        <!-- Dimension Indicator -->
        <line x1="-30" y1="0" x2="-30" y2="500" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
        <line x1="-40" y1="0" x2="-20" y2="0" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
        <line x1="-40" y1="500" x2="-20" y2="500" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
        <text x="-50" y="255" fill="${cfg.accentColor}" font-family="monospace" font-size="12" text-anchor="end" transform="rotate(-90 -50 255)">164.2 MM</text>
      </g>
    `;
  } else if (cfg.category === "laptop") {
    silhouette = `
      <!-- Laptop Silhouette -->
      <g transform="translate(160, 220)">
        <!-- Display Screen Lid -->
        <polygon points="60,30 420,30 460,250 20,250" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="3" />
        <polygon points="75,44 405,44 440,236 40,236" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="1" stroke-opacity="0.5" />
        <!-- Display Logo -->
        <circle cx="240" cy="135" r="28" fill="#0D1D40" stroke="${cfg.accentColor}" stroke-width="2" />
        <polygon points="240,118 255,145 225,145" fill="${cfg.accentColor}" fill-opacity="0.8" />
        <!-- Bottom Base Deck -->
        <polygon points="20,250 460,250 480,285 0,285" fill="#0E1A38" stroke="${cfg.accentColor}" stroke-width="3" />
        <rect x="180" y="260" width="120" height="14" rx="3" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="1" />
        <!-- Dimension Line -->
        <line x1="0" y1="315" x2="480" y2="315" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
        <text x="240" y="335" fill="${cfg.accentColor}" font-family="monospace" font-size="12" text-anchor="middle">356.8 MM ARCHITECTURAL WIDTH</text>
      </g>
    `;
  } else if (cfg.category === "audio") {
    silhouette = `
      <!-- Audio Headphone Silhouette -->
      <g transform="translate(200, 150)">
        <!-- Headband Arc -->
        <path d="M 60 220 A 140 140 0 0 1 340 220" fill="none" stroke="${cfg.accentColor}" stroke-width="16" stroke-linecap="round" />
        <path d="M 60 220 A 140 140 0 0 1 340 220" fill="none" stroke="#060C1B" stroke-width="6" stroke-linecap="round" />
        <!-- Yokes -->
        <path d="M 60 220 L 60 270" stroke="${cfg.accentColor}" stroke-width="8" stroke-linecap="round" />
        <path d="M 340 220 L 340 270" stroke="${cfg.accentColor}" stroke-width="8" stroke-linecap="round" />
        <!-- Left Ear Cup -->
        <rect x="20" y="250" width="75" height="140" rx="36" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="4" />
        <circle cx="58" cy="320" r="26" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="2" stroke-dasharray="4 2" />
        <!-- Right Ear Cup -->
        <rect x="305" y="250" width="75" height="140" rx="36" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="4" />
        <circle cx="342" cy="320" r="26" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="2" stroke-dasharray="4 2" />
        <!-- Sound Waves -->
        <path d="M 10 300 Q -15 320 10 340" fill="none" stroke="${cfg.accentColor}" stroke-width="2" stroke-opacity="0.5" />
        <path d="M 390 300 Q 415 320 390 340" fill="none" stroke="${cfg.accentColor}" stroke-width="2" stroke-opacity="0.5" />
      </g>
    `;
  } else if (cfg.category === "gaming") {
    silhouette = `
      <!-- Spatial Visor / Gaming Silhouette -->
      <g transform="translate(180, 200)">
        <!-- Visor Faceplate -->
        <rect x="40" y="60" width="360" height="180" rx="54" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="4" />
        <rect x="58" y="76" width="324" height="148" rx="42" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.6" />
        <!-- Dual Lenses Reflection -->
        <circle cx="150" cy="150" r="48" fill="#040814" stroke="${cfg.accentColor}" stroke-width="3" />
        <circle cx="150" cy="150" r="24" fill="${cfg.accentColor}" fill-opacity="0.4" />
        <circle cx="290" cy="150" r="48" fill="#040814" stroke="${cfg.accentColor}" stroke-width="3" />
        <circle cx="290" cy="150" r="24" fill="${cfg.accentColor}" fill-opacity="0.4" />
        <!-- Headstrap Attachment -->
        <path d="M 40 150 L 0 150" stroke="${cfg.accentColor}" stroke-width="12" stroke-linecap="round" />
        <path d="M 400 150 L 440 150" stroke="${cfg.accentColor}" stroke-width="12" stroke-linecap="round" />
        <!-- Sensor Array Dots -->
        <circle cx="220" cy="88" r="4" fill="${cfg.accentColor}" />
        <circle cx="190" cy="88" r="3" fill="${cfg.accentColor}" />
        <circle cx="250" cy="88" r="3" fill="${cfg.accentColor}" />
      </g>
    `;
  } else if (cfg.category === "wearable") {
    silhouette = `
      <!-- Wearable Watch / Ring Silhouette -->
      <g transform="translate(260, 160)">
        <!-- Watch Straps -->
        <rect x="80" y="10" width="120" height="120" rx="8" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="2" />
        <rect x="80" y="350" width="120" height="120" rx="8" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="2" />
        <!-- Dial Case -->
        <circle cx="140" cy="240" r="110" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="5" />
        <circle cx="140" cy="240" r="92" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="2" stroke-dasharray="6 3" />
        <!-- Inner Core Sensor -->
        <circle cx="140" cy="240" r="45" fill="#040814" stroke="${cfg.accentColor}" stroke-width="2" />
        <!-- Pulse EKG Line -->
        <path d="M 85 240 L 115 240 L 125 210 L 140 265 L 155 225 L 165 240 L 195 240" fill="none" stroke="${cfg.accentColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Crown Button -->
        <rect x="250" y="222" width="16" height="36" rx="4" fill="#0E1A38" stroke="${cfg.accentColor}" stroke-width="2" />
      </g>
    `;
  } else {
    silhouette = `
      <!-- Hardware Accessory Silhouette -->
      <g transform="translate(220, 200)">
        <polygon points="50,40 310,40 360,240 0,240" fill="#070E22" stroke="${cfg.accentColor}" stroke-width="4" />
        <polygon points="70,58 290,58 332,222 28,222" fill="#0B1736" stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
        <!-- Circular Inductive Ring -->
        <circle cx="180" cy="140" r="54" fill="#040814" stroke="${cfg.accentColor}" stroke-width="3" stroke-dasharray="8 4" />
        <circle cx="180" cy="140" r="22" fill="${cfg.accentColor}" fill-opacity="0.4" />
        <!-- Connection Pins -->
        <rect x="150" y="240" width="60" height="20" rx="6" fill="#0E1A38" stroke="${cfg.accentColor}" stroke-width="2" />
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg-grad-${cfg.filename.replace(".svg", "")}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040714" />
      <stop offset="50%" stop-color="#070E22" />
      <stop offset="100%" stop-color="#09132C" />
    </linearGradient>

    <!-- Center Radial Glow -->
    <radialGradient id="glow-${cfg.filename.replace(".svg", "")}" cx="50%" cy="48%" r="45%">
      <stop offset="0%" stop-color="${cfg.glowColor}" />
      <stop offset="70%" stop-color="rgba(7, 14, 34, 0)" />
    </radialGradient>

    <!-- Technical Grid Pattern -->
    <pattern id="grid-${cfg.filename.replace(".svg", "")}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      <circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.15)" />
    </pattern>
  </defs>

  <!-- Deep Slate Background -->
  <rect width="800" height="800" fill="url(#bg-grad-${cfg.filename.replace(".svg", "")})" />
  <rect width="800" height="800" fill="url(#grid-${cfg.filename.replace(".svg", "")})" />

  <!-- Ambient Glow Behind Hardware -->
  <circle cx="400" cy="380" r="320" fill="url(#glow-${cfg.filename.replace(".svg", "")})" />

  <!-- Concentric Telemetry Target Rings -->
  <circle cx="400" cy="380" r="330" fill="none" stroke="${cfg.accentColor}" stroke-width="1" stroke-opacity="0.15" stroke-dasharray="6 6" />
  <circle cx="400" cy="380" r="270" fill="none" stroke="${cfg.accentColor}" stroke-width="1" stroke-opacity="0.2" />
  <circle cx="400" cy="380" r="180" fill="none" stroke="${cfg.accentColor}" stroke-width="1" stroke-opacity="0.1" />

  <!-- Corner Calibration Targets -->
  <g stroke="${cfg.accentColor}" stroke-width="1.5" stroke-opacity="0.4">
    <!-- Top Left -->
    <path d="M 40 60 L 40 40 L 60 40" fill="none" />
    <!-- Top Right -->
    <path d="M 760 60 L 760 40 L 740 40" fill="none" />
    <!-- Bottom Left -->
    <path d="M 40 740 L 40 760 L 60 760" fill="none" />
    <!-- Bottom Right -->
    <path d="M 760 740 L 760 760 L 740 760" fill="none" />
  </g>

  <!-- Top Technical Header -->
  <g font-family="monospace">
    <text x="50" y="55" fill="${cfg.accentColor}" font-size="11" font-weight="bold" letter-spacing="2">NEXORA PRECISION LABS • 3D SPECIMEN</text>
    <text x="750" y="55" fill="#94A3B8" font-size="11" text-anchor="end" letter-spacing="1">REF: ${cfg.filename.toUpperCase()}</text>
  </g>

  <!-- Hardware Silhouette Element -->
  ${silhouette}

  <!-- Bottom Technical Overlay Card -->
  <g transform="translate(60, 680)">
    <rect x="0" y="0" width="680" height="66" rx="12" fill="#060C1B" fill-opacity="0.9" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    <!-- Indicator Pill -->
    <rect x="18" y="16" width="8" height="34" rx="4" fill="${cfg.accentColor}" />
    <!-- Unit Name and Perspective -->
    <text x="38" y="34" fill="#FFFFFF" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="1">${cfg.title}</text>
    <text x="38" y="52" fill="#94A3B8" font-family="monospace" font-size="11" letter-spacing="0.5">${cfg.subtitle}</text>
    <!-- Angle Tag -->
    <rect x="520" y="18" width="144" height="28" rx="6" fill="#0D1936" stroke="${cfg.accentColor}" stroke-width="1" stroke-opacity="0.5" />
    <text x="592" y="36" fill="${cfg.accentColor}" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="1">${cfg.angle || "ORTHOGRAPHIC VIEW"}</text>
  </g>
</svg>`;
}

const targetDir = path.resolve(process.cwd(), "public/images/products");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (const img of images) {
  const filePath = path.join(targetDir, img.filename);
  const content = generateSvgContent(img);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Generated: ${img.filename}`);
}

console.log(`Successfully generated ${images.length} product vector assets.`);
