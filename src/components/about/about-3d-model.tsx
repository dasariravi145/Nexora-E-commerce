"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface About3DModelProps {
  pointerCoordinates: { x: number; y: number };
  isReducedMotion: boolean;
}

/**
 * Lightweight procedural 3D geometric matrix.
 * Uses zero external asset downloads, under 5 draw calls, and minimal GPU cycles.
 */
export function About3DModel({
  pointerCoordinates,
  isReducedMotion,
}: About3DModelProps) {
  const rootGroupRef = React.useRef<THREE.Group>(null);
  const coreRef = React.useRef<THREE.Mesh>(null);
  const ring1Ref = React.useRef<THREE.Mesh>(null);
  const ring2Ref = React.useRef<THREE.Mesh>(null);
  const particlesRef = React.useRef<THREE.Points>(null);

  // Deterministic orbital particles generated once
  const particlePositions = React.useMemo(() => {
    const count = 42;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.3 + (i % 3) * 0.25;
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    // If reduced motion is preferred, keep static orientation
    if (isReducedMotion) return;

    const clampedDelta = Math.min(delta, 0.1);

    // Smooth pointer parallax on root group
    if (rootGroupRef.current) {
      const targetRotationX = pointerCoordinates.y * 0.35;
      const targetRotationY = pointerCoordinates.x * 0.5;
      rootGroupRef.current.rotation.x +=
        (targetRotationX - rootGroupRef.current.rotation.x) * (clampedDelta * 3.5);
      rootGroupRef.current.rotation.y +=
        (targetRotationY - rootGroupRef.current.rotation.y) * (clampedDelta * 3.5);
    }

    // Procedural core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += clampedDelta * 0.45;
      coreRef.current.rotation.x += clampedDelta * 0.25;
    }

    // Orbital counter-rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += clampedDelta * 0.35;
      ring1Ref.current.rotation.y += clampedDelta * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= clampedDelta * 0.3;
      ring2Ref.current.rotation.z += clampedDelta * 0.25;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += clampedDelta * 0.12;
    }
  });

  return (
    <group ref={rootGroupRef} dispose={null}>
      {/* Central Crystalline Octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial
          color="#1D4ED8"
          metalness={0.85}
          roughness={0.2}
          wireframe={false}
          emissive="#0B1E48"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Outer Wireframe Shell */}
      <mesh>
        <octahedronGeometry args={[1.28, 0]} />
        <meshBasicMaterial
          color="#60A5FA"
          wireframe={true}
          transparent={true}
          opacity={0.45}
        />
      </mesh>

      {/* Primary Tilted Orbital Ring (Electric Blue) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.85, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#327BFF"
          emissive="#2563EB"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Secondary Counter-Tilted Orbital Ring (Violet) */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.25, 0.016, 16, 64]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#7C3AED"
          emissiveIntensity={0.9}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Ambient Swarm Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#93C5FD"
          transparent={true}
          opacity={0.75}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
