"use client";

import * as React from "react";
import { categories } from "@/data/categories";
import { BrandOption, PriceBounds } from "@/lib/catalogue-filters";
import { Filter, RotateCcw, AlertTriangle, Layers, Tag, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CatalogueFilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  availableBrands: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brandSlug: string) => void;
  priceBounds: PriceBounds;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  onResetAll: () => void;
  totalProductsCount: number;
  isPriceInvalid?: boolean;
  hideCategorySection?: boolean;
  hideBrandSection?: boolean;
  className?: string;
}

export function CatalogueFilterSidebar({
  selectedCategory,
  onSelectCategory,
  availableBrands,
  selectedBrands,
  onToggleBrand,
  priceBounds,
  minPrice,
  maxPrice,
  onPriceChange,
  onResetAll,
  totalProductsCount,
  isPriceInvalid = false,
  hideCategorySection = false,
  hideBrandSection = false,
  className,
}: CatalogueFilterSidebarProps) {
  // Local state for smooth numeric input
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

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = localMin.trim() ? Math.max(0, Number(localMin)) : undefined;
    const maxVal = localMax.trim() ? Math.max(0, Number(localMax)) : undefined;
    onPriceChange(minVal, maxVal);
  };

  const handlePricePreset = (presetMin?: number, presetMax?: number) => {
    setLocalMin(presetMin !== undefined ? String(presetMin) : "");
    setLocalMax(presetMax !== undefined ? String(presetMax) : "");
    onPriceChange(presetMin, presetMax);
  };

  const handleClearPrice = () => {
    setLocalMin("");
    setLocalMax("");
    onPriceChange(undefined, undefined);
  };

  return (
    <aside
      aria-label="Catalogue Filters"
      className={cn(
        "rounded-2xl bg-white border border-[#E2E8F0] shadow-sm p-5 space-y-6 text-sm",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#2563EB]" />
          <h2 className="font-bold text-[#0F172A] text-base tracking-wide">Filter Options</h2>
        </div>
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs font-mono text-[#475569] hover:text-[#0F172A] flex items-center gap-1 transition-colors p-1 rounded hover:bg-slate-100"
        >
          <RotateCcw className="h-3 w-3 text-[#2563EB]" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Division Filter */}
      {!hideCategorySection && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#2563EB]" />
              Hardware Division
            </span>
            <span className="text-[11px] text-[#64748B] lowercase">6 divisions</span>
          </div>

          <div className="space-y-1">
            {/* All Hardware Option */}
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left",
                selectedCategory.toLowerCase() === "all"
                  ? "bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/40 font-semibold"
                  : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 border border-transparent"
              )}
            >
              <span>All Hardware</span>
              <span className="font-mono text-[11px] text-[#64748B]">
                {totalProductsCount}
              </span>
            </button>

            {/* Division Specific Options */}
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left",
                    isSelected
                      ? "bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/40 font-semibold"
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {cat.itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Dynamic Brand Filters */}
      {!hideBrandSection && (
        <div className={cn("space-y-3", !hideCategorySection && "pt-4 border-t border-[#E2E8F0]")}>
          <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#2563EB]" />
              Engineered Brand
            </span>
            <span className="text-[11px] text-[#64748B] lowercase">
              {availableBrands.length} brands
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {availableBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand.slug);
              return (
                <label
                  key={brand.slug}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-all border",
                    isChecked
                      ? "bg-[#EAF2FF] border-[#2563EB]/40 text-[#0F172A] font-semibold"
                      : "border-transparent text-[#475569] hover:text-[#0F172A] hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(brand.slug)}
                      className="h-3.5 w-3.5 rounded border-[#CBD5E1] bg-white text-[#2563EB] focus:ring-blue-500/30 accent-blue-600"
                    />
                    <span>{brand.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {brand.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Demo Price Range Filter (INR) */}
      <div className={cn("space-y-3", (!hideCategorySection || !hideBrandSection) && "pt-4 border-t border-[#E2E8F0]")}>
        <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-[#2563EB]" />
            Demo Price (INR)
          </span>
          <span className="text-[10px] text-[#64748B] font-mono">
            ₹{priceBounds.min.toLocaleString("en-IN")} – ₹{priceBounds.max.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Price Inputs Form */}
        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min-price-input" className="block text-[11px] font-mono text-[#475569] mb-1">
                Min Price (₹)
              </label>
              <input
                id="min-price-input"
                type="number"
                min="0"
                step="1000"
                placeholder={String(priceBounds.min)}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full h-9 px-2.5 text-xs font-mono text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="max-price-input" className="block text-[11px] font-mono text-[#475569] mb-1">
                Max Price (₹)
              </label>
              <input
                id="max-price-input"
                type="number"
                min="0"
                step="1000"
                placeholder={String(priceBounds.max)}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full h-9 px-2.5 text-xs font-mono text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Validation Warning */}
          {isPriceInvalid && (
            <div
              role="alert"
              className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>Min price cannot exceed Max price. Range will return 0 matches.</span>
            </div>
          )}

          {/* Price Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handlePricePreset(undefined, 50000)}
              className="px-2 py-1 rounded-md bg-[#F8FAFC] hover:bg-slate-100 text-[11px] font-mono text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors"
            >
              &lt; ₹50k
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(50000, 150000)}
              className="px-2 py-1 rounded-md bg-[#F8FAFC] hover:bg-slate-100 text-[11px] font-mono text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors"
            >
              ₹50k–₹1.5L
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(150000, undefined)}
              className="px-2 py-1 rounded-md bg-[#F8FAFC] hover:bg-slate-100 text-[11px] font-mono text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors"
            >
              &gt; ₹1.5L
            </button>
            {(localMin || localMax) && (
              <button
                type="button"
                onClick={handleClearPrice}
                className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-[11px] font-mono text-red-700 border border-red-200 transition-colors ml-auto"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-8 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white border border-transparent text-xs font-mono font-medium transition-colors shadow-sm"
          >
            Apply Price Filter
          </button>
        </form>
      </div>
    </aside>
  );
}
