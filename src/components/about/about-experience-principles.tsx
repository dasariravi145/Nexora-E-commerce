import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { customerPrinciples } from "@/data/about";
import { Boxes, Scale, SlidersHorizontal, Headphones, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutExperiencePrinciplesProps {
  className?: string;
}

const PRINCIPLE_ICONS: Record<string, LucideIcon> = {
  Boxes,
  Scale,
  SlidersHorizontal,
  Headphones,
};

/**
 * AboutExperiencePrinciples:
 * Section E: Customer Experience Principles.
 * Communicates the standard of customer interaction: sensory 3D inspection,
 * direct parametric comparisons, clear engineering discipline segmentation,
 * and direct concierge pathways.
 */
export function AboutExperiencePrinciples({
  className,
}: AboutExperiencePrinciplesProps) {
  return (
    <section
      id="experience-principles"
      aria-labelledby="experience-principles-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="experience-principles-heading"
        badge="Interface Integrity"
        badgeVariant="electric"
        title="Customer Experience Principles"
        description="Every customer touchpoint is engineered for maximum agency, zero dark patterns, and uncompromising clarity."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerPrinciples.map((principle, index) => {
          const Icon = PRINCIPLE_ICONS[principle.iconName] || Boxes;

          return (
            <Card
              key={principle.id}
              variant="glass"
              className="p-5 sm:p-6 flex flex-col justify-between space-y-4 border-white/[0.08] transition-all duration-300 hover:border-blue-500/30 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">
                  {principle.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                  {principle.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono text-slate-400 block">
                  Benefit: <strong className="text-slate-200">{principle.practicalBenefit}</strong>
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
