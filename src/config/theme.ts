/**
 * NEXORA Design Tokens & Theme Specification
 *
 * Core Color Palette:
 * - Primary Background: #060B1A (Obsidian Space)
 * - Secondary Background: #101A30 (Midnight Navy)
 * - Electric Blue: #327BFF (Active Brand Accent)
 * - Violet Accent: #8B5CF6 (Secondary Harmonic Glow)
 * - Premium White: #F8FAFC (Ultra-clean typography)
 * - Muted Text: #94A3B8 (High-contrast slate for accessibility)
 */

export const themeTokens = {
  colors: {
    background: {
      primary: "#060B1A",
      secondary: "#101A30",
      surface: "#0A1226",
      card: "#0E1830",
      cardHover: "#132140",
    },
    accent: {
      electric: "#327BFF",
      electricHover: "#2563EB",
      electricGlow: "rgba(50, 123, 255, 0.35)",
      violet: "#8B5CF6",
      violetHover: "#7C3AED",
      violetGlow: "rgba(139, 92, 246, 0.35)",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      muted: "#64748B",
      accent: "#327BFF",
    },
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      glass: "rgba(255, 255, 255, 0.12)",
      highlight: "rgba(50, 123, 255, 0.28)",
      highlightActive: "rgba(50, 123, 255, 0.6)",
    },
    lighting: {
      glowRadial: "radial-gradient(circle at 50% 0%, rgba(50, 123, 255, 0.15) 0%, rgba(6, 11, 26, 0) 70%)",
      glowHero: "radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.12) 0%, rgba(50, 123, 255, 0.08) 35%, rgba(6, 11, 26, 0) 70%)",
    },
  },
  typography: {
    fontSans: "var(--font-sans)",
    fontDisplay: "var(--font-display)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

export type ThemeTokens = typeof themeTokens;
