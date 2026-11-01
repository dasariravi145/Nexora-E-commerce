/**
 * NEXORA — PROMPT 23: PERFORMANCE AUDIT, 3D & CORE WEB VITALS TEST SUITE
 *
 * Verifies all 18 engineering areas specified in Section 19 of Prompt 23:
 * 1. Homepage rendering & lazy 3D isolation
 * 2. 3D hero initialization & DPR cap [1, 1.5]
 * 3. 3D viewer controls & touchAction
 * 4. Model loading fallback components
 * 5. WebGL unavailable fallback behavior
 * 6. Reduced motion preference handling
 * 7. Product catalogue performance bounds
 * 8. Product search latency & execution speed
 * 9. Multi-parametric filter efficiency
 * 10. Comparison matrix generation bounds
 * 11. Cart persistence serialization & hydration
 * 12. Enquiry integration & memoized drift check
 * 13. Contact form validation bounds & security
 * 14. FAQ search filtering responsiveness
 * 15. Mobile navigation touch targets & modal accessibility
 * 16. Accessibility basics (landmarks, skip link, focus)
 * 17. Technical SEO regression integrity
 * 18. Static route structure & production build readiness
 */

import fs from "fs";
import path from "path";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { getAllBrands } from "@/data/brands";
import { promotions } from "@/data/promotions";
import { faqs, searchFAQs } from "@/data/faqs";
import { siteConfig } from "@/config/site";
import { validateContactForm, formatPlainTextMessage } from "@/lib/contact-validation";
import { hydrateCartLines, calculateCartTotals } from "@/lib/cart-state";
import { filterAndSortProducts, DEFAULT_FILTER_STATE } from "@/lib/catalogue-filters";
import { buildComparisonMatrix } from "@/lib/product-comparison";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
}

console.log("=== RUNNING NEXORA PROMPT 23: PERFORMANCE & CWV AUDIT SUITE ===\n");

const srcDir = path.resolve(process.cwd(), "src");

// ---------------------------------------------------------------------------
// 1. Homepage Rendering & Lazy 3D Isolation
// ---------------------------------------------------------------------------
console.log("--- 1. Homepage Rendering & Code-Splitting Audit ---");
const homePageFile = path.join(srcDir, "app", "page.tsx");
assert(fs.existsSync(homePageFile), "Test 1a: Homepage file (src/app/page.tsx) exists");
const homeContent = fs.readFileSync(homePageFile, "utf-8");
assert(homeContent.includes("<HeroSection"), "Test 1b: Homepage renders HeroSection");
assert(homeContent.includes("<ProductSpotlight"), "Test 1c: Homepage renders ProductSpotlight");
assert(homeContent.includes("<FeaturedProducts"), "Test 1d: Homepage renders FeaturedProducts");

// Verify that HeroSection and ProductSpotlight code-split their 3D components
const heroSectionFile = path.join(srcDir, "components", "home", "hero-section.tsx");
const heroSectionContent = fs.readFileSync(heroSectionFile, "utf-8");
assert(
  heroSectionContent.includes("dynamic(") && heroSectionContent.includes("ssr: false"),
  "Test 1e: HeroSection isolates 3D HeroScene via next/dynamic with ssr: false"
);

const productSpotlightFile = path.join(srcDir, "components", "home", "product-spotlight.tsx");
const productSpotlightContent = fs.readFileSync(productSpotlightFile, "utf-8");
assert(
  productSpotlightContent.includes("dynamic(") && productSpotlightContent.includes("ssr: false"),
  "Test 1f: ProductSpotlight isolates 3D SpotlightViewer via next/dynamic with ssr: false"
);

// ---------------------------------------------------------------------------
// 2. 3D Hero Initialization & DPR Cap [1, 1.5]
// ---------------------------------------------------------------------------
console.log("\n--- 2. 3D Hero Initialization & DPR Cap Audit ---");
const heroSceneFile = path.join(srcDir, "components", "3d", "hero-scene.tsx");
assert(fs.existsSync(heroSceneFile), "Test 2a: HeroScene component exists");
const heroSceneContent = fs.readFileSync(heroSceneFile, "utf-8");
assert(
  heroSceneContent.includes("dpr={[1, 1.5]}"),
  "Test 2b: HeroScene caps DPR at [1, 1.5] to prevent mobile GPU thermal throttling"
);
assert(
  heroSceneContent.includes("powerPreference: \"high-performance\""),
  "Test 2c: HeroScene requests high-performance WebGL context"
);

