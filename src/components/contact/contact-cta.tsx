import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactCTAProps {
  className?: string;
}

/**
 * ContactCTA:
 * Section G: Explore Products Call-To-Action.
 * Seamlessly connects visitors from the advisory desk directly to the
 * 30-specimen hardware catalogue, 6 categories, and comparison suite.
 */
export function ContactCTA({ className }: ContactCTAProps) {
  return (
    <section
      id="contact-catalog-cta"
      aria-labelledby="contact-catalog-cta-heading"
      className={cn("pt-4", className)}
    >
      <Card
        variant="solid"
        className="relative overflow-hidden p-6 sm:p-10 border-blue-200 bg-[#EAF2FF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge variant="electric" size="sm">
              Hardware Catalogue
            </Badge>
            <span className="text-xs font-mono text-[#64748B]">
              30 Verified Units
            </span>
          </div>

          <h2
            id="contact-catalog-cta-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
          >
            Explore the <span className="gradient-text-electric">Complete Hardware Suite</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
            Inspect our full line of spatial communicators, planar acoustic monitors,
            neural workstations, and biometric wearables in interactive 3D.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-center"
          >
            <span>Explore 30 Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-[#0F172A] bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-blue-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-center shadow-sm"
          >
            <Scale className="h-4 w-4 text-purple-600" />
            <span>Compare Specimens</span>
          </Link>
        </div>
      </Card>
    </section>
  );
}
