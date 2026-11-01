"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { ProductVariant } from "@/types";

export interface Product3DModelRendererProps {
  modelUrl?: string;
  categorySlug?: string;
  productSlug?: string;
  selectedVariant?: ProductVariant;
  autoRotate?: boolean;
  isReducedMotion?: boolean;
  onRotationUpdate?: (degrees: number) => void;
  onError?: (errorMessage: string) => void;
}

/**
 * GLTFModelLoader loads and renders a real binary GLB/GLTF model.
 * Clones the scene so materials can be customized per variant without mutating cache.
 */
function GLTFModel({
  url,
  selectedVariant,
}: {
  url: string;
  selectedVariant?: ProductVariant;
  onError?: (err: string) => void;
}) {
  const gltf = useGLTF(url);

  const clonedScene = React.useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const scene = gltf.scene.clone(true);

    // If variant specifies a colorway, apply to standard materials
    if (selectedVariant?.colorHex) {
      const tint = new THREE.Color(selectedVariant.colorHex);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Clone material before mutating
          child.material = child.material.clone();
          const name = child.name.toLowerCase();
          if (
            ("color" in child.material && name.includes("chassis")) ||
            name.includes("body") ||
            !name.includes("screen")
          ) {
            child.material.color.lerp(tint, 0.65);
          }
        }
      });
    }

    // Auto-center and normalize bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    return scene;
  }, [gltf, selectedVariant]);

  if (!clonedScene) return null;

  return <primitive object={clonedScene} />;
}

/**
 * ProceduralPhoneModel: High-detail titanium communicator 3D geometry
 * with dynamic micro-OLED canvas texture and real-time variant material tints.
 */
