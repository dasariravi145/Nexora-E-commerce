import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { futureVisionPillars } from "@/data/about";
import { Target, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutFutureVisionProps {
  className?: string;
}

/**
 * AboutFutureVision:
 * Section G: Future-Facing Technology Vision.
 * Explores conceptual research horizons: browser-based HRTF spatial audio,
 * circular metallurgy with modular snap-rail enclosures, and air-gapped
 * local-first compute architectures.
 */
export function AboutFutureVision({ className }: AboutFutureVisionProps) {
  return (
    <section
      id="future-vision"
      aria-labelledby="future-vision-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="future-vision-heading"
        badge="Architectural Roadmap"
        badgeVariant="violet"
        title="Future-Facing Technology Vision"
        description="Exploring next-generation spatial ergonomics, modular repairability, and privacy-first local computing."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {futureVisionPillars.map((vision) => (
          <Card
            key={vision.id}
            variant="glass"
            className="p-6 sm:p-8 flex flex-col justify-between space-y-6 border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                  <Orbit className="h-5 w-5" />
                </span>

                <Badge variant="violet" size="sm">
                  {vision.horizon}
                </Badge>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                  {vision.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  {vision.conceptTitle}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                {vision.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400">
                <Target className="h-3.5 w-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Architectural Benchmark:
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {vision.architecturalGoal}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
