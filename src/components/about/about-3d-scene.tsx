"use client";

import * as React from "react";
import { About3DFallback } from "@/components/about/about-3d-fallback";
import { Orbit, Sparkles, Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

import { Canvas } from "@react-three/fiber";
import { About3DModel } from "@/components/about/about-3d-model";

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );
}

export interface About3DSceneProps {
  className?: string;
}

/**
 * About3DScene:
 * Lightweight, accessible, and high-performance WebGL scene representing
 * the NEXORA geometric nexus concept.
 *
 * Features:
 * - Dynamic import with SSR isolation
 * - Full WebGL capability detection with automatic fallback
 * - Accessibility: prefers-reduced-motion detection and user-controlled 2D/3D toggle
 * - IntersectionObserver to freeze canvas when scrolled out of viewport
 * - Defensive pointer tracking (non-blocking for touch gestures)
 * - Capped DPR (1.0 - 1.5) to protect mobile GPU thermals and battery
 */
export function About3DScene({ className }: About3DSceneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const hasWebGL = React.useSyncExternalStore(
    () => () => {},
    checkWebGL,
    () => false
  );
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
  const [forceFallback, setForceFallback] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const isReducedMotion = useReducedMotion();

  // Suspend rendering when scrolled out of view
  React.useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined")
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !containerRef.current || e.pointerType === "touch")
      return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  const handleResetOrientation = () => {
    setPointer({ x: 0, y: 0 });
  };

  // If not mounted or WebGL missing or user requested 2D fallback or error caught
  if (!mounted || !hasWebGL || forceFallback || hasError) {
    return (
      <div className={cn("relative group", className)}>
        <About3DFallback
          message={
            !hasWebGL
              ? "WebGL acceleration unavailable. Showing architectural lattice."
              : isReducedMotion
              ? "Reduced motion active. Showing architectural lattice."
              : forceFallback
              ? "Architectural 2D lattice view active."
              : "Nexus Procedural Matrix"
          }
        />
        {mounted && hasWebGL && !hasError && (
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              onClick={() => setForceFallback(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg bg-blue-600/90 text-white hover:bg-blue-500 border border-blue-400/40 transition-colors shadow-lg shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Switch to interactive 3D WebGL view"
            >
              <Orbit className="h-3.5 w-3.5" />
              <span>Enable 3D</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl bg-[#070D1F] border border-white/[0.08] overflow-hidden select-none group transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10",
        className
      )}
      style={{ touchAction: "pan-y" }}
      role="region"
      aria-label="Interactive 3D NEXORA procedural nexus geometry"
    >
      {/* Top telemetry bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060B1A]/85 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-mono shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Nexus Matrix</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#060B1A]/85 backdrop-blur-md border border-purple-500/20 text-purple-300 text-[11px] font-mono">
            <Sparkles className="h-3 w-3" />
            <span>Procedural 3D</span>
          </span>
        </div>

        {/* Interactive Controls (clickable) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {(pointer.x !== 0 || pointer.y !== 0) && (
            <button
              type="button"
              onClick={handleResetOrientation}
              title="Reset orientation"
              aria-label="Reset 3D orientation"
              className="p-1.5 rounded-lg bg-[#060B1A]/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setForceFallback(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#060B1A]/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 backdrop-blur-md"
            aria-label="Switch to 2D architectural lattice view"
            title="Switch to lightweight 2D lattice view"
          >
            <Eye className="h-3 w-3 text-slate-400" />
            <span>2D View</span>
          </button>
        </div>
      </div>

      {/* WebGL Canvas */}
      {isVisible ? (
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 7.0], fov: 42 }}
          onCreated={() => {
            setHasError(false);
          }}
          onError={() => {
            setHasError(true);
          }}
          aria-hidden="true"
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <pointLight position={[-4, -3, 3]} intensity={1.4} color="#327bff" />
          <pointLight position={[4, 3, -2]} intensity={1.2} color="#8b5cf6" />
          <About3DModel
            pointerCoordinates={pointer}
            isReducedMotion={isReducedMotion}
          />
        </Canvas>
      ) : (
        <div className="w-full h-full bg-[#070D1F]" aria-hidden="true" />
      )}

      {/* Subtle ambient lighting gradients */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(50, 123, 255, 0.15) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom Telemetry Info */}
      <div className="absolute bottom-3 inset-x-4 z-20 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
        <span className="hidden sm:inline bg-[#060B1A]/80 px-2.5 py-1 rounded-md border border-white/[0.06] backdrop-blur-sm">
          Tilt: {pointer.x.toFixed(2)}, {pointer.y.toFixed(2)}
        </span>
        <span className="mx-auto sm:mx-0 bg-[#060B1A]/80 px-3 py-1 rounded-md border border-white/[0.06] backdrop-blur-sm text-slate-300">
          {isReducedMotion
            ? "Static Orientation • Reduced Motion"
            : "Move cursor to inspect procedural matrix"}
        </span>
      </div>
    </div>
  );
}
