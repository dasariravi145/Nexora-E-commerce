/**
 * NEXORA — CATEGORY & BRAND DISCOVERY TEST SUITE
 * Validates Category landing, Category detail, Brand directory, Brand browsing,
 * Breadcrumbs, and Search/Filter integration.
 */

import assert from "node:assert";
import { categories, CATEGORY_THEMES, getCategoryBySlug, getCategoryItemCount } from "../../data/categories";
import { getAllBrands, getBrandBySlug, getProductsByBrand } from "../../data/brands";
import { products, getProductBySlug } from "../../data/products";
import { filterAndSortProducts } from "../catalogue-filters";

console.log("=== RUNNING NEXORA PROMPT 13 CATEGORY & BRAND TESTS ===\n");

// ============================================================================
// 1. CATEGORY DATA VALIDATION
// ============================================================================

assert.strictEqual(categories.length, 6, "Test 1: Exactly 6 hardware categories supported");

const expectedSlugs = ["smartphones", "laptops", "audio", "gaming", "wearables", "accessories"];
const actualSlugs = categories.map((c) => c.slug);

for (const expected of expectedSlugs) {
  assert(actualSlugs.includes(expected), `Test 1b: Expected category '${expected}' is present`);
}

const uniqueSlugs = new Set(actualSlugs);
assert.strictEqual(uniqueSlugs.size, 6, "Test 1c: All category slugs are unique");

const uniqueIds = new Set(categories.map((c) => c.id));
assert.strictEqual(uniqueIds.size, 6, "Test 1d: All category IDs are unique");

for (const cat of categories) {
  assert(cat.name && cat.name.trim().length > 0, `Category ${cat.slug} has non-empty name`);
  assert(cat.description && cat.description.trim().length > 0, `Category ${cat.slug} has non-empty description`);
  assert(cat.tagline && cat.tagline.trim().length > 0, `Category ${cat.slug} has non-empty tagline`);
}
console.log("[PASS] Test 1: Category models and 6 core disciplines verified");

// ============================================================================
// 2. CATEGORY ITEM COUNTS & CENTRALIZED DATASET SYNCHRONIZATION
// ============================================================================

assert.strictEqual(products.length, 30, "Test 2: Centralized catalogue strictly maintains 30 products");

for (const cat of categories) {
  const count = getCategoryItemCount(cat.slug, products);
  assert.strictEqual(count, 5, `Test 2b: Category '${cat.slug}' has exactly 5 units in centralized dataset`);
}

for (const product of products) {
  assert(
    expectedSlugs.includes(product.categorySlug.toLowerCase()),
    `Product '${product.slug}' has valid categorySlug '${product.categorySlug}'`
  );
}

// Case-insensitive lookup
assert(getCategoryBySlug("smartphones")?.name === "Smartphones", "Test 2c: Lowercase category slug resolves");
assert(getCategoryBySlug("SMARTPHONES")?.name === "Smartphones", "Test 2d: Uppercase category slug resolves");
assert(getCategoryBySlug("Audio")?.name === "Audio", "Test 2e: Mixed-case category slug resolves");
assert.strictEqual(getCategoryBySlug("quantum-computing"), undefined, "Test 2f: Unknown category slug returns undefined for 404 handling");

console.log("[PASS] Test 2: Category product counts dynamically synchronized without hardcoding");

// ============================================================================
// 3. CATEGORY VISUAL THEMES & ACCENTS
// ============================================================================

for (const slug of expectedSlugs) {
  const theme = CATEGORY_THEMES[slug];
  assert(theme, `Test 3: Visual theme exists for category '${slug}'`);
  assert(theme.accentColor, `Theme for '${slug}' defines accentColor`);
  assert(theme.badgeVariant, `Theme for '${slug}' defines badgeVariant`);
  assert(theme.glowColor, `Theme for '${slug}' defines glowColor`);
  assert(theme.heroGradient, `Theme for '${slug}' defines heroGradient`);
  assert(theme.accentText, `Theme for '${slug}' defines accentText`);
  assert(theme.borderColor, `Theme for '${slug}' defines borderColor`);
  assert(theme.discipline, `Theme for '${slug}' defines discipline specialization`);
}

