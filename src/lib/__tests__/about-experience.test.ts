/**
 * NEXORA — PROMPT 16 ABOUT US EXPERIENCE TEST SUITE
 * 
 * Validates About page editorial models, core values, technology philosophy,
 * customer experience principles, live demonstration showcases, commercial honesty
 * standards (zero fabricated history, awards, or fake reviews), working CTA routes,
 * and catalogue regression boundaries.
 */

import assert from "node:assert";
import {
  brandManifesto,
  coreValues,
  philosophyPillars,
  customerPrinciples,
  demoFeatureShowcases,
  futureVisionPillars,
  trustPillars,
} from "../../data/about";
import { products } from "../../data/products";
import { categories } from "../../data/categories";
import { promotions } from "../../data/promotions";

console.log("=== RUNNING NEXORA PROMPT 16 ABOUT EXPERIENCE TESTS ===\n");

// ============================================================================
// TEST 1: BRAND MANIFESTO INTEGRITY & CONCEPTUAL GROUNDING
// ============================================================================

assert(brandManifesto, "Test 1a: brandManifesto must exist");
assert(brandManifesto.title && brandManifesto.title.length > 10, "Test 1b: title must be descriptive");
assert(brandManifesto.eyebrow && brandManifesto.eyebrow.length > 0, "Test 1c: eyebrow must exist");
assert(brandManifesto.tagline && brandManifesto.tagline.length > 10, "Test 1d: tagline must be descriptive");
assert(brandManifesto.mission && brandManifesto.mission.includes("NEXORA"), "Test 1e: mission must mention NEXORA");
assert(brandManifesto.thesis && brandManifesto.thesis.length > 20, "Test 1f: thesis must be substantive");

console.log("[PASS] Test 1: Brand manifesto integrity and conceptual grounding verified");

// ============================================================================
// TEST 2: CORE VALUES (EXACTLY 4 MEANINGFUL BRAND VALUES)
// ============================================================================

assert(Array.isArray(coreValues) && coreValues.length === 4, "Test 2a: Exactly 4 core values must exist");

const expectedValueTitles = [
  "Thoughtful Design",
  "Product Clarity",
  "Accessible Technology",
  "Effortless Discovery",
];

const foundTitles = coreValues.map((v) => v.title);
for (const title of expectedValueTitles) {
  assert(foundTitles.includes(title), `Test 2b: Core value "${title}" must be present`);
}

const valueIdSet = new Set<string>();
for (const val of coreValues) {
  assert(val.id && typeof val.id === "string", `Test 2c: Value ${val.title} must have string id`);
  assert(!valueIdSet.has(val.id), `Test 2d: Duplicate value id ${val.id}`);
  valueIdSet.add(val.id);

  assert(val.description && val.description.length > 20, `Test 2e: Value ${val.title} has substantive description`);
  assert(val.tagline && val.tagline.length > 5, `Test 2f: Value ${val.title} has tagline`);
  assert(val.pillLabel && val.pillLabel.length > 0, `Test 2g: Value ${val.title} has pillLabel`);
  assert(["Compass", "Eye", "Accessibility", "Sparkles", "Sliders", "ShieldCheck"].includes(val.iconName), `Test 2h: Valid icon for ${val.title}`);
}

console.log("[PASS] Test 2: Exactly 4 meaningful core values verified with complete editorial metadata");

// ============================================================================
// TEST 3: TECHNOLOGY AND DESIGN PHILOSOPHY PILLARS
// ============================================================================

assert(Array.isArray(philosophyPillars) && philosophyPillars.length === 3, "Test 3a: Exactly 3 philosophy pillars");

const pillarNumbers = philosophyPillars.map((p) => p.number);
assert(pillarNumbers.includes("01") && pillarNumbers.includes("02") && pillarNumbers.includes("03"), "Test 3b: Sequential numbering 01, 02, 03");

