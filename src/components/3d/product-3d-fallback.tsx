"use client";

import * as React from "react";
import Image from "next/image";
import { AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";

export interface Product3DFallbackProps {
  message?: string;
  subMessage?: string;
  imageUrl?: string;
  imageAlt?: string;
  categorySlug?: string;
  productSlug?: string;
  onRetry?: () => void;
  onSwitchToGallery?: () => void;
  className?: string;
}

/**
 * Product3DFallback: Graceful, accessible fallback when WebGL is unsupported or 3D asset fails.
 * Guarantees zero page crashes and immediate access to primary hardware visuals.
 */
export function Product3DFallback({
  message = "3D Showroom Initializing...",
  subMessage = "High-precision WebGL studio pipeline",
  imageUrl,
  imageAlt,
  categorySlug = "smartphones",
  productSlug,
  onRetry,
  onSwitchToGallery,
  className,
}: Product3DFallbackProps) {
  return (
    <div
      className={`relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070D1F] flex flex-col items-center justify-center p-6 text-center select-none ${
        className || ""
      }`}
      role="alert"
      aria-live="polite"
    >
      {/* Background Visual Specimen */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center p-8">
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={imageAlt || "Hardware fallback preview"}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ) : (
          <HardwareVisual
            categorySlug={categorySlug}
            productSlug={productSlug}
            size="hero"
            className="border-none bg-transparent"
          />
        )}
      </div>

      {/* Ambient Lighting Ring */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, rgba(7, 13, 31, 0) 70%)",
        }}
        aria-hidden="true"
      />

      {/* Fallback Message & Action Buttons */}
      <div className="relative z-10 max-w-sm space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 mx-auto shadow-lg shadow-blue-500/10">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold text-white font-mono">
            {message}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {subMessage}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {onRetry && (
            <PremiumButton
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={onRetry}
            >
              Retry 3D Pipeline
            </PremiumButton>
          )}

          {onSwitchToGallery && (
            <PremiumButton
              variant="glass"
              size="sm"
              leftIcon={<ImageIcon className="h-3.5 w-3.5 text-blue-400" />}
              onClick={onSwitchToGallery}
            >
              View Image Gallery
            </PremiumButton>
          )}
        </div>
      </div>
    </div>
  );
}
