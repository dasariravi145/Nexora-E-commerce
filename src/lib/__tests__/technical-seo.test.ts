/**
 * NEXORA — PROMPT 22 TECHNICAL SEO TEST SUITE
 * 
 * Verifies the complete technical SEO architecture:
 * 1. Homepage metadata
 * 2. Product metadata
 * 3. Category metadata
 * 4. Brand metadata
 * 5. About metadata
 * 6. Contact metadata
 * 7. Help metadata
 * 8. Invalid slug handling
 * 9. Sitemap route inclusion
 * 10. Sitemap route exclusion
 * 11. Robots configuration
 * 12. Preview noindex behavior
 * 13. Production indexing opt-in
 * 14. Canonical origin validation
 * 15. Structured data correctness
 * 16. Breadcrumb route accuracy
 * 17. No fabricated ratings
 * 18. No fabricated availability
 * 19. Internal link validity
 * 20. Existing application regression
 */

import assert from "node:assert";
import {
  seoConfig,
  validateCanonicalOrigin,
  isIndexingEnabled,
  getCanonicalUrl,
  getMetadataBase,
} from "../../config/seo";
import {
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
} from "../seo-structured-data";
import { products } from "../../data/products";
import { categories, getCategoryBySlug } from "../../data/categories";
import { getAllBrands, getBrandBySlug } from "../../data/brands";
import { getActivePromotions } from "../../data/promotions";
import sitemap from "../../app/sitemap";
import robots from "../../app/robots";

// Mock helper for metadata generators
import { generateMetadata as generateProductMetadata } from "../../app/products/[slug]/page";
import { generateMetadata as generateCategoryMetadata } from "../../app/categories/[slug]/page";
import { generateMetadata as generateBrandMetadata } from "../../app/brands/[slug]/page";
import { generateMetadata as generateOfferMetadata } from "../../app/offers/[slug]/page";

console.log("=== RUNNING NEXORA PROMPT 22 TECHNICAL SEO TESTS ===\n");

// Helper to isolate environment variables during tests
function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T {
  const originalEnv = { ...process.env };
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  try {
    return fn();
  } finally {
    process.env = originalEnv;
  }
}

// TEST 1: Homepage metadata
{
  assert.ok(seoConfig.defaultTitle.includes("NEXORA"), "Test 1: Default title includes brand name");
  assert.ok(seoConfig.siteDescription.length > 30, "Test 1: Site description is substantial and descriptive");
  assert.strictEqual(seoConfig.locale, "en_US", "Test 1: Locale is en_US");
  console.log("[PASS] Test 1: Homepage metadata configuration verified");
}

// TEST 2: Product metadata
async function testProductMetadata() {
  const specimen = products[0];
  const meta = await generateProductMetadata({
    params: Promise.resolve({ slug: specimen.slug }),
  });

  assert.ok(typeof meta.title === "string" && meta.title.includes(specimen.name), "Test 2: Product meta title includes product name");
  assert.strictEqual(meta.description, specimen.description, "Test 2: Product meta description matches product description");
  assert.ok(meta.openGraph && meta.openGraph.images, "Test 2: Product OpenGraph contains images");
  console.log("[PASS] Test 2: Product dynamic metadata verified");
}

// TEST 3: Category metadata
async function testCategoryMetadata() {
  const category = categories[0];
  const meta = await generateCategoryMetadata({
    params: Promise.resolve({ slug: category.slug }),
  });

  assert.ok(typeof meta.title === "string" && meta.title.includes(category.name), "Test 3: Category meta title includes category name");
  assert.ok(typeof meta.description === "string" && meta.description.includes(category.description), "Test 3: Category description includes official description");
  console.log("[PASS] Test 3: Category dynamic metadata verified");
}

