"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import {
  filterAndSortProducts,
  DEFAULT_FILTER_STATE,
} from "@/lib/catalogue-filters";
import { getProductStartingPrice } from "@/lib/format";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import {
  Search,
  X,
  Command,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);
  const [query, setQuery] = React.useState("");

  if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
    setQuery("");
  } else if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
  }

  // Lock scroll and auto-focus input
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Execute real-time search query over centralized product dataset
  const { results, totalMatches } = React.useMemo(() => {
    if (!query.trim()) {
      return { results: [], totalMatches: 0 };
    }
    return filterAndSortProducts(products, {
      ...DEFAULT_FILTER_STATE,
      query,
    });
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectProduct = (slug: string) => {
    router.push(`/products/${slug}`);
    onClose();
  };

  const handleQuickSuggestion = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catalogue Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-16"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#060B1A]/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080E1E] border border-white/[0.12] shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-fadeIn flex flex-col max-h-[85vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>Catalogue Search</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
              <Command className="h-3 w-3" /> K
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center shrink-0">
          <div
            className="absolute left-3.5 flex items-center pointer-events-none text-slate-400"
            aria-hidden="true"
          >
            <Search className="h-4.5 w-4.5 text-blue-400" />
          </div>

          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Search hardware catalogue"
            placeholder="Search electronics, beryllium drivers, titanium frame..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            className="w-full h-12 pl-10 pr-20 text-sm text-white placeholder:text-slate-400 bg-[#0E1830]/90 border border-white/[0.12] rounded-xl outline-none transition-all duration-200 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:bg-[#121E3C]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {query.trim() ? (
            /* Live Search Results */
            results.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>Top matching hardware ({totalMatches} units):</span>
                  <span className="text-blue-400 font-semibold">Press Enter to view all</span>
                </div>

                <div className="space-y-1.5">
                  {results.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product.slug)}
                      className="w-full p-2.5 rounded-xl bg-[#0B1428] hover:bg-[#101D38] border border-white/[0.06] hover:border-blue-500/40 text-left transition-all duration-200 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail Visual */}
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#070D1A]">
                          <HardwareVisual
                            categorySlug={product.categorySlug}
                            productSlug={product.slug}
                            size="sm"
                            className="h-full w-full"
                          />
                        </div>

                        {/* Title & Brand */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                              {product.brand}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.2 rounded">
                              {product.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 truncate">
                            {product.name}
                          </h4>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-white">
                          {getProductStartingPrice(product).displayPrice}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* View All Matches Button */}
                <Link
                  href={`/products?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="block text-center py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-mono text-blue-300 hover:text-white transition-colors"
                >
                  Explore all {totalMatches} results in Catalogue &rarr;
                </Link>
              </div>
            ) : (
              /* No Results State */
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 mx-auto">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">No products found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No hardware in our 30-item demo collection matched &ldquo;{query}&rdquo;.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block text-xs font-mono text-blue-400 hover:underline pt-1"
                >
                  Browse all 30 products in catalogue &rarr;
                </Link>
              </div>
            )
          ) : (
            /* Default Suggestions when query is empty */
            <div className="space-y-4 py-2">
              {/* Quick Search Tags */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span>Popular Discovery Queries:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Titanium", "Planar", "Micro-OLED", "Beryllium", "Quantum", "Cybernetic"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleQuickSuggestion(term)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Hardware Divisions */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Browse by Hardware Division:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={onClose}
                      className="p-2.5 rounded-xl bg-[#0B1428] hover:bg-[#101D38] border border-white/[0.06] hover:border-blue-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-500">{cat.itemCount} units</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-white/[0.04] shrink-0 font-mono">
          <span>
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close
          </span>
          <span>NEXORA 30-Unit Centralized Discovery</span>
        </div>
      </div>
    </div>
  );
}
