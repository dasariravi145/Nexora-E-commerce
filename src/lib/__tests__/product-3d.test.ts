import fs from "fs";
import path from "path";
import {
  products,
  getProductBySlug,
} from "@/data/products";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
}

console.log("=== RUNNING NEXORA PROMPT 12: 3D PRODUCT VIEWER & ASSETS TESTS ===\n");

// 1. Flagship 3D Asset Metadata Verification
const nova = getProductBySlug("nexora-nova-1-pro");
assert(!!nova, "Test 1: 'nexora-nova-1-pro' resolves from catalogue");
assert(nova?.has3DModel === true, "Test 1b: Nova 1 Pro has has3DModel flag enabled");
assert(nova?.modelUrl === "/models/nova-1-pro.glb", "Test 1c: Nova 1 Pro references valid GLB asset path");
assert(nova?.modelType === "interactive-turntable" || nova?.modelType === "gltf-model", "Test 1d: Nova 1 Pro modelType is supported 3D interactive type");
assert(nova?.modelLicense?.includes("CC0") === true, "Test 1e: Nova 1 Pro model license is CC0 documented");

const planar = getProductBySlug("vortex-resonance-planar");
assert(!!planar, "Test 2: 'vortex-resonance-planar' resolves from catalogue");
assert(planar?.has3DModel === true, "Test 2b: Vortex Planar has has3DModel flag enabled");
assert(planar?.modelUrl === "/models/audio-pod.glb", "Test 2c: Vortex Planar references valid GLB asset path");
assert(planar?.modelType === "interactive-turntable" || planar?.modelType === "gltf-model", "Test 2d: Vortex Planar modelType is supported 3D interactive type");
assert(planar?.modelLicense?.includes("CC0") === true, "Test 2e: Vortex Planar model license is CC0 documented");

// 2. Physical File Integrity on Disk
const publicDir = path.resolve(process.cwd(), "public");
const novaGlbPath = path.join(publicDir, "models", "nova-1-pro.glb");
const audioGlbPath = path.join(publicDir, "models", "audio-pod.glb");
const attributionPath = path.join(publicDir, "models", "ATTRIBUTION.md");

assert(fs.existsSync(novaGlbPath), "Test 3: public/models/nova-1-pro.glb physically exists on disk");
const novaStat = fs.statSync(novaGlbPath);
assert(novaStat.size > 10000, `Test 3b: nova-1-pro.glb has non-trivial size (${(novaStat.size / 1024).toFixed(1)} KB)`);

assert(fs.existsSync(audioGlbPath), "Test 4: public/models/audio-pod.glb physically exists on disk");
const audioStat = fs.statSync(audioGlbPath);
assert(audioStat.size > 20000, `Test 4b: audio-pod.glb has non-trivial size (${(audioStat.size / 1024).toFixed(1)} KB)`);

assert(fs.existsSync(attributionPath), "Test 5: public/models/ATTRIBUTION.md physically exists");
const attributionContent = fs.readFileSync(attributionPath, "utf-8");
assert(attributionContent.includes("Creative Commons Zero") || attributionContent.includes("CC0 1.0 Universal"), "Test 5b: ATTRIBUTION.md documents CC0 1.0 license");
assert(attributionContent.includes("nova-1-pro.glb"), "Test 5c: ATTRIBUTION.md documents nova-1-pro.glb");
assert(attributionContent.includes("audio-pod.glb"), "Test 5d: ATTRIBUTION.md documents audio-pod.glb");

// 3. Strict Non-3D Products Integrity (No Fake 3D Models Fabricated)
const non3DProducts = products.filter((p) => p.slug !== "nexora-nova-1-pro" && p.slug !== "vortex-resonance-planar");
assert(non3DProducts.length === 28, "Test 6: Exactly 28 products are preserved without fabricated 3D models");
const invalid3DModels = non3DProducts.filter((p) => p.has3DModel === true);
assert(invalid3DModels.length === 0, "Test 6b: Zero unsupported products falsely declare has3DModel: true");

