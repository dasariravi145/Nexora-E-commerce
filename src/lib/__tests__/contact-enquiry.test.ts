/**
 * NEXORA — PROMPT 17 CONTACT US EXPERIENCE TEST SUITE
 * 
 * Validates Contact form validation, field length limits, optional phone rules,
 * RFC email verification, category choices, product slug resolution, mailto encoding,
 * unconfigured recipient handling, zero-fabrication standards, and catalogue integrity.
 */

import assert from "node:assert";
import {
  validateContactForm,
  formatMailtoHref,
  formatPlainTextMessage,
  isValidEmail,
  isValidPhone,
  sanitizeInput,
} from "../contact-validation";
import { contactConfig, getContactMethods } from "../../config/contact";
import { products, getProductBySlug } from "../../data/products";
import { categories } from "../../data/categories";
import { promotions } from "../../data/promotions";
import type { ContactFormData, EnquiryCategory } from "../../types/contact";

console.log("=== RUNNING NEXORA PROMPT 17 CONTACT ENQUIRY TESTS ===\n");

// ============================================================================
// TEST 1: EMAIL FORMAT VALIDATION
// ============================================================================

const validEmails = [
  "alex@nexus-hardware.com",
  "client.service@domain.co.uk",
  "engineer+review@sub.domain.org",
  "john.doe@tech-lab.io",
];

for (const email of validEmails) {
  assert(isValidEmail(email), `Test 1a: Email "${email}" should be valid`);
}

const invalidEmails = [
  "",
  "   ",
  "plainaddress",
  "@missinguser.com",
  "user@.com",
  "user@domain",
  "user name@domain.com",
  "user@domain..com",
];

for (const email of invalidEmails) {
  assert(!isValidEmail(email), `Test 1b: Email "${email}" should be invalid`);
}

console.log("[PASS] Test 1: Email format validation verified (RFC-compliant regex)");

// ============================================================================
// TEST 2: OPTIONAL PHONE VALIDATION
// ============================================================================

const validPhones = [
  "+1 (555) 019-2834",
  "9876543210",
  "+44 20 7946 0958",
  "011-2345-6789",
  "+91 98765 43210",
];

for (const phone of validPhones) {
  assert(isValidPhone(phone), `Test 2a: Phone "${phone}" should be valid`);
}

const invalidPhones = [
  "123", // too short (fewer than 7 digits)
  "phone-number",
  "+++",
  "12345",
  "abcdefghij",
];

for (const phone of invalidPhones) {
  assert(!isValidPhone(phone), `Test 2b: Phone "${phone}" should be invalid`);
}

console.log("[PASS] Test 2: Optional phone validation verified (accepts international formats, rejects malformed inputs)");

// ============================================================================
// TEST 3: REQUIRED FIELD VALIDATION
// ============================================================================

const emptyData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  category: "product-info",
  productSlug: "",
  message: "",
  consent: false,
};

const emptyResult = validateContactForm(emptyData);
assert(!emptyResult.isValid, "Test 3a: Empty form should be invalid");
assert(emptyResult.errors.name, "Test 3b: Name required error must be present");
assert(emptyResult.errors.email, "Test 3c: Email required error must be present");
assert(emptyResult.errors.message, "Test 3d: Message required error must be present");
assert(emptyResult.errors.consent, "Test 3e: Consent required error must be present");
assert(!emptyResult.errors.phone, "Test 3f: Phone is optional; no error when empty");

console.log("[PASS] Test 3: Required field validation verified");

// ============================================================================
// TEST 4: INPUT LENGTH LIMITS
// ============================================================================

// Name too short (< 2 chars)
const shortNameResult = validateContactForm({
  ...emptyData,
  name: "A",
  email: "alex@nexus.com",
  message: "Legitimate technical consultation request details.",
  consent: true,
});
assert(!shortNameResult.isValid && shortNameResult.errors.name, "Test 4a: Name under 2 chars rejected");

// Name too long (> 100 chars)
const longNameResult = validateContactForm({
  ...emptyData,
  name: "A".repeat(101),
  email: "alex@nexus.com",
  message: "Legitimate technical consultation request details.",
  consent: true,
});
assert(!longNameResult.isValid && longNameResult.errors.name, "Test 4b: Name over 100 chars rejected");