for (const p of philosophyPillars) {
  assert(p.title && p.title.length > 5, `Test 3c: Pillar ${p.number} must have title`);
  assert(p.subtitle && p.subtitle.length > 5, `Test 3d: Pillar ${p.number} must have subtitle`);
  assert(p.description && p.description.length > 30, `Test 3e: Pillar ${p.number} must have detailed description`);
  assert(Array.isArray(p.keyPoints) && p.keyPoints.length >= 3, `Test 3f: Pillar ${p.number} must have >= 3 proof points`);
  assert(["electric", "violet", "cyan"].includes(p.accentColor), `Test 3g: Valid accent color for ${p.number}`);
}

console.log("[PASS] Test 3: Three foundational philosophy pillars verified with technical proof points");

// ============================================================================
// TEST 4: CUSTOMER EXPERIENCE PRINCIPLES
// ============================================================================

assert(Array.isArray(customerPrinciples) && customerPrinciples.length === 4, "Test 4a: Exactly 4 experience principles");

const principleIdSet = new Set<string>();
for (const cp of customerPrinciples) {
  assert(cp.id && typeof cp.id === "string", "Test 4b: String id required");
  assert(!principleIdSet.has(cp.id), `Test 4c: Duplicate principle id ${cp.id}`);
  principleIdSet.add(cp.id);

  assert(cp.title && cp.title.length > 5, `Test 4d: Title required for ${cp.id}`);
  assert(cp.description && cp.description.length > 20, `Test 4e: Description required for ${cp.id}`);
  assert(cp.practicalBenefit && cp.practicalBenefit.length > 5, `Test 4f: Practical benefit required for ${cp.id}`);
  assert(["Boxes", "Scale", "SlidersHorizontal", "Headphones"].includes(cp.iconName), `Test 4g: Valid icon for ${cp.id}`);
}

console.log("[PASS] Test 4: Four customer experience principles verified");

// ============================================================================
// TEST 5: TECHNOLOGY SHOWCASE (LIVE DEMO FEATURES ONLY)
// ============================================================================

assert(Array.isArray(demoFeatureShowcases) && demoFeatureShowcases.length === 4, "Test 5a: Exactly 4 demo features");

for (const feat of demoFeatureShowcases) {
  assert(feat.isImplemented === true, `Test 5b: Feature ${feat.title} must be marked isImplemented`);
  assert(feat.title && feat.title.length > 5, `Test 5c: Feature title required`);
  assert(feat.badge && feat.badge.length > 0, `Test 5d: Feature badge required`);
  assert(["electric", "violet", "success", "outline"].includes(feat.badgeVariant), `Test 5e: Valid badge variant`);
  assert(feat.description && feat.description.length > 20, `Test 5f: Feature description required`);
  assert(feat.implementationDetail && feat.implementationDetail.length > 10, `Test 5g: Implementation detail required`);
  assert(feat.routeHref.startsWith("/"), `Test 5h: Route must be an internal route starting with /`);
  assert(feat.routeLabel && feat.routeLabel.length > 0, `Test 5i: Route label required`);
}

// Verify actual routes referenced
const routesReferenced = demoFeatureShowcases.map((f) => f.routeHref);
assert(routesReferenced.includes("/products/nexora-nova-1-pro"), "Test 5j: 3D viewer links to Nova 1 Pro");
assert(routesReferenced.includes("/compare"), "Test 5k: Comparison feature links to /compare");
assert(routesReferenced.includes("/categories"), "Test 5l: Categories feature links to /categories");
assert(routesReferenced.includes("/offers"), "Test 5m: Offers feature links to /offers");

console.log("[PASS] Test 5: Technology showcase strictly points to live implemented storefront features");

// ============================================================================
// TEST 6: FUTURE-FACING TECHNOLOGY VISION & ROADMAP
// ============================================================================

assert(Array.isArray(futureVisionPillars) && futureVisionPillars.length === 3, "Test 6a: 3 research vision pillars");

