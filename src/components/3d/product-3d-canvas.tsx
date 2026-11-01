"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Product3DModelRenderer } from "@/components/3d/product-3d-model-renderer";
import type { ProductVariant } from "@/types";

export interface Product3DCanvasProps {
  modelUrl?: string;
  categorySlug?: string;
  productSlug?: string;
  selectedVariant?: ProductVariant;
  autoRotate?: boolean;
  isReducedMotion?: boolean;
  onRotationUpdate?: (degrees: number) => void;
  onCanvasReady?: () => void;
  onError?: (err: string) => void;
}

export interface Product3DCanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

/**
 * Product3DCanvas: Three.js Canvas environment for NEXORA 3D product inspection.
 * - Studio lighting setup tuned for metallic and glass reflections.
 * - Caps DPR at 1.5 for mobile thermal and battery efficiency.
 * - Programmatic camera zoom and reset via imperative ref.
 * - Controlled OrbitControls without mouse-wheel page scroll interception.
 */
export const Product3DCanvas = React.forwardRef<
  Product3DCanvasHandle,
  Product3DCanvasProps
>(function Product3DCanvas(
  {
    modelUrl,
    categorySlug,
    productSlug,
    selectedVariant,
    autoRotate,
    isReducedMotion,
    onRotationUpdate,
    onCanvasReady,
    onError,
  },
  ref
) {
  const controlsRef = React.useRef<OrbitControlsImpl>(null);
  const initialCameraPos = React.useMemo(() => new THREE.Vector3(0, 0, 7.0), []);

  React.useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (!controlsRef.current) return;
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      const dist = camera.position.distanceTo(target);
      if (dist > 3.5) {
        camera.position.lerp(target, 0.25);
        controlsRef.current.update();
      }
    },
    zoomOut: () => {
      if (!controlsRef.current) return;
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      const dist = camera.position.distanceTo(target);
      if (dist < 10.5) {
        const direction = new THREE.Vector3()
          .subVectors(camera.position, target)
          .normalize();
        camera.position.addScaledVector(direction, 0.9);
        controlsRef.current.update();
      }
    },
    resetView: () => {
      if (!controlsRef.current) return;
      const camera = controlsRef.current.object;
      camera.position.copy(initialCameraPos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    },
  }));

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 7.0], fov: 42 }}
      onCreated={() => {
        if (onCanvasReady) onCanvasReady();
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
    >
      {/* Studio Lighting Environment */}
      <ambientLight color="#081026" intensity={1.3} />

      {/* Key Light: Crisp White Overhead Directional Light */}
      <directionalLight position={[4, 6, 6]} color="#FFFFFF" intensity={1.9} />

      {/* Specular Rim Light: Electric Blue */}
      <pointLight position={[-5, 2, -3]} color="#327BFF" intensity={2.6} distance={15} />

      {/* Backfill Accent: Studio Violet */}
      <pointLight position={[5, -2, -3]} color="#8B5CF6" intensity={2.2} distance={15} />

      {/* Top Edge Highlighter */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.0}
        color="#FFFFFF"
      />

      {/* 3D Model Specimen */}
      <Product3DModelRenderer
        modelUrl={modelUrl}
        categorySlug={categorySlug}
        productSlug={productSlug}
        selectedVariant={selectedVariant}
        autoRotate={autoRotate}
        isReducedMotion={isReducedMotion}
        onRotationUpdate={onRotationUpdate}
        onError={onError}
      />

      {/* Controlled OrbitControls: Bound polar tilt, smooth inertia */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.85}
        dampingFactor={0.07}
        minPolarAngle={0.6}
        maxPolarAngle={2.4}
      />
    </Canvas>
  );
});
