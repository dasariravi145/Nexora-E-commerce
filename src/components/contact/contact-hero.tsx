import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowDown, MessageSquare, ShieldCheck, Mail, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactHeroProps {
  className?: string;
}

/**
 * ContactHero:
 * Section A: Premium Contact Hero.
 * Styled with midnight navy, electric blue, and violet visual hierarchy,
 * semantic breadcrumbs, primary headline, and live operational status indicators.
 */
export function ContactHero({ className }: ContactHeroProps) {
  const breadcrumbs = [{ label: "Contact Us", current: true }];

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className={cn("space-y-8 sm:space-y-10", className)}
    >
      {/* Semantic Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-[#475569]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span>Portfolio Advisory Desk (Demo)</span>
        </div>
      </div>

      {/* Hero Header & Title */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="electric" size="md" dot>
            Advisory Desk Demo
          </Badge>
          <span className="text-xs font-mono text-[#64748B]">
            Phase 4 Contact Experience
          </span>
        </div>

        <h1
          id="contact-hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]"
        >
          Connect with the <span className="gradient-text-electric">Engineering Desk</span>
        </h1>

        <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl text-pretty font-normal">
          Direct technical consultations for spatial workstation configurations, planar
          acoustic pairing, multi-specimen comparison advice, and demonstration feedback.
        </p>

        {/* Quick Anchor Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#enquiry-form"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Open Advisory Form</span>
            <ArrowDown className="h-4 w-4" />
          </a>

          <a
            href="#contact-methods"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-[#0F172A] bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-blue-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
          >
            <Mail className="h-4 w-4 text-[#2563EB]" />
            <span>Contact Channels</span>
          </a>
        </div>
      </div>

      {/* Operational Status Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#2563EB]">
            <Cpu className="h-3.5 w-3.5" />
            <span>Desk Status</span>
          </div>
          <div className="text-base font-bold text-[#0F172A]">Active Demo</div>
          <p className="text-[11px] text-[#64748B]">Direct consultation</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-purple-600">
            <Mail className="h-3.5 w-3.5" />
            <span>Protocol</span>
          </div>
          <div className="text-base font-bold text-[#0F172A]">Mailto Draft</div>
          <p className="text-[11px] text-[#64748B]">Zero backend storage</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privacy</span>
          </div>
          <div className="text-base font-bold text-[#0F172A]">Local-Only</div>
          <p className="text-[11px] text-[#64748B]">No trackers or CRM</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Oversight</span>
          </div>
          <div className="text-base font-bold text-[#0F172A]">Human Review</div>
          <p className="text-[11px] text-[#64748B]">Zero AI bot walls</p>
        </div>
      </div>
    </section>
  );
}