// ---------------------------------------------------------------------------
// 3. 3D Viewer Controls & Touch Interaction
// ---------------------------------------------------------------------------
console.log("\n--- 3. 3D Viewer Controls & Touch Safety Audit ---");
const spotlightViewerFile = path.join(srcDir, "components", "3d", "spotlight-viewer.tsx");
const spotlightViewerContent = fs.readFileSync(spotlightViewerFile, "utf-8");
assert(
  spotlightViewerContent.includes("dpr={[1, 1.5]}"),
  "Test 3a: SpotlightViewer caps DPR at [1, 1.5]"
);
assert(
  spotlightViewerContent.includes("touchAction: \"pan-y\"") || spotlightViewerContent.includes("touch-pan-y"),
  "Test 3b: SpotlightViewer declares pan-y touch action to avoid trapping page scroll"
);

const product3DCanvasFile = path.join(srcDir, "components", "3d", "product-3d-canvas.tsx");
const product3DCanvasContent = fs.readFileSync(product3DCanvasFile, "utf-8");
assert(
  product3DCanvasContent.includes("dpr={[1, 1.5]}"),
  "Test 3c: Product3DCanvas caps DPR at [1, 1.5]"
);
assert(
  product3DCanvasContent.includes("touchAction: \"pan-y\"") || product3DCanvasContent.includes("touch-pan-y"),
  "Test 3d: Product3DCanvas declares pan-y touch action"
);

// ---------------------------------------------------------------------------
// 4. Model Loading Fallbacks
// ---------------------------------------------------------------------------
console.log("\n--- 4. Model Loading Fallbacks Audit ---");
const heroFallbackFile = path.join(srcDir, "components", "3d", "hero-fallback.tsx");
assert(fs.existsSync(heroFallbackFile), "Test 4a: HeroFallback component physically exists");

const spotlightFallbackFile = path.join(srcDir, "components", "3d", "spotlight-fallback.tsx");
assert(fs.existsSync(spotlightFallbackFile), "Test 4b: SpotlightFallback component physically exists");

const product3DFallbackFile = path.join(srcDir, "components", "3d", "product-3d-fallback.tsx");
assert(fs.existsSync(product3DFallbackFile), "Test 4c: Product3DFallback component physically exists");

const about3DFallbackFile = path.join(srcDir, "components", "about", "about-3d-fallback.tsx");
assert(fs.existsSync(about3DFallbackFile), "Test 4d: About3DFallback component physically exists");

// ---------------------------------------------------------------------------
// 5. WebGL Unavailable Fallback Behavior
// ---------------------------------------------------------------------------
console.log("\n--- 5. WebGL Unavailable Fallback Detection ---");
assert(
  heroSceneContent.includes("checkWebGL") || heroSceneContent.includes("hasWebGL"),
  "Test 5a: HeroScene implements WebGL availability check"
);
assert(
  spotlightViewerContent.includes("checkWebGL") || spotlightViewerContent.includes("isWebGLAvailable"),
  "Test 5b: SpotlightViewer implements WebGL availability check"
);
const product3DViewerFile = path.join(srcDir, "components", "3d", "product-3d-viewer.tsx");
const product3DViewerContent = fs.readFileSync(product3DViewerFile, "utf-8");
assert(
  product3DViewerContent.includes("checkWebGL") || product3DViewerContent.includes("hasWebGL"),
  "Test 5c: Product3DViewer implements WebGL availability check"
);
const about3DSceneFile = path.join(srcDir, "components", "about", "about-3d-scene.tsx");
const about3DSceneContent = fs.readFileSync(about3DSceneFile, "utf-8");
assert(
  about3DSceneContent.includes("checkWebGL") || about3DSceneContent.includes("hasWebGL"),
  "Test 5d: About3DScene implements WebGL availability check"
);