// Message too short (< 10 chars)
const shortMsgResult = validateContactForm({
  ...emptyData,
  name: "Alex Thorne",
  email: "alex@nexus.com",
  message: "Too short",
  consent: true,
});
assert(!shortMsgResult.isValid && shortMsgResult.errors.message, "Test 4c: Message under 10 chars rejected");

// Message too long (> 2000 chars)
const longMsgResult = validateContactForm({
  ...emptyData,
  name: "Alex Thorne",
  email: "alex@nexus.com",
  message: "M".repeat(2001),
  consent: true,
});
assert(!longMsgResult.isValid && longMsgResult.errors.message, "Test 4d: Message over 2000 chars rejected");

console.log("[PASS] Test 4: Input length boundaries (name 2-100, message 10-2000) strictly enforced");

// ============================================================================
// TEST 5: WHITESPACE TRIMMING & SANITIZATION
// ============================================================================

const dirtyString = "  Alex \x00 Thorne \x1F  ";
const cleanString = sanitizeInput(dirtyString);
assert(cleanString === "Alex  Thorne", `Test 5a: Strips control characters; got "${cleanString}"`);

const whitespaceOnlyData: ContactFormData = {
  ...emptyData,
  name: "   ",
  email: "   ",
  message: "         ",
  consent: true,
};
const whitespaceResult = validateContactForm(whitespaceOnlyData);
assert(!whitespaceResult.isValid, "Test 5b: Whitespace-only fields must be rejected");
assert(whitespaceResult.errors.name, "Test 5c: Whitespace name rejected");
assert(whitespaceResult.errors.email, "Test 5d: Whitespace email rejected");
assert(whitespaceResult.errors.message, "Test 5e: Whitespace message rejected");

console.log("[PASS] Test 5: Whitespace trimming and control character sanitization verified");

// ============================================================================
// TEST 6: ENQUIRY CATEGORY SELECTION & CONFIGURATION
// ============================================================================

assert(contactConfig.categories.length === 4, "Test 6a: Exactly 4 enquiry categories configured");

const validCategories = ["product-info", "comparison-help", "general-enquiry", "website-feedback"] as const;
for (const cat of validCategories) {
  const validData: ContactFormData = {
    name: "Alex Thorne",
    email: "alex@nexus.com",
    category: cat,
    message: "Inquiring about hardware telemetry and driver impedance.",
    consent: true,
  };
  const res = validateContactForm(validData);
  assert(res.isValid, `Test 6b: Category "${cat}" should be valid`);
}

// Invalid category
const invalidCatData = {
  name: "Alex Thorne",
  email: "alex@nexus.com",
  category: "order-support-fake" as unknown as EnquiryCategory,
  message: "Inquiring about hardware telemetry and driver impedance.",
  consent: true,
};
const invalidCatRes = validateContactForm(invalidCatData);
assert(!invalidCatRes.isValid && invalidCatRes.errors.category, "Test 6c: Invalid category rejected");

console.log("[PASS] Test 6: Enquiry category selection and taxonomy verified");

// ============================================================================
// TEST 7: PRODUCT PREFILL & CATALOGUE INTEGRATION
// ============================================================================

// Valid product resolution
const novaProduct = getProductBySlug("nexora-nova-1-pro");
assert(novaProduct && novaProduct.name === "NEXORA Nova 1 Pro", "Test 7a: Nova 1 Pro resolved from catalogue");

const vortexProduct = getProductBySlug("vortex-resonance-planar");
assert(vortexProduct && vortexProduct.name === "Vortex Resonance Planar", "Test 7b: Vortex Resonance Planar resolved from catalogue");

// Invalid product slug handling (must return undefined gracefully without crashing)
const invalidProduct = getProductBySlug("non-existent-chassis-xyz");
assert(invalidProduct === undefined, "Test 7c: Invalid product slug returns undefined cleanly");

console.log("[PASS] Test 7: Product prefill resolution and invalid slug defense verified");

// ============================================================================
// TEST 8: MAILTO ENCODING & PLAIN TEXT MESSAGE FORMATTING
// ============================================================================

const sampleForm: ContactFormData = {
  name: "Elena Rostova",
  email: "elena@quantum-acoustics.de",
  phone: "+49 30 123456",
  category: "product-info",
  productSlug: "vortex-resonance-planar",
  message: "Requesting planar magnetic frequency response curves and amplifier pairing recommendations.",
  consent: true,
};