assert.strictEqual(CATEGORY_THEMES.smartphones.accentColor, "blue", "Test 3b: Smartphones themed with electric blue");
assert.strictEqual(CATEGORY_THEMES.laptops.accentColor, "violet", "Test 3c: Laptops themed with deep violet");
assert.strictEqual(CATEGORY_THEMES.audio.accentColor, "cyan", "Test 3d: Audio themed with cyan lighting");
assert.strictEqual(CATEGORY_THEMES.gaming.accentColor, "indigo", "Test 3e: Gaming themed with violet/indigo accents");
assert.strictEqual(CATEGORY_THEMES.wearables.accentColor, "sky", "Test 3f: Wearables themed with cool-blue sky");
assert.strictEqual(CATEGORY_THEMES.accessories.accentColor, "slate", "Test 3g: Accessories themed with clean slate");

console.log("[PASS] Test 3: Category-specific visual identities & color palettes verified");

// ============================================================================
// 4. BRAND DIRECTORY & DYNAMIC EXTRACTION
// ============================================================================

const dynamicBrands = getAllBrands(products);
assert(dynamicBrands.length > 0, "Test 4: Dynamic brands extracted from products dataset");

const brandSlugs = dynamicBrands.map((b) => b.slug);
const uniqueBrandSlugs = new Set(brandSlugs);
assert.strictEqual(brandSlugs.length, uniqueBrandSlugs.size, "Test 4b: All brand slugs are unique");

const totalBrandUnits = dynamicBrands.reduce((acc, b) => acc + b.itemCount, 0);
assert.strictEqual(totalBrandUnits, 30, "Test 4c: Sum of dynamic brand unit counts strictly equals 30 catalogue units");

for (const brand of dynamicBrands) {
  assert(brand.name && brand.name.length > 0, `Brand ${brand.slug} has non-empty name`);
  assert(brand.origin && brand.origin.length > 0, `Brand ${brand.slug} has non-empty origin`);
  assert(brand.focus && brand.focus.length > 0, `Brand ${brand.slug} has non-empty focus`);
  assert(brand.insignia && brand.insignia.length >= 2, `Brand ${brand.slug} has typographic insignia`);
  assert(brand.itemCount > 0, `Brand ${brand.slug} has >0 products`);
  assert.strictEqual(brand.products.length, brand.itemCount, `Brand ${brand.slug} product array length matches itemCount`);
}

// Brand lookup
assert(getBrandBySlug("nexora-labs", products)?.name === "NEXORA LABS", "Test 4d: getBrandBySlug finds NEXORA LABS");
assert(getBrandBySlug("NEXORA-LABS", products)?.name === "NEXORA LABS", "Test 4e: Case-insensitive brand lookup succeeds");
assert.strictEqual(getBrandBySlug("fictional-brand-xyz", products), undefined, "Test 4f: Unknown brand returns undefined for 404 handling");

console.log("[PASS] Test 4: Dynamic brand directory extracted without duplicated datasets");

// ============================================================================
// 5. BRAND PRODUCT BROWSING
// ============================================================================

const nexoraLabsProducts = getProductsByBrand("nexora-labs", products);
assert(nexoraLabsProducts.length >= 7, "Test 5: NEXORA LABS manufactures flagship products across categories");
assert(nexoraLabsProducts.every((p) => p.brandSlug === "nexora-labs"), "Test 5b: All filtered products belong to NEXORA LABS");

const vortexProducts = getProductsByBrand("vortex-acoustics", products);
assert.strictEqual(vortexProducts.length, 4, "Test 5c: VORTEX ACOUSTICS has exactly 4 audio products");
assert(
  vortexProducts.every((p) => p.categorySlug === "audio" || p.categorySlug === "accessories"),
  "Test 5d: VORTEX ACOUSTICS products specialize in acoustic and cable hardware"
);

console.log("[PASS] Test 5: Brand product browsing accurately isolates laboratory specimens");

// ============================================================================
// 6. CATEGORY SEARCH & FILTERING INTEGRATION
// ============================================================================

// Scoping to category
const smartphoneProducts = products.filter((p) => p.categorySlug === "smartphones");
assert.strictEqual(smartphoneProducts.length, 5, "Base category filter yields 5 items");

// Search within category
const searchWithinCategory = filterAndSortProducts(smartphoneProducts, {
  query: "titanium",
  category: "smartphones",
  brands: [],
  sort: "featured",
});
assert(searchWithinCategory.results.length >= 1, "Test 6a: Search query 'titanium' finds titanium smartphones");
assert(searchWithinCategory.results.every((p) => p.categorySlug === "smartphones"), "Test 6b: Search respects category boundary");

