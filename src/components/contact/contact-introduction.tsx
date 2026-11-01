import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactConfig } from "@/config/contact";
import {
  Info,
  CheckCircle2,
  Lock,
  Headphones,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactIntroductionProps {
  className?: string;
}

/**
 * ContactIntroduction:
 * Section B: Contact Introduction & Advisory Scope.
 * Articulates the operational mandate of the client advisory desk,
 * accompanied by the mandatory demonstration storefront disclaimer.
 */
export function ContactIntroduction({ className }: ContactIntroductionProps) {
  return (
    <section
      id="contact-intro"
      aria-labelledby="contact-intro-heading"
      className={cn("space-y-6 sm:space-y-8", className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Advisory Scope */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <Card variant="solid" className="p-6 sm:p-8 space-y-4 border-[#E2E8F0] bg-white shadow-sm flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FF] border border-blue-200 text-[#2563EB]">
                <Sliders className="h-4 w-4" />
              </span>
              <h2 id="contact-intro-heading" className="text-lg font-bold text-[#0F172A]">
                Advisory Scope &amp; Consultation Capabilities
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
              The NEXORA engineering desk assists evaluators, developers, and hardware
              enthusiasts with architectural analysis across our 30 catalogue units.
              Whether dissecting planar driver frequency curves or evaluating spatial
              workstation thermal envelopes, our guidance is grounded in technical truth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>Planar acoustic driver matching and impedance advisory</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Multi-specimen side-by-side parametric trade-off reviews</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
                <span>Three.js spatial inspection and asset rendering telemetry</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Portfolio architecture and Next.js design system feedback</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Commercial Honesty & Handoff Disclaimer */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#EAF2FF] border border-blue-200 space-y-4 shadow-sm flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-blue-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Demonstration Notice</h3>
                </div>
                <Badge variant="electric" size="sm">
                  Client Handoff
                </Badge>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed text-pretty">
                {contactConfig.demoDisclaimer}
              </p>
            </div>

            <div className="pt-3 border-t border-blue-200/80 space-y-2 text-xs font-mono text-[#475569]">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Lock className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Zero Server-Side Retention</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Headphones className="h-3.5 w-3.5 text-purple-600" />
                <span>Direct Human Email Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