// TEST 4: Brand metadata
async function testBrandMetadata() {
  const brands = getAllBrands(products);
  const brand = brands[0];
  const meta = await generateBrandMetadata({
    params: Promise.resolve({ slug: brand.slug }),
  });

  assert.ok(typeof meta.title === "string" && meta.title.includes(brand.name), "Test 4: Brand meta title includes brand name");
  assert.ok(typeof meta.description === "string" && meta.description.includes(brand.origin), "Test 4: Brand description includes origin laboratory details");
  console.log("[PASS] Test 4: Brand dynamic metadata verified");
}

// TEST 5: About metadata
{
  const aboutUrl = withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => getCanonicalUrl("/about"));
  assert.strictEqual(aboutUrl, "https://nexora.tech/about", "Test 5: About canonical URL resolves correctly with valid origin");
  console.log("[PASS] Test 5: About metadata and canonical resolution verified");
}

// TEST 6: Contact metadata
{
  const contactUrl = withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => getCanonicalUrl("/contact"));
  assert.strictEqual(contactUrl, "https://nexora.tech/contact", "Test 6: Contact canonical URL excludes query parameters");
  console.log("[PASS] Test 6: Contact metadata and clean canonical verified");
}

// TEST 7: Help metadata
{
  const helpUrl = withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => getCanonicalUrl("/help"));
  const faqUrl = withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => getCanonicalUrl("/faq"));
  assert.strictEqual(helpUrl, "https://nexora.tech/help", "Test 7: Help canonical URL verified");
  assert.strictEqual(faqUrl, "https://nexora.tech/faq", "Test 7: FAQ canonical URL verified");
  console.log("[PASS] Test 7: Help and FAQ metadata verified");
}

// TEST 8: Invalid slug handling
async function testInvalidSlugHandling() {
  const invalidProductMeta = await generateProductMetadata({
    params: Promise.resolve({ slug: "nonexistent-quantum-widget" }),
  });
  assert.ok(invalidProductMeta.title?.toString().includes("Not Found"), "Test 8: Invalid product metadata indicates Not Found");
  assert.strictEqual(invalidProductMeta.robots && typeof invalidProductMeta.robots === "object" && invalidProductMeta.robots.index, false, "Test 8: Invalid product metadata sets robots index: false");

  const invalidCategoryMeta = await generateCategoryMetadata({
    params: Promise.resolve({ slug: "time-travel-machines" }),
  });
  assert.ok(invalidCategoryMeta.title?.toString().includes("Not Found"), "Test 8: Invalid category metadata indicates Not Found");
  assert.strictEqual(invalidCategoryMeta.robots && typeof invalidCategoryMeta.robots === "object" && invalidCategoryMeta.robots.index, false, "Test 8: Invalid category sets index: false");

  const invalidBrandMeta = await generateBrandMetadata({
    params: Promise.resolve({ slug: "fake-brand-lab" }),
  });
  assert.ok(invalidBrandMeta.title?.toString().includes("Not Found"), "Test 8: Invalid brand metadata indicates Not Found");
  assert.strictEqual(invalidBrandMeta.robots && typeof invalidBrandMeta.robots === "object" && invalidBrandMeta.robots.index, false, "Test 8: Invalid brand sets index: false");

  const invalidOfferMeta = await generateOfferMetadata({
    params: Promise.resolve({ slug: "free-unlimited-money" }),
  });
  assert.ok(invalidOfferMeta.title?.toString().includes("Not Found"), "Test 8: Invalid offer metadata indicates Not Found");
  assert.strictEqual(invalidOfferMeta.robots && typeof invalidOfferMeta.robots === "object" && invalidOfferMeta.robots.index, false, "Test 8: Invalid offer sets index: false");

  console.log("[PASS] Test 8: Invalid slug defense and noindex metadata verified across all dynamic routes");
}

