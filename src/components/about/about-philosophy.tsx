import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { philosophyPillars } from "@/data/about";
import { CheckCircle2, Box, Eye, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutPhilosophyProps {
  className?: string;
}

const PILLAR_ICONS = {
  "pillar-material-integrity": Box,
  "pillar-spatial-interfaces": Eye,
  "pillar-honest-commerce": Coins,
};

const ACCENT_STYLES = {
  electric: {
    badge: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    gradientText: "from-blue-400 via-blue-200 to-white",
    cardGlow: "group-hover:border-blue-500/40 group-hover:shadow-blue-500/10",
    numberColor: "text-blue-500/40",
  },
  violet: {
    badge: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    gradientText: "from-purple-400 via-purple-200 to-white",
    cardGlow: "group-hover:border-purple-500/40 group-hover:shadow-purple-500/10",
    numberColor: "text-purple-500/40",
  },
  cyan: {
    badge: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    gradientText: "from-cyan-400 via-cyan-200 to-white",
    cardGlow: "group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10",
    numberColor: "text-cyan-500/40",
  },
};

/**
 * AboutPhilosophy:
 * Section C: Technology and Design Philosophy.
 * Highlights the three foundational pillars behind NEXORA's hardware ethos:
 * Monolithic Physicality, Spatial-First Architecture, and Honest Engineering Telemetry.
 */
export function AboutPhilosophy({ className }: AboutPhilosophyProps) {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="philosophy-heading"
        badge="Design & Engineering Principles"
        badgeVariant="electric"
        title="Technology &amp; Design Philosophy"
        description="Our hardware curation is grounded in raw metallurgy, spatial interactivity, and unvarnished specification disclosures."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {philosophyPillars.map((pillar) => {
          const style = ACCENT_STYLES[pillar.accentColor];
          const Icon = PILLAR_ICONS[pillar.id as keyof typeof PILLAR_ICONS] || Box;

          return (
            <Card
              key={pillar.id}
              variant="glass"
              className={cn(
                "relative p-6 sm:p-8 flex flex-col justify-between space-y-6 border-white/[0.08] transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1",
                style.cardGlow
              )}
            >
              <div className="space-y-5">
                {/* Pillar Header */}
                <div className="flex items-center justify-between gap-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border",
                      style.badge
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={cn(
                      "font-mono text-3xl sm:text-4xl font-extrabold tracking-tighter select-none",
                      style.numberColor
                    )}
                    aria-hidden="true"
                  >
                    {pillar.number}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                  {pillar.description}
                </p>
              </div>

              {/* Key Verification Proof Points */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
                  Engineering Evidence:
                </span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {pillar.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
