"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  ShieldAlert,
  ArrowRight,
  Info,
  Sparkles,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";
import type { Promotion, Product } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { OfferCard } from "@/components/offers/offer-card";
import {
  OfferCategoryFilter,
  type OfferCategoryTab,
} from "@/components/offers/offer-category-filter";

interface OffersClientProps {
  initialPromotions: Promotion[];
  products: Product[];
}

export function OffersClient({
  initialPromotions,
  products,
}: OffersClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Create product lookup map for rapid resolution
  const productMap = React.useMemo(() => {
    return new Map<string, Product>(products.map((p) => [p.id, p]));
  }, [products]);

  // Compute category tabs with dynamic active counts
  const categoryTabs = React.useMemo<OfferCategoryTab[]>(() => {
    const categories = [
      { id: "all", label: "All Offers" },
      { id: "smartphones", label: "Smartphones" },
      { id: "laptops", label: "Laptops" },
      { id: "audio", label: "Audio" },
      { id: "gaming", label: "Gaming" },
      { id: "wearables", label: "Wearables" },
      { id: "accessories", label: "Accessories" },
    ];

    return categories.map((cat) => {
      let count = 0;
      if (cat.id === "all") {
        count = initialPromotions.length;
      } else {
        count = initialPromotions.filter(
          (p) => p.categorySlug.toLowerCase() === cat.id
        ).length;
      }
      return {
        id: cat.id,
        label: cat.label,
        count,
      };
    });
  }, [initialPromotions]);

  // Filter promotions based on selected category
  const filteredPromotions = React.useMemo(() => {
    if (selectedCategory === "all") return initialPromotions;
    return initialPromotions.filter(
      (p) => p.categorySlug.toLowerCase() === selectedCategory
    );
  }, [initialPromotions, selectedCategory]);

  // Identify featured hero spotlight promotion (Priority 1)
  const spotlightPromo = React.useMemo(() => {
    return initialPromotions.find((p) => p.featured) || initialPromotions[0];
  }, [initialPromotions]);

  const spotlightProduct = spotlightPromo
    ? productMap.get(spotlightPromo.eligibleProductIds[0])
    : undefined;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Demonstration Commerce Notice Banner */}
      <div
        role="region"
        aria-label="Demonstration Notice"
        className="p-4 sm:p-5 rounded-2xl bg-[#0B1530] border border-blue-500/30 text-blue-200 shadow-xl"
      >
        <div className="flex items-start gap-3 text-xs sm:text-sm">
          <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-semibold text-white">
              Demonstration Storefront &amp; Promotional Architecture
            </p>
            <p className="text-blue-200/90 text-xs sm:text-[13px]">
              All offers, promotional tiers, and calculated savings presented on this page are clearly identified illustrative demonstration concepts. Pricing reflects Indian Rupee (INR) baseline figures from the centralized catalogue. No real commercial purchase, credit card checkout, or payment processing is available.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Promotion Banner (Section B) */}
      {spotlightPromo && spotlightProduct && (
        <section aria-labelledby="featured-spotlight-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="featured-spotlight-heading"
              className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Flagship Showcase Incentive</span>
            </h2>
            <Badge variant="electric" size="sm">
              Primary Allocation
            </Badge>
          </div>

          <Card
            variant="glass"
            className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0F1D40]/90 via-[#0A1430]/90 to-[#060B1A]/95 border-blue-500/40 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Lighting Gradient */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Visual Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-2xl bg-[#050A18] border border-white/[0.08] p-6 shadow-inner">
                  <HardwareVisual
                    categorySlug={spotlightProduct.categorySlug}
                    productSlug={spotlightProduct.slug}
                    size="lg"
                    className="w-full h-48 sm:h-56 border-none bg-transparent"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.06]">
                    <span>{spotlightProduct.brand}</span>
                    <span className="text-blue-400 font-bold">Grade-5 Titanium</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Promotion Details */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="electric" size="md" dot>
                    {spotlightPromo.badgeText}
                  </Badge>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    Save {spotlightPromo.savingsPercent}% (
                    {spotlightPromo.formattedSavingsAmount})
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {spotlightPromo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-300 font-medium">
                    {spotlightPromo.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {spotlightPromo.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs line-through text-slate-500 font-mono">
                        {spotlightPromo.formattedOriginalPrice}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        Illustrative Demo Saving
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                        {spotlightPromo.formattedPromotionalPrice}
                      </span>
                      <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">
                        Demo Value
                      </span>
                    </div>
                  </div>

                  {spotlightPromo.applicableVariantsNote && (
                    <p className="text-[11px] text-slate-400 italic max-w-xs text-right">
                      {spotlightPromo.applicableVariantsNote}
                    </p>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href={`/offers/${spotlightPromo.slug}`} className="w-full sm:w-auto">
                    <PremiumButton
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      View Allocation Terms
                    </PremiumButton>
                  </Link>
                  <Link href={`/products/${spotlightProduct.slug}`} className="w-full sm:w-auto">
                    <PremiumButton
                      variant="outline"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      Inspect Hardware Specimen
                    </PremiumButton>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Offer Category Tabs & Filter Navigation (Section C) */}
      <section aria-labelledby="all-offers-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeading
            badge="Laboratory Allocations"
            badgeVariant="violet"
            title="Demonstration Hardware Packages"
            description="Explore transparent illustrative incentives categorized by engineering division."
            id="all-offers-heading"
          />

          <span className="text-xs font-mono text-slate-400 shrink-0">
            Showing {filteredPromotions.length} of {initialPromotions.length} Active Offers
          </span>
        </div>

        {/* Category Tabs */}
        <OfferCategoryFilter
          tabs={categoryTabs}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Offer Cards Grid (Section D) */}
        {filteredPromotions.length > 0 ? (
          <div
            id={`offers-panel-${selectedCategory}`}
            role="tabpanel"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
          >
            {filteredPromotions.map((promo) => {
              const eligibleList = promo.eligibleProductIds
                .map((id) => productMap.get(id))
                .filter((p): p is Product => Boolean(p));

              return (
                <OfferCard
                  key={promo.id}
                  promotion={promo}
                  eligibleProducts={eligibleList}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#091124] border border-white/[0.08] space-y-4">
            <PackageOpen className="h-8 w-8 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-white text-base">
                No Active Allocations in this Division
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No demonstration promotions are currently staged for this category. Switch to &quot;All Offers&quot; to view active allocations.
              </p>
            </div>
            <PremiumButton
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Reset Category Filter
            </PremiumButton>
          </div>
        )}
      </section>

      {/* Terms & Eligibility Disclosure Accordion / Cards (Section E & F) */}
      <section aria-labelledby="terms-heading" className="space-y-6 pt-4">
        <SectionHeading
          badge="Commercial Governance"
          badgeVariant="subtle"
          title="Demonstration Rules &amp; Eligibility Framework"
          description="Clear architectural rules governing portfolio pricing and demonstration incentives."
          id="terms-heading"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass" className="p-5 space-y-3 bg-[#080E24]/80">
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
              <h4 className="font-bold text-sm text-white">Honest Pricing Calculations</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All promotional price reductions are calculated strictly against real baseline catalogue prices in Indian Rupees (INR). No artificial markup is applied to exaggerate savings metrics.
            </p>
          </Card>

          <Card variant="glass" className="p-5 space-y-3 bg-[#080E24]/80">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldAlert className="h-4 w-4" />
              <h4 className="font-bold text-sm text-white">Zero Fabricated Scarcity</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We do not invent deceptive countdown timers, fake stock counters, or artificial rush claims. All allocations reflect designated engineering test batches.
            </p>
          </Card>

          <Card variant="glass" className="p-5 space-y-3 bg-[#080E24]/80">
            <div className="flex items-center gap-2 text-emerald-400">
              <Tag className="h-4 w-4" />
              <h4 className="font-bold text-sm text-white">Variant Scope Transparency</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demonstration incentives apply to specified baseline hardware finishes. Additional memory, storage, or custom optical finishes reflect their standard catalogue delta.
            </p>
          </Card>
        </div>
      </section>

      {/* Browse All Products CTA (Section G) */}
      <section className="pt-4">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-slate-900/40 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Seeking Uncompromised Hardware Configurations?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Browse the complete 30-specimen catalogue with multi-token search, laboratory filtering, and 3D turntable studios.
            </p>
          </div>

          <Link href="/products" className="shrink-0">
            <PremiumButton
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore Full Catalogue
            </PremiumButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
