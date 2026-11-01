"use client";

import { cn } from "@/lib/utils";

export interface OfferCategoryTab {
  id: string; // "all" | categorySlug
  label: string;
  count: number;
}

interface OfferCategoryFilterProps {
  tabs: OfferCategoryTab[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export function OfferCategoryFilter({
  tabs,
  selectedCategory,
  onSelectCategory,
  className,
}: OfferCategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Promotion categories"
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isSelected = selectedCategory === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            aria-controls={`offers-panel-${tab.id}`}
            onClick={() => onSelectCategory(tab.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isSelected
                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                : "bg-[#091124] text-slate-400 border-white/[0.08] hover:text-white hover:border-white/20 hover:bg-[#0D1832]"
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                isSelected
                  ? "bg-white/20 text-white"
                  : "bg-white/[0.06] text-slate-400"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
