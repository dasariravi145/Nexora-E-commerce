import * as React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoFeatureShowcases } from "@/data/about";
import {
  Box,
  Scale,
  SlidersHorizontal,
  Tag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutTechShowcaseProps {
  className?: string;
}

const FEATURE_ICONS = {
  "feature-3d-viewer": Box,
  "feature-comparison-matrix": Scale,
  "feature-category-brand-discovery": SlidersHorizontal,
  "feature-promotions-showcase": Tag,
};

/**
 * AboutTechShowcase:
 * Section F: Product Discovery Experience & Technology Showcase.
 * Strictly presents actual, functioning capabilities implemented within the
 * NEXORA demonstration storefront:
 * 1. Three.js 3D Product Inspection (/products/nexora-nova-1-pro)
 * 2. Multi-Specimen Comparison Matrix (/compare)
 * 3. 6 Divisions & 6 Brand Laboratories (/categories & /brands)
 * 4. Transparent Demonstration Promotions (/offers)
 */
export function AboutTechShowcase({ className }: AboutTechShowcaseProps) {
  return (
    <section
      id="technology-showcase"
      aria-labelledby="tech-showcase-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionHeading
          id="tech-showcase-heading"
          badge="Live Demonstration Capabilities"
          badgeVariant="electric"
          title="Product Discovery Experience"
          description="Every technological feature highlighted below is physically operable in this storefront. Experience real-time WebGL, parametric comparison, and responsive discovery."
        />

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#080E1E] border border-white/[0.08] text-xs font-mono text-emerald-400 self-start lg:self-auto">
          <CheckCircle2 className="h-4 w-4" />
          <span>4 Verified Technical Suites Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {demoFeatureShowcases.map((feat) => {
          const Icon =
            FEATURE_ICONS[feat.id as keyof typeof FEATURE_ICONS] || Box;

          return (
            <Card
              key={feat.id}
              variant="interactive"
              className="p-6 sm:p-8 flex flex-col justify-between space-y-6 border-white/[0.08] group hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header Strip */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={feat.badgeVariant} size="sm">
                      {feat.badge}
                    </Badge>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Live Feature</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                    {feat.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#060B1A]/80 border border-white/[0.06] text-xs font-mono text-slate-400">
                  <span className="text-slate-300 block mb-0.5 font-semibold">
                    Implementation Scope:
                  </span>
                  <span>{feat.implementationDetail}</span>
                </div>
              </div>

              {/* Working CTA */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <Link
                  href={feat.routeHref}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-white transition-colors group/btn focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-1 -m-1"
                >
                  <span>{feat.routeLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>

                <span className="text-[11px] font-mono text-slate-500">
                  {feat.routeHref}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