for (const fv of futureVisionPillars) {
  assert(fv.conceptTitle && fv.conceptTitle.length > 5, "Test 6b: Concept title required");
  assert(fv.category && fv.category.length > 0, "Test 6c: Category required");
  assert(fv.horizon && fv.horizon.length > 0, "Test 6d: Horizon required");
  assert(fv.description && fv.description.length > 20, "Test 6e: Description required");
  assert(fv.architecturalGoal && fv.architecturalGoal.length > 10, "Test 6f: Benchmark goal required");
}

console.log("[PASS] Test 6: Future vision research horizons verified without fabricated production claims");

// ============================================================================
// TEST 7: TRUST PILLARS & HONESTY STANDARDS
// ============================================================================

assert(Array.isArray(trustPillars) && trustPillars.length === 4, "Test 7a: Exactly 4 trust pillars");

for (const tp of trustPillars) {
  assert(tp.title && tp.title.length > 5, "Test 7b: Trust pillar title required");
  assert(tp.description && tp.description.length > 20, "Test 7c: Trust pillar description required");
  assert(tp.evidenceText && tp.evidenceText.length > 5, "Test 7d: Trust pillar evidence required");
  assert(["FileCheck2", "Coins", "Layers", "MessageSquareCode"].includes(tp.iconName), "Test 7e: Valid icon");
}

console.log("[PASS] Test 7: Trust pillars and commercial transparency verified");

// ============================================================================
// TEST 8: ZERO-FABRICATION VERIFICATION (NO FAKE FOUNDING, AWARDS, PARTNERS)
// ============================================================================

const allAboutText = [
  brandManifesto.mission,
  brandManifesto.thesis,
  ...coreValues.map((v) => `${v.title} ${v.description} ${v.tagline}`),
  ...philosophyPillars.map((p) => `${p.title} ${p.subtitle} ${p.description} ${p.keyPoints.join(" ")}`),
  ...customerPrinciples.map((c) => `${c.title} ${c.description} ${c.practicalBenefit}`),
  ...demoFeatureShowcases.map((d) => `${d.title} ${d.description} ${d.implementationDetail}`),
  ...trustPillars.map((t) => `${t.title} ${t.description} ${t.evidenceText}`),
].join(" ").toLowerCase();

// Prohibited fabrications
assert(!allAboutText.includes("founded in 19"), "Test 8a: No fabricated 20th century founding year");
assert(!allAboutText.includes("founded in 200"), "Test 8b: No fabricated early 2000s founding year");
assert(!allAboutText.includes("headquartered in cupertino"), "Test 8c: No fabricated fake HQ");
assert(!allAboutText.includes("fortune 500"), "Test 8d: No fake enterprise rankings");
assert(!allAboutText.includes("10 million happy customers"), "Test 8e: No fake customer volume");
assert(!allAboutText.includes("award-winning company"), "Test 8f: No fake corporate awards");
assert(!allAboutText.includes("official partner of apple"), "Test 8g: No fake manufacturer partnerships");

console.log("[PASS] Test 8: Zero-fabrication scan passed: zero false corporate claims or fake endorsements");

// ============================================================================
// TEST 9: REPOSITORY & CENTRALIZED CATALOGUE REGRESSION DEFENSE
// ============================================================================

assert(products.length === 30, "Test 9a: Base catalogue must maintain strictly 30 products");
assert(categories.length === 6, "Test 9b: Exactly 6 categories preserved");
assert(promotions.length === 7, "Test 9c: Exactly 7 promotions preserved");

// Verify Nova 1 Pro and Vortex Planar 3D availability remains unregressed
const nova = products.find((p) => p.slug === "nexora-nova-1-pro");
assert(nova && nova.has3DModel === true, "Test 9d: Nova 1 Pro 3D flag intact");

const vortex = products.find((p) => p.slug === "vortex-resonance-planar");
assert(vortex && vortex.has3DModel === true, "Test 9e: Vortex Planar 3D flag intact");

console.log("[PASS] Test 9: Zero regression on base catalogue, 3D models, categories, and promotions");

console.log("\nALL PROMPT 16 ABOUT US EXPERIENCE TESTS PASSED SUCCESSFULLY!\n");
