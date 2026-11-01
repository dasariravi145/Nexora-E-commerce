"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Cpu,
  ShoppingBag,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { getProductById } from "@/data/products";
import { formatINR } from "@/lib/format";
import { useOptionalCart } from "@/context/cart-context";
import { MAX_CART_ITEM_QUANTITY } from "@/lib/cart-state";

export type CardWorkflowState =
  | "DEFAULT"
  | "PENDING_CONFIRMATION"
  | "CONFIRMED_ADDITION"
  | "SUCCESS"
  | "ERROR";

export interface ProductRecommendationCardProps {
  product: Product;
  onNavigate?: () => void;
}

/**
 * Verified Product Recommendation Card with Safe AI Cart Assistance.
 *
 * Implements strict two-step confirmation workflow:
 * DEFAULT -> PENDING_CONFIRMATION -> CONFIRMED_ADDITION -> SUCCESS
 *
 * Security & Integrity Guarantees:
 * - Product canonical verification before confirmation AND before mutation.
 * - Pricing derived strictly from centralized catalogue, ignoring untrusted model text.
 * - Initial "Add to Bag" click triggers ZERO cart mutations.
 * - Explicit "Confirm Add" executes mutation with re-verified product and variant.
 * - Cancellation resets to DEFAULT with ZERO cart mutations.
 * - Enforces maximum quantity of 10 and prevents rapid duplicate additions.
 */
