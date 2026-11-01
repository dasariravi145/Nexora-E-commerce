import type { ContactFormData, ContactFormErrors, EnquiryCategory } from "@/types/contact";
import type { HydratedCartLine, CartTotals } from "@/types/cart";
import { contactConfig } from "@/config/contact";

/**
 * Standard RFC 5322 compatible email validation pattern.
 * Prevents malicious or malformed addresses while allowing standard domain notation.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Flexible international phone validation pattern.
 * Permits leading +, digits, spaces, parentheses, hyphens, and dots (7 to 25 total length).
 */
const PHONE_REGEX = /^[+]?[\d\s().-]{7,25}$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length <= 120 && EMAIL_REGEX.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const trimmed = phone.trim();
  // Strip formatting symbols to ensure at least 7 real digits exist
  const digitCount = (trimmed.match(/\d/g) || []).length;
  return trimmed.length <= 25 && digitCount >= 7 && digitCount <= 16 && PHONE_REGEX.test(trimmed);
}

export function sanitizeInput(value: string): string {
  if (!value || typeof value !== "string") return "";
  // Strip control characters while preserving valid newlines and tabs
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}

/**
 * Validates ContactFormData according to strict UX, privacy, and integrity standards.
 */
export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};

  // 1. Full Name
  const trimmedName = (data.name || "").trim();
  if (!trimmedName) {
    errors.name = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  } else if (trimmedName.length > 100) {
    errors.name = "Full name cannot exceed 100 characters.";
  }

  // 2. Email Address
  const trimmedEmail = (data.email || "").trim();
  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Please provide a valid email address (e.g. name@domain.com).";
  }

  // 3. Optional Phone Number
  const trimmedPhone = (data.phone || "").trim();
  if (trimmedPhone && !isValidPhone(trimmedPhone)) {
    errors.phone = "Please enter a valid phone number (minimum 7 digits) or leave blank.";
  }

  // 4. Enquiry Category
  const validCategoryIds: EnquiryCategory[] = [
    "product-info",
    "comparison-help",
    "general-enquiry",
    "website-feedback",
  ];
  if (!data.category || !validCategoryIds.includes(data.category)) {
    errors.category = "Please select a valid enquiry category.";
  }

  // 5. Message Content
  const trimmedMessage = (data.message || "").trim();
  if (!trimmedMessage) {
    errors.message = "Inquiry message is required.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Please provide at least 10 characters to describe your inquiry.";
  } else if (trimmedMessage.length > 2000) {
    errors.message = "Message exceeds the 2,000-character maximum.";
  }

  // 6. Demonstration Consent
  if (!data.consent) {
    errors.consent = "You must acknowledge the demonstration storefront disclaimer.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface EnquiryContext {
  productName?: string;
  cartLines?: HydratedCartLine[];
  totals?: CartTotals;
}

export const SAFE_MAILTO_MAX_LENGTH = 2000;

export function isMailtoTooLong(mailtoHref: string): boolean {
  return mailtoHref.length > SAFE_MAILTO_MAX_LENGTH;
}

/**
 * Generates an unencoded, structured plain text message body.
 * Supports both single-product enquiries (100% backward compatible) and multi-specimen cart enquiry baskets.
 */
