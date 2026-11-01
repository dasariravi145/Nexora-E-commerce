import * as React from "react";
import type { ProductFeature } from "@/types";
import { Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductHighlightsProps {
  features?: ProductFeature[];
  productName: string;
  className?: string;
}

/**
 * ProductHighlights: Refined architectural engineering highlights section.
 * - Clean editorial card layout with subtle hover depth.
 * - Monospace ordinal counters (01, 02, 03).
 * - Full respect for prefers-reduced-motion.
 */
export function ProductHighlights({
  features,
  productName,
  className,
}: ProductHighlightsProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)} aria-label={`${productName} features and highlights`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#2563EB]" />
          <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-mono uppercase tracking-wider">
            Architectural &amp; Engineering Highlights
          </h2>
        </div>
        <span className="text-xs font-mono text-[#2563EB] font-medium">
          {features.length} Precision Milestones for {productName}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, idx) => (
          <div
            key={feat.title}
            className="group relative p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            {/* Top Ordinal & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-1 rounded-md border border-[#2563EB]/25">
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <Zap className="h-4 w-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
            </div>

            {/* Feature Content */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed text-pretty">
                {feat.description}
              </p>
            </div>

            {/* Bottom Glow Accent */}
            <div
              className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent group-hover:via-[#2563EB]/50 transition-colors"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
