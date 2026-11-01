"use client";

import * as React from "react";
import Link from "next/link";
import { useComparison } from "@/context/comparison-context";
import { MAX_COMPARISON_PRODUCTS, MIN_COMPARISON_PRODUCTS } from "@/lib/product-comparison";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  X,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonTray() {
  const {
    items,
    count,
    canCompare,
    activeCategoryName,
    incompatibilityNotice,
    removeFromCompare,
    clearCompare,
    dismissNotice,
  } = useComparison();

  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);

  // If there are no items and no notice, render nothing
  if (count === 0 && !incompatibilityNotice) {
    return null;
  }

  return (
    <>
      {/* Category Incompatibility / Error Notification Banner */}
      {incompatibilityNotice && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-24 sm:bottom-28 inset-x-4 max-w-xl mx-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
        >
          <div className="p-4 rounded-2xl bg-[#0F162D] border border-amber-500/40 text-amber-200 shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Comparison Parameter Notice</p>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {incompatibilityNotice}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={dismissNotice}
              aria-label="Dismiss notice"
              className="p-1 rounded-lg text-amber-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Comparison Dock (Only when products are selected) */}
      {count > 0 && (
        <aside
          aria-label="Product comparison tray"
          className="fixed bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-6 max-w-5xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#070D22]/95 border border-white/10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
            {/* Mobile Header / Compact Toggle Bar */}
            <div className="flex items-center justify-between sm:hidden pb-2 border-b border-white/[0.06]">
              <button
                type="button"
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                className="flex items-center gap-2 text-xs font-mono font-semibold text-white focus-visible:outline-none"
                aria-expanded={isMobileExpanded}
                aria-label="Toggle comparison specimen drawer"
              >
                <Scale className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  Comparing {count}/{MAX_COMPARISON_PRODUCTS} {activeCategoryName}
                </span>
                {isMobileExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Clear
                </button>

                <Link href="/compare">
                  <PremiumButton
                    variant={canCompare ? "primary" : "outline"}
                    size="sm"
                    disabled={!canCompare}
                    className="py-1 px-3 text-xs"
                  >
                    Compare ({count})
                  </PremiumButton>
                </Link>
              </div>
            </div>

            {/* Product Slots Grid: Visible always on Desktop, expandable on Mobile */}
            <div
              className={cn(
                "pt-2 sm:pt-0 items-center justify-between gap-4",
                isMobileExpanded ? "flex flex-col sm:flex-row" : "hidden sm:flex"
              )}
            >
              {/* Left: Division Badge & Slots */}
              <div className="flex-1 w-full space-y-2">
                <div className="hidden sm:flex items-center justify-between pr-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-white">
                      {activeCategoryName} Specimen Matrix
                    </span>
                    <Badge variant="electric" size="sm">
                      {count} of {MAX_COMPARISON_PRODUCTS} Selected
                    </Badge>
                  </div>

                  {!canCompare && (
                    <span className="text-[11px] text-amber-300/80">
                      Select at least {MIN_COMPARISON_PRODUCTS} {activeCategoryName?.toLowerCase()} units to launch comparison.
                    </span>
                  )}
                </div>

                {/* 4 Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Array.from({ length: MAX_COMPARISON_PRODUCTS }).map((_, idx) => {
                    const product = items[idx];
                    if (product) {
                      return (
                        <div
                          key={product.id}
                          className="relative group flex items-center gap-2.5 p-2 rounded-xl bg-[#09112A] border border-blue-500/30 hover:border-blue-400/60 transition-all shadow-inner"
                        >
                          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                            <HardwareVisual
                              categorySlug={product.categorySlug}
                              size="sm"
                              className="h-10 w-10 border-none bg-transparent"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-white truncate font-sans">
                              {product.name}
                            </p>
                            <p className="text-[10px] font-mono text-blue-300">
                              {product.formattedPrice}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCompare(product.id)}
                            aria-label={`Remove ${product.name} from comparison`}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    }

                    // Empty slot
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="hidden sm:flex items-center justify-center p-2 rounded-xl border border-dashed border-white/10 text-slate-500 text-[11px] font-mono h-[52px]"
                      >
                        <span>Slot {idx + 1} Open</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Actions Bar (Desktop) */}
              <div className="hidden sm:flex items-center gap-2.5 shrink-0 pl-2 border-l border-white/[0.08]">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>

                <Link href="/compare">
                  <PremiumButton
                    variant={canCompare ? "primary" : "outline"}
                    size="md"
                    disabled={!canCompare}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className={cn(
                      !canCompare && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Compare Specifications
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
