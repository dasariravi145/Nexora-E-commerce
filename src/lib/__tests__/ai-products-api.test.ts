import { GET } from "../../app/api/ai/products/route";
import { safeCompareKeys, validateAgentApiKey } from "../server/agent-auth";
import type { AiProductsApiResponse } from "@/types";

/**
 * NEXORA AI Products API Focused Test Suite
 *
 * Validates:
 * 1. Server authentication (fail-closed, missing header, invalid key, timing-safe equality)
 * 2. Un-cached dynamic response headers
 * 3. Parameter validation (maxPrice, limit, category, search)
 * 4. Critical requirement: ₹60,000 laptop search yields 0 matches
 * 5. Bounded pagination & clamps
 * 6. Compact payload structure & zero fabricated fields
 */
async function runTests() {
  console.log("================================================================================");
  console.log("   NEXORA — AI AGENT PRODUCTS CATALOGUE API TEST SUITE                         ");
  console.log("================================================================================");

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

  const TEST_SECRET = "test-nexora-agent-key-secret-98765";

  // --- 1. Timing-Safe Key Comparison ---
  {
    assert(
      safeCompareKeys(TEST_SECRET, TEST_SECRET) === true,
      "Test 1a: safeCompareKeys returns true for identical secrets"
    );
    assert(
      safeCompareKeys("wrong-secret", TEST_SECRET) === false,
      "Test 1b: safeCompareKeys returns false for incorrect secret"
    );
    assert(
      safeCompareKeys(TEST_SECRET + "-extra", TEST_SECRET) === false,
      "Test 1c: safeCompareKeys returns false for secret length mismatch"
    );
    assert(
      safeCompareKeys("", TEST_SECRET) === false,
      "Test 1d: safeCompareKeys returns false for empty input"
    );
    assert(
      safeCompareKeys(TEST_SECRET, "") === false,
      "Test 1e: safeCompareKeys returns false for empty expected secret"
    );
  }

  // --- 2. Fail-Closed Server Configuration ---
  {
    const originalEnv = process.env.NEXORA_AGENT_API_KEY;
    delete process.env.NEXORA_AGENT_API_KEY;

    const res = validateAgentApiKey("some-key");
    assert(
      res.authorized === false && res.status === 500 && res.errorCode === "AUTH_MISCONFIGURED",
      "Test 2: validateAgentApiKey fails closed (status 500) when server env var is missing"
    );

    const req = new Request("http://localhost:3000/api/ai/products", {
      headers: { "x-nexora-agent-key": "some-key" },
    });
    const routeRes = await GET(req);
    assert(
      routeRes.status === 500,
      "Test 2b: GET /api/ai/products route returns 500 when server env var is missing"
    );

    process.env.NEXORA_AGENT_API_KEY = originalEnv;
  }

  // Enable test secret for remaining tests
  process.env.NEXORA_AGENT_API_KEY = TEST_SECRET;

  // --- 3. Request Header Authentication ---
  {
    // Missing header
    const reqNoHeader = new Request("http://localhost:3000/api/ai/products");
    const resNoHeader = await GET(reqNoHeader);
    assert(
      resNoHeader.status === 401,
      "Test 3a: Request without X-Nexora-Agent-Key returns 401 Unauthorized"
    );

    // Invalid header
    const reqInvalid = new Request("http://localhost:3000/api/ai/products", {
      headers: { "x-nexora-agent-key": "invalid-agent-key" },
    });
    const resInvalid = await GET(reqInvalid);
    assert(
      resInvalid.status === 401,
      "Test 3b: Request with invalid X-Nexora-Agent-Key returns 401 Unauthorized"
    );

    // Valid header
    const reqValid = new Request("http://localhost:3000/api/ai/products", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resValid = await GET(reqValid);
    assert(
      resValid.status === 200,
      "Test 3c: Request with valid X-Nexora-Agent-Key returns 200 OK"
    );

    // Case-insensitive header lookup
    const reqAltCase = new Request("http://localhost:3000/api/ai/products", {
      headers: { "X-Nexora-Agent-Key": TEST_SECRET },
    });
    const resAltCase = await GET(reqAltCase);
    assert(
      resAltCase.status === 200,
      "Test 3d: Header lookup handles standard HTTP case-insensitivity"
    );
  }

  // --- 4. Un-Cached Dynamic Headers ---
  {
    const req = new Request("http://localhost:3000/api/ai/products", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const cacheControl = res.headers.get("cache-control") || "";
    assert(
      cacheControl.includes("no-store") && cacheControl.includes("no-cache"),
      "Test 4: Response enforces no-store, no-cache dynamic headers"
    );
  }

  // --- 5. Default Query Execution ---
  {
    const req = new Request("http://localhost:3000/api/ai/products", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    assert(
      data.count === 10 && data.totalAvailable === 30,
      "Test 5a: Default query returns default 10 products with totalAvailable=30",
      `Count: ${data.count}, Total: ${data.totalAvailable}`
    );
    assert(
      data.filtersApplied.limit === 10,
      "Test 5b: Default query confirms limit=10 in metadata"
    );
  }

  // --- 6. Category Filtering ---
  {
    // Filter by smartphones
    const req = new Request("http://localhost:3000/api/ai/products?category=smartphones", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    assert(
      data.count === 5 && data.totalAvailable === 5,
      "Test 6a: Category filtering by 'smartphones' returns exactly 5 units",
      `Count: ${data.count}`
    );
    assert(
      data.products.every((p) => p.categorySlug === "smartphones"),
      "Test 6b: All returned products match 'smartphones' category slug"
    );

    // Case insensitivity
    const reqMixed = new Request("http://localhost:3000/api/ai/products?category=Laptops", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resMixed = await GET(reqMixed);
    const dataMixed = (await resMixed.json()) as AiProductsApiResponse;

    assert(
      dataMixed.count === 5 && dataMixed.products.every((p) => p.categorySlug === "laptops"),
      "Test 6c: Category filtering handles mixed-case ('Laptops') correctly"
    );
  }

  // --- 7. CRITICAL REQUIREMENT: ₹60,000 Laptop Search Must Return Zero Matches ---
  {
    const req = new Request("http://localhost:3000/api/ai/products?category=laptops&maxPrice=60000", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    assert(
      res.status === 200,
      "Test 7a: ₹60,000 laptop query returns successful 200 status code"
    );
    assert(
      data.count === 0 && data.products.length === 0,
      "Test 7b: ₹60,000 laptop query returns exactly ZERO matches (cheapest is ₹1,99,999)",
      `Found ${data.count} items`
    );
    assert(
      data.totalAvailable === 0,
      "Test 7c: totalAvailable reflects 0 within the requested price ceiling"
    );
  }

  // --- 8. Price Ceiling Filter Matches ---
  {
    // Under ₹2,50,000 in laptops
    const req = new Request("http://localhost:3000/api/ai/products?category=laptops&maxPrice=250000", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    assert(
      data.count === 2,
      "Test 8a: Laptops under ₹2,50,000 matches exactly 2 units (Zephyr 14 ₹2.19L & Compute Deck ₹1.99L)",
      `Found ${data.count}`
    );
    assert(
      data.products.every((p) => p.demoPrice <= 250000),
      "Test 8b: Every matched laptop price is strictly <= ₹2,50,000"
    );
  }

  // --- 9. Text Search Filtering ---
  {
    const req = new Request("http://localhost:3000/api/ai/products?search=beryllium", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    assert(
      data.count === 2,
      "Test 9a: Search 'beryllium' finds the 2 Vortex reference audio monitors",
      `Found ${data.count}`
    );
    assert(
      data.products.some((p) => p.id === "prod-11") && data.products.some((p) => p.id === "prod-12"),
      "Test 9b: Search matches prod-11 (Vortex Resonance) and prod-12 (Vortex Beryllium Monitor X)"
    );
  }

  // --- 10. Limit Bounding & Clamping ---
  {
    // Explicit limit 3
    const reqLimit3 = new Request("http://localhost:3000/api/ai/products?limit=3", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resLimit3 = await GET(reqLimit3);
    const dataLimit3 = (await resLimit3.json()) as AiProductsApiResponse;
    assert(
      dataLimit3.count === 3 && dataLimit3.products.length === 3,
      "Test 10a: Explicit limit=3 returns exactly 3 products"
    );

    // Oversized limit clamped to catalogue max (30)
    const reqClamp = new Request("http://localhost:3000/api/ai/products?limit=100", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resClamp = await GET(reqClamp);
    const dataClamp = (await resClamp.json()) as AiProductsApiResponse;
    assert(
      dataClamp.count === 30 && dataClamp.filtersApplied.limit === 30,
      "Test 10b: Oversized limit is clamped to max 30 products"
    );
  }

  // --- 11. Input Validation (400 Bad Request) ---
  {
    // Negative maxPrice
    const reqNegPrice = new Request("http://localhost:3000/api/ai/products?maxPrice=-500", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resNegPrice = await GET(reqNegPrice);
    assert(
      resNegPrice.status === 400,
      "Test 11a: Negative maxPrice returns 400 Bad Request"
    );

    // Non-numeric maxPrice
    const reqNanPrice = new Request("http://localhost:3000/api/ai/products?maxPrice=abc", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resNanPrice = await GET(reqNanPrice);
    assert(
      resNanPrice.status === 400,
      "Test 11b: Non-numeric maxPrice returns 400 Bad Request"
    );

    // Invalid limit (zero)
    const reqZeroLimit = new Request("http://localhost:3000/api/ai/products?limit=0", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resZeroLimit = await GET(reqZeroLimit);
    assert(
      resZeroLimit.status === 400,
      "Test 11c: limit=0 returns 400 Bad Request"
    );

    // Non-integer limit
    const reqFloatLimit = new Request("http://localhost:3000/api/ai/products?limit=2.5", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const resFloatLimit = await GET(reqFloatLimit);
    assert(
      resFloatLimit.status === 400,
      "Test 11d: Non-integer limit returns 400 Bad Request"
    );
  }

  // --- 12. Response Schema & Zero Fabricated Data Integrity ---
  {
    const req = new Request("http://localhost:3000/api/ai/products?limit=5", {
      headers: { "x-nexora-agent-key": TEST_SECRET },
    });
    const res = await GET(req);
    const data = (await res.json()) as AiProductsApiResponse;

    const firstProduct = data.products[0] as unknown as Record<string, unknown>;

    // Real required fields exist
    assert(
      typeof firstProduct.id === "string" && firstProduct.id.startsWith("prod-"),
      "Test 12a: Product has valid ID starting with prod-"
    );
    assert(
      typeof firstProduct.slug === "string" && firstProduct.slug.length > 0,
      "Test 12b: Product has valid slug"
    );
    assert(
      typeof firstProduct.name === "string" && firstProduct.name.length > 0,
      "Test 12c: Product has valid name"
    );
    assert(
      typeof firstProduct.demoPrice === "number" && firstProduct.demoPrice > 0,
      "Test 12d: Product has positive numeric demoPrice"
    );
    assert(
      typeof firstProduct.formattedPrice === "string" && firstProduct.formattedPrice.startsWith("₹"),
      "Test 12e: Product has formattedPrice in INR"
    );
    assert(
      Array.isArray(firstProduct.specifications) && firstProduct.specifications.length > 0,
      "Test 12f: Product has specifications array"
    );
    assert(
      typeof firstProduct.url === "string" && firstProduct.url.startsWith("/products/"),
      "Test 12g: Product has relative URL starting with /products/"
    );

    // Strictly NO fabricated stock / availability / discount fields
    assert(
      firstProduct.stock === undefined &&
      firstProduct.quantity === undefined &&
      firstProduct.availability === undefined &&
      firstProduct.discount === undefined,
      "Test 12h: Zero fabricated stock, inventory, availability, or discount fields present"
    );
  }

  console.log("================================================================================");
  console.log(`   TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}    `);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner threw unexpected error:", err);
  process.exit(1);
});
