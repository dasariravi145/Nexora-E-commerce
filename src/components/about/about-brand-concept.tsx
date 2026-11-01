import * as React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brandManifesto } from "@/data/about";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export interface AboutBrandConceptProps {
  className?: string;
}

/**
 * AboutBrandConcept:
 * Section B: NEXORA Brand Concept & Brand Storytelling.
 * Delivers original conceptual narrative on premium product discovery,
 * industrial architecture, and tactile digital inspection, accompanied by an explicit,
 * honest commercial disclosure confirming NEXORA's demonstration storefront status.
 */
export function AboutBrandConcept({ className }: AboutBrandConceptProps) {
  return (
    <section
      id="brand-concept"
      aria-labelledby="brand-concept-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <SectionHeading
        id="brand-concept-heading"
        badge="Conceptual Architecture"
        badgeVariant="violet"
        title={brandManifesto.title}
        description={brandManifesto.tagline}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Conceptual Essays */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass" className="p-6 sm:p-8 space-y-5 border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-white">
                What NEXORA Represents
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-pretty">
              {brandManifesto.mission}
            </p>
          </Card>

          <Card variant="glass" className="p-6 sm:p-8 space-y-5 border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-white">
                Why Premium Product Discovery Matters
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-pretty">
              {brandManifesto.thesis}
            </p>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#080E1E] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold">
                <Cpu className="h-3.5 w-3.5" />
                <span>The Role of Design</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Tactile Structural Honesty
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Form follows thermal dynamics, acoustic resonance, and human ergonomics
                rather than superficial ornamental trends.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#080E1E] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>The Customer Experience</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Objective Spatial Intuition
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering buyers to inspect hardware in true 3D, compare specifications
                side-by-side, and verify savings mathematically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Commercial Honesty & Demonstration Disclosure */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1B38] to-[#080E1E] border border-blue-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Demonstration Disclosure
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Zero-Fabrication Charter
                  </span>
                </div>
              </div>
              <Badge variant="electric" size="sm">
                Authentic UX
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
              NEXORA is an original architectural case study and luxury electronics
              demonstration storefront created to explore high-fidelity web experiences,
              Three.js spatial inspection, and accessible design systems.
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Our Verification Commitments:
              </h4>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Fabricated History:</strong> We do not invent founding years,
                    headquarters addresses, or fictitious executive biographies.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Fabricated Social Proof:</strong> Zero fake customer reviews,
                    simulated purchase counts, or manufactured industry awards.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mathematical Pricing:</strong> Every demo discount is derived strictly
                    from verified baseline catalogue prices in Indian Rupees (INR).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Functional Architecture:</strong> Every route, filter, comparison matrix,
                    and 3D model described is physically implemented and operable.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                Verified Catalogue Specimen Base
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-1"
              >
                <span>Inspect 30 Units</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
