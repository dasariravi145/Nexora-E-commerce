"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { HeroProductModel } from "@/components/3d/hero-product-model";
import { HeroFallback } from "@/components/3d/hero-fallback";
import { Box, RotateCcw } from "lucide-react";

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

export function HeroScene() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
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

  // Pointer movement listener for desktop parallax tilt (ignored for touch to avoid gesture conflicts)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !containerRef.current || e.pointerType === "touch") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  // If WebGL is unsupported, return clean fallback
  if (!isWebGLAvailable) {
    return (
      <HeroFallback message="WebGL hardware acceleration unavailable. Showing static architectural preview." />
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[310px] xs:h-[350px] sm:h-[420px] lg:h-[480px] rounded-[22px] bg-[#070D1F] border border-white/[0.08] overflow-hidden select-none group"
      style={{ touchAction: "pan-y" }}
      aria-label="Interactive 3D model of NEXORA Nova 1 Pro. Drag horizontally to rotate model."
    >
      {/* Loading state indicator while Canvas compiles shaders */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20">
          <HeroFallback message="Compiling studio shader pipeline..." />
        </div>
      )}

      {/* Interactive Canvas */}
      {isVisible && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 7.6], fov: 42 }}
          onCreated={() => setIsLoaded(true)}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting Rig */}
          <ambientLight color="#081026" intensity={1.0} />

          {/* Key Light: Studio Daylight */}
          <directionalLight
            position={[5, 8, 5]}
            color="#FFFFFF"
            intensity={1.6}
            castShadow
          />

          {/* Electric Blue Accent Rim Light */}
          <pointLight
            position={[-4, -2, 3]}
            color="#327BFF"
            intensity={4.2}
            distance={14}
          />

          {/* Soft Violet Secondary Rim Light */}
          <pointLight
            position={[3, 4, -3]}
            color="#8B5CF6"
            intensity={3.2}
            distance={12}
          />

          {/* Focal 3D Model */}
          <HeroProductModel
            pointerCoordinates={pointer}
            isReducedMotion={isReducedMotion}
          />

          {/* Controlled Drag Orbit (Zero scroll hijacking) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.06}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.5}
            maxAzimuthAngle={Math.PI / 3}
            minAzimuthAngle={-Math.PI / 3}
          />
        </Canvas>
      )}

      {/* Top Telemetry Header Overlay */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pointer-events-none z-10">
        <span className="flex items-center gap-1.5 text-blue-400 bg-[#060B1A]/85 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-blue-500/20">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive 3D Stage</span>
        </span>
        <span className="hidden sm:inline bg-[#060B1A]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08]">
          Drag to Rotate
        </span>
      </div>

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pointer-events-none z-10">
        <span className="flex items-center gap-1.5 bg-[#060B1A]/85 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-white/[0.08]">
          <Box className="h-3 w-3 text-blue-400" />
          <span>Nova 1 Pro</span>
        </span>
        <span className="flex items-center gap-1.5 bg-[#060B1A]/85 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-white/[0.08]">
          <RotateCcw className="h-3 w-3 text-purple-400" />
          <span>Three.js<span className="hidden xs:inline"> • WebGL 2.0</span></span>
        </span>
      </div>
    </div>
  );
}
