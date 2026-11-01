"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Box, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export interface ProductImageGalleryProps {
  images: ProductImage[];
  categorySlug: string;
  productSlug: string;
  productName: string;
  selectedIndex?: number;
  onSelectImage?: (index: number) => void;
  highlightBadge?: string;
  badgeVariant?: "electric" | "violet" | "subtle";
  has3DModel?: boolean;
  onSwitchTo3D?: () => void;
  className?: string;
}

/**
 * ProductImageGallery: High-precision interactive image gallery for NEXORA product showroom.
 * Features:
 * - Single image mode: hides navigation and thumbnails cleanly
 * - Multi-image mode: thumbnail navigation, prev/next buttons, swipe gestures
 * - Interactive zoom inspection mode with touch & click panning
 * - Automatic fallback to HardwareVisual if asset fails to load
 * - Keyboard accessible with Left/Right arrow cycling and Escape to close zoom
 */
export function ProductImageGallery({
  images,
  categorySlug,
  productSlug,
  productName,
  selectedIndex,
  onSelectImage,
  highlightBadge,
  badgeVariant = "electric",
  has3DModel,
  onSwitchTo3D,
  className,
}: ProductImageGalleryProps) {
  const [currentIndexLocal, setCurrentIndexLocal] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomPan, setZoomPan] = React.useState({ x: 50, y: 50 });
  const [failedImages, setFailedImages] = React.useState<Record<number, boolean>>({});

  // Controlled vs Uncontrolled sync
  const currentIndex = selectedIndex !== undefined ? selectedIndex : currentIndexLocal;
  const updateIndex = React.useCallback(
    (newIndex: number) => {
      const normalizedIndex = (newIndex + images.length) % images.length;
      if (onSelectImage) {
        onSelectImage(normalizedIndex);
      } else {
        setCurrentIndexLocal(normalizedIndex);
      }
    },
    [images.length, onSelectImage]
  );

  const activeImage = images[currentIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  // Touch gesture state (non-blocking for vertical scroll)
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !hasMultipleImages) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = touchEndY - touchStartRef.current.y;

    // Only trigger swipe if horizontal movement is dominant and > 40px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        updateIndex(currentIndex + 1);
      } else {
        updateIndex(currentIndex - 1);
      }
    }
    touchStartRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isZoomed && e.key === "Escape") {
      setIsZoomed(false);
      return;
    }

    if (hasMultipleImages) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        updateIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        updateIndex(currentIndex + 1);
      }
    }
  };

  // Zoom pan tracking on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPan({ x, y });
  };

  const isCurrentFailed = failedImages[currentIndex];

  return (
    <div
      className={cn("space-y-4 select-none", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${productName} specimen image gallery`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Primary Showcase Viewport */}
      <div
        className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070D1F] flex items-center justify-center group focus-within:border-blue-500/50 transition-colors"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(6, 11, 26, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* Top Badges: Highlight Badge & 3D Ready Indicator */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
          {highlightBadge && (
            <Badge variant={badgeVariant} size="sm">
              {highlightBadge}
            </Badge>
          )}
          {has3DModel && onSwitchTo3D ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwitchTo3D();
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A1226]/90 hover:bg-blue-950/80 border border-blue-500/40 hover:border-blue-400 text-[10px] font-mono text-blue-300 hover:text-white backdrop-blur-md transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Launch interactive 3D studio turntable"
              aria-label="Launch interactive 3D studio turntable"
            >
              <Box className="h-3 w-3 text-blue-400 animate-pulse" />
              <span>3D Turntable Ready (Launch)</span>
            </button>
          ) : has3DModel ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A1226]/90 border border-blue-500/30 text-[10px] font-mono text-blue-300 backdrop-blur-md">
              <Box className="h-3 w-3 text-blue-400 animate-pulse" />
              3D Turntable Ready
            </span>
          ) : null}
        </div>

        {/* Top-Right Gallery Actions: Image Counter & Zoom Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {hasMultipleImages && (
            <span
              className="px-2.5 py-1 rounded-md bg-[#060C1B]/85 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md"
              aria-live="polite"
            >
              {currentIndex + 1} / {images.length}
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#060C1B]/85 border border-white/10 text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-[#0A142E] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isZoomed ? "Exit zoom view" : "Zoom into product image"}
            title={isZoomed ? "Exit zoom (Esc)" : "Zoom image"}
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
        </div>

        {/* Primary Image Display or Fallback */}
        <div
          className={cn(
            "relative w-full h-full flex items-center justify-center transition-all duration-300",
            isZoomed ? "cursor-zoom-out overflow-hidden" : "cursor-zoom-in"
          )}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          {activeImage && !isCurrentFailed ? (
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out"
              style={
                isZoomed
                  ? {
                      transform: "scale(1.85)",
                      transformOrigin: `${zoomPan.x}% ${zoomPan.y}%`,
                    }
                  : undefined
              }
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || `${productName} view ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-contain p-4 sm:p-8"
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [currentIndex]: true }));
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full p-6 flex items-center justify-center">
              <HardwareVisual
                categorySlug={categorySlug}
                productSlug={productSlug}
                size="hero"
                className="border-none bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Next / Previous Controls (Hidden if single image) */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateIndex(currentIndex - 1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#060C1B]/80 hover:bg-[#0A142E] border border-white/10 hover:border-blue-500/50 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Previous product image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateIndex(currentIndex + 1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#060C1B]/80 hover:bg-[#0A142E] border border-white/10 hover:border-blue-500/50 text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Next product image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Zoom Instructions Indicator */}
        {isZoomed && (
          <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#060C1B]/90 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md pointer-events-none">
            <span>Inspection Zoom Active • Move cursor or drag to pan</span>
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="pointer-events-auto flex items-center gap-1 text-blue-400 hover:text-white font-semibold"
            >
              <X className="h-3 w-3" />
              Close
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Strip (Only rendered if multiple images exist) */}
      {hasMultipleImages && (
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label={`${productName} thumbnail perspectives`}
        >
          {images.map((img, idx) => {
            const isSelected = idx === currentIndex;
            const isThumbFailed = failedImages[idx];

            return (
              <button
                key={img.url + idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Select angle ${idx + 1}: ${img.alt || productName}`}
                onClick={() => updateIndex(idx)}
                className={cn(
                  "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border bg-[#070D1F] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isSelected
                    ? "border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/50"
                    : "border-white/[0.08] hover:border-white/25 opacity-70 hover:opacity-100"
                )}
              >
                {!isThumbFailed ? (
                  <Image
                    src={img.url}
                    alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain p-1.5"
                    onError={() => {
                      setFailedImages((prev) => ({ ...prev, [idx]: true }));
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <HardwareVisual
                      categorySlug={categorySlug}
                      productSlug={productSlug}
                      size="sm"
                      className="border-none bg-transparent h-12"
                    />
                  </div>
                )}

                {/* Active Indicator Underline */}
                {isSelected && (
                  <span
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
