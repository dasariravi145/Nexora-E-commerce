import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { coreValues } from "@/data/about";
import { Compass, Eye, Accessibility, Sparkles, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutCoreValuesProps {
  className?: string;
}

const VALUE_ICONS: Record<string, LucideIcon> = {
  Compass,
  Eye,
  Accessibility,
  Sparkles,
};

const VALUE_THEMES = [
  {
    iconBorder: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    badgeVariant: "electric" as const,
    hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/10",
  },
  {
    iconBorder: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    badgeVariant: "violet" as const,
    hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/10",
  },
  {
    iconBorder: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    badgeVariant: "success" as const,
    hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
  },
  {
    iconBorder: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    badgeVariant: "outline" as const,
    hoverBorder: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
  },
];

/**
 * AboutCoreValues:
 * Section D: Core Values Section.
 * Presents four foundational brand values: Thoughtful Design, Product Clarity,
 * Accessible Technology, and Effortless Discovery with premium editorial composition,
 * custom typography, tactile icons, and interactive hover states.
 */
export function AboutCoreValues({ className }: AboutCoreValuesProps) {
  return (
    <section
      id="core-values"
      aria-labelledby="core-values-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="core-values-heading"
        badge="Foundational Ethics"
        badgeVariant="violet"
        title="Four Core Brand Values"
        description="Principles governing every hardware decision, specification disclosure, and digital interaction we design."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {coreValues.map((val, idx) => {
          const theme = VALUE_THEMES[idx % VALUE_THEMES.length];
          const Icon = VALUE_ICONS[val.iconName] || Sparkles;

          return (
            <Card
              key={val.id}
              variant="interactive"
              className={cn(
                "p-6 sm:p-8 flex flex-col justify-between space-y-5 border-white/[0.08] transition-all duration-300 group",
                theme.hoverBorder
              )}
            >
              <div className="space-y-4">
                {/* Top Badge & Icon Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                      theme.iconBorder
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <Badge variant={theme.badgeVariant} size="sm">
                    {val.pillLabel}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    {val.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                    {val.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                  {val.description}
                </p>
              </div>

              {/* Bottom Subtle Proof Strip */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span>Value Principle 0{idx + 1}</span>
                </span>
                <span className="text-[11px] text-slate-400">NEXORA Standard</span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
