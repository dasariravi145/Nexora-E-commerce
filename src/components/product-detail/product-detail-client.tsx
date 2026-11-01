"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-detail/product-image-gallery";
import { ProductVariantSelector } from "@/components/product-detail/product-variant-selector";
import { ProductPriceCard } from "@/components/product-detail/product-price-card";
import type { Product, ProductVariant } from "@/types";
import { ShieldCheck, Cpu, ArrowUpRight, Image as ImageIcon, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const Product3DViewer = dynamic(
  () => import("@/components/3d/product-3d-viewer").then((mod) => mod.Product3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070D1F] flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <div className="h-10 w-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-blue-400">
          Initializing 3D Turntable Studio...
        </p>
      </div>
    ),
  }
);

export interface ProductDetailClientProps {
  product: Product;
  className?: string;
}

/**
 * ProductDetailClient: Interactive client coordinator orchestrating image gallery,
 * 3D studio viewer, variant selections, and real-time INR demo pricing.
 */
export function ProductDetailClient({
  product,
  className,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0);
  const [viewMode, setViewMode] = React.useState<"images" | "3d">("images");

  // When a variant is chosen, update variant state and sync gallery image if variant specifies an imageIndex
  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.imageIndex !== undefined && variant.imageIndex < product.images.length) {
      setSelectedImageIndex(variant.imageIndex);
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start",
        className
      )}
    >
      {/* Left Column: Interactive Product Image Gallery & 3D Studio Viewer */}
      <div className="lg:col-span-7 space-y-4">
        {/* Gallery / 3D Mode Switcher (Only visible for products with 3D model support) */}
        {product.has3DModel && (
          <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
            <div
              role="tablist"
              aria-label="Product display mode"
              className="inline-flex items-center p-1 rounded-xl bg-white border border-[#E2E8F0] shadow-sm"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "images"}
                aria-label={`Show photography gallery (${product.images.length} views)`}
                onClick={() => setViewMode("images")}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all",
                  viewMode === "images"
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-semibold"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-100"
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Photography ({product.images.length})</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "3d"}
                aria-label="Show interactive 3D studio turntable"
                onClick={() => setViewMode("3d")}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all",
                  viewMode === "3d"
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-semibold"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-100"
                )}
              >
                <Box className="h-3.5 w-3.5" />
                <span>Interactive 3D</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] uppercase font-bold border border-amber-200">
                  360°
                </span>
              </button>
            </div>

            {viewMode === "3d" && (
              <span className="text-[11px] font-mono text-[#475569] hidden sm:inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                WebGL Studio Active
              </span>
            )}
          </div>
        )}

        {/* Display Primary View: 3D Studio Viewer or Photography Gallery */}
        {viewMode === "3d" && product.has3DModel ? (
          <Product3DViewer
            product={product}
            selectedVariant={selectedVariant}
            onSwitchToGallery={() => setViewMode("images")}
          />
        ) : (
          <ProductImageGallery
            images={product.images}
            categorySlug={product.categorySlug}
            productSlug={product.slug}
            productName={product.name}
            selectedIndex={selectedImageIndex}
            onSelectImage={setSelectedImageIndex}
            highlightBadge={product.highlightBadge}
            badgeVariant={product.badgeVariant}
            has3DModel={product.has3DModel}
            onSwitchTo3D={() => setViewMode("3d")}
          />
        )}

        {/* Engineering Warranty Verification Tag */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between text-xs font-mono text-[#475569]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Hardware Enclave Inspection Certified</span>
          </span>
          <span>Specimen Ref: {product.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Right Column: Identification, Pricing, Variants, and Action Area */}
      <div className="lg:col-span-5 space-y-6">
        {/* Brand, Division, Title, and Tagline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/products?brand=${product.brandSlug}`}>
              <Badge variant="electric" size="sm" dot>
                {product.brand}
              </Badge>
            </Link>

            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs font-mono text-[#475569] hover:text-[#2563EB] transition-colors flex items-center gap-1"
            >
              <span>Division: {product.category}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-tight">
            {product.name}
          </h1>

          <p className="text-sm font-semibold text-[#2563EB] font-mono">
            {product.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty pt-1">
            {product.description}
          </p>
        </div>

        {/* Pricing Card with Dynamic Selected Variant Calculation & Actions */}
        <ProductPriceCard
          product={product}
          selectedVariant={selectedVariant}
        />

        {/* Variant Selector (Only renders if product has genuine variant data) */}
        {product.variants && product.variants.length > 0 && (
          <ProductVariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariant?.id}
            onSelectVariant={handleSelectVariant}
          />
        )}

        {/* Quick Specs Snapshot */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#475569] block flex items-center gap-1.5 font-semibold">
            <Cpu className="h-3.5 w-3.5 text-[#2563EB]" />
            Core Architecture At A Glance
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.specs.map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