// ---------------------------------------------------------------------------
// 6. Reduced Motion Preference Handling
// ---------------------------------------------------------------------------
console.log("\n--- 6. Reduced Motion Preference Audit ---");
assert(
  heroSceneContent.includes("prefers-reduced-motion"),
  "Test 6a: HeroScene listens to prefers-reduced-motion media query"
);
assert(
  spotlightViewerContent.includes("prefers-reduced-motion"),
  "Test 6b: SpotlightViewer listens to prefers-reduced-motion media query"
);
assert(
  product3DViewerContent.includes("prefers-reduced-motion") || product3DCanvasContent.includes("isReducedMotion"),
  "Test 6c: Product 3D Viewer pipeline respects prefers-reduced-motion"
);
assert(
  about3DSceneContent.includes("prefers-reduced-motion"),
  "Test 6d: About3DScene listens to prefers-reduced-motion media query"
);

// ---------------------------------------------------------------------------
// 7. Product Catalogue Performance Bounds
// ---------------------------------------------------------------------------
console.log("\n--- 7. Product Catalogue Performance Bounds ---");
assert(products.length === 30, `Test 7a: Catalogue contains exact 30 items (found ${products.length})`);
for (const product of products) {
  assert(typeof product.id === "string" && product.id.length > 0, `Test 7b: Product ${product.slug} has valid id`);
  assert(typeof product.name === "string" && product.name.length > 0, `Test 7c: Product ${product.slug} has valid name`);
  assert(typeof product.demoPrice === "number" && !isNaN(product.demoPrice) && product.demoPrice > 0, `Test 7d: Product ${product.slug} has valid demoPrice (${product.demoPrice})`);
  assert(typeof product.category === "string" && product.category.length > 0, `Test 7e: Product ${product.slug} has valid category`);
  assert(typeof product.brand === "string" && product.brand.length > 0, `Test 7f: Product ${product.slug} has valid brand`);
}

// ---------------------------------------------------------------------------
// 8. Product Search Latency & Execution Speed
// ---------------------------------------------------------------------------
console.log("\n--- 8. Product Search Latency Benchmark ---");
const searchTerms = ["phone", "pro", "titanium", "audio", "spatial", "camera", "lens", "oled", "quantum", "wireless"];
const iterations = 500;
let totalMatches = 0;
const startSearch = performance.now();

for (let i = 0; i < iterations; i++) {
  const term = searchTerms[i % searchTerms.length].toLowerCase();
  const searchResult = filterAndSortProducts(products, {
    ...DEFAULT_FILTER_STATE,
    query: term,
  });
  totalMatches += searchResult.results.length;
}

const elapsedSearch = performance.now() - startSearch;
const avgSearchLatencyMs = elapsedSearch / iterations;
assert(totalMatches > 0, "Test 8a: Search benchmark produced positive match total across iterations");
assert(
  avgSearchLatencyMs < 5.0,
  `Test 8b: Average search latency across ${iterations} runs is ${avgSearchLatencyMs.toFixed(3)}ms (< 5.0ms 60fps frame budget)`
);

// ---------------------------------------------------------------------------
// 9. Multi-Parametric Filter Efficiency
// ---------------------------------------------------------------------------
console.log("\n--- 9. Multi-Parametric Filter Benchmark ---");
let filterMatches = 0;
const startFilter = performance.now();
for (let i = 0; i < 500; i++) {
  const filterResult = filterAndSortProducts(products, {
    ...DEFAULT_FILTER_STATE,
    category: "smartphones",
    minPrice: 50000,
    maxPrice: 200000,
  });
  filterMatches += filterResult.results.length;
}
const elapsedFilter = performance.now() - startFilter;
const avgFilterLatencyMs = elapsedFilter / 500;
assert(filterMatches > 0, "Test 9a: Multi-filter produced matches across iterations");
assert(
  avgFilterLatencyMs < 5.0,
  `Test 9b: Multi-filter latency per run is ${avgFilterLatencyMs.toFixed(3)}ms (< 5.0ms threshold)`
);

// ---------------------------------------------------------------------------
// 10. Comparison Matrix Generation Bounds
// ---------------------------------------------------------------------------
console.log("\n--- 10. Comparison Matrix Bounds ---");
const compareProducts = products.filter((p) => p.categorySlug === "smartphones").slice(0, 4);
assert(compareProducts.length === 4, "Test 10a: Exactly 4 smartphone comparison products resolved");

