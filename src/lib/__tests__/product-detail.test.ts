import {
  products,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
} from "@/data/products";
import {
  formatINR,
  formatVariantLabel,
  isDescriptorRedundant,
  getProductStartingPrice,
} from "@/lib/format";
import type { Product } from "@/types/product";
import {
  hydrateCartLines,
  calculateCartTotals,
  addItemToCart,
} from "@/lib/cart-state";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
}

console.log("=== RUNNING NEXORA PROMPT 11 PRODUCT DETAIL TESTS ===\n");

// 1. Product route rendering & data lookup
const nova1Pro = getProductBySlug("nexora-nova-1-pro");
assert(!!nova1Pro, "Test 1: Valid slug 'nexora-nova-1-pro' resolves to product");
assert(nova1Pro?.name === "NEXORA Nova 1 Pro", "Test 1b: Product name matches dataset");
assert(nova1Pro?.category === "Smartphones", "Test 1c: Product category correctly attributed");
assert(nova1Pro?.currency === "INR", "Test 1d: Standardized on INR currency");
const novaById = getProductById("prod-01");
assert(!!novaById && novaById.slug === "nexora-nova-1-pro", "Test 1e: getProductById('prod-01') resolves to Nova 1 Pro");

// 2. Unknown slug handling (404 condition)
const unknownProduct = getProductBySlug("non-existent-device-xyz");
assert(unknownProduct === undefined, "Test 2: Unknown slug returns undefined for 404 handling");

// 3. Multi-image gallery verification
assert(Array.isArray(nova1Pro?.images) && (nova1Pro?.images.length || 0) >= 3, "Test 3: Nova 1 Pro has multi-image gallery (>= 3 angles)");
assert(nova1Pro?.images[0].isPrimary === true, "Test 3b: First image has isPrimary flag true");
assert(!!nova1Pro?.images[0].alt, "Test 3c: All gallery images have descriptive alt text");

// 4. Single-image behavior verification
const photon = getProductBySlug("kinetic-photon-horizon");
assert(!!photon && photon.images.length === 1, "Test 4: Single-image product has exactly 1 image");

// 5. Variant selection & data model
assert(!!nova1Pro?.variants && nova1Pro.variants.length >= 3, "Test 5: Nova 1 Pro has multiple variants");
const var01a = nova1Pro?.variants?.find((v) => v.id === "var-01a");
const var01b = nova1Pro?.variants?.find((v) => v.id === "var-01b");
const var01c = nova1Pro?.variants?.find((v) => v.id === "var-01c");
assert(!!var01a && var01a.colorName === "Obsidian", "Test 5b: Variant 01a has Obsidian colorway");
assert(!!var01b && var01b.colorName === "Electric Azure", "Test 5c: Variant 01b has Electric Azure colorway");
assert(!!var01c && var01c.storage === "1TB Unified", "Test 5d: Variant 01c has 1TB Unified capacity");

// 6. Variant price delta computation
const basePrice = nova1Pro?.demoPrice ?? 0;
const deltaB = var01b?.demoPriceDelta ?? 0;
const deltaC = var01c?.demoPriceDelta ?? 0;
assert(deltaB === 15000, "Test 6: Variant 01b has exact demo price delta (+₹15,000)");
assert(deltaC === 30000, "Test 6b: Variant 01c has exact demo price delta (+₹30,000)");
assert(basePrice + deltaB === 144999, "Test 6c: Dynamic variant price equals ₹1,44,999");
assert(formatINR(basePrice + deltaB) === "₹1,44,999.00", "Test 6d: Correct INR formatting for variant price");

// 7. Non-variant products (no invented variants)
const dock = getProductBySlug("nexora-magbridge-dock");
assert(!!dock && (!dock.variants || dock.variants.length === 0), "Test 7: Single-SKU product has no variants (no invented variants)");

// 8. Laptop RAM + Storage variants
const zephyr16 = getProductBySlug("nexora-zephyr-16-studio");
assert(!!zephyr16 && !!zephyr16.variants && zephyr16.variants.length === 3, "Test 8: Zephyr 16 has 3 RAM+Storage variants");
assert(zephyr16?.variants?.[0].ram === "32GB RAM", "Test 8b: Zephyr 16 base has 32GB RAM");
assert(zephyr16?.variants?.[1].ram === "64GB RAM", "Test 8c: Zephyr 16 mid has 64GB RAM");
assert(zephyr16?.variants?.[2].ram === "128GB RAM", "Test 8d: Zephyr 16 extreme has 128GB RAM");

