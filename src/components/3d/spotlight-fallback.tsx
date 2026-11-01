import { Smartphone, Cpu, ShieldCheck } from "lucide-react";

export interface SpotlightFallbackProps {
  message?: string;
  isReducedMotion?: boolean;
}

/**
 * SpotlightFallback renders a high-fidelity obsidian architectural preview of the
 * NEXORA Nova 1 Pro when WebGL is unavailable or when reduced motion is preferred.
 */
export function SpotlightFallback({
  message = "Architectural Preview Active",
  isReducedMotion = false,
}: SpotlightFallbackProps) {
  return (
    <div
      role="region"
      aria-label="NEXORA Nova 1 Pro Hardware Preview"
      className="relative w-full h-[320px] xs:h-[360px] sm:h-[420px] lg:h-[460px] rounded-2xl bg-[#070D1F] border border-white/[0.08] p-6 flex flex-col justify-between items-center text-center overflow-hidden select-none"
    >
      {/* Background Radial Sheen */}
      <div
        className="absolute inset-0 bg-radial-gradient from-blue-600/15 via-purple-600/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Blueprint Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="spotlight-fallback-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgba(50, 123, 255, 0.25)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#spotlight-fallback-grid)" />
      </svg>

      {/* Header Telemetry */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          {isReducedMotion ? "Static Architectural View" : "3D Engine Loading"}
        </span>
        <span className="text-slate-400">Titanium Grade 5 • 7.8mm</span>
      </div>

      {/* Center Device Silhouette with Holographic Glow */}
      <div className="relative my-auto flex flex-col items-center justify-center space-y-4 z-10">
        <div className="relative flex h-24 w-16 sm:h-28 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600/25 to-purple-600/25 border-2 border-blue-400/40 text-blue-300 shadow-2xl shadow-blue-500/20">
          <Smartphone className="h-10 w-10 text-blue-300" />
          {/* Camera plateau hint */}
          <div className="absolute top-2 right-2 h-4 w-3.5 rounded bg-blue-400/40 border border-blue-300/60" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-white tracking-wide">
            NEXORA Nova 1 Pro
          </p>
          <p className="text-xs text-slate-400 font-mono">{message}</p>
        </div>
      </div>

      {/* Footer Specs Status */}
      <div className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono z-10">
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          Neural Silicon X2
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Cryo-Sealed
        </span>
      </div>
    </div>
  );
}
