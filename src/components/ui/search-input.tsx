"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, Sparkles } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  showStatusHint?: boolean;
}

/**
 * SearchInput shell provides keyboard navigation, clear action,
 * accessible ARIA labels, and informative status messaging for Phase 1.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      placeholder = "Search electronics, spatial displays, audio...",
      onSearch,
      onClear,
      onClose,
      showStatusHint = true,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = React.useState("");
    const internalInputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => internalInputRef.current as HTMLInputElement);

    const handleClear = () => {
      setQuery("");
      if (onClear) onClear();
      internalInputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        if (query) {
          handleClear();
        } else if (onClose) {
          onClose();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (onSearch) onSearch(val);
    };

    return (
      <div className="w-full space-y-2">
        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <div
            className="absolute left-3.5 flex items-center pointer-events-none text-slate-400"
            aria-hidden="true"
          >
            <Search className="h-4.5 w-4.5 text-blue-400" />
          </div>

          {/* Accessible Input */}
          <input
            ref={internalInputRef}
            type="search"
            role="searchbox"
            aria-label="Search electronics catalogue"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
            className={cn(
              "w-full h-11 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 bg-[#0E1830]/90 border border-white/[0.12] rounded-xl outline-none transition-all duration-200 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:bg-[#121E3C]",
              className
            )}
            {...props}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Phase 1 Informational Status (No Fake Results) */}
        {showStatusHint && query && (
          <div
            role="status"
            aria-live="polite"
            className="p-3 rounded-xl bg-[#0A1226] border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5 animate-fadeIn"
          >
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Search Interface Shell Active</p>
              <p className="text-slate-400 mt-0.5">
                Query received: &ldquo;<span className="text-blue-300 font-mono">{query}</span>&rdquo;. Full catalogue indexing and filtering will connect in Phase 2 (Shopping Experience).
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
