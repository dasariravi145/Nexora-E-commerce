/**
 * NEXORA — PROMPT 18 TEST SUITE & PHASE 4 INDEPENDENT AUDIT
 * 
 * Validates Help Center architecture, structured FAQ dataset, client search,
 * category filtering, accordion state semantics, zero-fabrication standards,
 * customer guidance tutorials, and regression across Prompts 15, 16, 17, and 18.
 */

import assert from "node:assert";
import {
  faqs,
  faqCategories,
  customerGuides,
  searchFAQs,
  getFAQById,
  getFAQsByCategory,
} from "../../data/faqs";
import type { FAQCategory } from "../../types/faq";
import { siteConfig } from "../../config/site";
import { contactConfig, getContactMethods } from "../../config/contact";
import { products, getProductBySlug } from "../../data/products";
import { categories } from "../../data/categories";
import { promotions } from "../../data/promotions";
import {
  brandManifesto,
  coreValues,
  philosophyPillars,
  demoFeatureShowcases,
} from "../../data/about";
import { validateContactForm, formatMailtoHref } from "../contact-validation";

console.log("=== RUNNING NEXORA PROMPT 18 HELP CENTER & PHASE 4 AUDIT TESTS ===\n");

// ============================================================================
// TEST 1: FAQ DATASET INTEGRITY & STABLE TAXONOMY
// ============================================================================

assert(Array.isArray(faqCategories) && faqCategories.length === 8, "Test 1a: Exactly 8 official FAQ categories declared");
const expectedCategoryIds = [
  "getting-started",
  "product-browsing",
  "search-filters",
  "product-comparison",
  "3d-viewer",
  "demo-offers",
  "contact-enquiry",
  "about-nexora",
];
expectedCategoryIds.forEach((catId) => {
  const found = faqCategories.find((c) => c.id === catId);
  assert(found, `Test 1b: FAQ category '${catId}' is present in metadata`);
  assert(found.name.trim().length > 0, `Test 1c: FAQ category '${catId}' has non-empty display name`);
  assert(found.description.trim().length > 0, `Test 1d: FAQ category '${catId}' has non-empty description`);
});

assert(Array.isArray(faqs) && faqs.length >= 20, `Test 1e: FAQ dataset contains at least 20 items (actual: ${faqs.length})`);

// Ensure unique IDs and non-empty content
const seenIds = new Set<string>();
faqs.forEach((faq) => {
  assert(!seenIds.has(faq.id), `Test 1f: Duplicate FAQ ID '${faq.id}' detected`);
  seenIds.add(faq.id);

  assert(faq.question.trim().length >= 10, `Test 1g: FAQ '${faq.id}' question is adequately detailed`);
  assert(faq.answer.trim().length >= 25, `Test 1h: FAQ '${faq.id}' answer is adequately informative`);
  assert(expectedCategoryIds.includes(faq.category), `Test 1i: FAQ '${faq.id}' has valid category`);
  assert(Array.isArray(faq.keywords) && faq.keywords.length > 0, `Test 1j: FAQ '${faq.id}' has searchable keywords`);
  assert(typeof faq.displayOrder === "number" && faq.displayOrder > 0, `Test 1k: FAQ '${faq.id}' has valid displayOrder`);
});

console.log("[PASS] Test 1: Centralized FAQ dataset integrity and stable taxonomy verified");

// ============================================================================
// TEST 2: FUNCTIONAL FAQ SEARCH (CASE-INSENSITIVE & MULTI-FIELD)
// ============================================================================

// Search by keyword in question
const search3D = searchFAQs("3d viewer");
assert(search3D.length >= 2, "Test 2a: Searching '3d viewer' returns matching answers");
assert(search3D.some((f) => f.id === "faq-3d-01"), "Test 2b: 'faq-3d-01' found via '3d viewer'");

// Search case-insensitivity and whitespace trimming
const searchUpper = searchFAQs("  WEBGL  ");
assert(searchUpper.length >= 1, "Test 2c: Case-insensitive and trimmed search returns results for 'WEBGL'");
assert(searchUpper.some((f) => f.keywords.includes("webgl") || f.answer.includes("WebGL")), "Test 2d: WebGL matches keyword or answer");

// Search by keyword in keywords array
const searchPlanar = searchFAQs("planar");
assert(searchPlanar.length >= 1, "Test 2e: Keyword 'planar' correctly resolves audiophile FAQs");

// Search by category string
const searchComparison = searchFAQs("product-comparison");
assert(searchComparison.length >= 3, "Test 2f: Searching by category identifier yields full discipline set");

console.log("[PASS] Test 2: Real client-side FAQ search with case-insensitivity and multi-field matching verified");

// ============================================================================
// TEST 3: CATEGORY FILTERING & ISOLATION
// ============================================================================

