"use client";

import * as React from "react";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { useComparison } from "@/context/comparison-context";
import {
  buildComparisonMatrix,
  filterDifferencesOnly,
  MIN_COMPARISON_PRODUCTS,
} from "@/lib/product-comparison";
import {
  Scale,
  X,
  RotateCcw,
  Plus,
  Eye,
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const {
    items,
    count,
    activeCategoryName,
    activeCategorySlug,
    removeFromCompare,
    clearCompare,
  } = useComparison();

  const [showDifferencesOnly, setShowDifferencesOnly] = React.useState(false);

  // Generate dynamic specification matrix across selected products
  const fullMatrix = React.useMemo(() => buildComparisonMatrix(items), [items]);

  const displayedMatrix = React.useMemo(() => {
    if (!showDifferencesOnly) return fullMatrix;
    return filterDifferencesOnly(fullMatrix);
  }, [fullMatrix, showDifferencesOnly]);

  // Breadcrumbs: Home > Categories > [Category] > Compare (or Home > Compare if empty)
  const breadcrumbItems = React.useMemo(() => {
    if (activeCategoryName && activeCategorySlug) {
      return [
        { label: "Categories", href: "/categories" },
        { label: activeCategoryName, href: `/categories/${activeCategorySlug}` },
        { label: "Specification Comparison", current: true },
      ];
    }
    return [
      { label: "Categories", href: "/categories" },
      { label: "Specification Comparison", current: true },
    ];
  }, [activeCategoryName, activeCategorySlug]);

  return (
    <div className="py-8 sm:py-14 md:py-20 space-y-8 sm:space-y-12">
      <SiteContainer size="xl" className="space-y-8 sm:space-y-10">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center gap-3">
            {activeCategorySlug ? (
              <Link href={`/categories/${activeCategorySlug}`}>
                <PremiumButton
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
                >
                  All {activeCategoryName}
                </PremiumButton>
              </Link>
            ) : (
              <Link href="/products">
                <PremiumButton
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
                >
                  Full Catalogue
                </PremiumButton>
              </Link>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="electric" size="sm" dot>
                Technical Matrix
              </Badge>
              {activeCategoryName && (
                <span className="text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-wider">
                  Division: {activeCategoryName}
                </span>
              )}
              <Badge variant="subtle" size="sm" className="bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]">
                {count} Specimen{count === 1 ? "" : "s"} Calibrated
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Hardware Specification Comparison
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Side-by-side engineering evaluation comparing architectural specifications, thermal dissipation methods, display physics, and calibrated acoustic metrics.
            </p>
          </div>

          {/* Quick Actions & Differences Toggle */}
          {count >= MIN_COMPARISON_PRODUCTS && (
            <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-xs font-mono self-start lg:self-auto">
              {/* Show Differences Only Accessible Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={showDifferencesOnly}
                onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
                  showDifferencesOnly
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-semibold"
                    : "bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 border border-[#E2E8F0]"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Show Differences Only</span>
              </button>

              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>

              {activeCategorySlug && count < 4 && (
                <Link href={`/categories/${activeCategorySlug}`}>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-[#EAF2FF] border border-[#2563EB]/30 text-[#2563EB] hover:bg-blue-100 transition-colors flex items-center gap-1 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Unit</span>
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Empty State: Under Minimum Threshold */}
        {count < MIN_COMPARISON_PRODUCTS && (
          <Card
            variant="solid"
            className="p-8 sm:p-14 text-center space-y-6 border-[#E2E8F0] bg-white shadow-sm max-w-3xl mx-auto"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] border border-[#2563EB]/25 text-[#2563EB] shadow-md">
              <Scale className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                {count === 0
                  ? "No Hardware Specimens Selected"
                  : "Select at Least 2 Specimens to Compare"}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {count === 0
                  ? "Explore NEXORA's 6 precision hardware engineering divisions and select 2 to 4 products within the same division to evaluate side-by-side technical specifications."
                  : `You have currently selected 1 ${activeCategoryName} unit ("${items[0].name}"). Select at least one more ${activeCategoryName} specimen to unlock the full technical matrix.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {activeCategorySlug ? (
                <Link href={`/categories/${activeCategorySlug}`}>
                  <PremiumButton
                    variant="primary"
                    size="md"
                    rightIcon={<Plus className="h-4 w-4" />}
                  >
                    Select Another {activeCategoryName} Unit
                  </PremiumButton>
                </Link>
              ) : (
                <Link href="/categories">
                  <PremiumButton
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowLeft className="h-4 w-4 rotate-180" />}
                  >
                    Explore Hardware Categories
                  </PremiumButton>
                </Link>
              )}

              <Link href="/products">
                <PremiumButton variant="outline" size="md" className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50">
                  Browse Global Catalogue
                </PremiumButton>
              </Link>
            </div>
          </Card>
        )}

        {/* Comparison Table / Matrix View (Active when count >= 2) */}
        {count >= MIN_COMPARISON_PRODUCTS && (
          <div className="space-y-8">
            {/* Scroll Affordance Notice for Touch/Mobile Viewports */}
            <div className="sm:hidden flex items-center justify-between text-[11px] font-mono text-[#475569] px-1">
              <span>Swipe horizontally to inspect all {count} columns</span>
              <span className="text-[#2563EB]">Scrollable →</span>
            </div>

            <div className="relative overflow-x-auto rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
              <table className="w-full border-collapse text-left text-xs font-mono">
                {/* Table Header: Sticky Product Cards */}
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {/* Fixed Attribute Column Header */}
                    <th
                      scope="col"
                      className="sticky left-0 z-30 w-44 sm:w-56 md:w-64 p-4 sm:p-6 bg-[#F8FAFC] border-r border-[#E2E8F0] text-[#0F172A] font-mono text-xs uppercase tracking-wider align-bottom"
                    >
                      <div className="space-y-1">
                        <span className="text-[#2563EB] font-bold block">Specimen Parameter</span>
                        <span className="text-[10px] text-[#64748B] font-normal block">
                          Calibrated Metrics
                        </span>
                      </div>
                    </th>

                    {/* Product Columns */}
                    {items.map((product) => (
                      <th
                        key={product.id}
                        scope="col"
                        className="w-56 sm:w-64 md:w-72 min-w-[220px] p-4 sm:p-5 border-r border-[#E2E8F0] last:border-r-0 align-top bg-white"
                      >
                        <div className="space-y-3.5">
                          {/* Visual Thumbnail */}
                          <div className="relative rounded-xl overflow-hidden bg-[#09152B] border border-slate-700 p-2">
                            <HardwareVisual
                              categorySlug={product.categorySlug}
                              size="sm"
                              className="w-full h-24 border-none bg-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => removeFromCompare(product.id)}
                              aria-label={`Remove ${product.name} from comparison`}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-rose-400 hover:bg-black/90 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Product Identification */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                              <span className="uppercase tracking-wider text-[#2563EB] font-semibold">
                                {product.brand}
                              </span>
                              <span>{product.category}</span>
                            </div>

                            <Link
                              href={`/products/${product.slug}`}
                              className="font-sans font-bold text-sm sm:text-base text-[#0F172A] hover:text-[#2563EB] transition-colors line-clamp-2 block"
                            >
                              {product.name}
                            </Link>

                            <p className="text-sm font-extrabold text-[#0F172A] pt-1">
                              {product.formattedPrice}
                            </p>
                          </div>

                          {/* Action Button */}
                          <Link href={`/products/${product.slug}`} className="block">
                            <PremiumButton
                              variant="outline"
                              size="sm"
                              rightIcon={<Eye className="h-3.5 w-3.5" />}
                              className="w-full py-1 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
                            >
                              Inspect Details
                            </PremiumButton>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body: Grouped Specification Rows */}
                <tbody>
                  {displayedMatrix.map((group) => (
                    <React.Fragment key={group.groupName}>
                      {/* Section Header Row */}
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th
                          colSpan={items.length + 1}
                          className="sticky left-0 z-20 py-2.5 px-4 sm:px-6 text-[11px] font-mono uppercase tracking-widest text-[#2563EB] font-bold bg-[#F8FAFC]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                            <span>{group.groupName}</span>
                          </div>
                        </th>
                      </tr>

                      {/* Specification Attribute Rows */}
                      {group.rows.map((row) => (
                        <tr
                          key={row.key}
                          className={cn(
                            "border-b border-[#E2E8F0] transition-colors hover:bg-slate-50/70",
                            row.hasDifference && "bg-[#EAF2FF]/40"
                          )}
                        >
                          {/* Attribute Label (Sticky Left) */}
                          <th
                            scope="row"
                            className={cn(
                              "sticky left-0 z-20 py-3.5 px-4 sm:px-6 bg-white border-r border-[#E2E8F0] text-[#0F172A] font-medium text-xs",
                              row.hasDifference && "bg-[#EAF2FF]/60 text-[#0F172A] font-semibold"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{row.label}</span>
                              {row.hasDifference && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] shrink-0" title="Values differ" />
                              )}
                            </div>
                          </th>

                          {/* Attribute Values per Product */}
                          {items.map((product) => {
                            const val = row.values[product.id] || "Not specified";
                            const isMissing = val === "Not specified";

                            return (
                              <td
                                key={`${product.id}-${row.key}`}
                                className={cn(
                                  "py-3.5 px-4 sm:px-5 border-r border-[#E2E8F0] last:border-r-0 text-xs",
                                  isMissing ? "text-[#94A3B8] italic" : "text-[#0F172A]"
                                )}
                              >
                                <span>{val}</span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty Differences Fallback */}
            {showDifferencesOnly && displayedMatrix.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                <p className="font-semibold text-[#0F172A] text-sm">
                  No Specification Differences Detected
                </p>
                <p className="text-xs text-[#475569] max-w-md mx-auto">
                  All active comparison specifications share identical values across the compared units. Disable &ldquo;Show Differences Only&rdquo; to review the full matrix.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDifferencesOnly(false)}
                  className="mt-2 text-xs font-mono text-[#2563EB] hover:text-blue-800 underline font-medium"
                >
                  View All Specifications
                </button>
              </div>
            )}

            {/* Honest Technical Calibration Disclosure */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#475569]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  All comparative metrics are calibrated under laboratory conditions. No artificial winner scoring or algorithmic rankings are computed.
                </span>
              </div>

              <Link
                href="/about"
                className="text-[#2563EB] hover:text-blue-800 font-semibold inline-flex items-center gap-1 shrink-0"
              >
                <span>Hardware Methodology</span>
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </SiteContainer>
    </div>
  );
}
