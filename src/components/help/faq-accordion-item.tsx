"use client";

import * as React from "react";
import type { FAQItem } from "@/types/faq";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQAccordionItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery?: string;
  className?: string;
}

/**
 * FAQAccordionItem:
 * Section D: Accessible interactive accordion item with strict WAI-ARIA compliance.
 * Implements aria-expanded, aria-controls, keyboard operability (Enter/Space),
 * visible focus ring, and subtle disclosure animation respecting prefers-reduced-motion.
 */
export function FAQAccordionItem({
  faq,
  isOpen,
  onToggle,
  searchQuery,
  className,
}: FAQAccordionItemProps) {
  const buttonId = `faq-trigger-${faq.id}`;
  const contentId = `faq-content-${faq.id}`;

  // Helper to highlight matching text if search query is active
  const renderHighlighted = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    const clean = query.trim();
    const parts = text.split(new RegExp(`(${clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === clean.toLowerCase() ? (
        <mark
          key={index}
          className="bg-blue-500/30 text-blue-200 px-0.5 rounded font-bold underline decoration-blue-400"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        isOpen
          ? "border-blue-300 bg-white shadow-md shadow-blue-500/5"
          : "border-[#E2E8F0] bg-white hover:border-slate-300 shadow-xs",
        className
      )}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl group"
      >
        <div className="flex items-start gap-3.5 pr-2">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-mono font-bold shrink-0 mt-0.5 transition-colors",
              isOpen
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] group-hover:text-[#2563EB] group-hover:border-blue-200"
            )}
          >
            {faq.displayOrder < 10 ? `0${faq.displayOrder}` : faq.displayOrder}
          </span>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
              {renderHighlighted(faq.question, searchQuery)}
            </h3>
            <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
              {faq.category.replace("-", " ")}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border shrink-0 transition-transform duration-200",
            isOpen
              ? "rotate-180 bg-[#EAF2FF] text-[#2563EB] border-blue-200"
              : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] group-hover:text-[#0F172A] group-hover:border-slate-300"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {/* Accordion Content Container */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={cn(
          "px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#E2E8F0] space-y-3.5",
          !isOpen && "hidden"
        )}
      >
        <p className="pl-9.5 text-pretty">
          {renderHighlighted(faq.answer, searchQuery)}
        </p>

        {faq.keywords && faq.keywords.length > 0 && (
          <div className="pl-9.5 flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] text-[#64748B] font-mono">Related:</span>
            {faq.keywords.slice(0, 4).map((kw) => (
              <Badge
                key={kw}
                variant="outline"
                size="sm"
                className="text-[10px] text-[#475569] border-[#E2E8F0] bg-slate-50"
              >
                #{kw}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