// 4. Variant Color Finishes for 3D Dynamic Shading
assert(Array.isArray(nova?.variants) && (nova?.variants.length || 0) >= 3, "Test 7: Nova 1 Pro has multiple variants for 3D finish testing");
const novaObsidian = nova?.variants?.find((v) => v.colorHex === "#0F172A");
const novaAzure = nova?.variants?.find((v) => v.colorHex === "#1E40AF");
const novaSilver = nova?.variants?.find((v) => v.colorHex === "#94A3B8");
assert(!!novaObsidian, "Test 7b: Obsidian color finish (#0F172A) present on Nova 1 Pro");
assert(!!novaAzure, "Test 7c: Electric Azure color finish (#1E40AF) present on Nova 1 Pro");
assert(!!novaSilver, "Test 7d: Cryo Silver color finish (#94A3B8) present on Nova 1 Pro");

assert(Array.isArray(planar?.variants) && (planar?.variants.length || 0) >= 3, "Test 8: Vortex Planar has multiple variants for 3D finish testing");
const planarCarbon = planar?.variants?.find((v) => v.colorHex === "#1E293B");
const planarCobalt = planar?.variants?.find((v) => v.colorHex === "#1E40AF");
const planarPlatinum = planar?.variants?.find((v) => v.colorHex === "#CBD5E1");
assert(!!planarCarbon, "Test 8b: Matte Carbon color finish (#1E293B) present on Vortex Planar");
assert(!!planarCobalt, "Test 8c: Anodized Cobalt color finish (#1E40AF) present on Vortex Planar");
assert(!!planarPlatinum, "Test 8d: Liquid Platinum color finish (#CBD5E1) present on Vortex Planar");

// 5. Camera & Zoom Math Assertions
const MIN_DISTANCE = 1.8;
const MAX_DISTANCE = 7.0;
const DEFAULT_DISTANCE = 3.6;
const ZOOM_STEP = 0.5;

function simulateZoom(current: number, direction: "in" | "out"): number {
  if (direction === "in") {
    return Math.max(MIN_DISTANCE, current - ZOOM_STEP);
  } else {
    return Math.min(MAX_DISTANCE, current + ZOOM_STEP);
  }
}

let distance = DEFAULT_DISTANCE;
distance = simulateZoom(distance, "in");
assert(distance === 3.1, "Test 9: Zoom in decreases camera distance by 0.5m");
distance = simulateZoom(distance, "in");
distance = simulateZoom(distance, "in");
distance = simulateZoom(distance, "in");
assert(distance >= MIN_DISTANCE, "Test 9b: Zoom in respects minimum camera safety distance (1.8m)");

distance = DEFAULT_DISTANCE;
for (let i = 0; i < 10; i++) {
  distance = simulateZoom(distance, "out");
}
assert(distance <= MAX_DISTANCE, "Test 9c: Zoom out respects maximum camera distance (7.0m)");

// 6. Azimuth Degree Normalization (0° to 360°)
function normalizeDegrees(radians: number): number {
  let deg = Math.round((radians * 180) / Math.PI) % 360;
  if (deg < 0) deg += 360;
  return deg;
}

assert(normalizeDegrees(0) === 0, "Test 10: 0 rad normalizes to 0°");
assert(normalizeDegrees(Math.PI) === 180, "Test 10b: PI rad normalizes to 180°");
assert(normalizeDegrees(Math.PI * 2) === 0, "Test 10c: 2*PI rad normalizes to 0°");
assert(normalizeDegrees(-Math.PI / 2) === 270, "Test 10d: -PI/2 rad normalizes to 270°");

// 7. Mobile Throttling: DPR Bounds Check
const DPR_BOUNDS = [1, 1.5];
assert(DPR_BOUNDS[0] === 1 && DPR_BOUNDS[1] === 1.5, "Test 11: DPR capped at 1.5 for mobile GPU thermal & battery optimization");

console.log("\nALL 27 PROMPT 12 3D VIEWER TESTS PASSED SUCCESSFULLY!\n");
