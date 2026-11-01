"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent background scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
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
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#060B1A]/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0A1226] border-l border-white/[0.08] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideInRight">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/30">
                N
              </span>
              <span className="font-bold tracking-wider text-white text-base">
                NEXORA
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav aria-label="Mobile Links" className="space-y-1">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 font-medium text-base transition-colors"
              >
                <span>{item.title}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant={item.badge === "Exclusive" ? "violet" : "electric"} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom CTA / Cart Info */}
        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between min-h-[48px] w-full px-4 py-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-300 font-medium text-sm hover:bg-blue-600/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-blue-400" />
              <span>Demo Cart</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-xs text-blue-300 font-semibold">
              0 items
            </span>
          </Link>

          <div className="p-3.5 rounded-xl bg-[#0E1830] border border-white/[0.06] text-xs text-slate-400 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <p>
              Phase 1 Architecture active. Interactive 3D product viewports & spatial computing arriving in upcoming prompts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
