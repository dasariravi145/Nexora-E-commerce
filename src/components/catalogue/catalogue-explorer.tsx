"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import {
  filterAndSortProducts,
  getAvailableBrands,
  getPriceBounds,
  parseFilterParams,
  toQueryString,
  CatalogueFilterState,
  SortOption,
} from "@/lib/catalogue-filters";
import { CatalogueSearchBar } from "./catalogue-search-bar";
import { CatalogueSortSelect } from "./catalogue-sort-select";
import { CatalogueFilterSidebar } from "./catalogue-filter-sidebar";
import { CatalogueActiveChips } from "./catalogue-active-chips";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { SlidersHorizontal, AlertCircle, RotateCcw, Sparkles } from "lucide-react";

export interface CatalogueExplorerProps {
  initialProducts: Product[];
  fixedCategory?: string;
  fixedBrand?: string;
  hideCategoryFilter?: boolean;
  hideBrandFilter?: boolean;
  emptyHeading?: string;
  emptySubtext?: string;
}

export function CatalogueExplorer({
  initialProducts,
  fixedCategory,
  fixedBrand,
  hideCategoryFilter = false,
  hideBrandFilter = false,
  emptyHeading,
  emptySubtext,
}: CatalogueExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scope base products if fixedCategory or fixedBrand is provided
  const scopedProducts = React.useMemo(() => {
    let prods = initialProducts;
    if (fixedCategory) {
      prods = prods.filter((p) => p.categorySlug.toLowerCase() === fixedCategory.toLowerCase());
    }
    if (fixedBrand) {
      prods = prods.filter((p) => p.brandSlug.toLowerCase() === fixedBrand.toLowerCase());
    }
    return prods;
  }, [initialProducts, fixedCategory, fixedBrand]);

  // Derive filter state from URL query params, enforcing fixed category/brand constraints
  const rawFilters = React.useMemo(() => parseFilterParams(searchParams), [searchParams]);
  const filters: CatalogueFilterState = React.useMemo(() => {
    const f = { ...rawFilters };
    if (fixedCategory) {
      f.category = fixedCategory;
    }
    if (fixedBrand) {
      f.brands = [fixedBrand];
    }
    return f;
  }, [rawFilters, fixedCategory, fixedBrand]);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);

  // Derived metadata from scoped product catalogue
  const availableBrands = React.useMemo(
    () => getAvailableBrands(scopedProducts),
    [scopedProducts]
  );
  const priceBounds = React.useMemo(
    () => getPriceBounds(scopedProducts),
    [scopedProducts]
  );

  const brandLabels = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of availableBrands) {
      map[b.slug] = b.name;
    }
    return map;
  }, [availableBrands]);

  // Execute filtering & deterministic sorting pipeline
  const { results, appliedFilterCount, isPriceRangeInvalid } =
    React.useMemo(
      () => filterAndSortProducts(scopedProducts, filters),
      [scopedProducts, filters]
    );

  // Sync state update with URL query params
  const updateFilters = React.useCallback(
    (newFilters: Partial<CatalogueFilterState>) => {
      const next: CatalogueFilterState = { ...filters, ...newFilters };
      if (fixedCategory) {
        next.category = fixedCategory;
      }
      if (fixedBrand) {
        next.brands = [fixedBrand];
      }
      const queryString = toQueryString(next);
      router.replace(`${pathname}${queryString}`, { scroll: false });
    },
    [router, pathname, filters, fixedCategory, fixedBrand]
  );

  // Action handlers
  const handleQueryChange = (query: string) => {
    updateFilters({ query });
  };

  const handleCategorySelect = (categorySlug: string) => {
    updateFilters({ category: categorySlug });
  };

  const handleToggleBrand = (brandSlug: string) => {
    const current = filters.brands || [];
    const exists = current.includes(brandSlug);
    const nextBrands = exists
      ? current.filter((b) => b !== brandSlug)
      : [...current, brandSlug];
    updateFilters({ brands: nextBrands });
  };

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    updateFilters({ minPrice, maxPrice });
  };

  const handleSortChange = (sort: SortOption) => {
    updateFilters({ sort });
  };

  const handleResetAll = () => {
    if (fixedCategory || fixedBrand) {
      const resetFilters: Partial<CatalogueFilterState> = {};
      if (fixedCategory) resetFilters.category = fixedCategory;
      if (fixedBrand) resetFilters.brands = [fixedBrand];
      const qs = toQueryString(resetFilters);
      router.replace(`${pathname}${qs}`, { scroll: false });
    } else {
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Top Discovery Command Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        {/* Search Bar */}
        <div className="flex-1">
          <CatalogueSearchBar
            value={filters.query}
            onChange={handleQueryChange}
            resultCount={results.length}
            totalProducts={scopedProducts.length}
          />
        </div>

        {/* Right Controls: Sort Dropdown & Mobile Filter Trigger */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Mobile Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex-1 md:flex-initial h-11 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF2FF] border border-[#E2E8F0] text-xs font-mono font-medium text-[#0F172A] flex items-center justify-center gap-2 transition-colors active:scale-95"
            aria-label="Open filter and sorting options"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
            <span>Filters</span>
            {appliedFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-[10px] text-white font-bold">
                {appliedFilterCount}
              </span>
            )}
          </button>

          {/* Desktop & Mobile Sort Dropdown */}
          <CatalogueSortSelect
            value={filters.sort}
            onChange={handleSortChange}
            className="flex-1 md:flex-initial"
          />
        </div>
      </div>

      {/* 2. Active Filters Chips Row */}
      <CatalogueActiveChips
        query={filters.query}
        category={filters.category}
        brands={filters.brands}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        sort={filters.sort}
        onRemoveQuery={() => updateFilters({ query: "" })}
        onRemoveCategory={() => updateFilters({ category: "all" })}
        onRemoveBrand={(b) =>
          updateFilters({ brands: filters.brands.filter((item) => item !== b) })
        }
        onRemoveMinPrice={() => updateFilters({ minPrice: undefined })}
        onRemoveMaxPrice={() => updateFilters({ maxPrice: undefined })}
        onResetSort={() => updateFilters({ sort: "featured" })}
        onResetAll={handleResetAll}
        brandLabels={brandLabels}
        hideCategoryChip={Boolean(fixedCategory)}
        hideBrandChip={Boolean(fixedBrand)}
      />

      {/* 3. Screen Reader Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Showing {results.length} of {scopedProducts.length} products matching
        active search and filters.
      </div>

      {/* 4. Main Body: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <CatalogueFilterSidebar
            selectedCategory={filters.category}
            onSelectCategory={handleCategorySelect}
            availableBrands={availableBrands}
            selectedBrands={filters.brands}
            onToggleBrand={handleToggleBrand}
            priceBounds={priceBounds}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onPriceChange={handlePriceChange}
            onResetAll={handleResetAll}
            totalProductsCount={scopedProducts.length}
            isPriceInvalid={isPriceRangeInvalid}
            hideCategorySection={Boolean(fixedCategory || hideCategoryFilter)}
            hideBrandSection={Boolean(fixedBrand || hideBrandFilter)}
          />
        </div>

        {/* Right Column: Grid Header Telemetry & Product Cards / Empty State */}
        <div className="lg:col-span-3 space-y-6">
          {/* Result Count and Quick Category Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0] text-xs font-mono text-[#475569]">
            <div>
              Showing <span className="text-[#0F172A] font-bold">{results.length}</span>{" "}
              of {scopedProducts.length} precision hardware flagships
            </div>

            {appliedFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetAll}
                className="text-[#2563EB] hover:text-blue-800 underline self-start sm:self-auto font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Product Cards Grid or Dynamic Empty States */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : isPriceRangeInvalid ? (
            /* Invalid Price Range State */
            <div className="p-8 sm:p-12 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Invalid Price Range Bound
                </h3>
                <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                  The minimum price specified exceeds the maximum price bound.
                  Adjust the bounds or reset price filters to resume discovery.
                </p>
              </div>
              <PremiumButton
                variant="outline"
                size="sm"
                onClick={() => handlePriceChange(undefined, undefined)}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Reset Price Range
              </PremiumButton>
            </div>
          ) : (
            /* No Matching Products State */
            <div className="p-8 sm:p-14 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-center space-y-5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#2563EB] mx-auto border border-[#2563EB]/20">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {emptyHeading || "No Hardware Units Found"}
                </h3>
                <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                  {emptySubtext ||
                    "No products in our demo catalogue match all active search, division, brand, or price constraints. Try relaxing one or more filters."}
                </p>
              </div>

              <div className="pt-2">
                <PremiumButton
                  variant="primary"
                  size="sm"
                  onClick={handleResetAll}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                >
                  Clear Active Filters ({scopedProducts.length} Units)
                </PremiumButton>
              </div>
            </div>
          )}

          {/* Interactive Engineering Telemetry Notice */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-xs text-[#475569] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0" />
              <span>
                Deterministic client-side filter engine synchronized with URL
                state. Zero external search telemetry or latency.
              </span>
            </div>
            <Badge variant="subtle" size="sm" className="self-start sm:self-auto shrink-0 bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]">
              {scopedProducts.length} Live Units
            </Badge>
          </div>
        </div>
      </div>

      {/* 5. Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        selectedCategory={filters.category}
        onSelectCategory={handleCategorySelect}
        availableBrands={availableBrands}
        selectedBrands={filters.brands}
        onToggleBrand={handleToggleBrand}
        priceBounds={priceBounds}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onPriceChange={handlePriceChange}
        sort={filters.sort}
        onSelectSort={handleSortChange}
        onResetAll={handleResetAll}
        activeFilterCount={appliedFilterCount}
        totalProductsCount={scopedProducts.length}
        hideCategorySection={Boolean(fixedCategory || hideCategoryFilter)}
        hideBrandSection={Boolean(fixedBrand || hideBrandFilter)}
      />
    </div>
  );
}
