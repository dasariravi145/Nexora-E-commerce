"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartEmpty } from "@/components/cart/cart-empty";
import { ArrowLeft, ShoppingBag, RotateCcw, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartViewProps {
  className?: string;
}

export function CartView({ className }: CartViewProps) {
  const { cartLines, totals, isHydrated, clearCart } = useCart();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shopping Bag", current: true },
  ];

  // Placeholder while local storage hydrates to avoid layout shift / flash
  if (!isHydrated) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="h-10 w-10 mx-auto rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Hydrating persistent specimen bag...
        </p>
      </div>
    );
  }

  const isEmpty = cartLines.length === 0;

  return (
    <div className={cn("space-y-8 sm:space-y-12", className)}>
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Catalogue</span>
          </Link>

          {!isEmpty && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#F8FAFC] hover:bg-slate-100 text-[#475569] hover:text-red-600 border border-[#E2E8F0] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Bag</span>
            </button>
          )}
        </div>
      </div>

      {/* Cart Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge variant="electric" size="md">
            Demonstration Cart
          </Badge>
          <span className="text-xs font-mono text-[#475569]">
            Phase 5 Ecommerce Integration
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Specimen <span className="gradient-text-electric">Shopping Bag</span>
          </h1>

          {!isEmpty && (
            <span className="text-xs sm:text-sm font-mono text-[#475569]">
              {totals.lineCount} {totals.lineCount === 1 ? "Line Item" : "Line Items"} •{" "}
              {totals.itemCount} {totals.itemCount === 1 ? "Unit" : "Units"}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#475569] max-w-2xl text-pretty leading-relaxed">
          Manage staged hardware configurations, adjust evaluation quantities, and review
          accurate INR demo totals derived from our centralized 30-specimen catalogue.
        </p>
      </div>

      {/* Main Body */}
      {isEmpty ? (
        <div className="py-6 sm:py-10">
          <CartEmpty />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold">
                Configured Hardware Specimens ({cartLines.length})
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                Persistent local state
              </span>
            </div>

            <div className="space-y-3">
              {cartLines.map((line) => (
                <CartItemCard
                  key={`${line.product.id}::${line.variant?.id || "default"}`}
                  line={line}
                />
              ))}
            </div>

            {/* Hardware Telemetry Note */}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between text-xs font-mono text-[#475569]">
              <span className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Centralized catalogue integrity verified</span>
              </span>
              <span>All 30 units synced</span>
            </div>
          </div>

          {/* Right Column: Order Summary Panel */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <CartSummary />
          </div>
        </div>
      )}

      {/* Bottom Assurances Bar */}
      <div className="pt-8 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#475569]">
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[#2563EB] font-bold">
            <ShoppingBag className="h-4 w-4" />
            <span>Persistent Staging</span>
          </div>
          <p className="text-[11px] text-[#475569]">
            Retained in your browser across sessions using safe local schema versioning.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Client-Side Isolation</span>
          </div>
          <p className="text-[11px] text-[#475569]">
            No telemetry, cookies, or remote server storage required for cart staging.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Cpu className="h-4 w-4" />
            <span>Catalogue Grounded</span>
          </div>
          <p className="text-[11px] text-[#475569]">
            All prices and specifications are pulled directly from our genuine 30-specimen data.
          </p>
        </div>
      </div>
    </div>
  );
}
