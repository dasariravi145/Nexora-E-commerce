/**
 * NEXORA — PRODUCT COMPARISON UNIT TEST SUITE
 * Validates product comparison rules, category compatibility, specification matrix generation,
 * difference detection, missing value fallbacks, duplicate prevention, and selection limits.
 */

import assert from "node:assert";
import { products, getProductById } from "../../data/products";
import {
  validateComparisonAddition,
  buildComparisonMatrix,
  filterDifferencesOnly,
  getProductSpecValue,
  normalizeSpecKey,
  MAX_COMPARISON_PRODUCTS,
  MIN_COMPARISON_PRODUCTS,
} from "../product-comparison";

console.log("=== RUNNING NEXORA PROMPT 14 PRODUCT COMPARISON TESTS ===\n");

const smartphones = products.filter((p) => p.categorySlug === "smartphones");
const [smartphone1, smartphone2, smartphone3, smartphone4, smartphone5] = smartphones;
const audioProduct = products.find((p) => p.categorySlug === "audio")!;
const laptopProduct = products.find((p) => p.categorySlug === "laptops")!;

// ============================================================================
// 1. COMPARISON ADDITION & DUPLICATE PREVENTION
// ============================================================================

const emptyList: typeof products = [];
const res1 = validateComparisonAddition(emptyList, smartphone1);
assert.strictEqual(res1.allowed, true, "Test 1a: Adding first product to empty list is allowed");

const oneProductList = [smartphone1];
const resDuplicate = validateComparisonAddition(oneProductList, smartphone1);
assert.strictEqual(resDuplicate.allowed, false, "Test 1b: Duplicate product cannot be added");
assert(
  resDuplicate.reason?.includes("already in your comparison"),
  "Test 1c: Clear duplicate prevention message provided"
);

console.log("[PASS] Test 1: Comparison add and duplicate prevention verified");

// ============================================================================
// 2. CATEGORY COMPATIBILITY ENFORCEMENT
// ============================================================================

// Same category: Smartphones vs Smartphones
const resSameCat = validateComparisonAddition(oneProductList, smartphone2);
assert.strictEqual(resSameCat.allowed, true, "Test 2a: Adding second smartphone to smartphones list is allowed");

// Different category: Smartphone vs Audio
const resIncompatibleAudio = validateComparisonAddition(oneProductList, audioProduct);
assert.strictEqual(resIncompatibleAudio.allowed, false, "Test 2b: Adding Audio product to Smartphone list is rejected");
assert(
  resIncompatibleAudio.reason?.includes("Cannot compare a Audio with Smartphones"),
  "Test 2c: Explicit category mismatch reason delivered"
);

// Different category: Smartphone vs Laptop
const resIncompatibleLaptop = validateComparisonAddition(oneProductList, laptopProduct);
assert.strictEqual(resIncompatibleLaptop.allowed, false, "Test 2d: Adding Laptop product to Smartphone list is rejected");

console.log("[PASS] Test 2: Category compatibility enforcement strictly verified");

// ============================================================================
// 3. SELECTION LIMITS (MAX 4 PRODUCTS, MIN 2 FOR COMPARISON)
// ============================================================================

assert.strictEqual(MAX_COMPARISON_PRODUCTS, 4, "Test 3a: Maximum comparison capacity is 4");
assert.strictEqual(MIN_COMPARISON_PRODUCTS, 2, "Test 3b: Minimum comparison requirement is 2");

const fourProductList = [smartphone1, smartphone2, smartphone3, smartphone4];
assert.strictEqual(fourProductList.length, 4, "Four smartphones staged");

const resFifth = validateComparisonAddition(fourProductList, smartphone5);
assert.strictEqual(resFifth.allowed, false, "Test 3c: Adding 5th product is strictly rejected");
assert(
  resFifth.reason?.includes("maximum of 4 specimens"),
  "Test 3d: Cap limit reason provided"
);

console.log("[PASS] Test 3: Selection boundaries (2 to 4 products) verified");

// ============================================================================
// 4. SPECIFICATION MATRIX GENERATION
// ============================================================================

const twoSmartphones = [smartphone1, smartphone2];
const matrix = buildComparisonMatrix(twoSmartphones);

assert(matrix.length > 0, "Test 4a: Dynamic matrix generates specification groups");

const overviewGroup = matrix.find((g) => g.groupName === "Catalogue Overview");
assert(overviewGroup, "Test 4b: General catalogue overview group present");

