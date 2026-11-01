import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { trustPillars } from "@/data/about";
import {
  FileCheck2,
  Coins,
  Layers,
  MessageSquareCode,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutTrustSectionProps {
  className?: string;
}

const TRUST_ICONS: Record<string, LucideIcon> = {
  FileCheck2,
  Coins,
  Layers,
  MessageSquareCode,
};

/**
 * AboutTrustSection:
 * Section 8: Trust-Building Without Fabrication.
 * Builds authentic consumer trust through transparency, verifiable demonstration
 * economics, consistent navigation, and clear architectural statements—strictly
 * rejecting fabricated customer reviews, simulated celebrity endorsements, and fake trust badges.
 */
export function AboutTrustSection({ className }: AboutTrustSectionProps) {
  return (
    <section
      id="trust-transparency"
      aria-labelledby="trust-transparency-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="trust-transparency-heading"
        badge="Zero-Fabrication Standard"
        badgeVariant="success"
        title="Trust Through Commercial Transparency"
        description="Authentic trust cannot be manufactured through fake testimonials or artificial countdowns. We earn credibility through verifiable mathematics and functional software."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustPillars.map((pillar) => {
          const Icon = TRUST_ICONS[pillar.iconName] || ShieldCheck;

          return (
            <Card
              key={pillar.id}
              variant="glass"
              className="p-5 sm:p-6 flex flex-col justify-between space-y-4 border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono text-emerald-400/90 block">
                  Evidence: <span className="text-slate-300">{pillar.evidenceText}</span>
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
