"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import type { HydratedCartLine } from "@/types/cart";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_CART_ITEM_QUANTITY, MIN_CART_ITEM_QUANTITY } from "@/lib/cart-state";
import { formatVariantLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface CartItemCardProps {
  line: HydratedCartLine;
  compact?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function CartItemCard({
  line,
  compact = false,
  onNavigate,
  className,
}: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, variant, item, formattedUnitPrice, formattedLineSubtotal } = line;

  const handleDecrease = () => {
    if (item.quantity <= MIN_CART_ITEM_QUANTITY) {
      removeFromCart(product.id, variant?.id);
    } else {
      updateQuantity(product.id, variant?.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < MAX_CART_ITEM_QUANTITY) {
      updateQuantity(product.id, variant?.id, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id, variant?.id);
  };

  const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) {
      updateQuantity(product.id, variant?.id, val);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-4 transition-all duration-200 hover:border-[#2563EB]/40",
        compact ? "space-y-3" : "sm:p-5 sm:flex sm:items-center sm:gap-6",
        className
      )}
    >
      {/* Top / Left: Visual & Details Container */}
      <div className={cn("flex items-start gap-3.5 min-w-0", !compact && "sm:flex-1 sm:items-center sm:gap-5")}>
        {/* Hardware Visual Thumbnail */}
        <Link
          href={`/products/${product.slug}`}
          onClick={onNavigate}
          aria-label={`View ${product.name} details`}
          className="relative shrink-0 overflow-hidden rounded-xl bg-[#09152B] border border-slate-700 p-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className={cn(compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24")}>
            <HardwareVisual
              categorySlug={product.categorySlug}
              productSlug={product.slug}
              size="sm"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Product & Variant Identity */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
            <span className="text-[#2563EB] font-semibold uppercase">{product.brand}</span>
            <span>•</span>
            <span className="truncate">{product.category}</span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="block group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover/link:text-[#2563EB] transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {/* Variant Specification Details (if selected) */}
          {variant && (
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <Badge variant="subtle" size="sm" className="font-mono text-[10px] py-0 px-1.5 bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]">
                {variant.colorHex && (
                  <span
                    className="inline-block h-2 w-2 rounded-full mr-1 ring-1 ring-black/10"
                    style={{ backgroundColor: variant.colorHex }}
                    aria-hidden="true"
                  />
                )}
                <span>{formatVariantLabel(variant)}</span>
              </Badge>
            </div>
          )}

          {/* Unit Demo Price Tag */}
          <div className="text-xs font-mono text-[#475569] pt-0.5">
            <span className="font-semibold text-[#0F172A]">{formattedUnitPrice}</span>
            <span className="text-[#64748B] text-[11px]"> / unit</span>
          </div>
        </div>
      </div>

      {/* Controls & Line Subtotal Row */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]",
          !compact && "sm:pt-0 sm:border-t-0 sm:flex-col sm:items-end sm:gap-2 sm:shrink-0"
        )}
      >
        {/* Quantity Controls */}
        <div className="flex items-center gap-1.5">
          <div
            role="group"
            aria-label={`Quantity selector for ${product.name}`}
            className="inline-flex items-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-0.5"
          >
            <button
              type="button"
              onClick={handleDecrease}
              aria-label={
                item.quantity === 1
                  ? `Remove ${product.name} from bag`
                  : `Decrease quantity of ${product.name} to ${item.quantity - 1}`
              }
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 active:scale-95"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <input
              type="number"
              min={MIN_CART_ITEM_QUANTITY}
              max={MAX_CART_ITEM_QUANTITY}
              value={item.quantity}
              onChange={handleDirectChange}
              aria-label={`Quantity of ${product.name}`}
              className="w-10 h-8 text-center text-xs font-mono font-bold text-[#0F172A] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              type="button"
              onClick={handleIncrease}
              disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
              aria-label={`Increase quantity of ${product.name} to ${item.quantity + 1}`}
              className={cn(
                "h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#475569] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
                item.quantity >= MAX_CART_ITEM_QUANTITY
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-[#0F172A] hover:bg-slate-200/60 active:scale-95"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Line Subtotal */}
        <div className="text-right">
          <span className="block text-[10px] font-mono uppercase text-[#64748B] sm:hidden">
            Subtotal
          </span>
          <span className="text-sm sm:text-base font-extrabold text-[#0F172A] font-mono tracking-tight">
            {formattedLineSubtotal}
          </span>
        </div>
      </div>
    </div>
  );
}