// 9. Headphones Colorway variants
const planar = getProductBySlug("vortex-resonance-planar");
assert(!!planar && !!planar.variants && planar.variants.length === 3, "Test 9: Vortex Planar has 3 color variants");
assert(planar?.variants?.[0].colorHex === "#1E293B", "Test 9b: Planar matte carbon color hex");
assert(planar?.variants?.[1].colorHex === "#1E40AF", "Test 9c: Planar anodized cobalt color hex");

// 10. Wearable Size variants
const watch = getProductBySlug("chrono-pulse-telemetry-watch");
assert(!!watch && !!watch.variants && watch.variants.length === 2, "Test 10: Telemetry watch has 42mm and 46mm size variants");
assert(watch?.variants?.[0].size === "42mm", "Test 10b: Watch base size is 42mm");
assert(watch?.variants?.[1].size === "46mm" && watch?.variants?.[1].demoPriceDelta === 8000, "Test 10c: Watch 46mm size has +₹8,000 delta");

// 11. Specifications rendering & category adaptability
assert(Array.isArray(nova1Pro?.specifications) && nova1Pro.specifications.length > 0, "Test 11: Nova 1 Pro specifications present");
assert(Array.isArray(zephyr16?.specifications) && zephyr16.specifications.length > 0, "Test 11b: Zephyr 16 specifications present");
assert(Array.isArray(planar?.specifications) && planar.specifications.length > 0, "Test 11c: Audio specifications present");
const displaySpec = nova1Pro?.specifications.find((s) => s.group === "Display");
const acousticSpec = planar?.specifications.find((s) => s.group === "Acoustics");
assert(!!displaySpec, "Test 11d: Display spec group dynamically parsed");
assert(!!acousticSpec, "Test 11e: Acoustics spec group dynamically parsed");

// 12. Related products selection
if (nova1Pro) {
  const relatedNova = getRelatedProducts(nova1Pro, 4);
  assert(relatedNova.length === 4, "Test 12: Returns exactly 4 related products");
  assert(!relatedNova.some((p) => p.slug === nova1Pro.slug), "Test 12b: Excludes current product from related list");
  assert(relatedNova.every((p) => p.categorySlug === "smartphones"), "Test 12c: Prioritizes remaining units from same category");
  
  // Test uniqueness
  const uniqueIds = new Set(relatedNova.map((p) => p.id));
  assert(uniqueIds.size === relatedNova.length, "Test 12d: No duplicate units in related products");
}

// 13. Regression: Catalogue filters and 30 products baseline
assert(products.length === 30, "Test 13: Centralized catalogue strictly maintains 30 products");

// =========================================================================
// PHASE 5.1 FOCUSED REGRESSION TESTS: VARIANT DEDUPLICATION & STARTING PRICES
// =========================================================================

console.log("\n=== RUNNING PHASE 5.1 VARIANT & PRICING REGRESSION TESTS ===");

// Test 14: No duplicate storage/capacity descriptor in variant selector logic
const allCatalogueVariants = products.flatMap((p) => p.variants || []);
assert(allCatalogueVariants.length > 0, "Test 14a: Found catalogue variants to inspect");

for (const v of allCatalogueVariants) {
  if (v.storage && v.name.includes(v.storage)) {
    assert(
      isDescriptorRedundant(v.storage, v.name) === true,
      `Test 14b: Storage '${v.storage}' correctly flagged redundant for variant '${v.name}'`
    );
  }
  if (v.ram && v.name.includes(v.ram)) {
    assert(
      isDescriptorRedundant(v.ram, v.name) === true,
      `Test 14c: RAM '${v.ram}' correctly flagged redundant for variant '${v.name}'`
    );
  }
  if (v.size && v.name.includes(v.size)) {
    assert(
      isDescriptorRedundant(v.size, v.name) === true,
      `Test 14d: Size '${v.size}' correctly flagged redundant for variant '${v.name}'`
    );
  }
}

// Specifically test Nova 1 Pro (var-01b: 512GB Unified)
assert(
  isDescriptorRedundant(var01b?.storage, var01b?.name) === true,
  "Test 14e: Nova 1b storage '512GB Unified' is redundant in 'Electric Azure • 512GB Unified'"
);

// Specifically test Zephyr 16 (var-06a: 32GB RAM / 1TB SSD)
const zephyrBase = zephyr16?.variants?.[0];
assert(!!zephyrBase, "Test 14f: Zephyr 16 base variant resolved");
assert(
  isDescriptorRedundant(zephyrBase?.storage, zephyrBase?.name) === true,
  "Test 14g: Zephyr storage '1TB SSD' is redundant in '32GB RAM • 1TB NVMe SSD'"
);
assert(
  isDescriptorRedundant(zephyrBase?.ram, zephyrBase?.name) === true,
  "Test 14h: Zephyr RAM '32GB RAM' is redundant in '32GB RAM • 1TB NVMe SSD'"
);

