"use client";

import * as React from "react";
import { SortOption, SORT_OPTIONS } from "@/lib/catalogue-filters";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CatalogueSortSelectProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export function CatalogueSortSelect({
  value,
  onChange,
  className,
}: CatalogueSortSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="catalogue-sort-select"
        className="text-xs font-mono text-[#475569] flex items-center gap-1.5 shrink-0"
      >
        <ArrowUpDown className="h-3.5 w-3.5 text-[#2563EB]" />
        <span className="hidden xs:inline">Sort by:</span>
      </label>

      <div className="relative">
        <select
          id="catalogue-sort-select"
          aria-label="Sort product catalogue"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="h-11 pl-3 pr-8 text-xs font-mono font-medium text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 focus:bg-white appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-white text-[#0F172A]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
          <svg
            className="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
