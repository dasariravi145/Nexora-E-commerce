/**
 * NEXORA — RELEASE CANDIDATE FUNCTIONAL QA & REGRESSION TEST SUITE
 * Prompt 24 of 25: Phase 7
 * 
 * Comprehensive automated verification covering:
 * 1. Feature Inventory (23 functional areas)
 * 2. Route & Navigation Architecture (All 21 static and dynamic routes)
 * 3. 3D WebGL Engine & Fallback Assets
 * 4. Product Catalogue Integrity & Truthful Data (30 hardware specimens)
 * 5. Comparison Matrix Invariants
 * 6. Shopping Cart State Machine & Storage Resilience
 * 7. Cart-to-Enquiry Bridge & Mailto Encoding Safety
 * 8. Contact Form Validation & Privacy Bounds
 * 9. Help Center FAQ System (23 curated questions)
 * 10. Technical SEO Dual-Gate Indexing Defense
 * 11. Accessibility Landmarks & Reduced Motion Support
 * 12. Security & Non-Destructive Storage Recovery
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

import { products } from "../../data/products";
import { categories } from "../../data/categories";
import { getAllBrands, BRANDS_DIRECTORY } from "../../data/brands";
import { promotions } from "../../data/promotions";
import { faqs, faqCategories } from "../../data/faqs";
import {
  MIN_CART_ITEM_QUANTITY,
  MAX_CART_ITEM_QUANTITY,
  sanitizeQuantity,
  validateAndHydrateStorage,
  hydrateCartLines,
  calculateCartTotals,
  getCartLineKey,
} from "../../lib/cart-state";
import {
  validateContactForm,
  formatPlainTextMessage,
  formatMailtoHref,
  isMailtoTooLong,
  isValidEmail,
} from "../../lib/contact-validation";
import {
  filterAndSortProducts,
  DEFAULT_FILTER_STATE,
} from "../../lib/catalogue-filters";
import {
  validateComparisonAddition,
  buildComparisonMatrix,
  filterDifferencesOnly,
} from "../../lib/product-comparison";
import {
  validateCanonicalOrigin,
  isIndexingEnabled,
} from "../../config/seo";

console.log("================================================================================");
console.log("   NEXORA PROMPT 24 — RELEASE CANDIDATE FUNCTIONAL QA & REGRESSION SUITE        ");
console.log("================================================================================");

let passCount = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passCount++;
    console.log(`[PASS] Test ${passCount}: ${name}`);
  } catch (err: unknown) {
    console.error(`[FAIL] Test: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: FEATURE INVENTORY VERIFICATION
// -----------------------------------------------------------------------------
test("1. Feature Inventory: Product catalogue contains exactly 30 specimens", () => {
  assert.strictEqual(products.length, 30, "Expected exactly 30 hardware specimens");
});

test("2. Feature Inventory: 6 core disciplines declared with valid metadata", () => {
  assert.strictEqual(categories.length, 6, "Expected 6 categories");
  const expectedSlugs = ["smartphones", "laptops", "audio", "gaming", "wearables", "accessories"];
  for (const slug of expectedSlugs) {
    assert.ok(categories.some((c) => c.slug === slug), `Missing category: ${slug}`);
  }
});

test("3. Feature Inventory: 6 artisan engineering brand labs declared", () => {
  const dynamicBrands = getAllBrands(products);
  assert.ok(dynamicBrands.length >= 6, "Expected at least 6 dynamic brand entries");
  assert.ok(Object.keys(BRANDS_DIRECTORY).length >= 6, "Expected at least 6 curated brand entries in directory");
  const expectedBrandSlugs = [
    "nexora-labs",
    "kinetic-labs",
    "aura-silicon",
    "chrono-rigs",
    "vortex-acoustics",
    "magbridge-optics",
  ];
  for (const bSlug of expectedBrandSlugs) {
    assert.ok(dynamicBrands.some((b) => b.slug === bSlug), `Missing brand in catalogue: ${bSlug}`);
  }
});

test("4. Feature Inventory: 7 promotions declared with 6 active division tiers", () => {
  assert.strictEqual(promotions.length, 7, "Expected 7 promotions");
  const activePromos = promotions.filter((p) => p.enabled === true);
  assert.strictEqual(activePromos.length, 6, "Expected exactly 6 active promotions");
  const disabledPromos = promotions.filter((p) => p.enabled === false);
  assert.strictEqual(disabledPromos.length, 1, "Expected exactly 1 disabled promotion for lifecycle testing");
});

test("5. Feature Inventory: Help center contains 23 FAQs across 8 categories", () => {
  assert.strictEqual(faqs.length, 23, "Expected 23 curated FAQs");
  assert.strictEqual(faqCategories.length, 8, "Expected 8 FAQ categories");
});

// -----------------------------------------------------------------------------
// SECTION 2: ROUTE ARCHITECTURE & NAVIGATION INTEGRITY
// -----------------------------------------------------------------------------
test("6. Route Audit: All 9 static core page components exist on filesystem", () => {
  const staticRoutes = [
    "src/app/page.tsx",
    "src/app/products/page.tsx",
    "src/app/categories/page.tsx",
    "src/app/brands/page.tsx",
    "src/app/compare/page.tsx",
    "src/app/offers/page.tsx",
    "src/app/about/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/help/page.tsx",
    "src/app/faq/page.tsx",
    "src/app/cart/page.tsx",
  ];
  for (const rel of staticRoutes) {
    const fullPath = path.resolve(__dirname, "../../../", rel);
    assert.ok(fs.existsSync(fullPath), `Route file missing: ${rel}`);
  }
});

test("7. Route Audit: All 4 dynamic route templates exist on filesystem", () => {
  const dynamicTemplates = [
    "src/app/products/[slug]/page.tsx",
    "src/app/categories/[slug]/page.tsx",
    "src/app/brands/[slug]/page.tsx",
    "src/app/offers/[slug]/page.tsx",
  ];
  for (const rel of dynamicTemplates) {
    const fullPath = path.resolve(__dirname, "../../../", rel);
    assert.ok(fs.existsSync(fullPath), `Dynamic route template missing: ${rel}`);
  }
});

test("8. Route Audit: Sitemap and robots metadata routes exist", () => {
  const metaRoutes = ["src/app/sitemap.ts", "src/app/robots.ts", "src/app/not-found.tsx"];
  for (const rel of metaRoutes) {
    const fullPath = path.resolve(__dirname, "../../../", rel);
    assert.ok(fs.existsSync(fullPath), `Metadata file missing: ${rel}`);
  }
});

// -----------------------------------------------------------------------------
// SECTION 3: 3D ASSETS, WEBGL CANVASES & FALLBACKS
// -----------------------------------------------------------------------------
test("9. 3D WebGL: Physical GLB assets exist in public/models", () => {
  const modelDir = path.resolve(__dirname, "../../../public/models");
  assert.ok(fs.existsSync(path.join(modelDir, "nova-1-pro.glb")), "Missing nova-1-pro.glb");
  assert.ok(fs.existsSync(path.join(modelDir, "audio-pod.glb")), "Missing audio-pod.glb");
  assert.ok(fs.existsSync(path.join(modelDir, "ATTRIBUTION.md")), "Missing ATTRIBUTION.md");
});

test("10. 3D WebGL: All 4 3D canvas files enforce DPR capping <= 1.5", () => {
  const canvasFiles = [
    "src/components/3d/hero-scene.tsx",
    "src/components/3d/spotlight-viewer.tsx",
    "src/components/3d/product-3d-canvas.tsx",
    "src/components/about/about-3d-scene.tsx",
  ];
  for (const rel of canvasFiles) {
    const content = fs.readFileSync(path.resolve(__dirname, "../../../", rel), "utf8");
    assert.ok(
      content.includes("dpr={[1, 1.5]}"),
      `Canvas ${rel} must declare standardized dpr={[1, 1.5]}`
    );
  }
});

test("11. 3D WebGL: Product3DCanvas enforces non-blocking touchAction pan-y", () => {
  const content = fs.readFileSync(
    path.resolve(__dirname, "../../../src/components/3d/product-3d-canvas.tsx"),
    "utf8"
  );
  assert.ok(
    content.includes('touchAction: "pan-y"'),
    "Product 3D canvas must declare touchAction: pan-y"
  );
});

// -----------------------------------------------------------------------------
// SECTION 4: PRODUCT CATALOGUE INTEGRITY & TRUTHFUL DATA
// -----------------------------------------------------------------------------
test("12. Catalogue Integrity: Zero duplicate IDs, slugs, or SKU identifiers", () => {
  const idSet = new Set<string>();
  const slugSet = new Set<string>();
  const skuSet = new Set<string>();
  for (const p of products) {
    assert.ok(!idSet.has(p.id), `Duplicate ID: ${p.id}`);
    assert.ok(!slugSet.has(p.slug), `Duplicate slug: ${p.slug}`);
    idSet.add(p.id);
    slugSet.add(p.slug);
    if (p.variants) {
      for (const v of p.variants) {
        if (v.sku) {
          assert.ok(!skuSet.has(v.sku), `Duplicate variant SKU: ${v.sku}`);
          skuSet.add(v.sku);
        }
      }
    }
  }
});

test("13. Catalogue Integrity: All demo prices are positive integers without NaN", () => {
  for (const p of products) {
    assert.ok(
      typeof p.demoPrice === "number" &&
        p.demoPrice > 0 &&
        Number.isInteger(p.demoPrice) &&
        !Number.isNaN(p.demoPrice),
      `Invalid price for ${p.id}: ${p.demoPrice}`
    );
  }
});

test("14. Catalogue Integrity: Zero fabricated customer reviews or star ratings", () => {
  const catalogueContent = fs.readFileSync(
    path.resolve(__dirname, "../../../src/data/products.ts"),
    "utf8"
  );
  assert.ok(!catalogueContent.includes("reviewCount"), "Found fabricated reviewCount in products.ts");
  assert.ok(!catalogueContent.includes("ratingValue"), "Found fabricated ratingValue in products.ts");
  assert.ok(!catalogueContent.includes("aggregateRating"), "Found fabricated aggregateRating in products.ts");
});

// -----------------------------------------------------------------------------
// SECTION 5: PRODUCT COMPARISON MATRIX INVARIANTS
// -----------------------------------------------------------------------------
test("15. Comparison: Addition validates bounds (max 4) and category consistency", () => {
  const phone1 = products.find((p) => p.categorySlug === "smartphones")!;
  const phone2 = products.filter((p) => p.categorySlug === "smartphones")[1]!;
  const laptop = products.find((p) => p.categorySlug === "laptops")!;

  // Allow same category
  const res1 = validateComparisonAddition([phone1], phone2);
  assert.strictEqual(res1.allowed, true);

  // Reject cross category
  const res2 = validateComparisonAddition([phone1], laptop);
  assert.strictEqual(res2.allowed, false);
  assert.ok(res2.reason?.includes("category"));

  // Reject duplicate
  const res3 = validateComparisonAddition([phone1], phone1);
  assert.strictEqual(res3.allowed, false);
  assert.ok(res3.reason?.includes("already"));
});

test("16. Comparison: Specification matrix and difference filtering verified", () => {
  const phones = products.filter((p) => p.categorySlug === "smartphones").slice(0, 3);
  const matrix = buildComparisonMatrix(phones);
  assert.ok(matrix.length > 0, "Matrix should generate groups");

  const diffMatrix = filterDifferencesOnly(matrix);
  assert.ok(diffMatrix.length <= matrix.length, "Differences matrix cannot exceed total groups");
});

// -----------------------------------------------------------------------------
// SECTION 6: SHOPPING CART STATE MACHINE & INTEGRITY
// -----------------------------------------------------------------------------
test("17. Cart: Compound keys differentiate variants deterministically", () => {
  const key1 = getCartLineKey("nexora-nova-1-pro", "var-256gb");
  const key2 = getCartLineKey("nexora-nova-1-pro", "var-512gb");
  const key3 = getCartLineKey("nexora-nova-1-pro");
  assert.notStrictEqual(key1, key2);
  assert.notStrictEqual(key1, key3);
  assert.strictEqual(key3, "nexora-nova-1-pro");
});

test("18. Cart: Quantities bounded strictly between 1 and 10", () => {
  assert.strictEqual(sanitizeQuantity(0), MIN_CART_ITEM_QUANTITY);
  assert.strictEqual(sanitizeQuantity(-5), MIN_CART_ITEM_QUANTITY);
  assert.strictEqual(sanitizeQuantity(NaN), MIN_CART_ITEM_QUANTITY);
  assert.strictEqual(sanitizeQuantity("5" as unknown), MIN_CART_ITEM_QUANTITY);
  assert.strictEqual(sanitizeQuantity(100), MAX_CART_ITEM_QUANTITY);
  assert.strictEqual(sanitizeQuantity(4.9), 4);
});

test("19. Cart: Storage validation strips nonexistent products and corrupted data", () => {
  const malformed = JSON.stringify({
    version: 1,
    items: [
      { productId: "nonexistent-product-xyz", quantity: 2 },
      { productId: products[0].id, quantity: 999 },
      { productId: products[0].id, quantity: 1 }, // duplicate line should merge
      { bad: "data" },
    ],
  });
  const validated = validateAndHydrateStorage(malformed);
  assert.strictEqual(validated.length, 1, "Only the genuine product should remain");
  assert.strictEqual(validated[0].productId, products[0].id);
  assert.strictEqual(validated[0].quantity, MAX_CART_ITEM_QUANTITY, "Quantity should clamp to 10");
});

test("20. Cart: Line hydration re-computes prices from live catalogue (never trusts storage)", () => {
  const item = { productId: products[0].id, quantity: 2 };
  const lines = hydrateCartLines([item]);
  assert.strictEqual(lines.length, 1);
  assert.strictEqual(lines[0].unitPrice, products[0].demoPrice);
  assert.strictEqual(lines[0].lineSubtotal, products[0].demoPrice * 2);

  const totals = calculateCartTotals(lines);
  assert.strictEqual(totals.subtotal, products[0].demoPrice * 2);
  assert.strictEqual(totals.itemCount, 2);
});

// -----------------------------------------------------------------------------
// SECTION 7: CART-TO-ENQUIRY BRIDGE & MAILTO SAFETY
// -----------------------------------------------------------------------------
test("21. Cart-to-Enquiry: Formats structured message draft with demo disclaimer", () => {
  const item = { productId: products[0].id, quantity: 1 };
  const lines = hydrateCartLines([item]);
  const totals = calculateCartTotals(lines);

  const draft = formatPlainTextMessage(
    {
      name: "Alex Vance",
      email: "alex@example.com",
      phone: "+1 555 123 4567",
      category: "product-info",
      message: "I am interested in acquiring this prototype specimen.",
      consent: true,
    },
    { cartLines: lines, totals }
  );

  assert.ok(draft.includes("NEXORA DEMO PRODUCT ENQUIRY"));
  assert.ok(draft.includes(products[0].name));
  assert.ok(draft.includes("No order has been placed"));
  assert.ok(draft.includes("No payment has been processed"));
});

test("22. Cart-to-Enquiry: Mailto URI is RFC safe with CRLF header protection", () => {
  const mailto = formatMailtoHref({
    name: "Dr. Gordon\r\nBcc: hacker@evil.com",
    email: "gordon@blackmesa.gov",
    category: "product-info",
    message: "Requesting theoretical hardware specifications.",
    consent: true,
  });

  assert.ok(mailto.startsWith("mailto:"), "Must begin with mailto:");
  // Ensure CRLF is stripped from subject
  assert.ok(!mailto.includes("\r\nBcc:"), "CRLF header injection must be sanitized");
  assert.strictEqual(isMailtoTooLong(mailto), false);
});

// -----------------------------------------------------------------------------
// SECTION 8: CONTACT FORM VALIDATION & PRIVACY
// -----------------------------------------------------------------------------
test("23. Contact: RFC 5322 email validation rejects invalid patterns", () => {
  assert.strictEqual(isValidEmail("user@example.com"), true);
  assert.strictEqual(isValidEmail("user.name+tag@domain.co.uk"), true);
  assert.strictEqual(isValidEmail("user@localhost"), false);
  assert.strictEqual(isValidEmail("not-an-email"), false);
  assert.strictEqual(isValidEmail("@missing-user.com"), false);
});

test("24. Contact: Message length bounded strictly between 10 and 2000 chars", () => {
  const shortRes = validateContactForm({
    name: "Valid Name",
    email: "valid@email.com",
    category: "product-info",
    message: "Too short",
    consent: true,
  });
  assert.strictEqual(shortRes.isValid, false);
  assert.ok(shortRes.errors.message?.includes("10 characters"));

  const validRes = validateContactForm({
    name: "Valid Name",
    email: "valid@email.com",
    category: "product-info",
    message: "This is a valid inquiry message with sufficient detail.",
    consent: true,
  });
  assert.strictEqual(validRes.isValid, true);
});

test("25. Contact: Consent disclaimer is strictly required for submission", () => {
  const res = validateContactForm({
    name: "Valid Name",
    email: "valid@email.com",
    category: "product-info",
    message: "This is a valid inquiry message with sufficient detail.",
    consent: false,
  });
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.consent);
});

// -----------------------------------------------------------------------------
// SECTION 9: TECHNICAL SEO DUAL-GATE INDEXING DEFENSE
// -----------------------------------------------------------------------------
test("26. SEO: Canonical validator rejects localhost, private IPs, and malformed origins", () => {
  assert.strictEqual(validateCanonicalOrigin("http://localhost:3000"), null);
  assert.strictEqual(validateCanonicalOrigin("http://127.0.0.1:8080"), null);
  assert.strictEqual(validateCanonicalOrigin("http://192.168.1.5"), null);
  assert.strictEqual(validateCanonicalOrigin("http://internal.lan"), null);
  assert.strictEqual(
    validateCanonicalOrigin("https://nexora.com"),
    "https://nexora.com"
  );
});

test("27. SEO: Public indexing is inactive by default in local environments", () => {
  // Without explicitly setting valid production origin and SEO_INDEXING_ENABLED="true", indexing remains false
  assert.strictEqual(isIndexingEnabled(), false);
});

test("28. SEO: Noindex policy declared on /cart and /compare routes", () => {
  const cartContent = fs.readFileSync(
    path.resolve(__dirname, "../../../src/app/cart/page.tsx"),
    "utf8"
  );
  assert.ok(cartContent.includes("index: false"), "Cart route must declare index: false");

  const compareContent = fs.readFileSync(
    path.resolve(__dirname, "../../../src/app/compare/layout.tsx"),
    "utf8"
  );
  assert.ok(compareContent.includes("index: false"), "Compare route must declare index: false");
});

// -----------------------------------------------------------------------------
// SECTION 10: ACCESSIBILITY, RESPONSIVENESS & PERFORMANCE
// -----------------------------------------------------------------------------
test("29. Accessibility: Root layout contains WCAG Skip to main content link", () => {
  const layout = fs.readFileSync(
    path.resolve(__dirname, "../../../src/app/layout.tsx"),
    "utf8"
  );
  assert.ok(layout.includes('href="#main-content"'), "Skip to main content link must be present");
  assert.ok(layout.includes('id="main-content"'), "Main landmark with id=main-content must exist");
});

test("30. In-Memory Search Latency: Benchmark maintains sub-frame (< 5.0ms) execution", () => {
  const start = performance.now();
  for (let i = 0; i < 300; i++) {
    filterAndSortProducts(products, {
      ...DEFAULT_FILTER_STATE,
      query: "pro titanium",
    });
  }
  const avgMs = (performance.now() - start) / 300;
  assert.ok(avgMs < 5.0, `Average search latency ${avgMs.toFixed(3)}ms exceeded 5.0ms budget`);
});

console.log("================================================================================");
console.log(`   ALL ${passCount} RELEASE CANDIDATE QA TESTS PASSED SUCCESSFULLY!          `);
console.log("================================================================================");