// Specifically test Iris Pro (var-16a: 256GB Spatial Core)
const irisPro = getProductBySlug("nexora-iris-pro-spatial-rig");
const irisBase = irisPro?.variants?.[0];
assert(!!irisBase, "Test 14i: Iris Pro base variant resolved");
assert(
  isDescriptorRedundant(irisBase?.storage, irisBase?.name) === true,
  "Test 14j: Iris Pro storage '256GB Spatial Core' is redundant in '256GB Spatial Core'"
);

// Specifically test Chrono Pulse Watch (var-22a: 42mm Case • Aerospace Titanium)
const watchBase = watch?.variants?.[0];
assert(!!watchBase, "Test 14k: Chrono Pulse base variant resolved");
assert(
  isDescriptorRedundant(watchBase?.size, watchBase?.name) === true,
  "Test 14l: Watch size '42mm' is redundant in '42mm Case • Aerospace Titanium'"
);

// Test 15: No duplicate descriptor in cart item display
// The formatVariantLabel helper must produce clean labels without repeating storage/RAM/size
const nova1bLabel = formatVariantLabel(var01b!);
assert(
  nova1bLabel === "Electric Azure • 512GB Unified",
  `Test 15a: Cart label for Nova 1b contains storage exactly once: '${nova1bLabel}'`
);
assert(
  !nova1bLabel.includes("512GB Unified • 512GB Unified") && !nova1bLabel.includes("Unified Unified"),
  "Test 15b: Cart label has no duplicate '512GB Unified' or 'Unified Unified'"
);

const zephyrBaseLabel = formatVariantLabel(zephyrBase!);
assert(
  zephyrBaseLabel === "32GB RAM • 1TB NVMe SSD",
  `Test 15c: Cart label for Zephyr base contains specs exactly once: '${zephyrBaseLabel}'`
);

const irisBaseLabel = formatVariantLabel(irisBase!);
assert(
  irisBaseLabel === "256GB Spatial Core",
  `Test 15d: Cart label for Iris Pro contains capacity exactly once: '${irisBaseLabel}'`
);

// If an attribute is NOT present in the variant name, it must be appended cleanly
const mockVariantWithoutStorage = {
  id: "mock-01",
  name: "Obsidian Titanium",
  sku: "N1P-OBS-RAW",
  storage: "512GB Unified",
};
assert(
  formatVariantLabel(mockVariantWithoutStorage) === "Obsidian Titanium • 512GB Unified",
  "Test 15e: Variant missing storage in name gets storage appended cleanly"
);

// Test 16: Correct rendering for single-variant / no-variant products
const singleVariantProducts = products.filter((p) => !p.variants || p.variants.length <= 1);
assert(singleVariantProducts.length === 24, "Test 16a: Exactly 24 single-price / no-variant products in catalogue");
for (const p of singleVariantProducts) {
  const priceInfo = getProductStartingPrice(p);
  assert(priceInfo.hasPriceRange === false, `Test 16b: Product ${p.slug} has no price range`);
  assert(priceInfo.displayPrice === p.formattedPrice, `Test 16c: Product ${p.slug} displayPrice equals formattedPrice`);
  assert(!priceInfo.displayPrice.startsWith("From"), `Test 16d: Product ${p.slug} does NOT start with 'From'`);
}

// Test 17: Correct 'From' label for differently priced variants
const multiPricedProducts = [
  { slug: "nexora-nova-1-pro", expectedMin: "₹1,29,999.00" },
  { slug: "nexora-zephyr-16-studio", expectedMin: "₹2,89,999.00" },
  { slug: "nexora-iris-pro-spatial-rig", expectedMin: "₹2,49,999.00" },
  { slug: "chrono-pulse-telemetry-watch", expectedMin: "₹69,999.00" },
];
for (const item of multiPricedProducts) {
  const p = getProductBySlug(item.slug);
  assert(!!p, `Test 17a: Product ${item.slug} resolved`);
  const priceInfo = getProductStartingPrice(p!);
  assert(priceInfo.hasPriceRange === true, `Test 17b: ${item.slug} has price range`);
  assert(priceInfo.displayPrice === `From ${item.expectedMin}`, `Test 17c: ${item.slug} has starting price 'From ${item.expectedMin}' (got '${priceInfo.displayPrice}')`);
  assert(priceInfo.formattedMinPrice === item.expectedMin, `Test 17d: ${item.slug} formattedMinPrice is '${item.expectedMin}'`);
}

