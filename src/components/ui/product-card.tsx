"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { useComparison } from "@/context/comparison-context";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";
import { getProductStartingPrice } from "@/lib/format";
import { Eye, Scale, Check, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  className?: string;
  priorityImage?: boolean;
}

/**
 * ProductCard: Accessible, high-performance product card component for the NEXORA catalogue.
 * Features consistent image aspect ratios, verified brand/category attribution,
 * standard INR demo pricing, product comparison toggle, and working navigation to /products/[slug].
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const { isCompared, toggleCompare } = useComparison();
  const { addToCart } = useCart();
  const compared = isCompared(product.id);
  const priceInfo = getProductStartingPrice(product);

  return (
    <Card
      id={product.id}
      variant="interactive"
      className={cn(
        "p-4 sm:p-5 h-full flex flex-col justify-between space-y-4 group transition-all duration-300 bg-white border border-[#E2E8F0] shadow-xs hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 active:scale-[0.99] scroll-mt-24",
        compared && "ring-2 ring-blue-500 border-blue-500 shadow-md",
        className
      )}
    >
      {/* Product Visual Container with Consistent Aspect Ratio */}
      <div className="relative overflow-hidden rounded-xl">
        <Link
          href={`/products/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block"
        >
          <HardwareVisual
            categorySlug={product.categorySlug}
            productSlug={product.slug}
            size="md"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {product.highlightBadge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <Badge variant={product.badgeVariant || "electric"} size="sm">
              {product.highlightBadge}
            </Badge>
          </div>
        )}

        {/* Comparison Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product);
          }}
          aria-label={compared ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
          aria-pressed={compared}
          className={cn(
            "absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
            compared
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400 font-semibold"
              : "bg-white/90 text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-xs"
          )}
        >
          {compared ? <Check className="h-3 w-3" /> : <Scale className="h-3 w-3" />}
          <span>{compared ? "Comparing" : "Compare"}</span>
        </button>

        {product.has3DModel && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#09152B]/90 border border-[#F2B95C]/40 text-[10px] font-mono text-[#F2B95C] backdrop-blur-md shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2B95C] animate-pulse" />
              3D Turntable
            </span>
          </div>
        )}
      </div>

      {/* Product Metadata & Info */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="tracking-wider uppercase text-[#2563EB] font-bold truncate">
            {product.brand}
          </span>
          <span className="text-[10px] text-slate-500 shrink-0">
            {product.category}
          </span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover/link:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        {/* Technical Specs Tags */}
        <div className="pt-1 flex flex-wrap gap-1.5">
          {product.specs.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-mono"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing & Navigation Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-mono uppercase text-slate-500">
            {priceInfo.hasPriceRange ? "Starting Demo Price (INR)" : "Demo Price (INR)"}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-[#0F172A]">
            {priceInfo.displayPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
              addToCart(product, defaultVariant);
            }}
            aria-label={`Add ${product.name} to shopping bag`}
            title={`Add ${product.name} to bag`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>

          <Link href={`/products/${product.slug}`}>
            <PremiumButton
              variant="outline"
              size="sm"
              rightIcon={<Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
              className="group-hover:border-blue-500"
            >
              View Details
            </PremiumButton>
          </Link>
        </div>
      </div>
    </Card>
  );
}
