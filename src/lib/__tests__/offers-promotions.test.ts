/**
 * NEXORA — PROMPT 15 OFFERS & PROMOTIONS TEST SUITE
 * 
 * Validates demo promotion architecture, category filtering, product eligibility,
 * honest pricing calculations, disabled lifecycle states, unknown slug 404 handling,
 * and regression boundaries across the centralized catalogue.
 */

import assert from "node:assert";
import {
  promotions,
  getActivePromotions,
  getPromotionById,
  getPromotionBySlug,
  getPromotionsByCategory,
} from "../../data/promotions";
import { products, getProductById } from "../../data/products";
import {
  calculateSavings,
  isProductEligibleForPromotion,
  getPromotionsForProduct,
  getPromotionEligibleProducts,
} from "../promotion-eligibility";
import { formatINR } from "../format";

console.log("=== RUNNING NEXORA PROMPT 15 OFFERS & PROMOTIONS TESTS ===\n");

// ============================================================================
// TEST 1: PROMOTIONS DATASET INTEGRITY & UNIQUENESS
// ============================================================================

assert(Array.isArray(promotions) && promotions.length >= 7, "Test 1a: At least 7 promotions defined");

const promoIdSet = new Set<string>();
const promoSlugSet = new Set<string>();

for (const p of promotions) {
  assert(p.id && typeof p.id === "string", `Test 1b: Promo ${p.slug} must have string ID`);
  assert(!promoIdSet.has(p.id), `Test 1c: Duplicate promotion ID detected: ${p.id}`);
  promoIdSet.add(p.id);

  assert(p.slug && typeof p.slug === "string", `Test 1d: Promo ${p.id} must have string slug`);
  assert(!promoSlugSet.has(p.slug), `Test 1e: Duplicate promotion slug detected: ${p.slug}`);
  promoSlugSet.add(p.slug);

  assert(/^[a-z0-9-]+$/.test(p.slug), `Test 1f: Slug "${p.slug}" is URL-safe`);
  assert(p.title && p.title.trim().length > 0, `Test 1g: Title must not be empty`);
  assert(p.description && p.description.trim().length > 0, `Test 1h: Description must not be empty`);
  assert(p.badgeText && p.badgeText.trim().length > 0, `Test 1i: Badge text must not be empty`);
}

console.log("[PASS] Test 1: Promotion dataset identity and uniqueness verified");

// ============================================================================
// TEST 2: ELIGIBLE PRODUCT REFERENCES INTEGRITY
// ============================================================================

for (const p of promotions) {
  assert(
    Array.isArray(p.eligibleProductIds) && p.eligibleProductIds.length > 0,
    `Test 2a: Promotion ${p.slug} must list at least one eligible product ID`
  );

  for (const prodId of p.eligibleProductIds) {
    const product = getProductById(prodId);
    assert(
      product !== undefined,
      `Test 2b: Promotion ${p.slug} references non-existent product ID: "${prodId}"`
    );
    // If active, category should align
    if (p.enabled) {
      assert.strictEqual(
        product?.categorySlug.toLowerCase(),
        p.categorySlug.toLowerCase(),
        `Test 2c: Product "${prodId}" category must match promotion category "${p.categorySlug}"`
      );
    }
  }
}

console.log("[PASS] Test 2: All eligible product references resolve to genuine centralized products");

// ============================================================================
// TEST 3: HONEST PRICING CALCULATIONS & SAVINGS INTEGRITY
// ============================================================================

for (const p of promotions) {
  assert(p.originalPrice > 0, `Test 3a: Original price for ${p.slug} must be positive`);
  assert(p.promotionalPrice > 0, `Test 3b: Promotional price for ${p.slug} must be positive`);
  assert(
    p.promotionalPrice < p.originalPrice,
    `Test 3c: Promotional price must be strictly lower than original price (no fake markups)`
  );

  const calc = calculateSavings(p.originalPrice, p.promotionalPrice);
  assert.strictEqual(calc.isValid, true, `Test 3d: Savings calculation must be valid`);
  assert.strictEqual(
    p.savingsAmount,
    p.originalPrice - p.promotionalPrice,
    `Test 3e: Savings amount accurately computed`
  );

  const expectedPercent = Math.round(
    ((p.originalPrice - p.promotionalPrice) / p.originalPrice) * 100
  );
  assert.strictEqual(
    p.savingsPercent,
    expectedPercent,
    `Test 3f: Savings percent accurately computed (${p.savingsPercent}% vs ${expectedPercent}%)`
  );

  // Currency formatting check
  assert.strictEqual(
    p.formattedPromotionalPrice,
    formatINR(p.promotionalPrice),
    `Test 3g: Formatted promotional price matches formatINR`
  );
  assert.strictEqual(
    p.formattedOriginalPrice,
    formatINR(p.originalPrice),
    `Test 3h: Formatted original price matches formatINR`
  );
}

console.log("[PASS] Test 3: Mathematical savings calculations and INR formatting verified");

// ============================================================================
// TEST 4: INVALID PRICING DEFENSIVE HANDLING
// ============================================================================

const invalidRes1 = calculateSavings(-100, 50);
assert.strictEqual(invalidRes1.isValid, false, "Test 4a: Negative original price safely handled");

const invalidRes2 = calculateSavings(100, 150);
assert.strictEqual(invalidRes2.isValid, false, "Test 4b: Inverted promotional price (> original) safely handled");