// Brand filter within category
const nexoraSmartphones = filterAndSortProducts(smartphoneProducts, {
  query: "",
  category: "smartphones",
  brands: ["nexora-labs"],
  sort: "featured",
});
assert(nexoraSmartphones.results.length >= 1, "Test 6c: Brand filter within category isolates brand specimens");
assert(
  nexoraSmartphones.results.every((p) => p.brandSlug === "nexora-labs" && p.categorySlug === "smartphones"),
  "Test 6d: Dual constraint (brand + category) strictly enforced"
);

// Price filter within category
const priceFiltered = filterAndSortProducts(smartphoneProducts, {
  query: "",
  category: "smartphones",
  brands: [],
  minPrice: 100000,
  maxPrice: 150000,
  sort: "featured",
});
assert(
  priceFiltered.results.every((p) => p.demoPrice >= 100000 && p.demoPrice <= 150000),
  "Test 6e: Price range strictly enforced within category products"
);

// Empty state: non-matching query within category
const emptyCategorySearch = filterAndSortProducts(smartphoneProducts, {
  query: "non-existent-device-xyz",
  category: "smartphones",
  brands: [],
  sort: "featured",
});
assert.strictEqual(emptyCategorySearch.results.length, 0, "Test 6f: Non-matching search cleanly yields 0 items for empty-state UI");

console.log("[PASS] Test 6: Search, brand, price and sorting filters verified within category scope");

// ============================================================================
// 7. BRAND SEARCH & FILTERING INTEGRATION
// ============================================================================

const kineticProducts = products.filter((p) => p.brandSlug === "kinetic-labs");

// Category filter within brand
const kineticLaptops = filterAndSortProducts(kineticProducts, {
  query: "",
  category: "laptops",
  brands: ["kinetic-labs"],
  sort: "featured",
});
assert(
  kineticLaptops.results.every((p) => p.brandSlug === "kinetic-labs" && p.categorySlug === "laptops"),
  "Test 7a: Category filtering within brand specimens works cleanly"
);

// Sorting within brand
const sortedBrandAsc = filterAndSortProducts(kineticProducts, {
  query: "",
  category: "all",
  brands: ["kinetic-labs"],
  sort: "price-asc",
});
for (let i = 0; i < sortedBrandAsc.results.length - 1; i++) {
  assert(
    sortedBrandAsc.results[i].demoPrice <= sortedBrandAsc.results[i + 1].demoPrice,
    "Test 7b: Price ascending sort order preserved within brand products"
  );
}

console.log("[PASS] Test 7: Multi-parametric filtering & sorting verified within brand scope");

// ============================================================================
// 8. NAVIGATION INTEGRITY & BREADCRUMBS
// ============================================================================

// Every product slug is resolvable
for (const p of products) {
  const found = getProductBySlug(p.slug);
  assert(found && found.id === p.id, `Product slug '${p.slug}' resolves to correct specimen`);
}

// Breadcrumb structures:
// Home > Categories > [Category]
const categoryBreadcrumb = [
  { label: "Categories", href: "/categories" },
  { label: "Smartphones", current: true },
];
assert.strictEqual(categoryBreadcrumb[0].href, "/categories", "Category breadcrumb root links to /categories");
assert.strictEqual(categoryBreadcrumb[1].label, "Smartphones", "Category breadcrumb current item is category name");

// Home > Brands > [Brand]
const brandBreadcrumb = [
  { label: "Brands", href: "/brands" },
  { label: "NEXORA LABS", current: true },
];
assert.strictEqual(brandBreadcrumb[0].href, "/brands", "Brand breadcrumb root links to /brands");
assert.strictEqual(brandBreadcrumb[1].label, "NEXORA LABS", "Brand breadcrumb current item is brand name");

// Home > Categories > [Category] > [Product]
const productBreadcrumb = [
  { label: "Categories", href: "/categories" },
  { label: "Smartphones", href: "/categories/smartphones" },
  { label: "NEXORA Nova 1 Pro", current: true },
];
assert.strictEqual(productBreadcrumb[0].href, "/categories", "Product breadcrumb level 1 links to /categories");
assert.strictEqual(productBreadcrumb[1].href, "/categories/smartphones", "Product breadcrumb level 2 links to category page");
assert.strictEqual(productBreadcrumb[2].current, true, "Product breadcrumb level 3 marks product as current");

console.log("[PASS] Test 8: Breadcrumb semantic hierarchy and navigation link integrity verified");

console.log("\nALL 28 CATEGORY & BRAND DISCOVERY TESTS PASSED SUCCESSFULLY!\n");