export function ProductRecommendationCard({
  product,
  onNavigate,
}: ProductRecommendationCardProps) {
  const cart = useOptionalCart();

  // Canonical resolution: only verified products from local catalogue are accepted
  const canonicalProduct = product?.id ? getProductById(product.id) : undefined;

  const variants = React.useMemo(
    () => canonicalProduct?.variants || [],
    [canonicalProduct]
  );
  const hasVariants = variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = React.useState<string>("");
  const [workflowState, setWorkflowState] = React.useState<CardWorkflowState>("DEFAULT");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // Resolve active selected variant safely: user selection if valid, or default to variant in cart (if any), or first variant
  const selectedVariant: ProductVariant | undefined = React.useMemo(() => {
    if (!hasVariants) return undefined;
    if (selectedVariantId) {
      const matched = variants.find((v) => v.id === selectedVariantId);
      if (matched) return matched;
    }
    const inCart = variants.find((v) =>
      cart?.items.some(
        (item) => item.productId === canonicalProduct?.id && item.variantId === v.id
      )
    );
    if (inCart) return inCart;
    return variants[0];
  }, [hasVariants, selectedVariantId, variants, cart?.items, canonicalProduct?.id]);

  const activeVariantId = selectedVariant?.id || "";

  // Unverified / Hallucinated product protection:
  // If product is not in the canonical catalogue, render informative chip with zero cart actions
  if (!canonicalProduct) {
    return (
      <div
        className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg bg-amber-50/70 border border-amber-200 text-left shadow-2xs"
        role="alert"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-md bg-amber-900 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
          </span>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-amber-950 truncate block">
              {product?.name || "Unverified Specimen"}
            </span>
            <span className="text-[10px] text-amber-700">
              Unverified in catalogue • Cart actions disabled
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Derive verified demo price dynamically (base + variant delta)
  const verifiedPrice = canonicalProduct.demoPrice + (selectedVariant?.demoPriceDelta ?? 0);
  const formattedVerifiedPrice = formatINR(verifiedPrice);

  // Derive current quantity in cart for this product + variant configuration
  const currentCartItem = cart?.items.find(
    (item) =>
      item.productId === canonicalProduct.id &&
      (item.variantId || undefined) === (selectedVariant?.id || undefined)
  );
  const currentQuantityInCart = currentCartItem?.quantity ?? 0;
  const isMaxQuantityReached = currentQuantityInCart >= MAX_CART_ITEM_QUANTITY;

  // Step 1: Initiate addition (ZERO cart mutation)
  const handleInitiateAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Re-resolve canonical product before confirmation transition
    const freshProduct = getProductById(canonicalProduct.id);
    if (!freshProduct) {
      setErrorMessage("Catalogue verification failed. Product unavailable.");
      setWorkflowState("ERROR");
      return;
    }

    setErrorMessage("");
    setWorkflowState("PENDING_CONFIRMATION");
  };

  // Step 1 Cancel: Return to DEFAULT (ZERO cart mutation)
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage("");
    setWorkflowState("DEFAULT");
  };

  // Step 2: Explicit Confirmation Click (Mutates cart through validated addToCart)
  const handleConfirmAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent double-click or repeated submission during transition
    if (workflowState === "CONFIRMED_ADDITION") {
      return;
    }

    // Resolve canonical product again right before mutation
    const freshProduct = getProductById(canonicalProduct.id);
    if (!freshProduct) {
      setErrorMessage("Security verification failed: Product not found in canonical catalogue.");
      setWorkflowState("ERROR");
      return;
    }

    let verifiedVariant: ProductVariant | undefined = undefined;
    if (hasVariants) {
      verifiedVariant = freshProduct.variants?.find((v) => v.id === activeVariantId);
      if (!verifiedVariant) {
        setErrorMessage("Invalid product variant selected. Please choose a valid configuration.");
        setWorkflowState("ERROR");
        return;
      }
    }

    // Enforce maximum quantity bounds honestly
    const activeExistingQty =
      cart?.items.find(
        (item) =>
          item.productId === freshProduct.id &&
          (item.variantId || undefined) === (verifiedVariant?.id || undefined)
      )?.quantity ?? 0;

    if (activeExistingQty >= MAX_CART_ITEM_QUANTITY) {
      setErrorMessage(
        `Maximum demo limit of ${MAX_CART_ITEM_QUANTITY} reached for this configuration.`
      );
      setWorkflowState("ERROR");
      return;
    }

    // Set transition state to lock controls
    setWorkflowState("CONFIRMED_ADDITION");

    try {
      // Execute cart addition with openDrawer: false to avoid obscuring AI panel
      const success = cart ? cart.addToCart(freshProduct, verifiedVariant, 1, false) : true;
      if (success) {
        setWorkflowState("SUCCESS");
      } else {
        setErrorMessage("Failed to add specimen to cart.");
        setWorkflowState("ERROR");
      }
    } catch {
      setErrorMessage("An unexpected error occurred while modifying the cart.");
      setWorkflowState("ERROR");
    }
  };

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.openDrawer) {
      cart.openDrawer();
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div
      className="group flex flex-col gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB]/40 transition-colors text-left shadow-2xs"
      data-testid="product-recommendation-card"
      data-product-id={canonicalProduct.id}
      data-workflow-state={workflowState}
    >
      {/* 1. Header: Specimen Identity, Price & Direct Specimen Link */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <Link
          href={`/products/${canonicalProduct.slug}`}
          onClick={onNavigate}
          className="flex items-center gap-2 min-w-0 group/link focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded-xs"
          aria-label={`View verified catalogue specimen: ${canonicalProduct.name} (${canonicalProduct.formattedPrice})`}
        >
          <span className="w-6 h-6 rounded-md bg-[#09152B] flex items-center justify-center shrink-0 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-[#F2B95C]" />
          </span>
          <span className="text-xs font-semibold text-[#0F172A] truncate group-hover/link:text-[#2563EB] transition-colors">
            {canonicalProduct.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono font-medium text-[#475569]">
            {formattedVerifiedPrice}
          </span>
          <Link
            href={`/products/${canonicalProduct.slug}`}
            onClick={onNavigate}
            className="p-1 rounded text-[#475569] hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB]"
            title={`View ${canonicalProduct.name} page`}
            aria-label={`View ${canonicalProduct.name} page`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Interactive Workflow States */}

      {/* STATE A: DEFAULT */}
      {workflowState === "DEFAULT" && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleInitiateAdd}
            aria-label={`Add ${canonicalProduct.name} to shopping bag`}
            className="w-full py-1.5 px-3 rounded-md bg-white hover:bg-[#EAF2FF] text-[#2563EB] border border-[#CBD5E1] hover:border-[#2563EB]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
            {currentQuantityInCart > 0 && (
              <span className="text-[10px] font-mono text-[#64748B] font-normal">
                ({currentQuantityInCart} in bag)
              </span>
            )}
          </button>
        </div>
      )}

      {/* STATE B: PENDING CONFIRMATION */}
      {workflowState === "PENDING_CONFIRMATION" && (
        <div
          className="p-2.5 rounded-md bg-white border border-[#2563EB]/30 space-y-2 animate-in fade-in duration-150"
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#09152B] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#2563EB]" />
              Confirm Bag Addition
            </span>
            <span className="font-mono font-bold text-[#2563EB] text-xs">
              {formattedVerifiedPrice}
            </span>
          </div>

          {/* Variant Selector when applicable */}
          {hasVariants && (
            <div className="space-y-1">
              <label
                htmlFor={`variant-select-${canonicalProduct.id}`}
                className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider font-mono"
              >
                Configuration:
              </label>
              <div className="relative">
                <select
                  id={`variant-select-${canonicalProduct.id}`}
                  value={activeVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 pr-6 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] appearance-none cursor-pointer"
                  aria-label={`Select configuration for ${canonicalProduct.name}`}
                >
                  {variants.map((v) => {
                    const delta = v.demoPriceDelta ?? 0;
                    return (
                      <option key={v.id} value={v.id}>
                        {v.name} ({delta > 0 ? `+${formatINR(delta)}` : "Base"} •{" "}
                        {formatINR(canonicalProduct.demoPrice + delta)})
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-3 h-3 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Quantity bound warning */}
          {isMaxQuantityReached && (
            <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Maximum demo quantity reached ({MAX_CART_ITEM_QUANTITY}/10 in bag)</span>
            </div>
          )}

          {/* Confirmation & Cancellation Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-1.5 px-2 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAdd}
              disabled={isMaxQuantityReached}
              className="flex-1 py-1.5 px-2 rounded bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              Confirm Add
            </button>
          </div>
        </div>
      )}

      {/* STATE C: CONFIRMED ADDITION (Loading) */}
      {workflowState === "CONFIRMED_ADDITION" && (
        <div
          className="p-2.5 rounded-md bg-white border border-[#2563EB]/30 flex items-center justify-center gap-2 text-xs font-semibold text-[#2563EB]"
          aria-live="polite"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Adding to Specimen Bag...</span>
        </div>
      )}

      {/* STATE D: SUCCESS */}
      {workflowState === "SUCCESS" && (
        <div
          className="p-2 rounded-md bg-emerald-50 border border-emerald-200 space-y-1.5 animate-in fade-in duration-150"
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Added to Demo Bag</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-medium">
              {formattedVerifiedPrice}
            </span>
          </div>

          {selectedVariant && (
            <p className="text-[10px] text-emerald-700 truncate font-mono">
              {selectedVariant.name}
            </p>
          )}

          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={handleOpenCart}
              className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer"
            >
              View Bag
            </button>
            <button
              type="button"
              onClick={() => setWorkflowState("DEFAULT")}
              className="py-1 px-2 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* STATE E: ERROR */}
      {workflowState === "ERROR" && (
        <div
          className="p-2 rounded-md bg-rose-50 border border-rose-200 space-y-1 text-xs text-rose-800 animate-in fade-in duration-150"
          aria-live="assertive"
        >
          <div className="flex items-center gap-1.5 font-semibold text-rose-900">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Addition Unsuccessful</span>
          </div>
          <p className="text-[10px] text-rose-700">{errorMessage || "Failed to add product."}</p>
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setWorkflowState("DEFAULT");
            }}
            className="w-full py-1 px-2 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