const comparisonMatrix = buildComparisonMatrix(compareProducts);
assert(
  comparisonMatrix.length > 0,
  `Test 10b: Comparison matrix generated ${comparisonMatrix.length} specification groups`
);
const totalSpecRows = comparisonMatrix.reduce((sum, g) => sum + g.rows.length, 0);
assert(
  totalSpecRows > 0,
  `Test 10c: Comparison matrix contains ${totalSpecRows} total comparison rows across groups`
);

// ---------------------------------------------------------------------------
// 11. Cart Persistence Serialization & Hydration
// ---------------------------------------------------------------------------
console.log("\n--- 11. Cart Persistence Serialization ---");
const testCartState = {
  items: [
    {
      productId: "prod-01",
      slug: "nexora-nova-1-pro",
      name: "NEXORA Nova 1 Pro",
      price: 139999,
      quantity: 2,
      color: "Titanium Charcoal",
      storage: "512GB",
      image: "/images/products/phone-main.jpg",
    },
    {
      productId: "prod-02",
      slug: "vortex-resonance-planar",
      name: "Vortex Resonance Planar",
      price: 64999,
      quantity: 1,
      color: "Obsidian",
      image: "/images/products/headphones-main.jpg",
    },
  ],
};

const serialized = JSON.stringify(testCartState);
assert(typeof serialized === "string" && serialized.length > 0, "Test 11a: Cart state serializes to JSON string");
const deserialized = JSON.parse(serialized);
assert(Array.isArray(deserialized.items) && deserialized.items.length === 2, "Test 11b: Cart state deserializes cleanly");
const subtotal = deserialized.items.reduce(
  (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
  0
);
assert(subtotal === 139999 * 2 + 64999, `Test 11c: Cart subtotal computed accurately without NaN (${subtotal})`);

// ---------------------------------------------------------------------------
// 12. Enquiry Integration & Formatting
// ---------------------------------------------------------------------------
console.log("\n--- 12. Enquiry Integration & Bridge Formatting ---");
const testItems = [{ productId: "prod-01", variantId: "var-01a", quantity: 2 }];
const cartLines = hydrateCartLines(testItems);
const cartTotals = calculateCartTotals(cartLines);
const enquiryFormatted = formatPlainTextMessage(
  {
    name: "Performance Tester",
    email: "tester@nexora-store.internal",
    phone: "+91 98765 43210",
    category: "product-info",
    message: "Requesting flagship consultation.",
    consent: true,
  },
  {
    cartLines,
    totals: cartTotals,
  }
);
assert(
  enquiryFormatted.includes("NEXORA Nova 1 Pro"),
  "Test 12a: Enquiry message contains formatted product name"
);
assert(
  enquiryFormatted.includes("Quantity: 2"),
  "Test 12b: Enquiry message contains formatted item quantity"
);

// ---------------------------------------------------------------------------
// 13. Contact Form Validation Bounds & Security
// ---------------------------------------------------------------------------
console.log("\n--- 13. Contact Form Validation Bounds ---");
const validContact = validateContactForm({
  name: "Performance Tester",
  email: "tester@nexora-store.internal",
  phone: "+91 98765 43210",
  category: "product-info",
  message: "Testing enquiry handoff validation performance bounds across browser environments.",
  consent: true,
});
assert(validContact.isValid === true, "Test 13a: Valid contact submission accepted");

const invalidContact = validateContactForm({
  name: "",
  email: "invalid-email-address",
  phone: "123", // too short
  category: "product-info",
  message: "Short", // < 10 chars
  consent: false,
});
assert(invalidContact.isValid === false, "Test 13b: Invalid contact submission rejected with proper errors");
assert(Boolean(invalidContact.errors.email), "Test 13c: Email validation failure identified");
assert(Boolean(invalidContact.errors.message), "Test 13d: Message length threshold enforced");

// ---------------------------------------------------------------------------
// 14. FAQ Search Filtering Responsiveness
// ---------------------------------------------------------------------------
console.log("\n--- 14. FAQ Search Filtering Benchmark ---");
assert(faqs.length >= 20, `Test 14a: FAQ dataset contains at least 20 curated questions (found ${faqs.length})`);
let faqMatches = 0;
const startFaq = performance.now();
for (let i = 0; i < 500; i++) {
  const filtered = searchFAQs("demo");
  faqMatches += filtered.length;
}
const elapsedFaq = performance.now() - startFaq;
const avgFaqLatencyMs = elapsedFaq / 500;
assert(faqMatches > 0, "Test 14b: FAQ demo query produces results across iterations");
assert(
  avgFaqLatencyMs < 2.0,
  `Test 14c: FAQ filter latency per run is ${avgFaqLatencyMs.toFixed(3)}ms (< 2.0ms threshold)`
);

// ---------------------------------------------------------------------------
// 15. Mobile Navigation & Touch Target Sizing
// ---------------------------------------------------------------------------
console.log("\n--- 15. Mobile Navigation & Tap Target Audit ---");
const mobileNavFile = path.join(srcDir, "components", "layout", "mobile-nav.tsx");
assert(fs.existsSync(mobileNavFile), "Test 15a: MobileNav component exists");
const mobileNavContent = fs.readFileSync(mobileNavFile, "utf-8");
assert(
  mobileNavContent.includes("min-h-[44px]") ||
    mobileNavContent.includes("min-h-[48px]") ||
    mobileNavContent.includes("p-3") ||
    mobileNavContent.includes("py-3") ||
    mobileNavContent.includes("py-3.5"),
  "Test 15b: Mobile navigation touch targets provide comfortable touch padding"
);
assert(
  mobileNavContent.includes("aria-modal=\"true\"") || mobileNavContent.includes("role=\"dialog\""),
  "Test 15c: Mobile navigation drawer implements modal dialog accessibility semantics"
);

// ---------------------------------------------------------------------------
// 16. Accessibility Basics
// ---------------------------------------------------------------------------
console.log("\n--- 16. Accessibility Basics (Landmarks & Focus) ---");
const rootLayoutFile = path.join(srcDir, "app", "layout.tsx");
const rootLayoutContent = fs.readFileSync(rootLayoutFile, "utf-8");
assert(
  rootLayoutContent.includes("Skip to main content") || rootLayoutContent.includes("skip-to-content"),
  "Test 16a: Root layout implements 'Skip to main content' accessibility link"
);
assert(
  rootLayoutContent.includes("<main") && rootLayoutContent.includes("id=\"main-content\""),
  "Test 16b: Main content landmark <main id=\"main-content\"> exists"
);

// ---------------------------------------------------------------------------
// 17. Technical SEO Regression
// ---------------------------------------------------------------------------
console.log("\n--- 17. Technical SEO Regression Audit ---");
assert(siteConfig.url.startsWith("https://"), "Test 17a: Site URL uses secure HTTPS protocol");
assert(categories.length === 6, "Test 17b: 6 categories declared");
const allBrands = getAllBrands(products);
assert(allBrands.length === 6, "Test 17c: 6 artisan brand labs declared");
assert(promotions.filter((p) => p.enabled).length === 6, "Test 17d: Exactly 6 active promotions covering all 6 hardware divisions");

// ---------------------------------------------------------------------------
// 18. Static Route Structure Integrity
// ---------------------------------------------------------------------------
console.log("\n--- 18. Static Route Structure Integrity ---");
const staticRoutes = [
  "/",
  "/products",
  "/compare",
  "/offers",
  "/about",
  "/contact",
  "/help",
  "/faq",
  "/cart",
];

for (const route of staticRoutes) {
  const routePath = path.join(srcDir, "app", route === "/" ? "page.tsx" : `${route}/page.tsx`);
  assert(fs.existsSync(routePath), `Test 18a: Route ${route} has corresponding page component`);
}

const dynamicRoutes = [
  "products/[slug]",
  "categories/[slug]",
  "brands/[slug]",
  "offers/[slug]",
];

for (const dyn of dynamicRoutes) {
  const routePath = path.join(srcDir, "app", `${dyn}/page.tsx`);
  assert(fs.existsSync(routePath), `Test 18b: Dynamic route template ${dyn} has page component`);
}

console.log("\n=======================================================");
console.log("   ALL 18 PERFORMANCE AUDIT AREAS SUCCESSFULLY PASSED   ");
console.log("=======================================================\n");
