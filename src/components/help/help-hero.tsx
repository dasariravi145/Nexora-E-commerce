import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import {
  HelpCircle,
  Search,
  BookOpen,
  Mail,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpHeroProps {
  className?: string;
}

/**
 * HelpHero:
 * Section A: Premium Help Center hero with midnight navy background,
 * electric blue and violet atmospheric accents, semantic breadcrumb,
 * and live capability indicators.
 */
export function HelpHero({ className }: HelpHeroProps) {
  return (
    <section
      aria-labelledby="help-hero-heading"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-blue-200 bg-[#EAF2FF] p-6 sm:p-10 md:p-14 shadow-sm",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="relative z-10 space-y-6 sm:space-y-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#475569]">
          <Link
            href="/"
            className="hover:text-[#0F172A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-[#0F172A] font-medium" aria-current="page">
            Help Center & FAQ
          </span>
        </nav>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="electric" size="sm" className="gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              Customer Knowledge Hub
            </Badge>
            <Badge variant="outline" size="sm" className="text-[#475569] border-[#E2E8F0] bg-white">
              Frontend Demo Storefront
            </Badge>
          </div>

          <h1
            id="help-hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] leading-[1.15]"
          >
            Help Center &{" "}
            <span className="text-[#2563EB]">
              Customer Guidance
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#475569] max-w-2xl leading-relaxed text-pretty">
            Verified documentation, searchable answers, and step-by-step guidance for navigating
            NEXORA’s 30-specimen catalogue, interactive 3D WebGL viewer, comparison matrix, and client enquiry handoff.
          </p>
        </div>

        {/* Quick Jump Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a href="#faq-search">
            <PremiumButton variant="primary" size="md" leftIcon={<Search className="h-4 w-4" />}>
              Search Knowledge Base
            </PremiumButton>
          </a>
          <a href="#customer-guidance">
            <PremiumButton variant="outline" size="md" leftIcon={<BookOpen className="h-4 w-4 text-[#2563EB]" />} className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50">
              Interactive Guides
            </PremiumButton>
          </a>
          <Link href="/contact">
            <PremiumButton variant="ghost" size="md" leftIcon={<Mail className="h-4 w-4 text-[#475569]" />} className="text-[#475569] hover:text-[#0F172A]">
              Contact Advisory Desk
            </PremiumButton>
          </Link>
        </div>

        {/* Operational Telemetry Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2563EB] border border-blue-200 shadow-xs">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">8 Disciplines</div>
              <div className="text-[11px] text-[#64748B]">Categorized Topics</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-purple-600 border border-purple-200 shadow-xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">23 Answers</div>
              <div className="text-[11px] text-[#64748B]">Authentic Knowledge</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 border border-emerald-200 shadow-xs">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">3D & Compare</div>
              <div className="text-[11px] text-[#64748B]">Step-by-step Guides</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-amber-600 border border-amber-200 shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">Zero Fabrication</div>
              <div className="text-[11px] text-[#64748B]">Honest Demo Charter</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
