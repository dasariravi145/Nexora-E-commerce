"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import {
  ShieldAlert,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Info,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartSummaryProps {
  className?: string;
  onNavigate?: () => void;
}

export function CartSummary({ className, onNavigate }: CartSummaryProps) {
  const { totals, clearCart, items } = useCart();
  const [showCheckoutNotice, setShowCheckoutNotice] = React.useState(false);

  const handleSimulatedCheckout = () => {
    setShowCheckoutNotice(true);
  };

  return (
    <Card
      variant="solid"
      className={cn(
        "p-6 sm:p-7 space-y-6 border-[#E2E8F0] bg-white shadow-sm relative overflow-hidden",
        className
      )}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
            Order Assessment Summary
          </h3>
          <p className="text-xs text-[#475569]">
            Real-time calculation from verified catalogue prices
          </p>
        </div>
        <Badge variant="electric" size="sm">
          Demo Storefront
        </Badge>
      </div>

      {/* Quantitative Metrics */}
      <div className="space-y-3 text-xs font-mono">
        <div className="flex items-center justify-between text-[#475569]">
          <span>Unique Catalogue Lines</span>
          <span className="font-bold text-[#0F172A]">{totals.lineCount}</span>
        </div>

        <div className="flex items-center justify-between text-[#475569]">
          <span>Total Specimen Quantity</span>
          <span className="font-bold text-[#0F172A]">{totals.itemCount} units</span>
        </div>

        <div className="flex items-center justify-between text-[#475569]">
          <span>Taxes &amp; Delivery</span>
          <span className="text-[#64748B]">₹0 (Demo simulation)</span>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex items-baseline justify-between">
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#475569] font-sans font-semibold">
              Estimated Total (INR)
            </span>
            <span className="text-[11px] text-[#64748B] font-sans">
              Base demo pricing without fabricated fees
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-sans">
            {totals.formattedSubtotal}
          </span>
        </div>
      </div>

      {/* Demonstration Checkout Limitation Notice */}
      <div
        role="status"
        aria-live="polite"
        className="p-4 rounded-xl bg-[#EAF2FF] border border-blue-200 space-y-2 text-xs text-[#0F172A]"
      >
        <div className="flex items-center gap-2 text-[#2563EB] font-bold">
          <Info className="h-4 w-4 shrink-0" />
          <span>Demonstration Storefront Charter</span>
        </div>
        <p className="text-[#475569] leading-relaxed text-pretty">
          NEXORA is an exploratory portfolio demonstration. Commercial checkout, live
          gateway transactions, payment capture, and order fulfillment are intentionally
          disabled.
        </p>
      </div>

      {/* Simulated Checkout Feedback (if clicked) */}
      {showCheckoutNotice && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-950 animate-fadeIn"
        >
          <div className="flex items-center gap-2 text-purple-700 font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Simulated Checkout Evaluated</span>
          </div>
          <p className="text-purple-800 leading-relaxed">
            Your {totals.itemCount} specimen selection totalling {totals.formattedSubtotal} was
            validated. In accordance with zero-fabrication standards, no mock order IDs or fake
            shipping timelines will be generated.
          </p>
        </div>
      )}

      {/* Primary Actions */}
      <div className="space-y-3 pt-1">
        {totals.lineCount > 0 ? (
          <Link
            href="/contact?source=cart"
            onClick={onNavigate}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-center"
          >
            <Mail className="h-4 w-4" />
            <span>Request Product Enquiry</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
          >
            <Mail className="h-4 w-4" />
            <span>Request Product Enquiry</span>
          </button>
        )}

        <PremiumButton
          type="button"
          variant="outline"
          size="md"
          onClick={handleSimulatedCheckout}
          leftIcon={<ShoppingBag className="h-3.5 w-3.5 text-[#2563EB]" />}
          className="w-full text-center justify-center text-xs text-[#0F172A] hover:bg-slate-50 border-[#E2E8F0]"
        >
          Evaluate Simulated Checkout
        </PremiumButton>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href="/products"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            <span>Continue Catalogue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Empty Bag</span>
            </button>
          )}
        </div>
      </div>

      {/* Guarantee & Privacy Assurances */}
      <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-[#2563EB]" />
          <span>Local Storage Only</span>
        </span>
        <span>Zero Payment Capture</span>
      </div>
    </Card>
  );
}
