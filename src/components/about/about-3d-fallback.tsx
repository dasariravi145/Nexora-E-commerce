import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Orbit } from "lucide-react";

export interface About3DFallbackProps {
  message?: string;
  className?: string;
}

/**
 * High-performance, self-contained SVG & CSS architectural preview.
 * Acts as the immediate server placeholder, WebGL fallback, and reduced-motion visual.
 */
export function About3DFallback({
  message = "Nexus Procedural Matrix",
  className,
}: About3DFallbackProps) {
  return (
    <div
      role="img"
      aria-label="Architectural geometry preview of the NEXORA Nexus Matrix"
      className={cn(
        "relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl bg-[#070D1F] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-6 select-none",
        className
      )}
    >
      {/* Ambient background glows */}
      <div
        className="absolute w-[240px] h-[240px] rounded-full bg-blue-600/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute w-[180px] h-[180px] rounded-full bg-purple-600/15 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Geometric SVG lattice */}
      <svg
        viewBox="0 0 240 240"
        className="w-48 h-48 sm:w-56 sm:h-56 text-blue-400 relative z-10 motion-safe:animate-pulse"
        style={{ animationDuration: "6s" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer orbital boundary */}
        <circle
          cx="120"
          cy="120"
          r="105"
          stroke="rgba(139, 92, 246, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />

        {/* Secondary tilted ring ellipse */}
        <ellipse
          cx="120"
          cy="120"
          rx="90"
          ry="38"
          transform="rotate(-25 120 120)"
          stroke="rgba(50, 123, 255, 0.45)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Opposite tilted ring ellipse */}
        <ellipse
          cx="120"
          cy="120"
          rx="90"
          ry="38"
          transform="rotate(35 120 120)"
          stroke="rgba(139, 92, 246, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Central Isometric Octahedron Wireframe */}
        <g stroke="rgba(248, 250, 252, 0.85)" strokeWidth="1.5" strokeLinejoin="round">
          {/* Top apex to vertices */}
          <line x1="120" y1="45" x2="65" y2="120" stroke="rgba(50, 123, 255, 0.7)" />
          <line x1="120" y1="45" x2="175" y2="120" stroke="rgba(139, 92, 246, 0.7)" />
          <line x1="120" y1="45" x2="120" y2="155" stroke="rgba(50, 123, 255, 0.9)" />

          {/* Bottom apex to vertices */}
          <line x1="120" y1="195" x2="65" y2="120" stroke="rgba(50, 123, 255, 0.7)" />
          <line x1="120" y1="195" x2="175" y2="120" stroke="rgba(139, 92, 246, 0.7)" />
          <line x1="120" y1="195" x2="120" y2="155" stroke="rgba(139, 92, 246, 0.9)" />

          {/* Equator edges */}
          <line x1="65" y1="120" x2="120" y2="155" stroke="rgba(248, 250, 252, 0.6)" />
          <line x1="175" y1="120" x2="120" y2="155" stroke="rgba(248, 250, 252, 0.6)" />
          <line x1="65" y1="120" x2="120" y2="85" stroke="rgba(248, 250, 252, 0.25)" strokeDasharray="2 2" />
          <line x1="175" y1="120" x2="120" y2="85" stroke="rgba(248, 250, 252, 0.25)" strokeDasharray="2 2" />
        </g>

        {/* Vertex nodes */}
        <circle cx="120" cy="45" r="4" fill="#327BFF" />
        <circle cx="120" cy="195" r="4" fill="#8B5CF6" />
        <circle cx="65" cy="120" r="3.5" fill="#38BDF8" />
        <circle cx="175" cy="120" r="3.5" fill="#C084FC" />
        <circle cx="120" cy="155" r="4" fill="#F8FAFC" />
      </svg>

      {/* Top telemetry bar */}
      <div className="absolute top-4 inset-x-5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060B1A]/80 border border-blue-500/20 text-blue-300">
          <Orbit className="h-3 w-3" />
          <span>Nexus Matrix</span>
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060B1A]/80 border border-white/[0.08] text-slate-400">
          <Sparkles className="h-3 w-3 text-purple-400" />
          <span>Geometric Concept</span>
        </span>
      </div>

      {/* Bottom telemetry label */}
      <div className="absolute bottom-4 inset-x-5 flex items-center justify-center text-center">
        <p className="text-xs font-mono text-slate-400 bg-[#060B1A]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08]">
          {message}
        </p>
      </div>
    </div>
  );
}