const invalidRes3 = calculateSavings(100, 100);
assert.strictEqual(invalidRes3.isValid, false, "Test 4c: Equal promotional price safely handled");

const invalidRes4 = calculateSavings(NaN, 50);
assert.strictEqual(invalidRes4.isValid, false, "Test 4d: NaN price safely handled");

console.log("[PASS] Test 4: Defensive pricing calculation handles anomalies gracefully");

// ============================================================================
// TEST 5: DISABLED PROMOTIONS & LIFECYCLE MANAGEMENT
// ============================================================================

const activePromos = getActivePromotions();
assert.strictEqual(activePromos.length, 6, "Test 5a: Exactly 6 active promotions returned");

const disabledPromo = promotions.find((p) => !p.enabled);
assert(disabledPromo, "Test 5b: Disabled test promotion exists in dataset");
assert.strictEqual(
  activePromos.some((p) => p.id === disabledPromo?.id),
  false,
  "Test 5c: Disabled promotion excluded from active promotions list"
);

console.log("[PASS] Test 5: Lifecycle filtering cleanly isolates active from disabled promotions");

// ============================================================================
// TEST 6: CATEGORY FILTERING & PROMOTION QUERIES
// ============================================================================

const smartPromos = getPromotionsByCategory("smartphones");
assert.strictEqual(smartPromos.length, 1, "Test 6a: 1 active smartphone promotion");
assert.strictEqual(smartPromos[0].slug, "nova-flagship-founders-tier", "Test 6b: Smartphone promotion matches Nova 1 Pro");

const laptopPromos = getPromotionsByCategory("laptops");
assert.strictEqual(laptopPromos.length, 1, "Test 6c: 1 active laptop promotion");

const allPromos = getPromotionsByCategory("all");
assert.strictEqual(allPromos.length, 6, "Test 6d: 'all' category returns all active promotions");

console.log("[PASS] Test 6: Division-scoped category filtering verified");

// ============================================================================
// TEST 7: PROMOTION DETAIL LOOKUP & 404 RESILIENCE
// ============================================================================

const knownPromo = getPromotionBySlug("nova-flagship-founders-tier");
assert(knownPromo !== undefined, "Test 7a: Known promotion slug resolves");
assert.strictEqual(knownPromo?.id, "promo-01", "Test 7b: Resolved promotion has correct ID");

const unknownPromo = getPromotionBySlug("non-existent-ghost-slug-999");
assert.strictEqual(unknownPromo, undefined, "Test 7c: Unknown slug returns undefined for 404 routing");

const emptySlugPromo = getPromotionBySlug("");
assert.strictEqual(emptySlugPromo, undefined, "Test 7d: Empty slug safely returns undefined");

console.log("[PASS] Test 7: Promotion slug lookup and 404 resilience verified");

// ============================================================================
// TEST 8: PRODUCT ELIGIBILITY VALIDATION
// ============================================================================

const novaProduct = getProductById("prod-01")!;
const zephyrProduct = getProductById("prod-06")!;
const novaPromo = getPromotionById("promo-01")!;

assert.strictEqual(
  isProductEligibleForPromotion(novaProduct, novaPromo),
  true,
  "Test 8a: Nova 1 Pro is eligible for Nova 1 Pro Founders Tier promotion"
);

assert.strictEqual(
  isProductEligibleForPromotion(zephyrProduct, novaPromo),
  false,
  "Test 8b: Zephyr laptop is rejected for smartphone promotion"
);

assert.strictEqual(
  isProductEligibleForPromotion(novaProduct, disabledPromo),
  false,
  "Test 8c: Product is rejected for disabled promotion"
);

// getPromotionsForProduct check
const promosForNova = getPromotionsForProduct("prod-01");
assert.strictEqual(promosForNova.length, 1, "Test 8d: Nova 1 Pro has exactly 1 active promotion");
assert.strictEqual(promosForNova[0].id, "promo-01", "Test 8e: Matching promotion correctly assigned");

// getPromotionEligibleProducts check
const eligibleProducts = getPromotionEligibleProducts(novaPromo, products);
assert.strictEqual(eligibleProducts.length, 1, "Test 8f: Promotion resolves 1 eligible product");
assert.strictEqual(eligibleProducts[0].id, "prod-01", "Test 8g: Resolved product is Nova 1 Pro");

console.log("[PASS] Test 8: Product eligibility utility and reverse lookup verified");

// ============================================================================
// TEST 9: EXISTING REGRESSIONS DEFENSE
// ============================================================================

// Catalogue integrity
assert.strictEqual(products.length, 30, "Test 9a: Centralized catalogue retains exactly 30 products");

// Nova 1 Pro base demoPrice has NOT been mutated
assert.strictEqual(
  novaProduct.demoPrice,
  129999,
  "Test 9b: Base product price in products.ts remains unmutated (₹1,29,999)"
);

// Zephyr base demoPrice has NOT been mutated
assert.strictEqual(
  zephyrProduct.demoPrice,
  289999,
  "Test 9c: Base product price for Zephyr remains unmutated (₹2,89,999)"
);

console.log("[PASS] Test 9: Zero regression on base catalogue prices and data integrity");

console.log("\nALL PROMPT 15 OFFERS & PROMOTIONS TESTS PASSED SUCCESSFULLY!\n");
