"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Tag, ShieldCheck, Info } from "lucide-react";
import type { Promotion, Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  promotion: Promotion;
  eligibleProducts: Product[];
  className?: string;
}

export function OfferCard({
  promotion,
  eligibleProducts,
  className,
}: OfferCardProps) {
  const primaryProduct = eligibleProducts[0];

  return (
    <Card
      variant="interactive"
      className={cn(
        "p-5 sm:p-6 h-full flex flex-col justify-between space-y-5 rounded-2xl bg-[#091124]/90 border-white/[0.08] hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group",
        promotion.featured && "border-blue-500/30 bg-gradient-to-b from-[#0A1430] to-[#070D1E]",
        className
      )}
    >
      {/* Card Header & Badges */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={promotion.badgeVariant || "electric"}
              size="sm"
              dot={promotion.featured}
            >
              {promotion.badgeText}
            </Badge>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {promotion.categoryName}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Tag className="h-3 w-3" />
            <span>Save {promotion.savingsPercent}%</span>
          </div>
        </div>

        {/* Visual Preview */}
        {primaryProduct && (
          <div className="relative rounded-xl overflow-hidden bg-[#050A18] border border-white/[0.06] p-3 group-hover:border-blue-500/20 transition-colors">
            <HardwareVisual
              categorySlug={primaryProduct.categorySlug}
              productSlug={primaryProduct.slug}
              size="md"
              className="w-full h-36 border-none bg-transparent"
            />
            {promotion.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/80 backdrop-blur-md text-[10px] font-mono font-bold text-white shadow-md">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Featured Laboratory Drop</span>
              </div>
            )}
          </div>
        )}

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <Link
            href={`/offers/${promotion.slug}`}
            className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {promotion.title}
          </Link>
          <p className="text-xs font-medium text-slate-400 line-clamp-1">
            {promotion.tagline}
          </p>
          <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-2 pt-1">
            {promotion.description}
          </p>
        </div>
      </div>

      {/* Pricing Breakdown & CTAs */}
      <div className="space-y-4 pt-4 border-t border-white/[0.08]">
        {/* Pricing Matrix */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs line-through text-slate-500 font-mono">
                {promotion.formattedOriginalPrice}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                -{promotion.formattedSavingsAmount}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {promotion.formattedPromotionalPrice}
              </span>
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">
                Demo Price
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              <ShieldCheck className="h-3 w-3 text-blue-400 shrink-0" />
              <span>Lab Incentive</span>
            </span>
          </div>
        </div>

        {/* Variant Scope Notice */}
        {promotion.applicableVariantsNote && (
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-blue-950/20 px-2.5 py-1.5 rounded-lg border border-blue-500/10">
            <Info className="h-3 w-3 text-blue-400 shrink-0" />
            <span className="line-clamp-1">{promotion.applicableVariantsNote}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Link href={`/offers/${promotion.slug}`} className="block">
            <PremiumButton
              variant="outline"
              size="sm"
              className="w-full text-xs py-2 justify-center"
            >
              Promotion Terms
            </PremiumButton>
          </Link>

          {primaryProduct && (
            <Link href={`/products/${primaryProduct.slug}`} className="block">
              <PremiumButton
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                className="w-full text-xs py-2 justify-center"
              >
                Inspect Specimen
              </PremiumButton>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
