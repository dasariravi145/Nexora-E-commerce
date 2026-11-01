"use client";

import * as React from "react";
import type { ProductVariant } from "@/types";
import { formatINR, isDescriptorRedundant } from "@/lib/format";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductVariantSelectorProps {
  variants?: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant: (variant: ProductVariant) => void;
  className?: string;
}

/**
 * ProductVariantSelector: Accessible, deterministic hardware specification and finish selector.
 * - Only renders when genuine variant data is present on the product.
 * - Renders colorway swatches, RAM/Storage pill selectors, and size variants.
 * - Displays exact demo price deltas (+ ₹X,XXX or Included).
 * - Prevents invalid combinations by binding to supported variant records.
 */
export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
  className,
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  // Determine what dimensions are present in this variant set to provide descriptive header
  const dimensionParts = [
    variants.some((v) => v.colorHex || v.colorName) ? "Colorway" : null,
    variants.some((v) => v.storage) ? "Storage" : null,
    variants.some((v) => v.ram) ? "Memory" : null,
    variants.some((v) => v.size) ? "Chassis Size" : null,
  ].filter(Boolean);

  const dimensionLabel = dimensionParts.length > 0 ? dimensionParts.join(" & ") : "Configurations";

  return (
    <div className={cn("space-y-4 pt-1", className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="uppercase text-[#475569] tracking-wider font-semibold">
          Hardware {dimensionLabel}:
        </span>
        <span className="text-[#2563EB] font-semibold">{selectedVariant.name}</span>
      </div>

      {/* Main Variant Cards / Pill Radiogroup */}
      <div
        role="radiogroup"
        aria-label="Product variant options"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5"
      >
        {variants.map((v) => {
          const isSelected = v.id === selectedVariant.id;
          const delta = v.demoPriceDelta ?? 0;
          const formattedDelta = delta > 0 ? `+ ${formatINR(delta)}` : delta < 0 ? `- ${formatINR(Math.abs(delta))}` : "Base Spec";

          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectVariant(v)}
              className={cn(
                "relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isSelected
                  ? "bg-[#EAF2FF] border-[#2563EB] shadow-sm text-[#0F172A]"
                  : "bg-white border-[#E2E8F0] hover:border-[#2563EB]/40 text-[#0F172A] hover:bg-[#F8FAFC]"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Color Swatch if present */}
                {v.colorHex && (
                  <span
                    className={cn(
                      "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-transform",
                      isSelected ? "border-[#2563EB] ring-2 ring-[#2563EB]/30 scale-110 shadow-sm" : "border-[#E2E8F0]"
                    )}
                    style={{ backgroundColor: v.colorHex }}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "h-3 w-3",
                          v.colorHex.toLowerCase() === "#ffffff" || v.colorHex.toLowerCase() === "#f8fafc" || v.colorHex.toLowerCase() === "#f1f5f9"
                            ? "text-[#0F172A]"
                            : "text-white"
                        )}
                      />
                    )}
                  </span>
                )}

                <div className="space-y-0.5">
                  <span className="block text-xs font-semibold leading-snug text-[#0F172A]">
                    {v.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B]">
                    <span>SKU: {v.sku}</span>
                    {v.size && !isDescriptorRedundant(v.size, v.name) && <span>• {v.size}</span>}
                    {v.ram && !isDescriptorRedundant(v.ram, v.name) && <span>• {v.ram}</span>}
                    {v.storage && !isDescriptorRedundant(v.storage, v.name) && <span>• {v.storage}</span>}
                  </div>
                </div>
              </div>

              {/* Price Delta Badge */}
              <div className="shrink-0 text-right pl-2">
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium",
                    isSelected
                      ? delta > 0
                        ? "bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 font-semibold"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                      : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                  )}
                >
                  {formattedDelta}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
