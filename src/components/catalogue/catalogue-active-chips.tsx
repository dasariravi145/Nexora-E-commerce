"use client";

import * as React from "react";
import { X, RotateCcw } from "lucide-react";
import { formatINR } from "@/lib/format";
import { SORT_OPTIONS, SortOption } from "@/lib/catalogue-filters";
import { categories } from "@/data/categories";

export interface ActiveChipsProps {
  query: string;
  category: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  onRemoveQuery: () => void;
  onRemoveCategory: () => void;
  onRemoveBrand: (brandSlug: string) => void;
  onRemoveMinPrice: () => void;
  onRemoveMaxPrice: () => void;
  onResetSort: () => void;
  onResetAll: () => void;
  brandLabels: Record<string, string>;
  hideCategoryChip?: boolean;
  hideBrandChip?: boolean;
}

export function CatalogueActiveChips({
  query,
  category,
  brands,
  minPrice,
  maxPrice,
  sort,
  onRemoveQuery,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveMinPrice,
  onRemoveMaxPrice,
  onResetSort,
  onResetAll,
  brandLabels,
  hideCategoryChip = false,
  hideBrandChip = false,
}: ActiveChipsProps) {
  const hasCategory = !hideCategoryChip && category && category.toLowerCase() !== "all";
  const hasQuery = Boolean(query && query.trim());
  const hasBrands = !hideBrandChip && brands && brands.length > 0;
  const hasMinPrice = typeof minPrice === "number" && !isNaN(minPrice);
  const hasMaxPrice = typeof maxPrice === "number" && !isNaN(maxPrice);
  const hasCustomSort = sort && sort !== "featured";

  const totalActive =
    (hasQuery ? 1 : 0) +
    (hasCategory ? 1 : 0) +
    (hasBrands ? brands.length : 0) +
    (hasMinPrice ? 1 : 0) +
    (hasMaxPrice ? 1 : 0) +
    (hasCustomSort ? 1 : 0);

  if (totalActive === 0) return null;

  const activeCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === category.toLowerCase()
  );

  const activeSortDef = SORT_OPTIONS.find((s) => s.id === sort);

  return (
    <div
      role="region"
      aria-label="Active filters"
      className="flex items-center gap-2 flex-wrap text-xs font-mono"
    >
      <span className="text-[#475569] font-medium mr-1">Active filters:</span>

      {/* Query Chip */}
      {hasQuery && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EAF2FF] border border-[#2563EB]/30 text-[#2563EB] font-medium">
          <span>Search: &ldquo;{query}&rdquo;</span>
          <button
            type="button"
            onClick={onRemoveQuery}
            aria-label={`Remove query filter ${query}`}
            className="hover:text-blue-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Category Chip */}
      {hasCategory && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EAF2FF] border border-[#2563EB]/30 text-[#2563EB] font-medium">
          <span>Division: {activeCategoryObj?.name || category}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            aria-label={`Remove division filter ${category}`}
            className="hover:text-blue-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Brand Chips */}
      {hasBrands &&
        brands.map((bSlug) => (
          <span
            key={bSlug}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium"
          >
            <span>Brand: {brandLabels[bSlug] || bSlug}</span>
            <button
              type="button"
              onClick={() => onRemoveBrand(bSlug)}
              aria-label={`Remove brand filter ${brandLabels[bSlug] || bSlug}`}
              className="hover:text-indigo-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

      {/* Min Price Chip */}
      {hasMinPrice && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
          <span>Min: {formatINR(minPrice as number)}</span>
          <button
            type="button"
            onClick={onRemoveMinPrice}
            aria-label="Remove minimum price filter"
            className="hover:text-slate-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Max Price Chip */}
      {hasMaxPrice && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
          <span>Max: {formatINR(maxPrice as number)}</span>
          <button
            type="button"
            onClick={onRemoveMaxPrice}
            aria-label="Remove maximum price filter"
            className="hover:text-slate-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Sort Chip */}
      {hasCustomSort && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
          <span>Sort: {activeSortDef?.label}</span>
          <button
            type="button"
            onClick={onResetSort}
            aria-label="Reset sort to featured flagships"
            className="hover:text-slate-900 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear All Action */}
      <button
        type="button"
        onClick={onResetAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-[#475569] hover:text-[#0F172A] transition-colors border border-[#E2E8F0] shadow-sm active:scale-95"
      >
        <RotateCcw className="h-3 w-3 text-[#2563EB]" />
        <span>Clear All</span>
      </button>
    </div>
  );
}
