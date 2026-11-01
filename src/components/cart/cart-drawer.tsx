"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { CartEmpty } from "@/components/cart/cart-empty";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingBag, ArrowRight, ShieldAlert, Mail } from "lucide-react";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, cartLines, totals } = useCart();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Background scroll lock when drawer is active
  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  // Escape key listener to close drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo Shopping Cart Drawer"
      className="fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-[#060B1A]/85 backdrop-blur-md animate-fadeIn"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#081024] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#060B1A]/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Specimen Bag</h3>
                <Badge variant="electric" size="sm">
                  {totals.itemCount} {totals.itemCount === 1 ? "unit" : "units"}
                </Badge>
              </div>
              <p className="text-[11px] font-mono text-slate-400">Demo Assessment Cart</p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartLines.length === 0 ? (
            <div className="py-8">
              <CartEmpty onNavigate={closeDrawer} />
            </div>
          ) : (
            cartLines.map((line) => (
              <CartItemCard
                key={`${line.product.id}::${line.variant?.id || "default"}`}
                line={line}
                compact
                onNavigate={closeDrawer}
              />
            ))
          )}
        </div>

        {/* Drawer Footer with Subtotal & Actions (if items exist) */}
        {cartLines.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#060C1B] space-y-4">
            {/* Subtotal strip */}
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Demo Subtotal:</span>
              <span className="text-xl font-extrabold text-white font-sans tracking-tight">
                {totals.formattedSubtotal}
              </span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Link
                href="/contact?source=cart"
                onClick={closeDrawer}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Mail className="h-4 w-4" />
                <span>Request Product Enquiry</span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={closeDrawer} className="w-full">
                  <PremiumButton
                    variant="ghost"
                    size="md"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    className="w-full text-xs font-semibold justify-center border border-white/10"
                  >
                    View Cart
                  </PremiumButton>
                </Link>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full h-11 px-3 rounded-xl font-medium text-xs text-slate-300 hover:text-white bg-[#0E1830] hover:bg-[#132244] border border-white/[0.08] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Continue Browsing
                </button>
              </div>
            </div>

            {/* Mini notice */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 justify-center">
              <ShieldAlert className="h-3 w-3 text-blue-400" />
              <span>Simulated demo checkout • No live charges</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