export function formatPlainTextMessage(
  data: ContactFormData,
  context?: string | EnquiryContext
): string {
  const categoryObj = contactConfig.categories.find((c) => c.id === data.category);
  const categoryLabel = categoryObj ? categoryObj.label : data.category;
  const phoneText = data.phone?.trim() ? data.phone.trim() : "Not provided";

  // Check if context represents a multi-item enquiry basket
  const isEnquiryBasket =
    typeof context === "object" &&
    context !== null &&
    Array.isArray(context.cartLines) &&
    context.cartLines.length > 0;

  if (isEnquiryBasket && typeof context === "object") {
    const lines = context.cartLines || [];
    const formattedProducts = lines
      .map((line, idx) => {
        const variantText = line.variant ? line.variant.name : "Standard Edition";
        return [
          `${idx + 1}. ${line.product.name}`,
          `   Variant: ${variantText}`,
          `   Quantity: ${line.item.quantity}`,
          `   Demo Unit Price: ${line.formattedUnitPrice}`,
          `   Demo Line Subtotal: ${line.formattedLineSubtotal}`,
        ].join("\n");
      })
      .join("\n\n");

    const subtotalText = context.totals?.formattedSubtotal || "N/A";

    return [
      "NEXORA DEMO PRODUCT ENQUIRY",
      "",
      "Customer:",
      `Name: ${data.name.trim()}`,
      `Email: ${data.email.trim()}`,
      `Phone (optional): ${phoneText}`,
      `Category: ${categoryLabel}`,
      "",
      "Selected Products:",
      "",
      formattedProducts,
      "",
      `Demo Subtotal: ${subtotalText}`,
      "",
      "Customer Message:",
      data.message.trim(),
      "",
      "Important:",
      "This is a portfolio demonstration.",
      "No order has been placed.",
      "No payment has been processed.",
      "No inventory has been reserved.",
    ].join("\n");
  }

  // Single product or general advisory (backward compatible)
  const resolvedProductName =
    typeof context === "string" ? context : context?.productName;
  const targetSpecimen = resolvedProductName
    ? `${resolvedProductName} (${data.productSlug})`
    : data.productSlug || "General Advisory (No specimen selected)";

  return [
    "==================================================",
    "NEXORA — HARDWARE & ARCHITECTURAL ADVISORY INQUIRY",
    "==================================================",
    "",
    `Client Name:          ${data.name.trim()}`,
    `Client Email:         ${data.email.trim()}`,
    `Contact Telephone:    ${phoneText}`,
    `Inquiry Discipline:   ${categoryLabel}`,
    `Specimen of Interest: ${targetSpecimen}`,
    "",
    "MESSAGE INQUIRY DETAILS:",
    "--------------------------------------------------",
    data.message.trim(),
    "",
    "--------------------------------------------------",
    "Sent via NEXORA Client Advisory Interface (Demo Storefront)",
    "Note: This inquiry was pre-formatted in your browser via mailto handoff.",
  ].join("\n");
}

/**
 * Generates an RFC-safe, encoded mailto URI.
 * Supports both single-product enquiries and multi-product enquiry baskets.
 */
export function formatMailtoHref(
  data: ContactFormData,
  recipientEmail?: string,
  context?: string | EnquiryContext
): string {
  const isEnquiryBasket =
    typeof context === "object" &&
    context !== null &&
    Array.isArray(context.cartLines) &&
    context.cartLines.length > 0;

  // Sanitize subject line name to prevent CRLF injection in email client headers
  const safeName = sanitizeInput(data.name || "").replace(/[\r\n]+/g, " ");

  let subject: string;
  if (isEnquiryBasket && typeof context === "object") {
    const itemCount = context.cartLines?.length || 0;
    subject = `NEXORA Product Enquiry (${itemCount} item${itemCount > 1 ? "s" : ""}): ${safeName}`;
  } else {
    const categoryObj = contactConfig.categories.find((c) => c.id === data.category);
    const categoryLabel = categoryObj ? categoryObj.label : "Advisory";
    const resolvedProductName =
      typeof context === "string" ? context : context?.productName;
    const specimenLabel = resolvedProductName ? ` — ${resolvedProductName}` : "";
    subject = `NEXORA Advisory [${categoryLabel}]: ${safeName}${specimenLabel}`;
  }

  const body = formatPlainTextMessage(data, context);

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const cleanRecipient = (recipientEmail || contactConfig.publicEmail || "").trim();

  return `mailto:${cleanRecipient}?subject=${encodedSubject}&body=${encodedBody}`;
}

