import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpTransparencyBannerProps {
  className?: string;
}

/**
 * HelpTransparencyBanner:
 * Section 10 compliance: Demonstrates strict commercial transparency.
 * Articulates clearly what NEXORA is (a frontend portfolio demo)
 * and what it explicitly is not (no real checkout, no fake warranty, no fake shipping).
 */
export function HelpTransparencyBanner({ className }: HelpTransparencyBannerProps) {
  return (
    <section
      id="store-transparency"
      aria-labelledby="store-transparency-heading"
      className={cn("pt-4", className)}
    >
      <Card
        variant="solid"
        className="p-6 sm:p-8 border-amber-300 bg-amber-50/70 space-y-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 border border-amber-200 shrink-0 shadow-xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <Badge variant="outline" size="sm" className="text-amber-800 border-amber-300 bg-white">
                Commercial Transparency Charter
              </Badge>
              <h2
                id="store-transparency-heading"
                className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1"
              >
                Demonstration Scope & Ethical Disclosures
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* What NEXORA IS */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>What NEXORA Is:</span>
            </div>
            <ul className="space-y-1.5 text-[#0F172A] text-xs list-disc pl-5">
              <li>A high-fidelity modern Next.js 16 storefront portfolio demonstration.</li>
              <li>Interactive 3D WebGL inspection for certified CC0 open-source models.</li>
              <li>Real-time client-side search, filtering, and 4-way spec comparison.</li>
              <li>A client-side mailto inquiry generator respecting complete privacy.</li>
            </ul>
          </div>

          {/* What NEXORA IS NOT */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <XCircle className="h-4 w-4" />
              <span>What NEXORA Does Not Do:</span>
            </div>
            <ul className="space-y-1.5 text-[#0F172A] text-xs list-disc pl-5">
              <li>No financial transactions, payment gateways, or real order fulfillment.</li>
              <li>No fabricated warranty contracts, shipping guarantees, or return policies.</li>
              <li>No simulated AI chatbots, automated tracking, or fake customer testimonials.</li>
              <li>No remote database storage of submitted user inquiry information.</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
