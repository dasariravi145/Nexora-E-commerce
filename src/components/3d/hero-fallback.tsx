import * as React from "react";
import { Box, Cpu } from "lucide-react";

export interface HeroFallbackProps {
  message?: string;
  isReducedMotion?: boolean;
}

/**
 * HeroFallback renders a graceful, dark-obsidian loading or reduced-motion state.
 * Guarantees zero layout shift and instant visual feedback.
 */
export function HeroFallback({
  message = "Initializing Spatial 3D Engine...",
  isReducedMotion = false,
}: HeroFallbackProps) {
  return (
    <div
      role="region"
      aria-label="3D Hardware Visual Stage"
      className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-[22px] bg-[#070D1F] border border-white/[0.08] p-6 flex flex-col justify-between items-center text-center overflow-hidden select-none"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          {isReducedMotion ? "Reduced Motion Active" : "3D Engine Loading"}
        </span>
        <span className="text-slate-400">WebGL 2.0 • Three.js</span>
      </div>

      {/* Center Holographic Graphic */}
      <div className="relative my-auto flex flex-col items-center justify-center space-y-4 z-10">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-blue-400/30 text-blue-400 shadow-2xl shadow-blue-500/20">
          <Box className="h-10 w-10 text-blue-300 animate-pulse" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">NEXORA Nova 1 Pro</p>
          <p className="text-xs text-slate-400 font-mono">{message}</p>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono z-10">
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          Hardware Telemetry
        </span>
        <span>Phase 2 Active</span>
      </div>
    </div>
  );
}