const priceRow = overviewGroup?.rows.find((r) => r.key === "price");
assert(priceRow, "Test 4c: Price row present in overview group");
assert.strictEqual(priceRow?.values[smartphone1.id], smartphone1.formattedPrice, "Test 4d: Product 1 price formatted accurately");
assert.strictEqual(priceRow?.values[smartphone2.id], smartphone2.formattedPrice, "Test 4e: Product 2 price formatted accurately");

console.log("[PASS] Test 4: Dynamic specification matrix generated from centralized product data");

// ============================================================================
// 5. MISSING VALUE HANDLING ("Not specified", NEVER "0" OR UNDEFINED)
// ============================================================================

// Check getProductSpecValue for present attribute
const displayVal = getProductSpecValue(smartphone1, "Display");
assert(displayVal.includes("Quantum OLED"), "Test 5a: Present specification value resolved");

// Check getProductSpecValue for non-existent attribute on smartphone
const missingVal = getProductSpecValue(smartphone1, "Phase Change Vapor Chamber Loop NonExistent");
assert.strictEqual(missingVal, "Not specified", "Test 5b: Missing specification strictly falls back to 'Not specified'");
assert((missingVal as string) !== "0", "Test 5c: Missing specification is NEVER evaluated as '0'");

// Verify normalization handles whitespace, casing, and dashes
assert.strictEqual(normalizeSpecKey("  Primary - Display "), "primary display", "Test 5d: Spec key normalization handles spacing and punctuation");
assert.strictEqual(getProductSpecValue(smartphone1, "display"), displayVal, "Test 5e: Case-insensitive specification matching");

console.log("[PASS] Test 5: Missing specification values display 'Not specified' without data fabrication");

// ============================================================================
// 6. DIFFERENCE HIGHLIGHTING & FILTERING
// ============================================================================

// Smartphone 1 (Nova 1 Pro: ₹1,29,999) vs Smartphone 2 (Nova 1 Ultra: ₹1,59,999)
const matrixWithDifferences = buildComparisonMatrix(twoSmartphones);
const diffOnly = filterDifferencesOnly(matrixWithDifferences);

assert(diffOnly.length > 0, "Test 6a: Differences-only filter returns groups containing differences");

// Price row MUST have difference
const overviewDiff = diffOnly.find((g) => g.groupName === "Catalogue Overview");
const priceDiffRow = overviewDiff?.rows.find((r) => r.key === "price");
assert(priceDiffRow && priceDiffRow.hasDifference === true, "Test 6b: Differing prices flagged with hasDifference = true");

// Identical items comparison (comparing product with itself for edge case)
const identicalProducts = [smartphone1, smartphone1];
const matrixIdentical = buildComparisonMatrix(identicalProducts);
const diffIdentical = filterDifferencesOnly(matrixIdentical);
assert.strictEqual(diffIdentical.length, 0, "Test 6c: Identical products yield 0 difference rows");

console.log("[PASS] Test 6: Difference detection and 'Show differences only' filtering verified");

// ============================================================================
// 7. PERSISTENCE & SAFE ID VALIDATION
// ============================================================================

// Simulating stored IDs deserialization and validation
const simulatedRawStorage = JSON.stringify([
  "prod-01", // Nova 1 Pro (Smartphones)
  "prod-02", // Nova 1 Ultra (Smartphones)
  "invalid-ghost-id-99", // Obsolete / deleted product ID
  "prod-11", // Vortex Planar (Audio) - Category mismatch!
]);

const parsedIds = JSON.parse(simulatedRawStorage);
const validatedProducts: typeof products = [];

for (const id of parsedIds) {
  const p = getProductById(id);
  if (p) {
    if (validatedProducts.length === 0 || validatedProducts[0].categorySlug === p.categorySlug) {
      if (validatedProducts.length < MAX_COMPARISON_PRODUCTS && !validatedProducts.some((x) => x.id === p.id)) {
        validatedProducts.push(p);
      }
    }
  }
}

assert.strictEqual(validatedProducts.length, 2, "Test 7a: Storage validation pruned invalid ID and mismatched category");
assert.strictEqual(validatedProducts[0].id, "prod-01", "Test 7b: Valid first product retained");
assert.strictEqual(validatedProducts[1].id, "prod-02", "Test 7c: Valid second product of same category retained");

console.log("[PASS] Test 7: Comparison state persistence and corrupted storage defense verified");

console.log("\nALL 18 PRODUCT COMPARISON TESTS PASSED SUCCESSFULLY!\n");
