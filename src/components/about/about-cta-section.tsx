import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Layers,
  HelpCircle,
  Scale,
  Tag,
} from "lucide-react";

export interface AboutCTASectionProps {
  className?: string;
}

/**
 * AboutCTASection:
 * Sections H & I: Explore Products Call-To-Action & Contact Call-To-Action.
 * Seamlessly directs visitors to active, working storefront pathways:
 * - Products: /products
 * - Categories: /categories
 * - Offers: /offers
 * - Comparison: /compare
 * - Contact: /contact
 * - FAQ: /faq
 *
 * Guarantees zero non-functional or dead buttons.
 */
export function AboutCTASection({ className }: AboutCTASectionProps) {
  return (
    <section
      id="about-actions"
      aria-labelledby="about-actions-heading"
      className={cn("space-y-8 sm:space-y-12", className)}
    >
      <div className="sr-only">
        <h2 id="about-actions-heading">NEXORA Navigation &amp; Inquiries</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Explore Products & Hardware Divisions (Section H) */}
        <Card
          variant="glass"
          className="relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between space-y-6 border-blue-500/30 bg-gradient-to-br from-[#0B152E] via-[#080F22] to-[#050A18] shadow-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Badge variant="electric" size="md">
                Catalogue Exploration
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                30 Verified Units
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Ready to Explore <br className="hidden sm:inline" />
              <span className="gradient-text-electric">NEXORA Hardware?</span>
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg text-pretty">
              Step into our centralized engineering catalogue. Inspect specimens in
              multi-axis 3D, compare technical specifications side-by-side, or filter
              by specialized engineering disciplines.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Explore Full Catalogue</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-200 bg-[#101A30] hover:bg-[#162240] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Layers className="h-4 w-4 text-blue-400" />
                <span>6 Hardware Divisions</span>
              </Link>
            </div>

            {/* Quick Secondary Links */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center gap-4 text-xs font-mono text-slate-400">
              <Link
                href="/offers"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Tag className="h-3.5 w-3.5 text-blue-400" />
                <span>Exclusive Offers</span>
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Scale className="h-3.5 w-3.5 text-purple-400" />
                <span>Spec Comparison</span>
              </Link>
            </div>
          </div>
        </Card>

        {/* Card 2: Contact & Concierge (Section I) */}
        <Card
          variant="glass"
          className="relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between space-y-6 border-purple-500/30 bg-gradient-to-br from-[#120F2E] via-[#0B0A20] to-[#050A18] shadow-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Badge variant="violet" size="md">
                Engineering Concierge
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                Direct Inquiry
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Have Technical Questions <br className="hidden sm:inline" />
              <span className="gradient-text-hero">or Demonstration Feedback?</span>
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg text-pretty">
              Whether you are evaluating our spatial inspection performance, inquiring
              about catalogue hardware specifications, or discussing portfolio UX
              architecture, our engineering team is available.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Connect with Team</span>
              </Link>

              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-200 bg-[#101A30] hover:bg-[#162240] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <HelpCircle className="h-4 w-4 text-purple-400" />
                <span>Read Store FAQ</span>
              </Link>
            </div>

            {/* Quick Secondary Note */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Prompt Responses</span>
              </span>
              <span className="text-[11px] text-slate-400">No automated bot walls</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
