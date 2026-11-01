"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { contactConfig } from "@/config/contact";
import { products, getProductBySlug } from "@/data/products";
import { categories } from "@/data/categories";
import { useCart } from "@/context/cart-context";
import {
  validateContactForm,
  formatMailtoHref,
  formatPlainTextMessage,
  isMailtoTooLong,
  type EnquiryContext,
} from "@/lib/contact-validation";
import type { ContactFormData, ContactFormErrors } from "@/types/contact";
import {
  Mail,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  RotateCcw,
  Info,
  ShieldCheck,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactFormProps {
  className?: string;
}

interface SubmittedState {
  formData: ContactFormData;
  context?: EnquiryContext | string;
  mailto: string;
  isTooLong: boolean;
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  category: "product-info",
  productSlug: "",
  message: "",
  consent: false,
};

export function ContactForm({ className }: ContactFormProps) {
  const searchParams = useSearchParams();
  const urlProductParam = searchParams.get("product") || "";
  const sourceParam = searchParams.get("source") || "";
  const isCartSource = sourceParam === "cart";

  const { cartLines, totals, isHydrated } = useCart();

  const initialResolved = urlProductParam ? getProductBySlug(urlProductParam) : undefined;

  const [formData, setFormData] = React.useState<ContactFormData>(() => ({
    ...INITIAL_FORM_DATA,
    productSlug: initialResolved ? initialResolved.slug : "",
    category: isCartSource || initialResolved ? "product-info" : "general-enquiry",
  }));

  const [errors, setErrors] = React.useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedState, setSubmittedState] = React.useState<SubmittedState | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [invalidSlugWarning, setInvalidSlugWarning] = React.useState<string | null>(
    () => (urlProductParam && !initialResolved ? urlProductParam : null)
  );

  // Synchronize state when URL product search parameter changes across route transitions
  const [prevUrlParam, setPrevUrlParam] = React.useState(urlProductParam);
  if (urlProductParam !== prevUrlParam) {
    setPrevUrlParam(urlProductParam);
    if (urlProductParam) {
      const resolved = getProductBySlug(urlProductParam);
      if (resolved) {
        setFormData((prev) => ({
          ...prev,
          productSlug: resolved.slug,
          category: "product-info",
        }));
        setInvalidSlugWarning(null);
      } else {
        setInvalidSlugWarning(urlProductParam);
      }
    } else {
      setInvalidSlugWarning(null);
    }
  }

  // Synchronize category default when source=cart becomes active
  const [prevSourceParam, setPrevSourceParam] = React.useState(sourceParam);
  if (sourceParam !== prevSourceParam) {
    setPrevSourceParam(sourceParam);
    if (sourceParam === "cart") {
      setFormData((prev) => ({
        ...prev,
        category: "product-info",
      }));
    }
  }

  const selectedProduct = formData.productSlug
    ? getProductBySlug(formData.productSlug)
    : undefined;

  const hasCartItems = isCartSource && isHydrated && cartLines.length > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear inline error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormData];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Focus first error element
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(`contact-field-${firstErrorField}`);
      if (el) el.focus();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const activeContext: EnquiryContext | string | undefined = hasCartItems
      ? { cartLines, totals }
      : selectedProduct
      ? { productName: selectedProduct.name }
      : undefined;

    // Format mailto handoff
    const mailto = formatMailtoHref(
      formData,
      contactConfig.publicEmail,
      activeContext
    );

    const isTooLong = isMailtoTooLong(mailto);

    // Capture submission state
    setSubmittedState({
      formData: { ...formData },
      context: activeContext,
      mailto,
      isTooLong,
    });

    // If a recipient is configured, trigger system mailto handoff safely
    if (contactConfig.publicEmail.trim()) {
      try {
        window.location.href = mailto;
      } catch {
        // Fallback gracefully if popup blocker or protocol handler behaves unexpectedly
      }
    }

    setIsSubmitting(false);
  };

  const handleCopyDraft = async () => {
    if (!submittedState) return;
    const text = formatPlainTextMessage(submittedState.formData, submittedState.context);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback for non-secure contexts or restricted iframe environments
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3000);
        }
      } catch {
        // Fallback exhausted
      }
    }
  };

  const handleClearProduct = () => {
    setFormData((prev) => ({
      ...prev,
      productSlug: "",
    }));
  };

  const handleReset = () => {
    setSubmittedState(null);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setInvalidSlugWarning(null);
  };

  // Check if live cart has drifted from the snapshot captured when the draft was prepared
  const isCartDrifted = React.useMemo(() => {
    if (!submittedState || !isCartSource || typeof submittedState.context !== "object") {
      return false;
    }
    const submittedLines = (submittedState.context as EnquiryContext).cartLines || [];
    const submittedSubtotal = (submittedState.context as EnquiryContext).totals?.subtotal ?? 0;
    if (submittedLines.length !== cartLines.length) return true;
    if (submittedSubtotal !== totals.subtotal) return true;
    for (let i = 0; i < cartLines.length; i++) {
      if (
        cartLines[i].item.productId !== submittedLines[i]?.item.productId ||
        cartLines[i].item.variantId !== submittedLines[i]?.item.variantId ||
        cartLines[i].item.quantity !== submittedLines[i]?.item.quantity
      ) {
        return true;
      }
    }
    return false;
  }, [submittedState, isCartSource, cartLines, totals]);

  const handleUpdateDraftWithCurrentCart = () => {
    if (!submittedState) return;
    const updatedContext: EnquiryContext = { cartLines, totals };
    const updatedMailto = formatMailtoHref(
      submittedState.formData,
      contactConfig.publicEmail,
      updatedContext
    );
    setSubmittedState({
      ...submittedState,
      context: updatedContext,
      mailto: updatedMailto,
      isTooLong: isMailtoTooLong(updatedMailto),
    });
  };

  const hasRecipient = Boolean(contactConfig.publicEmail.trim());

  return (
    <Card
      id="enquiry-form"
      variant="solid"
      className={cn(
        "p-6 sm:p-10 border-[#E2E8F0] bg-white shadow-sm relative overflow-hidden space-y-6",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Hardware Consultation &amp; Inquiry Form
            </h2>
            <Badge variant="electric" size="sm">
              Live Validation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#475569]">
            Formulate your technical requirements. An email consultation draft will be
            generated for review.
          </p>
        </div>

        {submittedState && (
          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-[#E2E8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Enquiry</span>
          </button>
        )}
      </div>

      {/* Invalid Product Slug Warning (when URL param is unresolvable) */}
      {invalidSlugWarning && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900"
        >
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Product Identifier Notice: &ldquo;{invalidSlugWarning}&rdquo;
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              The requested product parameter could not be resolved from our catalogue.
              You may select a verified specimen from the list below or submit a general
              advisory inquiry.
            </p>
          </div>
        </div>
      )}

      {/* Multi-Specimen Enquiry Basket Summary (when source=cart and items exist) */}
      {isCartSource && isHydrated && cartLines.length > 0 && !submittedState && (
        <div
          role="region"
          aria-label="Enquiry Basket Summary"
          className="p-5 sm:p-6 rounded-2xl bg-[#EAF2FF] border border-blue-200 space-y-4 shadow-sm animate-fadeIn"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 text-[#2563EB] shrink-0 shadow-xs">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                    Enquiry Basket Summary
                  </h3>
                  <Badge variant="electric" size="sm">
                    Cart Snapshot
                  </Badge>
                </div>
                <p className="text-xs text-[#475569] font-mono mt-0.5">
                  {totals.lineCount} {totals.lineCount === 1 ? "Specimen Line" : "Specimen Lines"} •{" "}
                  {totals.itemCount} {totals.itemCount === 1 ? "Unit" : "Units"} Staged
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white hover:bg-slate-50 text-[#0F172A] border border-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-xs"
              >
                <span>Edit Cart / Quantities</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* List of Cart Lines */}
          <div className="divide-y divide-blue-200/60 max-h-72 overflow-y-auto pr-1 space-y-1">
            {cartLines.map((line, idx) => (
              <div
                key={`${line.item.productId}-${line.item.variantId || "std"}`}
                className="pt-3 pb-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#64748B] text-[11px]">{idx + 1}.</span>
                    <span className="font-semibold text-[#0F172A] truncate text-sm">
                      {line.product.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      ({line.product.brand})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#475569] font-mono flex-wrap">
                    <span>Variant: {line.variant ? line.variant.name : "Standard Edition"}</span>
                    <span>•</span>
                    <span>Qty: {line.item.quantity}</span>
                    <span>•</span>
                    <span>Unit: {line.formattedUnitPrice}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center shrink-0">
                  <span className="block font-mono font-bold text-[#0F172A] text-sm">
                    {line.formattedLineSubtotal}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    Line Subtotal (INR)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Disclaimer */}
          <div className="pt-3 border-t border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#475569] block font-semibold">
                Estimated Demo Subtotal
              </span>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Simulated pricing derived from centralized catalogue. No commercial order placed or inventory reserved.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-sans tracking-tight">
                {totals.formattedSubtotal}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty Enquiry Basket Notice (when source=cart and cart is empty) */}
      {isCartSource && isHydrated && cartLines.length === 0 && !submittedState && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-[#EAF2FF] border border-blue-200 space-y-3 text-xs text-[#0F172A] animate-fadeIn"
        >
          <div className="flex items-center gap-2.5 text-[#2563EB] font-bold">
            <ShoppingBag className="h-5 w-5 shrink-0" />
            <h3 className="text-sm font-bold text-[#0F172A]">
              Enquiry Basket is Empty
            </h3>
          </div>
          <p className="text-[#475569] leading-relaxed text-pretty">
            You accessed the concierge with <code className="text-[#2563EB] font-mono">source=cart</code>,
            but no hardware specimens are currently in your demonstration shopping bag. You may still
            submit a general consultation below, or explore the catalogue to stage specimens for a
            multi-product enquiry.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white transition-colors"
            >
              <span>Explore Product Catalogue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-[#0F172A] hover:bg-slate-50 bg-white border border-[#E2E8F0] transition-colors shadow-xs"
            >
              <span>View Empty Bag</span>
            </Link>
          </div>
        </div>
      )}

      {/* Active Specimen Showcase Card (when product is selected or prefilled and not using cart source) */}
      {selectedProduct && !isCartSource && !submittedState && (
        <div
          role="region"
          aria-label="Active Specimen Context"
          className="p-4 rounded-xl bg-[#EAF2FF] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#0F172A] shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-white border border-blue-200 text-[#2563EB] shrink-0 shadow-xs">
              <Package className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#0F172A] truncate text-sm">
                  {selectedProduct.name}
                </span>
                <Badge variant="electric" size="sm">
                  Active Specimen
                </Badge>
              </div>
              <p className="text-[11px] text-[#475569] font-mono truncate mt-0.5">
                Division: {selectedProduct.category} • Brand: {selectedProduct.brand} • Specimen Slug: {selectedProduct.slug}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearProduct}
            aria-label={`Clear selected specimen ${selectedProduct.name}`}
            className="self-start sm:self-auto shrink-0 px-2.5 py-1 text-xs font-mono rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] border border-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 shadow-xs"
          >
            Clear Specimen
          </button>
        </div>
      )}

      {/* Post-Submission State: Draft Prepared or Unconfigured Notice */}
      {submittedState ? (
        <div
          role="region"
          aria-labelledby="draft-status-heading"
          className="space-y-6 pt-2 animate-fadeIn"
        >
          {/* Large Mailto Advisory Warning if payload exceeds SAFE_MAILTO_MAX_LENGTH */}
          {submittedState.isTooLong && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs text-amber-200"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Large Enquiry Draft Detected ({submittedState.mailto.length} characters)</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed text-pretty">
                This multi-specimen enquiry draft exceeds the standard 2,000-character URL limit
                supported by some email applications (such as Microsoft Outlook, mobile mail apps,
                or webmail services). To avoid silent truncation of product specifications, please
                use <strong>Copy Message Draft</strong> below and paste the complete text into your
                email client.
              </p>
            </div>
          )}

          {/* Cart Drift Warning: Live cart was modified after draft creation */}
          {isCartDrifted && (
            <div
              role="status"
              className="p-4 rounded-xl bg-blue-950/60 border border-blue-400/40 space-y-2.5 text-xs text-blue-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>Shopping Bag Modified Since Draft Creation</span>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateDraftWithCurrentCart}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
                >
                  Update Draft with Current Cart ({totals.itemCount} items)
                </button>
              </div>
              <p className="text-blue-200/90 leading-relaxed text-pretty">
                Items or quantities in your evaluation bag were modified in another tab or drawer.
                The consultation draft below currently shows your cart at time of submission.
                Click above to instantly update your draft to match your latest shopping bag.
              </p>
            </div>
          )}

          {hasRecipient ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#EAF2FF] border border-blue-200 space-y-3">
              <div className="flex items-center gap-2.5 text-[#2563EB]">
                <Check className="h-5 w-5 text-emerald-600" />
                <h3 id="draft-status-heading" className="text-base font-bold text-[#0F172A]">
                  Email Client Handoff Initiated
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                Your system&apos;s default email client has been launched with your
                pre-formatted inquiry addressed to{" "}
                <code className="text-[#2563EB] font-mono font-bold">
                  {contactConfig.publicEmail}
                </code>
                . Please review the drafted text and click <strong>Send</strong> in your
                email client to transmit your inquiry.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Reminder:</strong> Email was not automatically transmitted. You must
                  confirm and send the message in your personal email application.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
              <div className="flex items-center gap-2.5 text-purple-700">
                <AlertCircle className="h-5 w-5 text-purple-700" />
                <h3 id="draft-status-heading" className="text-base font-bold text-[#0F172A]">
                  Demonstration Notice: Recipient Email Unconfigured
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                In this demonstration environment, no public recipient address is set in{" "}
                <code className="text-purple-700 font-mono font-semibold">
                  NEXT_PUBLIC_CONTACT_EMAIL
                </code>
                . Your consultation has been compiled below. You may copy the draft or launch
                an unaddressed client message.
              </p>
            </div>
          )}

          {/* Formatted Draft Preview & Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#475569] font-semibold uppercase tracking-wider">
                Formatted Inquiry Text Draft
              </span>
              <button
                type="button"
                onClick={handleCopyDraft}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  submittedState.isTooLong
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold"
                    : "bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200"
                )}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Message Draft</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
              {formatPlainTextMessage(submittedState.formData, submittedState.context)}
            </pre>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={submittedState.mailto}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                submittedState.isTooLong
                  ? "bg-[#101A30] hover:bg-[#162240] border border-amber-500/30 text-slate-200"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 border border-blue-400/30"
              )}
            >
              <ExternalLink className="h-4 w-4" />
              <span>
                {submittedState.isTooLong
                  ? "Launch Mail Client (May Truncate)"
                  : "Launch Default Email Client"}
              </span>
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-300 hover:text-white bg-[#101A30] hover:bg-[#162240] border border-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Revise Parameters</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Form Body */
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-field-name"
                className="text-xs font-semibold text-[#0F172A] flex items-center justify-between"
              >
                <span>
                  Full Name <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Max 100 chars</span>
              </label>
              <input
                id="contact-field-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Thorne"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
                className={cn(
                  "w-full h-11 px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-[#F8FAFC] border rounded-xl outline-none transition-colors",
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#E2E8F0] focus:border-[#2563EB] hover:border-slate-300"
                )}
              />
              {errors.name && (
                <p id="error-name" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Field 2: Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-field-email"
                className="text-xs font-semibold text-[#0F172A] flex items-center justify-between"
              >
                <span>
                  Email Address <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">RFC Compliant</span>
              </label>
              <input
                id="contact-field-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={120}
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@nexus-hardware.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
                className={cn(
                  "w-full h-11 px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-[#F8FAFC] border rounded-xl outline-none transition-colors",
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#E2E8F0] focus:border-[#2563EB] hover:border-slate-300"
                )}
              />
              {errors.email && (
                <p id="error-email" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Field 3: Telephone Number (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-field-phone"
                className="text-xs font-semibold text-[#0F172A] flex items-center justify-between"
              >
                <span>Phone Number (Optional)</span>
                <span className="text-[11px] font-mono text-[#64748B]">Min 7 digits</span>
              </label>
              <input
                id="contact-field-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                className={cn(
                  "w-full h-11 px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-[#F8FAFC] border rounded-xl outline-none transition-colors",
                  errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#E2E8F0] focus:border-[#2563EB] hover:border-slate-300"
                )}
              />
              {errors.phone && (
                <p id="error-phone" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Field 4: Enquiry Category */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-field-category"
                className="text-xs font-semibold text-[#0F172A] flex items-center justify-between"
              >
                <span>
                  Enquiry Category <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">4 Disciplines</span>
              </label>
              <select
                id="contact-field-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "error-category" : undefined}
                className={cn(
                  "w-full h-11 px-3.5 text-sm text-[#0F172A] bg-[#F8FAFC] border rounded-xl outline-none transition-colors cursor-pointer",
                  errors.category
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#E2E8F0] focus:border-[#2563EB] hover:border-slate-300"
                )}
              >
                {contactConfig.categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-[#0F172A]">
                    {cat.label} — {cat.description.substring(0, 42)}...
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="error-category" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>
          </div>

          {/* Field 5: Product of Interest (Optional Dropdown) - only shown when not using cart source */}
          {!isCartSource && (
            <div className="space-y-1.5">
              <label
                htmlFor="contact-field-product"
                className="text-xs font-semibold text-[#0F172A] flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span>Product of Interest (Optional)</span>
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  {selectedProduct ? `Selected: ${selectedProduct.name}` : "30 Catalogued Specimens"}
                </span>
              </label>
              <select
                id="contact-field-product"
                name="productSlug"
                value={formData.productSlug}
                onChange={handleChange}
                className="w-full h-11 px-3.5 text-sm text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors cursor-pointer"
              >
                <option value="" className="bg-white text-[#64748B]">
                  None — General Hardware or Portfolio Inquiry
                </option>
                {categories.map((cat) => {
                  const catProducts = products.filter(
                    (p) => p.categorySlug.toLowerCase() === cat.slug.toLowerCase()
                  );
                  return (
                    <optgroup
                      key={cat.id}
                      label={`Division: ${cat.name}`}
                      className="bg-slate-50 text-[#2563EB] font-bold"
                    >
                      {catProducts.map((p) => (
                        <option
                          key={p.id}
                          value={p.slug}
                          className="bg-white text-[#0F172A] font-normal"
                        >
                          {p.name} ({p.brand}) — {p.tagline}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>
          )}

          {/* Field 6: Message Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
              <label htmlFor="contact-field-message">
                Inquiry Details <span className="text-red-500">*</span>
              </label>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  formData.message.length > 2000
                    ? "text-red-600 font-bold"
                    : formData.message.length > 1800
                    ? "text-amber-600"
                    : "text-[#64748B]"
                )}
                aria-live="polite"
              >
                {formData.message.length} / 2,000 chars
              </span>
            </div>
            <textarea
              id="contact-field-message"
              name="message"
              rows={5}
              required
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your technical specifications, comparison questions, or spatial rig requirements..."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "error-message" : undefined}
              className={cn(
                "w-full p-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-[#F8FAFC] border rounded-xl outline-none transition-colors resize-y min-h-[120px]",
                errors.message
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] hover:border-slate-300"
              )}
            />
            {errors.message && (
              <p id="error-message" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Field 7: Demonstration Consent Checkbox */}
          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="contact-field-consent"
              className="flex items-start gap-3 cursor-pointer select-none group"
            >
              <input
                id="contact-field-consent"
                name="consent"
                type="checkbox"
                required
                checked={formData.consent}
                onChange={handleChange}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "error-consent" : undefined}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-[#2563EB] focus:ring-offset-0 focus:ring-1 cursor-pointer"
              />
              <span className="text-xs text-[#475569] leading-relaxed group-hover:text-[#0F172A]">
                I acknowledge that NEXORA is a demonstration storefront and that submitting
                this form compiles a client-side email draft via the mailto protocol. No
                personal data is stored on remote servers. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && (
              <p id="error-consent" role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1 pl-7">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.consent}</span>
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PremiumButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              leftIcon={<Mail className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Prepare Email Consultation Draft
            </PremiumButton>

            <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Client-side processing • Zero remote CRM tracking</span>
            </span>
          </div>
        </form>
      )}
    </Card>
  );
}