const plainText = formatPlainTextMessage(sampleForm, "Vortex Resonance Planar");
assert(plainText.includes("Client Name:          Elena Rostova"), "Test 8a: Plain text contains name");
assert(plainText.includes("Client Email:         elena@quantum-acoustics.de"), "Test 8b: Plain text contains email");
assert(plainText.includes("Contact Telephone:    +49 30 123456"), "Test 8c: Plain text contains phone");
assert(plainText.includes("Inquiry Discipline:   Product Information"), "Test 8d: Plain text contains category label");
assert(plainText.includes("Specimen of Interest: Vortex Resonance Planar (vortex-resonance-planar)"), "Test 8e: Plain text contains specimen");
assert(plainText.includes("Requesting planar magnetic frequency response curves"), "Test 8f: Plain text contains message");

const mailtoWithRecipient = formatMailtoHref(sampleForm, "concierge@nexora-demo.internal", "Vortex Resonance Planar");
assert(mailtoWithRecipient.startsWith("mailto:concierge@nexora-demo.internal?"), "Test 8g: Mailto points to recipient");
assert(mailtoWithRecipient.includes("subject="), "Test 8h: Mailto has encoded subject");
assert(mailtoWithRecipient.includes("body="), "Test 8i: Mailto has encoded body");
assert(!mailtoWithRecipient.includes("\n"), "Test 8j: Newlines are properly URL-encoded (%0A)");

// Unconfigured recipient mailto
const mailtoUnconfigured = formatMailtoHref(sampleForm, "", "Vortex Resonance Planar");
assert(mailtoUnconfigured.startsWith("mailto:?"), "Test 8k: Unconfigured recipient generates mailto:? without broken characters");

console.log("[PASS] Test 8: Mailto URI encoding and structured plain text message verified");

// ============================================================================
// TEST 9: CONTACT METHODS & CONFIGURATION TRANSPARENCY
// ============================================================================

const methods = getContactMethods();
assert(Array.isArray(methods) && methods.length === 4, "Test 9a: Exactly 4 contact methods available");

const emailMethod = methods.find((m) => m.type === "email");
assert(emailMethod, "Test 9b: Email method exists");

const formMethod = methods.find((m) => m.type === "form");
assert(formMethod && formMethod.actionHref === "#enquiry-form", "Test 9c: Form method links to #enquiry-form");

const repoMethod = methods.find((m) => m.type === "repository");
assert(repoMethod && repoMethod.actionHref?.includes("github.com"), "Test 9d: Repository method links to GitHub");

console.log("[PASS] Test 9: Contact method cards adhere to verified configuration standards");

// ============================================================================
// TEST 10: ZERO-FABRICATION VERIFICATION & REGRESSION BOUNDARIES
// ============================================================================

assert(!contactConfig.demoDisclaimer.includes("founded in 19"), "Test 10a: No fake founding year");
assert(products.length === 30, "Test 10b: Centralized catalogue preserves strictly 30 products");
assert(categories.length === 6, "Test 10c: Centralized catalogue preserves strictly 6 categories");
assert(promotions.length === 7, "Test 10d: Centralized promotions preserves strictly 7 promotions");

console.log("[PASS] Test 10: Zero-fabrication scan and base catalogue regression defense verified");

// ============================================================================
// TEST 11: SPECIAL CHARACTERS, HTML & XSS RESILIENCE
// ============================================================================

const xssPayload: ContactFormData = {
  name: "Dr. <script>alert('xss')</script>",
  email: "xss.tester@security-audit.org",
  phone: "+1 555 019 2834",
  category: "website-feedback",
  message: "Testing <b>bold HTML</b> & 'single quotes' and \"double quotes\" and ' OR 1=1; --",
  consent: true,
};

const xssValidation = validateContactForm(xssPayload);
assert(xssValidation.isValid, "Test 11a: Form with special characters passes validation");

const xssPlainText = formatPlainTextMessage(xssPayload);
assert(xssPlainText.includes("<script>alert('xss')</script>"), "Test 11b: Plain text preserves characters literally without evaluation");

