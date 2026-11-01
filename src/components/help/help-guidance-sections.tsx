import * as React from "react";
import Link from "next/link";
import { customerGuides } from "@/data/faqs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Box,
  Scale,
  Mail,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDE_ICONS: Record<string, React.ElementType> = {
  Search,
  Box,
  Scale,
  Mail,
};

export interface HelpGuidanceSectionsProps {
  className?: string;
}

/**
 * HelpGuidanceSections:
 * Implements Sections E, F, G, and H:
 * Practical, genuine customer guidance for:
 * - Product discovery & catalogue filters (/products)
 * - Interactive 3D product inspection (/products/nexora-nova-1-pro)
 * - Multi-parametric product comparison (/compare)
 * - Technical enquiry submission (/contact)
 */
export function HelpGuidanceSections({ className }: HelpGuidanceSectionsProps) {
  return (
    <section
      id="customer-guidance"
      aria-labelledby="customer-guidance-heading"
      className={cn("space-y-8 scroll-mt-24", className)}
    >
      <div className="space-y-2">
        <Badge variant="violet" size="sm">
          Interactive Operational Walkthroughs
        </Badge>
        <h2
          id="customer-guidance-heading"
          className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
        >
          Customer Guidance & Feature Tutorials
        </h2>
        <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
          Direct, practical tutorials explaining how to use NEXORA&apos;s implemented storefront capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customerGuides.map((guide) => {
          const Icon = GUIDE_ICONS[guide.iconName] || BookOpen;

          return (
            <Card
              key={guide.id}
              variant="solid"
              className="p-6 sm:p-7 space-y-6 bg-white border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#2563EB] border border-blue-200 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                        {guide.title}
                      </h3>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {guide.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                  {guide.summary}
                </p>

                {/* Step-by-step checklist */}
                <div className="space-y-3 pt-2">
                  {guide.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF2FF] text-[#2563EB] text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[#0F172A]">
                          {step.title}
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#475569] leading-normal">
                          {step.description}
                        </p>
                        {step.href && (
                          <div className="pt-1">
                            <Link
                              href={step.href}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:text-blue-700 hover:underline"
                            >
                              <span>{step.actionLabel || "Open feature"}</span>
                              <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
