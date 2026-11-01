"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import type { Product, ProductVariant } from "@/types";
import { formatINR } from "@/lib/format";
import { useComparison } from "@/context/comparison-context";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  ArrowRight,
  Info,
  Scale,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductPriceCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  className?: string;
}

/**
 * ProductPriceCard: Showcase pricing display and action foundation.
 * - Accurately updates with selected variant price deltas.
 * - Formats all numbers consistently in Indian Rupees (INR).
 * - Honest disabled state for cart functionality (scheduled for Phase 4).
 * - Real deep-link to /contact for technical concierge enquiries.
 * - Comparison matrix toggle action.
 * - Zero fabricated urgency, countdowns, or fake stock warnings.
 */
export function ProductPriceCard({
  product,
  selectedVariant,
  className,
}: ProductPriceCardProps) {
  const { isCompared, toggleCompare } = useComparison();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);
  const compared = isCompared(product.id);

  const delta = selectedVariant?.demoPriceDelta ?? 0;
  const rawPrice = product.demoPrice + delta;
  const currentPrice = !isNaN(rawPrice) && rawPrice > 0 ? rawPrice : product.demoPrice;
  const formattedCurrentPrice = formatINR(currentPrice);

  return (
    <Card
      variant="solid"
      className={cn("p-5 sm:p-6 space-y-5 border-[#E2E8F0] bg-white shadow-sm", className)}
    >
      {/* Price Header & Demo Flag */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-medium">
            Illustrative Demo Price (INR)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {formattedCurrentPrice}
            </span>
            {delta !== 0 && (
              <span className="text-xs font-mono text-[#2563EB] font-medium">
                ({delta > 0 ? `+${formatINR(delta)}` : `-${formatINR(Math.abs(delta))}`} config)
              </span>
            )}
          </div>
        </div>

        <Badge variant="subtle" size="sm" className="shrink-0 bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]">
          Showroom Specimen
        </Badge>
      </div>

      {/* Demo Storefront Disclosure */}
      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#475569]">
        <Info className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Demonstration storefront figure for interface evaluation. Commercial checkout, live transactions, and real payment processing are intentionally disabled.
        </p>
      </div>

      {/* Purchase Action Foundation */}
      <div className="space-y-3 pt-1">
        {/* Working Add to Specimen Bag Action */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              addToCart(product, selectedVariant);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            aria-label={`Add ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ""} to shopping bag`}
            className="w-full h-12 px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 border border-transparent transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Added to Specimen Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Specimen Bag</span>
                {selectedVariant && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-blue-800 text-blue-100">
                    {selectedVariant.name}
                  </span>
                )}
              </>
            )}
          </button>
          <span className="block text-center text-[10px] font-mono text-[#64748B]">
            Persistent local cart staging • Free simulated demo assessment
          </span>
        </div>

        {/* Compare Specimen Toggle Action */}
        <button
          type="button"
          onClick={() => toggleCompare(product)}
          aria-pressed={compared}
          className={cn(
            "w-full h-11 px-4 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
            compared
              ? "bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/40 shadow-sm font-bold"
              : "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:bg-slate-100"
          )}
        >
          {compared ? (
            <>
              <Check className="h-4 w-4 text-[#2563EB]" />
              <span>Added to Comparison ({product.category})</span>
            </>
          ) : (
            <>
              <Scale className="h-4 w-4 text-[#2563EB]" />
              <span>Compare with {product.category} Specimens</span>
            </>
          )}
        </button>

        {/* Action Buttons: Enquire & Continue Shopping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Link
            href={`/contact?product=${encodeURIComponent(product.slug)}`}
            className="w-full"
            aria-label={`Enquire about ${product.name}`}
          >
            <PremiumButton
              variant="outline"
              size="md"
              leftIcon={<MessageSquare className="h-4 w-4 text-[#2563EB]" />}
              className="w-full border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
            >
              Hardware Advisory
            </PremiumButton>
          </Link>

          <Link href="/products" className="w-full">
            <PremiumButton
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
            >
              Continue Catalogue
            </PremiumButton>
          </Link>
        </div>
      </div>

      {/* Hardware Assurance Bullets */}
      <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-2 gap-3 text-xs font-mono text-[#475569]">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>3-Yr Precision Warranty</span>
        </span>
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#2563EB] shrink-0" />
          <span>Tracked Express Dispatch</span>
        </span>
      </div>
    </Card>
  );
}