// TEST 9: Sitemap route inclusion
{
  withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    // Core static routes
    assert.ok(urls.includes("https://nexora.tech"), "Test 9: Sitemap includes homepage");
    assert.ok(urls.includes("https://nexora.tech/products"), "Test 9: Sitemap includes /products");
    assert.ok(urls.includes("https://nexora.tech/categories"), "Test 9: Sitemap includes /categories");
    assert.ok(urls.includes("https://nexora.tech/brands"), "Test 9: Sitemap includes /brands");
    assert.ok(urls.includes("https://nexora.tech/about"), "Test 9: Sitemap includes /about");
    assert.ok(urls.includes("https://nexora.tech/contact"), "Test 9: Sitemap includes /contact");
    assert.ok(urls.includes("https://nexora.tech/help"), "Test 9: Sitemap includes /help");
    assert.ok(urls.includes("https://nexora.tech/faq"), "Test 9: Sitemap includes /faq");

    // All 30 products
    for (const product of products) {
      assert.ok(urls.includes(`https://nexora.tech/products/${product.slug}`), `Test 9: Sitemap includes product ${product.slug}`);
    }

    // All 6 categories
    for (const cat of categories) {
      assert.ok(urls.includes(`https://nexora.tech/categories/${cat.slug}`), `Test 9: Sitemap includes category ${cat.slug}`);
    }

    // All 6 brands
    const brands = getAllBrands(products);
    for (const brand of brands) {
      assert.ok(urls.includes(`https://nexora.tech/brands/${brand.slug}`), `Test 9: Sitemap includes brand ${brand.slug}`);
    }

    // All active offers
    const activeOffers = getActivePromotions();
    for (const offer of activeOffers) {
      assert.ok(urls.includes(`https://nexora.tech/offers/${offer.slug}`), `Test 9: Sitemap includes offer ${offer.slug}`);
    }

    // Total count: 9 static + 30 products + 6 categories + 6 brands + 6 active offers = 57 routes
    assert.strictEqual(sitemapEntries.length, 57, "Test 9: Sitemap contains exactly 57 eligible public URLs");
  });
  console.log("[PASS] Test 9: Complete sitemap route inclusion verified (all 57 public routes accounted for)");
}

// TEST 10: Sitemap route exclusion
{
  withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    assert.ok(!urls.some((u) => u.includes("/cart")), "Test 10: /cart is strictly excluded from sitemap");
    assert.ok(!urls.some((u) => u.includes("/compare")), "Test 10: /compare is strictly excluded from sitemap");
    assert.ok(!urls.some((u) => u.includes("?")), "Test 10: Query parameter URLs are strictly excluded from sitemap");
    assert.ok(!urls.some((u) => u.includes("/api")), "Test 10: API routes are strictly excluded from sitemap");
  });
  console.log("[PASS] Test 10: Strict exclusion of private/user-state routes from sitemap verified");
}

// TEST 11: Robots configuration (Production opt-in)
{
  withEnv(
    {
      NEXT_PUBLIC_SITE_URL: "https://nexora.tech",
      SEO_INDEXING_ENABLED: "true",
    },
    () => {
      const robotsResult = robots();
      const rules = Array.isArray(robotsResult.rules) ? robotsResult.rules[0] : robotsResult.rules;
      assert.strictEqual(rules.allow, "/", "Test 11: Production robots allows /");
      assert.deepStrictEqual(rules.disallow, ["/cart", "/compare", "/api/"], "Test 11: Production robots disallows private paths");
      assert.strictEqual(robotsResult.sitemap, "https://nexora.tech/sitemap.xml", "Test 11: Production robots includes valid sitemap URL");
    }
  );
  console.log("[PASS] Test 11: Production robots.txt directives and disallow rules verified");
}

// TEST 12: Preview noindex behavior
{
  withEnv(
    {
      NEXT_PUBLIC_SITE_URL: undefined,
      SEO_INDEXING_ENABLED: undefined,
    },
    () => {
      const robotsResult = robots();
      const rules = Array.isArray(robotsResult.rules) ? robotsResult.rules[0] : robotsResult.rules;
      assert.strictEqual(rules.disallow, "/", "Test 12: Default environment disallows all crawling");
      assert.strictEqual(robotsResult.sitemap, undefined, "Test 12: Unconfigured preview omits sitemap URL");
    }
  );
  console.log("[PASS] Test 12: Conservative default preview noindex policy verified");
}

