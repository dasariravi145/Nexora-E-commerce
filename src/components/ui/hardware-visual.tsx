import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Cable,
  Box,
} from "lucide-react";

export interface HardwareVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  categorySlug: string;
  productSlug?: string;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
}

/**
 * HardwareVisual generates self-contained, retina-sharp futuristic hardware visuals.
 * Guarantees zero broken external asset links, zero latency, and responsive scaling.
 */
export function HardwareVisual({
  categorySlug,
  productSlug,
  size = "md",
  className,
  ...props
}: HardwareVisualProps) {
  const sizeStyles = {
    sm: "h-28",
    md: "h-48 sm:h-52",
    lg: "h-64 sm:h-72",
    hero: "h-72 sm:h-96 lg:h-[420px]",
  };

  const getVisualElements = () => {
    switch (categorySlug) {
      case "smartphones":
        return {
          icon: Smartphone,
          accent: "from-blue-600/30 via-blue-500/10 to-transparent",
          glowColor: "rgba(59, 130, 246, 0.3)",
          label: "Titanium Chassis • Micro-OLED Telemetry",
          pattern: (
            <>
              <rect
                x="35%"
                y="16%"
                width="30%"
                height="68%"
                rx="14"
                fill="none"
                stroke="rgba(59, 130, 246, 0.45)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx="50%" cy="24%" r="3" fill="rgba(59, 130, 246, 0.6)" />
            </>
          ),
        };
      case "laptops":
        return {
          icon: Laptop,
          accent: "from-violet-600/30 via-purple-500/10 to-transparent",
          glowColor: "rgba(139, 92, 246, 0.3)",
          label: "Dual-Touch OLED • Cryo-Vapor Matrix",
          pattern: (
            <>
              <rect
                x="25%"
                y="20%"
                width="50%"
                height="44%"
                rx="8"
                fill="none"
                stroke="rgba(139, 92, 246, 0.45)"
                strokeWidth="2"
              />
              <polygon
                points="40,165 260,165 285,188 15,188"
                fill="none"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="2"
              />
            </>
          ),
        };
      case "audio":
        return {
          icon: Headphones,
          accent: "from-cyan-600/30 via-cyan-500/10 to-transparent",
          glowColor: "rgba(6, 182, 212, 0.3)",
          label: "Planar Driver Physics • Cyan Soundstage",
          pattern: (
            <>
              <circle
                cx="50%"
                cy="50%"
                r="52"
                fill="none"
                stroke="rgba(6, 182, 212, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle
                cx="50%"
                cy="50%"
                r="38"
                fill="none"
                stroke="rgba(6, 182, 212, 0.45)"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <circle
                cx="50%"
                cy="50%"
                r="24"
                fill="none"
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth="1.5"
              />
            </>
          ),
        };
      case "gaming":
        return {
          icon: Gamepad2,
          accent: "from-violet-600/30 via-blue-500/15 to-transparent",
          glowColor: "rgba(99, 102, 241, 0.3)",
          label: "Sub-Millisecond Synapse • 8K Spatial Rig",
          pattern: (
            <>
              <rect
                x="22%"
                y="30%"
                width="56%"
                height="40%"
                rx="16"
                fill="none"
                stroke="rgba(99, 102, 241, 0.45)"
                strokeWidth="2"
              />
              <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            </>
          ),
        };
      case "wearables":
        return {
          icon: Watch,
          accent: "from-sky-600/30 via-blue-500/10 to-transparent",
          glowColor: "rgba(14, 165, 233, 0.25)",
          label: "Continuous Biometric Matrix • Cool-Blue Telemetry",
          pattern: (
            <>
              <circle
                cx="50%"
                cy="50%"
                r="42"
                fill="none"
                stroke="rgba(14, 165, 233, 0.2)"
                strokeWidth="1"
              />
              <circle
                cx="50%"
                cy="50%"
                r="32"
                fill="none"
                stroke="rgba(14, 165, 233, 0.45)"
                strokeWidth="2.5"
                strokeDasharray="8 4"
              />
              <path
                d="M 120 100 Q 140 85 150 100 T 180 100"
                fill="none"
                stroke="rgba(14, 165, 233, 0.5)"
                strokeWidth="1.5"
              />
            </>
          ),
        };
      case "accessories":
        return {
          icon: Cable,
          accent: "from-slate-600/30 via-blue-500/10 to-transparent",
          glowColor: "rgba(148, 163, 184, 0.2)",
          label: "100Gbps Optical Channel • Clean Interconnect",
          pattern: (
            <>
              <path
                d="M30,100 Q150,20 270,100"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <line x1="30" y1="120" x2="270" y2="120" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" strokeDasharray="6 3" />
            </>
          ),
        };
      default:
        return {
          icon: Box,
          accent: "from-blue-600/20 via-purple-500/10 to-transparent",
          glowColor: "rgba(50, 123, 255, 0.2)",
          label: "Spatial Hardware Specimen",
          pattern: null,
        };
    }
  };

  const visual = getVisualElements();
  const IconComponent = visual.icon;

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden flex items-center justify-center bg-[#070D1F] border border-white/[0.06] group-hover:border-blue-500/30 transition-all duration-300 select-none",
        sizeStyles[size],
        className
      )}
      data-product={productSlug}
      {...props}
    >
      {/* Ambient Radial Lighting Ring */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${visual.glowColor} 0%, rgba(6, 11, 26, 0) 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Futuristic Geometric Backdrop Vector */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`grid-${categorySlug}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${categorySlug})`} />
        {visual.pattern}
      </svg>

      {/* Hardware Core Icon & Holographic Disc */}
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F1B38] to-[#162750] border border-white/[0.12] text-blue-400 group-hover:text-white group-hover:border-blue-400/50 group-hover:scale-105 shadow-xl transition-all duration-300">
          <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
        </div>

        <span className="mt-3 text-[10px] font-mono tracking-wider uppercase text-slate-400 group-hover:text-slate-300 transition-colors">
          {visual.label}
        </span>
      </div>

      {/* Bottom Rim Sheen */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
