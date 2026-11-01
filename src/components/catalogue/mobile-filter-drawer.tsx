"use client";

import * as React from "react";
import { X, Filter, Check } from "lucide-react";
import { categories } from "@/data/categories";
import {
  BrandOption,
  PriceBounds,
  SortOption,
  SORT_OPTIONS,
} from "@/lib/catalogue-filters";
import { cn } from "@/lib/utils";

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  availableBrands: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brandSlug: string) => void;
  priceBounds: PriceBounds;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  sort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onResetAll: () => void;
  activeFilterCount: number;
  totalProductsCount: number;
  hideCategorySection?: boolean;
  hideBrandSection?: boolean;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  availableBrands,
  selectedBrands,
  onToggleBrand,
  priceBounds,
  minPrice,
  maxPrice,
  onPriceChange,
  sort,
  onSelectSort,
  onResetAll,
  activeFilterCount,
  totalProductsCount,
  hideCategorySection = false,
  hideBrandSection = false,
}: MobileFilterDrawerProps) {
  const [prevMin, setPrevMin] = React.useState(minPrice);
  const [prevMax, setPrevMax] = React.useState(maxPrice);
  const [localMin, setLocalMin] = React.useState<string>(
    minPrice !== undefined ? String(minPrice) : ""
  );
  const [localMax, setLocalMax] = React.useState<string>(
    maxPrice !== undefined ? String(maxPrice) : ""
  );

  // Sync external props during render
  if (minPrice !== prevMin) {
    setPrevMin(minPrice);
    setLocalMin(minPrice !== undefined ? String(minPrice) : "");
  }

  if (maxPrice !== prevMax) {
    setPrevMax(maxPrice);
    setLocalMax(maxPrice !== undefined ? String(maxPrice) : "");
  }

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    const minVal = localMin.trim() ? Math.max(0, Number(localMin)) : undefined;
    const maxVal = localMax.trim() ? Math.max(0, Number(localMax)) : undefined;
    onPriceChange(minVal, maxVal);
    onClose();
  };

  const isPriceInvalid =
    localMin.trim() &&
    localMax.trim() &&
    Number(localMin) > Number(localMax);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter and Sort Hardware"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#060B1A]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#09152B] border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slideInRight">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0B1A36]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Filters &amp; Sorting
            </h2>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-[10px] font-mono text-white font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetAll}
              className="text-xs font-mono text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters drawer"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* 1. Sort Section */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Sort Sequence
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sort === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectSort(opt.id)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left border",
                      isSelected
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold"
                        : "border-white/[0.06] bg-[#0A1226]/50 text-slate-300 hover:text-white hover:border-white/20"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Category Division Section */}
          {!hideCategorySection && (
            <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Hardware Division
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectCategory("all")}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all border",
                    selectedCategory.toLowerCase() === "all"
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold"
                      : "border-white/[0.06] bg-[#0A1226]/50 text-slate-300 hover:text-white"
                  )}
                >
                  <span>All Units</span>
                  <span className="text-[10px] text-slate-500">{totalProductsCount}</span>
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => onSelectCategory(cat.slug)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all border",
                        isSelected
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold"
                          : "border-white/[0.06] bg-[#0A1226]/50 text-slate-300 hover:text-white"
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                        {cat.itemCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Brands Section */}
          {!hideBrandSection && (
            <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Engineered Brands
              </h3>
              <div className="space-y-1.5">
                {availableBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand.slug);
                  return (
                    <label
                      key={brand.slug}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-all border",
                        isChecked
                          ? "bg-indigo-950/40 border-indigo-500/40 text-white font-medium"
                          : "border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleBrand(brand.slug)}
                          className="h-3.5 w-3.5 rounded border-white/20 bg-[#0E1830] text-blue-500 focus:ring-blue-500/30 accent-blue-600"
                        />
                        <span>{brand.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {brand.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Demo Price Range Section */}
          <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              <span>Demo Price (INR)</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ₹{priceBounds.min.toLocaleString("en-IN")} – ₹{priceBounds.max.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="mobile-min-price" className="block text-[11px] font-mono text-slate-400 mb-1">
                  Min (₹)
                </label>
                <input
                  id="mobile-min-price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={String(priceBounds.min)}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono text-white bg-[#0A1226] border border-white/[0.12] rounded-xl outline-none focus:border-blue-500/60"
                />
              </div>
              <div>
                <label htmlFor="mobile-max-price" className="block text-[11px] font-mono text-slate-400 mb-1">
                  Max (₹)
                </label>
                <input
                  id="mobile-max-price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={String(priceBounds.max)}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono text-white bg-[#0A1226] border border-white/[0.12] rounded-xl outline-none focus:border-blue-500/60"
                />
              </div>
            </div>

            {isPriceInvalid && (
              <p className="text-[11px] text-amber-300 font-mono">
                Min price cannot exceed Max price.
              </p>
            )}
          </div>
        </div>

        {/* Drawer Sticky Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0B1A36] flex items-center gap-3">
          <button
            type="button"
            onClick={onResetAll}
            className="flex-1 h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors border border-slate-700"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Apply ({totalProductsCount})
          </button>
        </div>
      </div>
    </div>
  );
}
