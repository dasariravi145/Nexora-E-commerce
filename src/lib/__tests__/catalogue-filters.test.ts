import { products } from "../../data/products";
import {
  filterAndSortProducts,
  getAvailableBrands,
  getPriceBounds,
  parseFilterParams,
  toQueryString,
  DEFAULT_FILTER_STATE,
  CatalogueFilterState,
} from "../catalogue-filters";

/**
 * NEXORA Catalogue Filter & Search Test Suite
 * Validates all 10 core requirements specified in Prompt 10.
 */
function runTests() {
  console.log("=== RUNNING NEXORA CATALOGUE FILTER TESTS ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed += 1;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed += 1;
    }
  }

  // Baseline check
  assert(products.length === 30, "Baseline check: 30 products exist in catalogue", `Found ${products.length}`);

  // Test 1: Case-insensitive search
  {
    const stateUpper: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, query: "NOVA" };
    const stateLower: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, query: "nova" };
    const stateMixed: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, query: "nOvA 1 pRo" };

    const resUpper = filterAndSortProducts(products, stateUpper);
    const resLower = filterAndSortProducts(products, stateLower);
    const resMixed = filterAndSortProducts(products, stateMixed);

    assert(
      resUpper.results.length > 0 && resUpper.results.length === resLower.results.length,
      "Test 1: Case-insensitive search yields identical result counts",
      `Upper: ${resUpper.results.length}, Lower: ${resLower.results.length}`
    );
    assert(
      resMixed.results.length > 0 && resMixed.results[0].slug === "nexora-nova-1-pro",
      "Test 1b: Exact multi-token mixed-case search ranks exact flagship unit first by relevance",
      `Top match: ${resMixed.results[0]?.slug}`
    );
  }

  // Test 2: Empty search
  {
    const stateEmpty: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, query: "" };
    const stateWhitespace: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, query: "    " };

    const resEmpty = filterAndSortProducts(products, stateEmpty);
    const resWhitespace = filterAndSortProducts(products, stateWhitespace);

    assert(
      resEmpty.results.length === 30,
      "Test 2: Empty search returns all 30 products"
    );
    assert(
      resWhitespace.results.length === 30,
      "Test 2b: Whitespace-only search trims and returns all 30 products"
    );
  }

  // Test 3: Category filtering
  {
    const stateSmartphones: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, category: "smartphones" };
    const stateAudio: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, category: "Audio" }; // case insensitive
    const stateAll: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, category: "all" };

    const resSmartphones = filterAndSortProducts(products, stateSmartphones);
    const resAudio = filterAndSortProducts(products, stateAudio);
    const resAll = filterAndSortProducts(products, stateAll);

    assert(
      resSmartphones.results.length === 5 && resSmartphones.results.every((p) => p.categorySlug === "smartphones"),
      "Test 3: Category filter 'smartphones' yields exactly 5 smartphone units"
    );
    assert(
      resAudio.results.length === 5 && resAudio.results.every((p) => p.categorySlug === "audio"),
      "Test 3b: Category filter 'Audio' is case-insensitive and yields 5 audio units"
    );
    assert(
      resAll.results.length === 30,
      "Test 3c: Category filter 'all' returns entire catalogue"
    );
  }

  // Test 4: Brand filtering
  {
    const brands = getAvailableBrands(products);
    assert(brands.length > 0, "Test 4a: Dynamic brand extraction finds brands from dataset", `Found ${brands.length} brands`);

    const nexoraBrand = brands.find((b) => b.slug.includes("nexora"));
    assert(Boolean(nexoraBrand), "Test 4b: Found NEXORA LABS brand dynamically");

    if (nexoraBrand) {
      const stateBrand: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, brands: [nexoraBrand.slug] };
      const resBrand = filterAndSortProducts(products, stateBrand);
      assert(
        resBrand.results.length === nexoraBrand.count &&
          resBrand.results.every((p) => p.brandSlug.toLowerCase() === nexoraBrand.slug),
        "Test 4c: Brand filtering returns matching units count matching dynamic extraction",
        `Expected ${nexoraBrand.count}, got ${resBrand.results.length}`
      );
    }
  }

  // Test 5: Minimum and Maximum price bounds
  {
    const bounds = getPriceBounds(products);
    assert(bounds.min > 0 && bounds.max > bounds.min, "Test 5a: Dynamic price bounds computed accurately", `Min: ${bounds.min}, Max: ${bounds.max}`);

    const stateMin: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, minPrice: 100000 };
    const resMin = filterAndSortProducts(products, stateMin);
    assert(
      resMin.results.length > 0 && resMin.results.every((p) => p.demoPrice >= 100000),
      "Test 5b: Minimum price filter (>= ₹1,00,000) excludes units below threshold"
    );

    const stateMax: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, maxPrice: 50000 };
    const resMax = filterAndSortProducts(products, stateMax);
    assert(
      resMax.results.length > 0 && resMax.results.every((p) => p.demoPrice <= 50000),
      "Test 5c: Maximum price filter (<= ₹50,000) excludes units above threshold"
    );

    const stateRange: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, minPrice: 30000, maxPrice: 80000 };
    const resRange = filterAndSortProducts(products, stateRange);
    assert(
      resRange.results.length > 0 &&
        resRange.results.every((p) => p.demoPrice >= 30000 && p.demoPrice <= 80000),
      "Test 5d: Price range filter (₹30,000–₹80,000) strictly enforces both bounds"
    );
  }

  // Test 6: Combined filters
  {
    const stateCombined: CatalogueFilterState = {
      query: "planar",
      category: "audio",
      brands: [],
      minPrice: 30000,
      maxPrice: 100000,
      sort: "price-asc",
    };
    const resCombined = filterAndSortProducts(products, stateCombined);
    assert(
      resCombined.results.length > 0,
      "Test 6: Combined filter (query + category + price bounds + sort) finds matching units",
      `Matches: ${resCombined.results.length}`
    );
    assert(
      resCombined.results.every(
        (p) =>
          p.categorySlug === "audio" &&
          p.demoPrice >= 30000 &&
          p.demoPrice <= 100000
      ),
      "Test 6b: Every result satisfies all simultaneous constraints"
    );
  }

  // Test 7: Sorting correctness
  {
    const stateAsc: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, sort: "price-asc" };
    const resAsc = filterAndSortProducts(products, stateAsc);
    let isAsc = true;
    for (let i = 0; i < resAsc.results.length - 1; i++) {
      if (resAsc.results[i].demoPrice > resAsc.results[i + 1].demoPrice) {
        isAsc = false;
        break;
      }
    }
    assert(isAsc, "Test 7a: Price Low-to-High sorting is strictly ascending");

    const stateDesc: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, sort: "price-desc" };
    const resDesc = filterAndSortProducts(products, stateDesc);
    let isDesc = true;
    for (let i = 0; i < resDesc.results.length - 1; i++) {
      if (resDesc.results[i].demoPrice < resDesc.results[i + 1].demoPrice) {
        isDesc = false;
        break;
      }
    }
    assert(isDesc, "Test 7b: Price High-to-Low sorting is strictly descending");

    const stateNameAsc: CatalogueFilterState = { ...DEFAULT_FILTER_STATE, sort: "name-asc" };
    const resNameAsc = filterAndSortProducts(products, stateNameAsc);
    let isNameAsc = true;
    for (let i = 0; i < resNameAsc.results.length - 1; i++) {
      if (resNameAsc.results[i].name.localeCompare(resNameAsc.results[i + 1].name) > 0) {
        isNameAsc = false;
        break;
      }
    }
    assert(isNameAsc, "Test 7c: Name A-to-Z sorting is alphabetical");
  }

  // Test 8: Reset filters
  {
    const stateModified: CatalogueFilterState = {
      query: "titanium",
      category: "smartphones",
      brands: ["nexora-labs"],
      minPrice: 100000,
      maxPrice: 200000,
      sort: "price-asc",
    };
    const resModified = filterAndSortProducts(products, stateModified);
    assert(resModified.results.length < 30, "Test 8a: Filtered state restricts catalogue");

    const resReset = filterAndSortProducts(products, DEFAULT_FILTER_STATE);
    assert(resReset.results.length === 30, "Test 8b: Reset to default state restores all 30 products");
  }

  // Test 9: Invalid URL parameters
  {
    const invalidParams = {
      q: "  [special-char]*?  ",
      category: "non-existent-category-xyz",
      brand: "bogus-brand",
      minPrice: "invalid_not_a_number",
      maxPrice: "-9999",
      sort: "unsupported-sort-key",
    };

    const parsed = parseFilterParams(invalidParams);
    assert(parsed.minPrice === undefined, "Test 9a: Non-numeric minPrice gracefully parsed as undefined");
    assert(parsed.maxPrice === undefined, "Test 9b: Negative maxPrice gracefully ignored");
    assert(parsed.sort === "featured", "Test 9c: Unsupported sort gracefully defaults to 'featured'");

    const resSafelyFiltered = filterAndSortProducts(products, parsed);
    assert(
      !resSafelyFiltered.isPriceRangeInvalid,
      "Test 9d: Engine does not crash on strange or malformed inputs"
    );

    // Test invalid price range (min > max)
    const reversedRangeState: CatalogueFilterState = {
      ...DEFAULT_FILTER_STATE,
      minPrice: 200000,
      maxPrice: 50000,
    };
    const resReversed = filterAndSortProducts(products, reversedRangeState);
    assert(
      resReversed.isPriceRangeInvalid && resReversed.results.length === 0,
      "Test 9e: Inverted price range (min > max) safely flagged with zero results"
    );

    // Test 9f: toQueryString formatting
    const qs = toQueryString({ query: "titanium", category: "smartphones", sort: "price-asc" });
    assert(
      qs === "?q=titanium&category=smartphones&sort=price-asc",
      "Test 9f: toQueryString correctly formats URL query parameters",
      `Got: ${qs}`
    );
  }

  // Test 10: No-results state
  {
    const stateNoMatch: CatalogueFilterState = {
      ...DEFAULT_FILTER_STATE,
      query: "xyznonexistentproductquery9999",
    };
    const resNoMatch = filterAndSortProducts(products, stateNoMatch);
    assert(
      resNoMatch.results.length === 0 && resNoMatch.totalMatches === 0,
      "Test 10: Non-matching query safely returns zero results for empty-state UI"
    );
  }

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
