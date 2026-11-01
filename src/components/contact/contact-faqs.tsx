import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactConfig } from "@/config/contact";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactFAQsProps {
  className?: string;
}

/**
 * ContactFAQs:
 * Section F: Frequently Asked Contact Questions.
 * Directly clarifies common customer and evaluator inquiries regarding
 * demonstration status, zero-purchase scope, mailto handoff, and privacy.
 */
export function ContactFAQs({ className }: ContactFAQsProps) {
  return (
    <section
      id="contact-faqs"
      aria-labelledby="contact-faqs-heading"
      className={cn("space-y-6 sm:space-y-8", className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="electric" size="sm">
            Knowledge Base
          </Badge>
          <h2
            id="contact-faqs-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
          >
            Frequently Asked Consultation Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
            Quick clarity on store architecture, demonstration economics, and advisory procedures.
          </p>
        </div>
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors shrink-0"
        >
          <span>Visit Full Help Center</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {contactConfig.faqs.map((faq, index) => (
          <Card
            key={faq.id}
            variant="solid"
            className="p-5 sm:p-6 space-y-3 bg-white border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2FF] text-[#2563EB] border border-blue-200 shrink-0 mt-0.5 font-mono text-xs font-bold">
                0{index + 1}
              </span>
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                  {faq.answer}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