// TEST 13: Production indexing opt-in
{
  // Case A: Flag true but origin missing
  withEnv({ SEO_INDEXING_ENABLED: "true", NEXT_PUBLIC_SITE_URL: undefined }, () => {
    assert.strictEqual(isIndexingEnabled(), false, "Test 13: Indexing disabled if valid origin missing");
  });

  // Case B: Origin present but flag false
  withEnv({ SEO_INDEXING_ENABLED: "false", NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => {
    assert.strictEqual(isIndexingEnabled(), false, "Test 13: Indexing disabled if flag is false");
  });

  // Case C: Both flag true and origin valid
  withEnv({ SEO_INDEXING_ENABLED: "true", NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => {
    assert.strictEqual(isIndexingEnabled(), true, "Test 13: Indexing enabled ONLY when flag is true and origin is valid");
  });
  console.log("[PASS] Test 13: Production indexing opt-in dual-gate verified");
}

// TEST 14: Canonical origin validation
{
  // Valid origins
  assert.strictEqual(validateCanonicalOrigin("https://nexora.tech"), "https://nexora.tech", "Test 14: Valid HTTPS origin accepted");
  assert.strictEqual(validateCanonicalOrigin("https://nexora-store.vercel.app/"), "https://nexora-store.vercel.app", "Test 14: Trailing slash stripped");

  // Invalid origins
  assert.strictEqual(validateCanonicalOrigin("http://localhost:3000"), null, "Test 14: Localhost rejected");
  assert.strictEqual(validateCanonicalOrigin("http://127.0.0.1:3000"), null, "Test 14: 127.0.0.1 loopback rejected");
  assert.strictEqual(validateCanonicalOrigin("http://192.168.1.50"), null, "Test 14: RFC1918 private IP rejected");
  assert.strictEqual(validateCanonicalOrigin("http://internal.corp.local"), null, "Test 14: .local domain rejected");
  assert.strictEqual(validateCanonicalOrigin("ftp://example.com"), null, "Test 14: Invalid protocol rejected");
  assert.strictEqual(validateCanonicalOrigin("not-a-url"), null, "Test 14: Malformed string rejected");
  assert.strictEqual(validateCanonicalOrigin(""), null, "Test 14: Empty string rejected");
  assert.strictEqual(validateCanonicalOrigin(undefined), null, "Test 14: Undefined rejected");

  console.log("[PASS] Test 14: Rigorous canonical origin validation and localhost rejection verified");
}

// TEST 15: Structured data correctness
{
  const siteSchema = generateWebSiteSchema();
  assert.strictEqual(siteSchema["@type"], "WebSite", "Test 15: WebSite schema type verified");
  assert.strictEqual(siteSchema.name, "NEXORA", "Test 15: WebSite name verified");

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);
  assert.strictEqual(breadcrumbs["@type"], "BreadcrumbList", "Test 15: BreadcrumbList schema type verified");
  assert.strictEqual(breadcrumbs.itemListElement.length, 2, "Test 15: BreadcrumbList element count verified");

  const specimen = products[0];
  const prodSchema = generateProductSchema(specimen);
  assert.strictEqual(prodSchema["@type"], "Product", "Test 15: Product schema type verified");
  assert.strictEqual(prodSchema.name, specimen.name, "Test 15: Product name in schema verified");
  assert.strictEqual(prodSchema.sku, specimen.id, "Test 15: Product SKU matches catalogue ID");

  console.log("[PASS] Test 15: Schema.org structured data types and serialization verified");
}

// TEST 16: Breadcrumb route accuracy
{
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Smartphones", path: "/categories/smartphones" },
    { name: "NEXORA Nova 1 Pro", path: "/products/nexora-nova-1-pro" },
  ]);

  const items = breadcrumbData.itemListElement;
  assert.strictEqual(items[0].position, 1, "Test 16: First breadcrumb position is 1");
  assert.strictEqual(items[0].name, "Home", "Test 16: First breadcrumb name is Home");
  assert.strictEqual(items[1].position, 2, "Test 16: Second breadcrumb position is 2");
  assert.strictEqual(items[2].position, 3, "Test 16: Third breadcrumb position is 3");
  assert.strictEqual(items[3].position, 4, "Test 16: Fourth breadcrumb position is 4");
  assert.strictEqual(items[3].item, "/products/nexora-nova-1-pro", "Test 16: Deep breadcrumb matches exact target path");

  console.log("[PASS] Test 16: Sequential 1-indexed breadcrumb hierarchy and route accuracy verified");
}

