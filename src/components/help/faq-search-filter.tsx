"use client";

import * as React from "react";
import type { FAQCategory } from "@/types/faq";
import { faqCategories, searchFAQs, faqs } from "@/data/faqs";
import { FAQAccordionItem } from "./faq-accordion-item";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import {
  Search,
  X,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Grid,
  Scale,
  Box,
  Tag,
  Mail,
  Info,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "getting-started": Compass,
  "product-browsing": Grid,
  "search-filters": Search,
  "product-comparison": Scale,
  "3d-viewer": Box,
  "demo-offers": Tag,
  "contact-enquiry": Mail,
  "about-nexora": Info,
};

export interface FAQSearchFilterProps {
  className?: string;
  initialCategory?: FAQCategory | "all";
}

/**
 * FAQSearchFilter:
 * Integrates Section B (FAQ search input), Section C (Help topic category selector),
 * and Section D (Frequently asked questions accordion list).
 * Features real-time client-side search, category filtering, result counter,
 * accessible empty state, and expand/collapse controls.
 */
export function FAQSearchFilter({
  className,
  initialCategory = "all",
}: FAQSearchFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<FAQCategory | "all">(initialCategory);
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set([faqs[0].id]));

  // Reactive filtering
  const filteredFAQs = React.useMemo(() => {
    return searchFAQs(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(filteredFAQs.map((f) => f.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setOpenIds(new Set([faqs[0].id]));
  };

  // Calculate counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length };
    faqCategories.forEach((cat) => {
      counts[cat.id] = faqs.filter((f) => f.category === cat.id).length;
    });
    return counts;
  }, []);

  return (
    <section
      id="faq-search"
      aria-labelledby="faq-search-heading"
      className={cn("space-y-8 scroll-mt-24", className)}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="electric" size="sm">
            Interactive Knowledge Base
          </Badge>
          <h2
            id="faq-search-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
          >
            Search Questions & Topics
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
            Query across answers, topics, technical keywords, and operational disclosures.
          </p>
        </div>

        {/* Global Expand / Collapse Control */}
        {filteredFAQs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="text-xs font-semibold text-[#0F172A] hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 shadow-xs"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-xs font-semibold text-[#0F172A] hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 shadow-xs"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* Section B: Search Input Bar */}
      <div className="relative">
        <label htmlFor="faq-search-input" className="sr-only">
          Search frequently asked questions and help topics
        </label>
        <div className="relative flex items-center">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 h-5 w-5 text-[#94A3B8]"
          />
          <input
            id="faq-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword (e.g. '3D viewer', 'compare', 'checkout', 'orders')..."
            className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-12 pr-12 py-3.5 sm:py-4 text-sm text-[#0F172A] placeholder-[#94A3B8] shadow-xs transition-colors focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-[#0F172A] hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Section C: Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#2563EB]" />
            Filter by Topic Discipline:
          </span>
          <span aria-live="polite" className="font-mono text-[#475569]">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? "answer" : "answers"} displayed
          </span>
        </div>

        <div
          role="tablist"
          aria-label="FAQ Category Filter"
          className="flex flex-wrap items-center gap-2"
        >
          {/* All Topics Pill */}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              activeCategory === "all"
                ? "bg-[#2563EB] text-white border-blue-600 shadow-sm"
                : "bg-white text-[#475569] border-[#E2E8F0] hover:border-slate-300 hover:text-[#0F172A] shadow-xs"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            All Topics
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-mono",
                activeCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-[#475569]"
              )}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Individual Category Pills */}
          {faqCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || HelpCircle;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isSelected
                    ? "bg-[#2563EB] text-white border-blue-600 shadow-sm"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:border-slate-300 hover:text-[#0F172A] shadow-xs"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.name}
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-mono",
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-[#475569]"
                  )}
                >
                  {categoryCounts[cat.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Search & Category Feedback Bar */}
      {(searchQuery || activeCategory !== "all") && (
        <div className="flex items-center justify-between rounded-xl bg-[#EAF2FF] border border-blue-200 px-4 py-2.5 text-xs text-[#0F172A]">
          <div className="flex items-center gap-2">
            <span>
              Showing results for{" "}
              {searchQuery && (
                <span className="font-bold text-[#0F172A]">&ldquo;{searchQuery}&rdquo;</span>
              )}
              {searchQuery && activeCategory !== "all" && " in "}
              {activeCategory !== "all" && (
                <span className="font-bold text-[#2563EB] uppercase tracking-wider">
                  [{activeCategory.replace("-", " ")}]
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Section D: Accordion Items List */}
      {filteredFAQs.length > 0 ? (
        <div className="space-y-3" role="region" aria-label="FAQ Questions List">
          {filteredFAQs.map((faq) => (
            <FAQAccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openIds.has(faq.id)}
              onToggle={() => handleToggle(faq.id)}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div
          role="status"
          className="flex flex-col items-center justify-center p-10 sm:p-14 text-center rounded-3xl border border-[#E2E8F0] bg-white space-y-4 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
              No matching knowledge base entries
            </h3>
            <p className="text-xs sm:text-sm text-[#475569]">
              No answers matched &ldquo;{searchQuery}&rdquo; within the selected topic discipline.
              Try broader search terms or reset the active filters.
            </p>
          </div>
          <PremiumButton
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5 text-[#2563EB]" />}
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
          >
            Reset All Filters
          </PremiumButton>
        </div>
      )}
    </section>
  );
}
