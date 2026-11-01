"use client";

import * as React from "react";
import {
  Rotate3d,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Box,
  HelpCircle,
} from "lucide-react";
import {
  Product3DCanvas,
  type Product3DCanvasHandle,
} from "@/components/3d/product-3d-canvas";
import { Product3DFallback } from "@/components/3d/product-3d-fallback";
import type { Product, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

export interface Product3DViewerProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onSwitchToGallery?: () => void;
  className?: string;
}

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

/**
 * Product3DViewer: Interactive 3D showroom viewer for NEXORA hardware specimens.
 * Features:
 * - 360-degree interactive mouse and touch drag rotation.
 * - Explicit accessible Zoom In, Zoom Out, and Reset Camera controls.
 * - Dynamic variant finish reflection in real time.
 * - Live azimuth rotation degree telemetry.
 * - IntersectionObserver GPU throttling when scrolled off screen.
 * - Non-blocking vertical page scroll on mobile devices (touchAction: pan-y).
 */
export function Product3DViewer({
  product,
  selectedVariant,
  onSwitchToGallery,
  className,
}: Product3DViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasHandleRef = React.useRef<Product3DCanvasHandle>(null);

  const [isWebGLAvailable] = React.useState(checkWebGL);
  const isReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = React.useState(true);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [rotationDegrees, setRotationDegrees] = React.useState(0);
  const [autoRotate, setAutoRotate] = React.useState(!isReducedMotion);

  // Pause rendering when scrolled out of view to preserve battery & GPU cycles
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

  // Keyboard accessibility handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      canvasHandleRef.current?.zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      canvasHandleRef.current?.zoomOut();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      canvasHandleRef.current?.resetView();
    }
  };

  if (!isWebGLAvailable) {
    return (
      <Product3DFallback
        message="WebGL Accelerators Unavailable"
        subMessage="Your browser or hardware environment does not currently expose WebGL acceleration. Standard optical photography active."
        imageUrl={product.images[0]?.url}
        imageAlt={product.images[0]?.alt}
        categorySlug={product.categorySlug}
        productSlug={product.slug}
        onSwitchToGallery={onSwitchToGallery}
      />
    );
  }

  if (errorMessage) {
    return (
      <Product3DFallback
        message="3D Asset Pipeline Notice"
        subMessage={`The hardware viewer encountered an asset loading notice: ${errorMessage}`}
        imageUrl={product.images[0]?.url}
        imageAlt={product.images[0]?.alt}
        categorySlug={product.categorySlug}
        productSlug={product.slug}
        onRetry={() => setErrorMessage(null)}
        onSwitchToGallery={onSwitchToGallery}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${product.name} interactive 3D specimen inspection. Use mouse or touch to rotate 360 degrees. Use on-screen controls or keyboard (+/-) to zoom, and (r) to reset.`}
      className={cn(
        "relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070D1F] select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
      style={{ touchAction: "pan-y" }}
    >
      {/* Loading Skeleton Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070D1F] gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F1B38] border border-blue-500/30 text-blue-400">
            <Box className="h-7 w-7 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-slate-300">
            Compiling WebGL Showroom Pipeline...
          </span>
        </div>
      )}

      {/* Top Floating Telemetry & Inspection Badges */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#060C1B]/90 border border-blue-500/30 text-[10px] font-mono text-blue-300 backdrop-blur-md shadow-lg shadow-black/40">
          <Rotate3d className={cn("h-3 w-3 text-blue-400", autoRotate && "animate-spin-slow")} />
          <span>360° Inspection Pedestal</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#060C1B]/90 border border-white/[0.08] text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg shadow-black/40">
          <Compass className="h-3 w-3 text-emerald-400" />
          <span>{rotationDegrees}° Azimuth</span>
        </div>
      </div>

      {/* 3D Canvas Instance */}
      {isVisible && (
        <Product3DCanvas
          ref={canvasHandleRef}
          modelUrl={product.modelUrl}
          categorySlug={product.categorySlug}
          productSlug={product.slug}
          selectedVariant={selectedVariant}
          autoRotate={autoRotate}
          isReducedMotion={isReducedMotion}
          onRotationUpdate={setRotationDegrees}
          onCanvasReady={() => setIsLoaded(true)}
          onError={(err) => setErrorMessage(err)}
        />
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 pointer-events-none">
        {/* Model Provenance & Variant Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#060C1B]/90 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
          <span className="text-blue-400 font-semibold">
            {product.isProcedural ? "Illustrative 3D Specimen" : "3D GLB Model"}
          </span>
          <span className="text-slate-500">•</span>
          <span className="truncate max-w-[140px] sm:max-w-none text-slate-400">
            {selectedVariant ? selectedVariant.name : product.name}
          </span>
        </div>

        {/* Accessible Camera Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-[#060C1B]/90 border border-white/10 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => canvasHandleRef.current?.zoomIn()}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#0E1A38] text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Zoom in on 3D specimen"
            title="Zoom in (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => canvasHandleRef.current?.zoomOut()}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#0E1A38] text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Zoom out on 3D specimen"
            title="Zoom out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => canvasHandleRef.current?.resetView()}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#0E1A38] text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Reset camera view to center"
            title="Reset view (r)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-0.5" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={cn(
              "flex h-8 px-2.5 items-center gap-1.5 rounded-lg text-[10px] font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              autoRotate
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                : "hover:bg-[#0E1A38] text-slate-400 hover:text-slate-200"
            )}
            aria-label={autoRotate ? "Pause automatic rotation" : "Start automatic rotation"}
            title="Toggle rotation"
          >
            {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span className="hidden sm:inline">{autoRotate ? "Pause" : "Spin"}</span>
          </button>
        </div>
      </div>

      {/* Helpful Interaction Tip */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#060C1B]/80 text-[10px] font-mono text-slate-400 border border-white/5">
        <HelpCircle className="h-3 w-3 text-blue-400" />
        <span>Drag to rotate • Use buttons to zoom • Press R to reset</span>
      </div>
    </div>
  );
}