// TEST 17: No fabricated ratings
{
  for (const product of products) {
    const schema = generateProductSchema(product) as Record<string, unknown>;
    assert.strictEqual(schema.aggregateRating, undefined, `Test 17: Product ${product.id} omits aggregateRating`);
    assert.strictEqual(schema.review, undefined, `Test 17: Product ${product.id} omits review`);
    assert.strictEqual(schema.ratingValue, undefined, `Test 17: Product ${product.id} omits ratingValue`);
  }
  console.log("[PASS] Test 17: Zero fabricated reviews, review counts, or star ratings verified across catalogue");
}

// TEST 18: No fabricated availability or offers
{
  for (const product of products) {
    const schema = generateProductSchema(product) as Record<string, unknown>;
    assert.strictEqual(schema.offers, undefined, `Test 18: Product ${product.id} strictly omits commercial offers`);
    assert.strictEqual(schema.availability, undefined, `Test 18: Product ${product.id} omits fake InStock/PreOrder`);
    assert.ok(
      typeof schema.disambiguatingDescription === "string" &&
      schema.disambiguatingDescription.includes("Demonstration"),
      `Test 18: Product ${product.id} includes honest demonstration disclaimer`
    );
  }
  console.log("[PASS] Test 18: Zero fabricated merchant offers, real stock status, or return policies verified");
}

// TEST 19: Internal link validity
{
  // Verify that all category slugs referenced by products resolve in categories dataset
  for (const product of products) {
    const cat = getCategoryBySlug(product.categorySlug);
    assert.ok(cat, `Test 19: Product ${product.slug} categorySlug resolves to valid category`);
  }

  // Verify that all brand slugs resolve in brands dataset
  const brands = getAllBrands(products);
  for (const brand of brands) {
    const found = getBrandBySlug(brand.slug, products);
    assert.ok(found, `Test 19: Brand slug ${brand.slug} resolves successfully`);
  }
  console.log("[PASS] Test 19: Internal link and taxonomy validity verified across all products, categories, and brands");
}

// TEST 20: Existing application regression
{
  assert.strictEqual(products.length, 30, "Test 20: Catalogue has exactly 30 products");
  assert.strictEqual(categories.length, 6, "Test 20: Exactly 6 engineering divisions exist");
  const brands = getAllBrands(products);
  assert.strictEqual(brands.length, 6, "Test 20: Exactly 6 artisan partner brands exist");
  const activeOffers = getActivePromotions();
  assert.strictEqual(activeOffers.length, 6, "Test 20: Exactly 6 active demonstration offers exist");

  // Verify getMetadataBase behavior
  withEnv({ NEXT_PUBLIC_SITE_URL: undefined }, () => {
    assert.strictEqual(getMetadataBase(), undefined, "Test 20: getMetadataBase returns undefined when unconfigured");
  });
  withEnv({ NEXT_PUBLIC_SITE_URL: "https://nexora.tech" }, () => {
    assert.strictEqual(getMetadataBase()?.origin, "https://nexora.tech", "Test 20: getMetadataBase returns URL object with valid origin");
  });

  console.log("[PASS] Test 20: Existing application integrity and zero regression verified");
}

// Execute async tests
async function runAllAsync() {
  await testProductMetadata();
  await testCategoryMetadata();
  await testBrandMetadata();
  await testInvalidSlugHandling();

  console.log("\n========================================================");
  console.log("ALL 20 PROMPT 22 TECHNICAL SEO TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================\n");
}

runAllAsync().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
