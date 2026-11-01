"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  SpotlightModel,
  type SpotlightViewMode,
} from "@/components/3d/spotlight-model";
import { SpotlightFallback } from "@/components/3d/spotlight-fallback";
import { Rotate3d, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

function checkWebGL(): boolean {
  if (typeof window === "undefined") return true;
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

export function SpotlightViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<SpotlightViewMode>("turntable");
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
  const [rotationDegrees, setRotationDegrees] = React.useState(0);
  const [isWebGLAvailable] = React.useState(checkWebGL);
  const isReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = React.useState(true);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Pause rendering when scrolled out of view to preserve GPU cycles
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

  if (!isWebGLAvailable) {
    return (
      <SpotlightFallback message="WebGL unsupported. Architectural preview active." />
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[320px] xs:h-[360px] sm:h-[420px] lg:h-[460px] rounded-2xl bg-[#070D1F] border border-white/[0.08] overflow-hidden select-none group"
      style={{ touchAction: "pan-y" }}
      aria-label="Interactive 3D Showroom Turntable of NEXORA Nova 1 Pro. Drag to rotate 360 degrees."
    >
      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20">
          <SpotlightFallback message="Initializing Showroom Studio Pipeline..." />
        </div>
      )}

      {/* Top Floating Telemetry & Inspection Badges */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A1226]/90 border border-blue-500/30 text-[10px] font-mono text-blue-300 backdrop-blur-md shadow-lg shadow-black/40">
          <Rotate3d className="h-3 w-3 text-blue-400 animate-spin-slow" />
          <span>360° Inspection Pedestal</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A1226]/90 border border-white/[0.08] text-[10px] font-mono text-slate-300 backdrop-blur-md">
          <Compass className="h-3 w-3 text-emerald-400" />
          <span>{rotationDegrees}° Azimuth</span>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      {isVisible && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 7.2], fov: 44 }}
          onCreated={() => setIsLoaded(true)}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting Environment */}
          <ambientLight color="#081026" intensity={1.2} />

          {/* Key Light: Crisp White Overhead Studio Light */}
          <directionalLight position={[4, 6, 6]} color="#FFFFFF" intensity={1.8} />

          {/* Specular Rim Light: Electric Blue */}
          <pointLight position={[-5, 2, -3]} color="#327BFF" intensity={2.5} distance={14} />

          {/* Backfill Accent: Violet Studio Rim */}
          <pointLight position={[5, -2, -3]} color="#8B5CF6" intensity={2.2} distance={14} />

          {/* Top Edge Highlighter */}
          <spotLight
            position={[0, 8, 2]}
            angle={0.4}
            penumbra={0.8}
            intensity={2.0}
            color="#FFFFFF"
          />

          {/* Bespoke Procedural Model */}
          <SpotlightModel
            viewMode={viewMode}
            pointerCoordinates={pointer}
            isReducedMotion={isReducedMotion}
            onRotationUpdate={setRotationDegrees}
          />

          {/* Restricted OrbitControls: No vertical flipping, bounded polar angle */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.8}
            minPolarAngle={1.2}
            maxPolarAngle={1.9}
            dampingFactor={0.06}
            onStart={() => {
              // Pause auto-rotation viewMode while dragging
              if (viewMode === "turntable") setViewMode("turntable");
            }}
          />
        </Canvas>
      )}

      {/* Bottom Preset Angle Toolbar */}
      <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setViewMode("turntable")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all duration-200 border whitespace-nowrap",
              viewMode === "turntable"
                ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                : "bg-[#091124]/90 text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white"
            )}
          >
            360° Rotate
          </button>

          <button
            type="button"
            onClick={() => setViewMode("front")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all duration-200 border whitespace-nowrap",
              viewMode === "front"
                ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                : "bg-[#091124]/90 text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white"
            )}
          >
            Display
          </button>

          <button
            type="button"
            onClick={() => setViewMode("camera")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all duration-200 border whitespace-nowrap",
              viewMode === "camera"
                ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                : "bg-[#091124]/90 text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white"
            )}
          >
            Camera Array
          </button>

          <button
            type="button"
            onClick={() => setViewMode("side")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all duration-200 border whitespace-nowrap",
              viewMode === "side"
                ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                : "bg-[#091124]/90 text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white"
            )}
          >
            Profile 7.8mm
          </button>
        </div>

        <div className="hidden md:flex items-center text-[10px] font-mono text-slate-400 shrink-0">
          Drag to inspect
        </div>
      </div>
    </div>
  );
}
