import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { ShoppingBag, ArrowRight, Sparkles, Scale, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartEmptyProps {
  className?: string;
  onNavigate?: () => void;
}

export function CartEmpty({ className, onNavigate }: CartEmptyProps) {
  return (
    <Card
      variant="solid"
      className={cn(
        "p-8 sm:p-12 md:p-16 text-center space-y-6 max-w-2xl mx-auto border-[#E2E8F0] bg-white shadow-sm relative overflow-hidden",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating empty bag icon */}
      <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF2FF] border border-blue-200 text-[#2563EB] mx-auto shadow-sm">
        <ShoppingBag className="h-10 w-10" />
        <span
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB] text-[10px] text-white font-bold"
          aria-hidden="true"
        >
          0
        </span>
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Your Specimen Bag is Empty
        </h3>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed text-pretty">
          No hardware specimens have been staged for demonstration assessment. Explore
          our 30-unit catalogue to configure spatial computing rigs, acoustic monitors,
          and biometric wearables.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
        <Link href="/products" onClick={onNavigate}>
          <PremiumButton
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto font-bold"
          >
            Explore 30 Catalogue Products
          </PremiumButton>
        </Link>

        <Link href="/compare" onClick={onNavigate}>
          <PremiumButton
            variant="outline"
            size="md"
            leftIcon={<Scale className="h-4 w-4 text-purple-600" />}
            className="w-full sm:w-auto text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50"
          >
            Compare Specimens
          </PremiumButton>
        </Link>
      </div>

      {/* Helpful links strip */}
      <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B] relative z-10">
        <Link
          href="/categories"
          onClick={onNavigate}
          className="hover:text-[#2563EB] transition-colors flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3 text-[#2563EB]" />
          <span>6 Hardware Divisions</span>
        </Link>
        <span>•</span>
        <Link
          href="/help"
          onClick={onNavigate}
          className="hover:text-[#2563EB] transition-colors flex items-center gap-1"
        >
          <HelpCircle className="h-3 w-3 text-purple-600" />
          <span>Customer Help Center</span>
        </Link>
      </div>
    </Card>
  );
}
