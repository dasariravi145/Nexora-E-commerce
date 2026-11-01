"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Menu, Search, ShoppingBag, Box } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#060B1A]/95 backdrop-blur-2xl border-b border-white/[0.1] shadow-lg shadow-black/30"
          : "bg-[#060B1A]/75 backdrop-blur-md border-b border-white/[0.06]"
      }`}
    >
      <Container size="xl">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            aria-label="NEXORA Homepage"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-purple-600 text-white font-extrabold text-lg shadow-lg shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 border border-white/20">
              <span className="tracking-tighter">N</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-[#060B1A]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  NEXORA
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-semibold tracking-widest text-blue-400 uppercase bg-blue-950/60 border border-blue-500/30 px-1.5 py-0.2 rounded">
                  3D
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
                NEXT-GEN ELECTRONICS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-animated relative px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-1.5 inline-block align-middle">
                    <Badge
                      variant={item.badge === "Exclusive" ? "violet" : "electric"}
                      size="sm"
                    >
                      {item.badge}
                    </Badge>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Placeholder Trigger */}
            <button
              type="button"
              aria-label="Search catalog"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Search catalog (Available in Phase 2)"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* 3D Hardware Mode Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/[0.08] text-xs font-medium text-slate-300">
              <Box className="h-3.5 w-3.5 text-blue-400" />
              <span>Spatial Engine</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Engine Ready" />
            </div>

            {/* Demo Cart Trigger */}
            <Link
              href="/cart"
              aria-label="Shopping Cart - 0 items"
              className="min-h-[44px] px-3.5 inline-flex items-center gap-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.08] hover:border-blue-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-blue-400" />
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
              <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30">
                0
              </span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Open mobile navigation menu"
              className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Responsive Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