function ProceduralPhoneModel({
  selectedVariant,
}: {
  selectedVariant?: ProductVariant;
}) {
  // Screen Canvas Texture
  const screenTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deep Obsidian Backdrop
    const bg = ctx.createLinearGradient(0, 0, 0, 1024);
    bg.addColorStop(0, "#050918");
    bg.addColorStop(0.5, "#0A132C");
    bg.addColorStop(1, "#060B1C");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1024);

    // Glowing Ambient Flare
    const flare = ctx.createRadialGradient(256, 380, 20, 256, 380, 280);
    flare.addColorStop(0, "rgba(50, 123, 255, 0.45)");
    flare.addColorStop(0.6, "rgba(139, 92, 246, 0.18)");
    flare.addColorStop(1, "rgba(5, 9, 24, 0)");
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, 512, 1024);

    // Circuit grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let y = 140; y < 860; y += 45) {
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(477, y);
      ctx.stroke();
    }

    // Header Telemetry
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("NEXORA OS 3.0", 45, 75);
    ctx.fillText("99% • 5G-X", 345, 75);

    // Center Large Clock
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 96px sans-serif";
    ctx.fillText("12:00", 130, 310);

    ctx.fillStyle = "#327BFF";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("NEURAL SILICON X2", 140, 370);

    // Active Telemetry Enclave
    ctx.fillStyle = "rgba(16, 26, 48, 0.85)";
    ctx.strokeStyle = "rgba(50, 123, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(40, 430, 432, 180, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "600 20px sans-serif";
    ctx.fillText("Active Telemetry Matrix", 60, 470);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "16px monospace";
    ctx.fillText("Quantum Display: 120Hz LTPO", 60, 510);
    ctx.fillText("Vapor Cryo-Loop: 28.4°C Nominal", 60, 545);
    ctx.fillText("Neural NPU Load: 4.2% Idle", 60, 580);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Compute variant chassis color
  const chassisColor = React.useMemo(() => {
    if (selectedVariant?.colorHex) {
      return new THREE.Color(selectedVariant.colorHex);
    }
    return new THREE.Color("#1E293B"); // Default Obsidian Titanium
  }, [selectedVariant]);

  return (
    <group position={[0, 0, 0]}>
      {/* Titanium Beveled Monocoque Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 4.6, 0.22]} />
        <meshStandardMaterial
          color={chassisColor}
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>

      {/* Screen Inset Surface */}
      <mesh position={[0, 0, 0.115]}>
        <planeGeometry args={[2.05, 4.4]} />
        <meshBasicMaterial
          map={screenTexture || undefined}
          color={screenTexture ? undefined : "#050B18"}
        />
      </mesh>

      {/* Screen Border Chamfer Frame */}
      <mesh position={[0, 0, 0.112]}>
        <boxGeometry args={[2.1, 4.48, 0.01]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Camera Island Plateau Back */}
      <mesh position={[-0.55, 1.35, -0.125]}>
        <boxGeometry args={[0.75, 1.45, 0.08]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Tri-Spectral Camera Lenses */}
      {[-0.35, 0, 0.35].map((yOffset, i) => (
        <group key={i} position={[-0.55, 1.35 + yOffset, -0.17]}>
          {/* Outer Lens Bezel */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Inner Sapphire Optics Element */}
          <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
            <meshStandardMaterial
              color="#0284C7"
              emissive="#0369A1"
              emissiveIntensity={0.4}
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
        </group>
      ))}

      {/* LiDAR Synapse Ring */}
      <mesh position={[-0.2, 1.55, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#9333EA"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * ProceduralAudioModel: Planar acoustic transducer 3D geometry
 * with open-back titanium grill and lambskin ear cushion.
 */
function ProceduralAudioModel({
  selectedVariant,
}: {
  selectedVariant?: ProductVariant;
}) {
  const bodyColor = React.useMemo(() => {
    if (selectedVariant?.colorHex) {
      return new THREE.Color(selectedVariant.colorHex);
    }
    return new THREE.Color("#1E293B");
  }, [selectedVariant]);

  return (
    <group position={[0, 0, 0]}>
      {/* Aluminum Earcup Shell */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.4, 0.7, 36]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Open-Back Titanium Acoustic Grill */}
      <mesh position={[0, 0, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.06, 36]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#1D4ED8"
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Memory Foam Lambskin Ear Cushion */}
      <mesh position={[0, 0, 0.38]}>
        <torusGeometry args={[1.2, 0.32, 16, 36]} />
        <meshStandardMaterial color="#0F172A" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Gimbal Articulation Fork */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Product3DModelRenderer: Dispatches between real GLB loading and bespoke procedural representations.
 * Handles auto-rotation, smooth inertia, and communicates real-time azimuth degrees to parent.
 */
export function Product3DModelRenderer({
  modelUrl,
  categorySlug = "smartphones",
  selectedVariant,
  autoRotate = true,
  isReducedMotion = false,
  onRotationUpdate,
  onError,
}: Product3DModelRendererProps) {
  const rootRef = React.useRef<THREE.Group>(null);
  const currentRotation = React.useRef(0);

  useFrame((_, delta) => {
    if (!rootRef.current) return;

    if (autoRotate && !isReducedMotion) {
      // Rotate 20 degrees per second (smooth controlled turntable)
      currentRotation.current += delta * 0.35;
      rootRef.current.rotation.y = currentRotation.current;
    }

    if (onRotationUpdate) {
      // Calculate normalized rotation degrees (0 - 360)
      const degrees = Math.round(((rootRef.current.rotation.y % (Math.PI * 2)) * 180) / Math.PI);
      const normalized = degrees < 0 ? degrees + 360 : degrees;
      onRotationUpdate(normalized);
    }
  });

  return (
    <group ref={rootRef}>
      <React.Suspense fallback={null}>
        {modelUrl ? (
          <GLTFModel
            url={modelUrl}
            selectedVariant={selectedVariant}
            onError={onError}
          />
        ) : categorySlug === "audio" ? (
          <ProceduralAudioModel selectedVariant={selectedVariant} />
        ) : (
          <ProceduralPhoneModel selectedVariant={selectedVariant} />
        )}
      </React.Suspense>
    </group>
  );
}
