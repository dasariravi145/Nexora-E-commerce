"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CatalogueSearchBarProps {
  value: string;
  onChange: (query: string) => void;
  resultCount: number;
  totalProducts: number;
  isLoading?: boolean;
  className?: string;
}

export function CatalogueSearchBar({
  value,
  onChange,
  resultCount,
  totalProducts,
  isLoading = false,
  className,
}: CatalogueSearchBarProps) {
  const [prevValue, setPrevValue] = React.useState(value);
  const [localQuery, setLocalQuery] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync external value changes during render (per React official recommendation)
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalQuery(value);
  }

  // Debounced notification to parent
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== value) {
        onChange(localQuery);
      }
    }, 180);

    return () => clearTimeout(handler);
  }, [localQuery, value, onChange]);

  const handleClear = () => {
    setLocalQuery("");
    onChange("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (localQuery) {
        handleClear();
      }
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        {/* Leading Search Icon */}
        <div
          className="absolute left-3.5 flex items-center pointer-events-none text-slate-400"
          aria-hidden="true"
        >
          {isLoading ? (
            <Loader2 className="h-4.5 w-4.5 text-blue-400 animate-spin" />
          ) : (
            <Search className="h-4.5 w-4.5 text-blue-400" />
          )}
        </div>

        {/* Search Input Box */}
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          aria-label="Search hardware by name, brand, specifications, or features"
          placeholder="Search products by model, titanium frame, planar drivers, chip..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          className="w-full h-11 pl-10 pr-24 text-sm text-[#0F172A] placeholder:text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
        />

        {/* Trailing Controls: Clear Action & Count Badge */}
        <div className="absolute right-2 flex items-center gap-1.5">
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <span
            className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#EAF2FF] border border-[#2563EB]/25 text-[11px] font-mono text-[#2563EB] font-medium"
            aria-live="polite"
          >
            {resultCount}/{totalProducts}
          </span>
        </div>
      </div>
    </div>
  );
}