// Test 18: No unnecessary 'From' label for equal-priced variants
const equalPricedProducts = [
  { slug: "vortex-resonance-planar", expectedPrice: "₹79,999.00" },
  { slug: "aura-kinetic-neural-ring", expectedPrice: "₹44,999.00" },
];
for (const item of equalPricedProducts) {
  const p = getProductBySlug(item.slug);
  assert(!!p, `Test 18a: Product ${item.slug} resolved`);
  const priceInfo = getProductStartingPrice(p!);
  assert(priceInfo.hasPriceRange === false, `Test 18b: ${item.slug} variants have equal prices, hasPriceRange must be false`);
  assert(priceInfo.displayPrice === item.expectedPrice, `Test 18c: ${item.slug} retains fixed price '${item.expectedPrice}' without 'From'`);
  assert(!priceInfo.displayPrice.startsWith("From"), `Test 18d: ${item.slug} does NOT have 'From' prefix`);
}

// Test 19: Correct displayed minimum price calculation
// Verify minimum is calculated correctly even if variants have custom ordering or non-zero min delta
const mockProductWithMixedDeltas: Product = {
  id: "test-prod-deltas",
  slug: "test-prod-deltas",
  name: "Test Delta Product",
  brand: "NEXORA LABS",
  brandSlug: "nexora-labs",
  category: "Smartphones",
  categorySlug: "smartphones",
  tagline: "Delta test",
  description: "Test description",
  demoPrice: 100000,
  formattedPrice: formatINR(100000),
  currency: "INR",
  images: [{ url: "/test.svg", alt: "Test", isPrimary: true }],
  specifications: [],
  features: [],
  has3DModel: false,
  highlightBadge: "Test",
  badgeVariant: "electric",
  featured: false,
  specs: [],
  variants: [
    { id: "v1", name: "High Spec", sku: "T-HIGH", demoPriceDelta: 20000 },
    { id: "v2", name: "Base Spec", sku: "T-BASE", demoPriceDelta: 0 },
    { id: "v3", name: "Mid Spec", sku: "T-MID", demoPriceDelta: 10000 },
  ],
};
const mixedPriceInfo = getProductStartingPrice(mockProductWithMixedDeltas);
assert(mixedPriceInfo.hasPriceRange === true, "Test 19a: Mixed delta product has price range");
assert(mixedPriceInfo.minPrice === 100000, "Test 19b: Correct minimum price is ₹1,00,000");
assert(mixedPriceInfo.displayPrice === `From ${formatINR(100000)}`, "Test 19c: Correct display price starts from minimum");

// Test 20: Cart calculations integrity check
// Ensure cart calculation formulas and line hydration remain completely unchanged
const testHydratedLines = hydrateCartLines([
  {
    productId: "prod-01",
    variantId: "var-01b", // 129999 + 15000 = 144999
    quantity: 2,
  },
  {
    productId: "prod-11",
    variantId: "var-11a", // 79999 + 0 = 79999
    quantity: 1,
  },
]);
assert(testHydratedLines.length === 2, "Test 20a: Exactly 2 hydrated cart lines");
assert(testHydratedLines[0].unitPrice === 144999, "Test 20b: Variant unitPrice matches 144999");
assert(testHydratedLines[0].lineSubtotal === 289998, "Test 20c: Variant lineSubtotal matches 289998");
assert(testHydratedLines[1].unitPrice === 79999, "Test 20d: Planar unitPrice matches 79999");

const calculatedTotals = calculateCartTotals(testHydratedLines);
assert(calculatedTotals.subtotal === 289998 + 79999, "Test 20e: Cart subtotal exact (369997)");
assert(calculatedTotals.itemCount === 3, "Test 20f: Cart total item count exact (3)");
assert(calculatedTotals.formattedSubtotal === formatINR(369997), "Test 20g: Formatted subtotal exact");

// Test 21: AI Add to Bag confirmation integrity
// Ensure cart state reducer preserves two distinct variants as separate lines
const novaProd = getProductById("prod-01")!;
const itemsAfterAdd1 = addItemToCart([], novaProd, var01a, 1);
const itemsAfterAdd2 = addItemToCart(itemsAfterAdd1, novaProd, var01b, 1);
assert(itemsAfterAdd2.length === 2, "Test 21a: Two distinct variants of prod-01 exist as separate cart items");
assert(itemsAfterAdd2[0].variantId === "var-01a", "Test 21b: First cart item has var-01a");
assert(itemsAfterAdd2[1].variantId === "var-01b", "Test 21c: Second cart item has var-01b");

console.log("\n=== SUMMARY: ALL PRODUCT DETAIL & PHASE 5.1 TESTS PASSED ===");