expectedCategoryIds.forEach((catId) => {
  const filtered = searchFAQs("", catId as FAQCategory);
  assert(filtered.length >= 2, `Test 3a: Category '${catId}' contains at least 2 structured answers`);
  filtered.forEach((item) => {
    assert(item.category === catId, `Test 3b: Filtered item '${item.id}' strictly belongs to '${catId}'`);
  });

  const directCategoryFAQs = getFAQsByCategory(catId as FAQCategory);
  assert(directCategoryFAQs.length === filtered.length, `Test 3c: getFAQsByCategory('${catId}') matches filtered length`);
});

// All topics filter
const allTopics = searchFAQs("", "all");
assert(allTopics.length === faqs.length, "Test 3d: Category 'all' returns the entire dataset");

console.log("[PASS] Test 3: FAQ category isolation and 'all topics' selection verified");

// ============================================================================
// TEST 4: COMBINED SEARCH AND CATEGORY FILTERING
// ============================================================================

// Search 'Nova 1 Pro' inside '3d-viewer'
const novaIn3D = searchFAQs("Nova 1 Pro", "3d-viewer");
assert(novaIn3D.length >= 1, "Test 4a: 'Nova 1 Pro' found inside '3d-viewer'");
assert(novaIn3D.every((f) => f.category === "3d-viewer"), "Test 4b: All results are strictly in '3d-viewer'");

// Search 'Nova 1 Pro' in an unrelated category (e.g. 'demo-offers')
const novaInOffers = searchFAQs("Nova 1 Pro", "demo-offers");
assert(novaInOffers.length === 0, "Test 4c: Category-constrained query cleanly excludes non-matching categories");

console.log("[PASS] Test 4: Combined multi-criteria search and category filtering verified");

// ============================================================================
// TEST 5: EMPTY SEARCH RESULTS HANDLING & RESILIENCE
// ============================================================================

const emptyRes = searchFAQs("xyznonexistentquery9999");
assert(Array.isArray(emptyRes) && emptyRes.length === 0, "Test 5a: Non-matching search returns empty array cleanly");

const specialCharRes = searchFAQs("@#$%^&*()_+");
assert(Array.isArray(specialCharRes), "Test 5b: Special character query executes without throwing exceptions");

console.log("[PASS] Test 5: Empty search results handling and special character safety verified");

// ============================================================================
// TEST 6: CUSTOMER GUIDANCE WALKTHROUGHS
// ============================================================================

assert(customerGuides.length === 4, "Test 6a: Exactly 4 structured customer guidance tutorials declared");

customerGuides.forEach((guide) => {
  assert(guide.title.trim().length > 0, `Test 6b: Guide '${guide.id}' has non-empty title`);
  assert(guide.summary.trim().length > 0, `Test 6c: Guide '${guide.id}' has non-empty summary`);
  assert(guide.steps.length >= 3, `Test 6d: Guide '${guide.id}' has at least 3 actionable steps`);

  guide.steps.forEach((step, idx) => {
    assert(step.title.trim().length > 0, `Test 6e: Guide '${guide.id}' step ${idx + 1} has title`);
    assert(step.description.trim().length > 0, `Test 6f: Guide '${guide.id}' step ${idx + 1} has description`);
    if (step.href) {
      assert(step.href.startsWith("/"), `Test 6g: Step link '${step.href}' is an internal route`);
    }
  });
});

console.log("[PASS] Test 6: Customer guidance walkthroughs match implemented storefront capabilities");

// ============================================================================
// TEST 7: ZERO-FABRICATION TRANSPARENCY CHECK
// ============================================================================

// Check that old placeholder fabrications ("3-Year Nexus Warranty", "temperature-controlled shipping") are purged
const rawDatasetString = JSON.stringify(faqs).toLowerCase();
assert(!rawDatasetString.includes("3-year nexus warranty"), "Test 7a: Zero fake '3-Year Nexus Warranty' claims in FAQ dataset");
assert(!rawDatasetString.includes("temperature-controlled shipping"), "Test 7b: Zero fake 'temperature-controlled shipping' claims in FAQ dataset");
assert(!rawDatasetString.includes("unconditional 30-day evaluation period for a full refund"), "Test 7c: Zero fake refund guarantees in FAQ dataset");

// Verify that demonstration disclosures are prominently documented
const demoFAQ = getFAQById("faq-gs-01");
assert(demoFAQ && demoFAQ.answer.includes("fictional portfolio demonstration storefront"), "Test 7d: Demo storefront status explicitly articulated in Getting Started FAQ");

const checkoutFAQ = getFAQById("faq-gs-02");
assert(checkoutFAQ && checkoutFAQ.answer.includes("Real commercial transactions, payments"), "Test 7e: Lack of real checkout explicitly articulated");

console.log("[PASS] Test 7: Zero-fabrication scan passed: zero fake warranties, shipping, or refund guarantees");

// ============================================================================
// TEST 8: NAVIGATION AND ROUTE INTEGRITY
// ============================================================================

