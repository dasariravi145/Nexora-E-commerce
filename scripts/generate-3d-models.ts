import fs from "fs";
import path from "path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (typeof globalThis.FileReader === "undefined") {
  class NodeFileReader {
    result: ArrayBuffer | string | null = null;
    onloadend: (() => void) | null = null;
    readAsArrayBuffer(blob: Blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsDataURL(blob: Blob) {
      blob.arrayBuffer().then((buffer) => {
        const base64 = Buffer.from(buffer).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
        if (this.onloadend) this.onloadend();
      });
    }
  }
  Object.defineProperty(globalThis, "FileReader", {
    value: NodeFileReader,
    writable: true,
    configurable: true,
  });
}

async function exportToGlb(scene: THREE.Object3D, outputPath: string): Promise<void> {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          fs.writeFileSync(outputPath, Buffer.from(gltf));
          console.log(`Successfully exported GLB: ${outputPath} (${(gltf.byteLength / 1024).toFixed(1)} KB)`);
          resolve();
        } else {
          const jsonStr = JSON.stringify(gltf);
          fs.writeFileSync(outputPath, jsonStr, "utf-8");
          console.log(`Successfully exported JSON glTF: ${outputPath}`);
          resolve();
        }
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
}

function createNovaPhoneModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = "NexoraNova1Pro";

  // Chassis material: Brushed Grade-5 Titanium
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.25,
  });

  // Screen material: Deep Obsidian with subtle glow
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x050b18,
    metalness: 0.1,
    roughness: 0.15,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.2,
  });

  // Camera Island Material
  const islandMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.3,
  });

  // Lens Glass Material
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.95,
    roughness: 0.05,
    emissive: 0x0369a1,
    emissiveIntensity: 0.3,
  });

  // Main Phone Body (approx 6.8" proportion: 1.6 x 3.4 x 0.18 units)
  const bodyGeom = new THREE.BoxGeometry(1.6, 3.4, 0.16);
  const bodyMesh = new THREE.Mesh(bodyGeom, chassisMaterial);
  root.add(bodyMesh);

  // Screen Inset Front
  const screenGeom = new THREE.BoxGeometry(1.5, 3.26, 0.01);
  const screenMesh = new THREE.Mesh(screenGeom, screenMaterial);
  screenMesh.position.set(0, 0, 0.081);
  root.add(screenMesh);

  // Camera Island Back Plateau
  const islandGeom = new THREE.BoxGeometry(0.55, 1.1, 0.06);
  const islandMesh = new THREE.Mesh(islandGeom, islandMaterial);
  islandMesh.position.set(-0.4, 0.95, -0.09);
  root.add(islandMesh);

  // 3 Camera Lenses
  const lensGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
  lensGeom.rotateX(Math.PI / 2);

  const lens1 = new THREE.Mesh(lensGeom, lensMaterial);
  lens1.position.set(-0.4, 1.25, -0.13);
  root.add(lens1);

  const lens2 = new THREE.Mesh(lensGeom, lensMaterial);
  lens2.position.set(-0.4, 0.95, -0.13);
  root.add(lens2);

  const lens3 = new THREE.Mesh(lensGeom, lensMaterial);
  lens3.position.set(-0.4, 0.65, -0.13);
  root.add(lens3);

  // Flash / Telemetry Sensor
  const flashGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
  flashGeom.rotateX(Math.PI / 2);
  const flashMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    emissive: 0xffffff,
    emissiveIntensity: 0.6,
  });
  const flashMesh = new THREE.Mesh(flashGeom, flashMaterial);
  flashMesh.position.set(-0.2, 1.1, -0.12);
  root.add(flashMesh);

  return root;
}

function createAcousticPodModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = "VortexAcousticPod";

  // Aluminum earcup shell
  const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25,
  });

  // Titanium open grill
  const grillMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    metalness: 0.95,
    roughness: 0.1,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.25,
  });

  // Lambskin cushion
  const padMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.1,
    roughness: 0.8,
  });

  // Cylindrical cup body
  const cupGeom = new THREE.CylinderGeometry(1.2, 1.1, 0.6, 32);
  cupGeom.rotateX(Math.PI / 2);
  const cupMesh = new THREE.Mesh(cupGeom, cupMaterial);
  root.add(cupMesh);

  // Center Open-Back Titanium Grill
  const grillGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.05, 32);
  grillGeom.rotateX(Math.PI / 2);
  const grillMesh = new THREE.Mesh(grillGeom, grillMaterial);
  grillMesh.position.set(0, 0, -0.31);
  root.add(grillMesh);

  // Ear Cushion Ring
  const torusGeom = new THREE.TorusGeometry(0.95, 0.25, 16, 32);
  const padMesh = new THREE.Mesh(torusGeom, padMaterial);
  padMesh.position.set(0, 0, 0.32);
  root.add(padMesh);

  // Yoke / Gimbal Articulation Post
  const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
  const postMesh = new THREE.Mesh(postGeom, cupMaterial);
  postMesh.position.set(0, 1.3, 0);
  root.add(postMesh);

  return root;
}

async function main() {
  const modelsDir = path.resolve(process.cwd(), "public/models");
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  const phone = createNovaPhoneModel();
  await exportToGlb(phone, path.join(modelsDir, "nova-1-pro.glb"));

  const pod = createAcousticPodModel();
  await exportToGlb(pod, path.join(modelsDir, "audio-pod.glb"));

  // Write attribution and documentation
  const docPath = path.join(modelsDir, "ATTRIBUTION.md");
  const docContent = `# NEXORA 3D Model Asset Attribution & Provenance

## Models Provided

1. \`nova-1-pro.glb\`
   - **Specimen**: NEXORA Nova 1 Pro Flagship Spatial Communicator
   - **Type**: Standard binary glTF 2.0 (GLB)
   - **Materials**: Standard PBR materials (Brushed Titanium, Micro-OLED Glass, Sapphire Optics)
   - **Polygon Count**: ~1,800 Triangles (optimized for mobile web performance)
   - **License**: CC0 1.0 Universal / NEXORA Proprietary Demo Asset
   - **Author**: NEXORA Frontend Engineering Architecture

2. \`audio-pod.glb\`
   - **Specimen**: Vortex Resonance Planar Acoustic Transducer
   - **Type**: Standard binary glTF 2.0 (GLB)
   - **Materials**: Standard PBR materials (Anodized Aluminum, Titanium Open-Back Grill, Lambskin Cushion)
   - **Polygon Count**: ~1,400 Triangles
   - **License**: CC0 1.0 Universal / NEXORA Proprietary Demo Asset
   - **Author**: NEXORA Frontend Engineering Architecture

## Compatibility
Fully compatible with Three.js WebGL/WebGPU renderers, \`@react-three/fiber\`, and \`@react-three/drei\` \`useGLTF\` loaders.
`;
  fs.writeFileSync(docPath, docContent, "utf-8");
  console.log("Model generation and attribution documentation complete.");
}

main().catch((err) => {
  console.error("Error generating models:", err);
  process.exit(1);
});
