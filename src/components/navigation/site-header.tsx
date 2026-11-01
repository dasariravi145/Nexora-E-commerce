"use client";

import * as React from "react";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { DesktopNavigation } from "@/components/navigation/desktop-navigation";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { SearchModal } from "@/components/navigation/search-modal";
import { Menu, Search, ShoppingBag, Box, Command } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  className?: string;
}

/**
 * SiteHeader provides a sticky, glassmorphic header with scroll transition detection,
 * responsive mobile menu, search modal trigger, and keyboard shortcut handler.
 */
export function SiteHeader({ className }: SiteHeaderProps) {
  const { totals, openDrawer } = useCart();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Passive scroll listener for backdrop transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to trigger search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        role="banner"
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-[#09152B]/95 backdrop-blur-2xl border-b border-slate-800 shadow-lg shadow-black/30 py-2 sm:py-2.5"
            : "bg-[#09152B]/85 backdrop-blur-md border-b border-slate-800/80 py-2.5 sm:py-3.5",
          className
        )}
      >
        <SiteContainer size="xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1"
              aria-label="NEXORA Homepage"
            >
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 border border-white/20">
                <span className="tracking-tighter">N</span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-[#09152B]"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white">
                    NEXORA
                  </span>
                  <span className="hidden xs:inline-flex text-[10px] font-bold tracking-widest text-[#F2B95C] uppercase bg-[#F2B95C]/15 border border-[#F2B95C]/40 px-1.5 py-0.2 rounded font-mono shadow-xs">
                    3D
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
                  NEXT-GEN ELECTRONICS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <DesktopNavigation />

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Search Entry Point Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search electronics catalogue (Press Ctrl+K)"
                title="Search catalogue (Ctrl+K)"
                className="group min-h-[42px] min-w-[42px] sm:min-h-[44px] px-2.5 sm:px-3 inline-flex items-center justify-center gap-2 rounded-xl text-slate-300 hover:text-white bg-[#0F1D38] hover:bg-[#152548] border border-slate-700/60 hover:border-blue-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
              >
                <Search className="h-4.5 w-4.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="hidden md:inline text-xs text-slate-400 group-hover:text-slate-300">
                  Search...
                </span>
                <span className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                  <Command className="h-2.5 w-2.5" />K
                </span>
              </button>

              {/* Spatial Hardware Engine Indicator */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1D38] border border-slate-700/60 text-xs font-medium text-slate-300 select-none">
                <Box className="h-3.5 w-3.5 text-blue-400" />
                <span>Spatial Engine</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Ready" />
              </div>

              {/* Demo Cart Trigger */}
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Demo shopping cart, ${totals.itemCount} items`}
                title="View Shopping Bag"
                className="min-h-[42px] px-2.5 sm:min-h-[44px] sm:px-3.5 inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#0F1D38] hover:bg-[#152548] text-slate-200 hover:text-white border border-slate-700/60 hover:border-blue-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-blue-400" />
                <span className="hidden sm:inline text-xs font-medium">Cart</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[11px] font-bold rounded-full border transition-colors",
                    totals.itemCount > 0
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-blue-600/30 text-blue-300 border-blue-500/30"
                  )}
                >
                  {totals.itemCount}
                </span>
              </button>

              {/* Mobile Menu Hamburger Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Open mobile navigation menu"
                className="lg:hidden min-h-[42px] min-w-[42px] sm:min-h-[44px] sm:min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] border border-slate-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </SiteContainer>
      </header>

      {/* Accessible Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