const xssMailto = formatMailtoHref(xssPayload, "concierge@nexora.internal");
assert(!xssMailto.includes("<script>"), "Test 11c: Mailto URI must URL-encode HTML tags (< becomes %3C)");
assert(xssMailto.includes("%3Cscript%3E"), "Test 11d: Script tag is safely percent-encoded");

console.log("[PASS] Test 11: Special characters, HTML entities, and XSS safety verified");

// ============================================================================
// TEST 12: UNICODE TEXT & INTERNATIONAL CHARACTER SETS
// ============================================================================

const unicodePayloads = [
  { name: "Елена Ростова", lang: "Cyrillic" },
  { name: "Hélène Müller-Größ", lang: "French/German Umlaut" },
  { name: "佐藤 健一", lang: "CJK Kanji" },
  { name: "Kūkai 🚀 Audio", lang: "Macron and Emoji" },
];

for (const u of unicodePayloads) {
  const uData: ContactFormData = {
    name: u.name,
    email: "international.client@domain.global",
    category: "product-info",
    productSlug: "nexora-nova-1-pro",
    message: `Inquiring in ${u.lang}: 宇宙空間オーディオ, Wärmeleitfähigkeit & акустическая точность.`,
    consent: true,
  };
  const uResult = validateContactForm(uData);
  assert(uResult.isValid, `Test 12a: Unicode payload for ${u.lang} should pass validation`);

  const uMailto = formatMailtoHref(uData, "concierge@nexora.internal", "NEXORA Nova 1 Pro");
  assert(uMailto.startsWith("mailto:concierge@nexora.internal?"), `Test 12b: Unicode mailto formulated for ${u.lang}`);
  // Verify that percent-encoding handled the unicode string without throwing
  assert(decodeURIComponent(uMailto).includes(u.name), `Test 12c: Decoded mailto round-trips ${u.name}`);
}

console.log("[PASS] Test 12: Multi-byte Unicode and international character sets verified");

// ============================================================================
// TEST 13: CRLF HEADER INJECTION DEFENSE IN MAILTO SUBJECT
// ============================================================================

const crlfPayload: ContactFormData = {
  name: "Alex Thorne\r\nBcc: evil@attacker.com\r\n",
  email: "alex@nexus.com",
  category: "general-enquiry",
  message: "Legitimate consultation details with newline characters.",
  consent: true,
};

const crlfMailto = formatMailtoHref(crlfPayload, "concierge@nexora.internal");
const subjectParam = crlfMailto.split("?")[1]?.split("&")[0] || "";
assert(!subjectParam.includes("%0D"), "Test 13a: Subject parameter must not contain encoded carriage return (%0D)");
assert(!subjectParam.includes("%0A"), "Test 13b: Subject parameter must not contain encoded line feed (%0A)");
assert(decodeURIComponent(subjectParam).includes("Alex Thorne Bcc: evil@attacker.com"), "Test 13c: CRLF converted to spaces in subject");

console.log("[PASS] Test 13: CRLF injection defense in mailto subject line verified");

// ============================================================================
// TEST 14: REPEATED SUBMISSION & IDEMPOTENT VALIDATION BEHAVIOR
// ============================================================================

const standardData: ContactFormData = {
  name: "Alex Thorne",
  email: "alex@nexus-hardware.com",
  phone: "+1 555 019 2834",
  category: "product-info",
  productSlug: "nexora-nova-1-pro",
  message: "Comprehensive architectural and acoustic pairing inquiry.",
  consent: true,
};

const run1 = validateContactForm(standardData);
const run2 = validateContactForm(standardData);
const run3 = validateContactForm(standardData);

assert.deepStrictEqual(run1, run2, "Test 14a: Validation is pure and idempotent (run 1 == run 2)");
assert.deepStrictEqual(run2, run3, "Test 14b: Validation is pure and idempotent (run 2 == run 3)");

const mailto1 = formatMailtoHref(standardData, "concierge@nexora.internal");
const mailto2 = formatMailtoHref(standardData, "concierge@nexora.internal");
assert.strictEqual(mailto1, mailto2, "Test 14c: Mailto formatting is pure and idempotent");

console.log("[PASS] Test 14: Repeated submission and idempotent validation behavior verified");

console.log("\nALL PROMPT 17 / 17A CONTACT ENQUIRY TESTS (14 SUITES) PASSED SUCCESSFULLY!\n");
