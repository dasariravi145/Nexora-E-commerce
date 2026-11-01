"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NavigationLink } from "@/components/navigation/navigation-link";
import { useCart } from "@/context/cart-context";
import { X, ShoppingBag, Box, Search, ArrowRight } from "lucide-react";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

/**
 * MobileNavigation drawer engineered specifically for small screens from 320px upwards.
 * Features focus trapping, background scroll lock, escape listener, and smooth CSS transitions.
 */
export function MobileNavigation({
  isOpen,
  onClose,
  onOpenSearch,
}: MobileNavigationProps) {
  const { totals } = useCart();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Background scroll handling
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus close button for keyboard users
      setTimeout(() => closeButtonRef.current?.focus(), 50);
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden overflow-hidden"
    >
      {/* Backdrop with transition */}
      <div
        className="fixed inset-0 bg-[#060B1A]/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel: 88vw width on small mobile leaves backdrop visible; max-w-sm on tablet */}
      <div className="fixed inset-y-0 right-0 w-[88vw] max-w-[320px] sm:max-w-sm bg-[#09152B] border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight p-4 sm:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/30">
                N
              </span>
              <span className="font-extrabold tracking-wider text-white text-base">
                NEXORA
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Search Launcher Button for Mobile */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="flex items-center justify-between w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0F1D38] border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-500/40 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" />
                <span>Search electronics...</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                Search
              </span>
            </button>
          )}

          {/* Mobile Navigation Links */}
          <nav aria-label="Mobile Navigation Links" className="space-y-1">
            {siteConfig.navItems.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                title={item.title}
                badge={item.badge}
                onClick={onClose}
                variant="mobile"
              />
            ))}
          </nav>
        </div>

        {/* Footer actions inside drawer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/cart"
            onClick={onClose}
            aria-label={`Demo shopping cart, ${totals.itemCount} items`}
            className="flex items-center justify-between min-h-[48px] w-full px-4 py-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-300 font-medium text-sm hover:bg-blue-600/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-blue-400" />
              <span>Demo Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-xs text-blue-300 font-semibold font-mono">
                {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </Link>

          <div className="p-3 rounded-xl bg-[#0F1D38] border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
            <Box className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>Spatial 3D Engine ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