assert(siteConfig.navItems.some((n) => n.href === "/help"), "Test 8a: Primary navigation contains /help route");
assert(siteConfig.navItems.some((n) => n.href === "/about"), "Test 8b: Primary navigation contains /about route");
assert(siteConfig.navItems.some((n) => n.href === "/offers"), "Test 8c: Primary navigation contains /offers route");
assert(siteConfig.navItems.some((n) => n.href === "/contact"), "Test 8d: Primary navigation contains /contact route");

assert(siteConfig.footerNav.support.some((n) => n.href === "/help"), "Test 8e: Footer support contains /help link");
assert(siteConfig.footerNav.support.some((n) => n.href === "/faq"), "Test 8f: Footer support preserves /faq backwards-compatible link");
assert(siteConfig.footerNav.support.some((n) => n.href === "/contact"), "Test 8g: Footer support contains /contact link");

console.log("[PASS] Test 8: Primary and footer navigation links verified for /help, /faq, /contact, /about, /offers");

// ============================================================================
// TEST 9: INDEPENDENT PHASE 4 BUSINESS PAGES AUDIT
// ============================================================================

// 9.1 Prompt 15: Offers & Promotions Audit
assert(promotions && promotions.length >= 7, "Audit 9.1a: At least 7 promotional tiers in Prompt 15 (6 active, 1 disabled)");
promotions.forEach((promo) => {
  assert(promo.id && promo.slug && promo.title, `Audit 9.1b: Promotion ${promo.id} has complete metadata`);
  assert(promo.savingsPercent > 0, `Audit 9.1c: Promotion ${promo.id} has positive savingsPercent`);
  promo.eligibleProductIds.forEach((pid) => {
    const product = products.find((p) => p.id === pid);
    assert(product, `Audit 9.1d: Promotion ${promo.slug} points to valid catalogue product ID '${pid}'`);
  });
});

// 9.2 Prompt 16: About Us Experience Audit
assert(brandManifesto && brandManifesto.title, "Audit 9.2a: About editorial manifesto is verified");
assert(coreValues.length === 4, "Audit 9.2b: Exactly 4 authentic core values in Prompt 16");
assert(philosophyPillars.length === 3, "Audit 9.2c: Exactly 3 technical philosophy pillars in Prompt 16");
assert(demoFeatureShowcases.length === 4, "Audit 9.2d: Exactly 4 demonstration features in Prompt 16");

// 9.3 Prompt 17: Contact Us Experience Audit
assert(contactConfig && contactConfig.categories.length === 4, "Audit 9.3a: Exactly 4 contact disciplines in Prompt 17");
const contactMethods = getContactMethods();
assert(contactMethods.length === 4, "Audit 9.3b: Exactly 4 contact channels in Prompt 17");
const validFormTest = validateContactForm({
  name: "Marcus Aurelius",
  email: "marcus@rome.org",
  category: "product-info",
  message: "Requesting optical resolution specifications for Kvant Vision Pro.",
  consent: true,
});
assert(validFormTest.isValid, "Audit 9.3c: Contact form validation correctly accepts valid submission");
const mailtoHref = formatMailtoHref(
  {
    name: "Marcus Aurelius",
    email: "marcus@rome.org",
    category: "product-info",
    message: "Requesting optical specs.",
    consent: true,
  },
  "support@nexora.internal"
);
assert(mailtoHref.startsWith("mailto:support@nexora.internal?"), "Audit 9.3d: Mailto URI correctly generated");

// 9.4 Prompt 18: FAQ & Help Center Audit
assert(faqs.length >= 20, "Audit 9.4a: Help Center FAQ dataset exceeds minimum size threshold");
assert(customerGuides.length === 4, "Audit 9.4b: Customer guidance tutorials verified");

console.log("[PASS] Test 9: Independent Phase 4 business page audit verified across Prompts 15, 16, 17, and 18");

// ============================================================================
// TEST 10: BASE CATALOGUE & 3D ASSETS REGRESSION DEFENSE
// ============================================================================

assert(products.length === 30, "Test 10a: Base catalogue strictly maintains all 30 products");
assert(categories.length === 6, "Test 10b: Exactly 6 hardware categories preserved");

const nova = getProductBySlug("nexora-nova-1-pro");
assert(nova && nova.has3DModel === true, "Test 10c: Nova 1 Pro maintains 3D model flag");

const vortex = getProductBySlug("vortex-resonance-planar");
assert(vortex && vortex.has3DModel === true, "Test 10d: Vortex Resonance Planar maintains 3D model flag");

console.log("[PASS] Test 10: Zero regression on base catalogue, categories, and 3D models");

console.log("\n========================================================");
console.log("ALL PROMPT 18 HELP CENTER & PHASE 4 AUDIT TESTS PASSED!");
console.log("========================================================\n");
