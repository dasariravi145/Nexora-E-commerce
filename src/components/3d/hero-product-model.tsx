"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface HeroProductModelProps {
  pointerCoordinates?: { x: number; y: number };
  isReducedMotion?: boolean;
}

/**
 * HeroProductModel renders the bespoke NEXORA Nova 1 Pro flagship spatial communicator
 * paired with a floating planar acoustic audio pod.
 *
 * 100% Original Intellectual Property. Procedurally constructed with high-end
 * MeshPhysicalMaterials, chamfered titanium chassis, and studio lighting response.
 */
export function HeroProductModel({
  pointerCoordinates = { x: 0, y: 0 },
  isReducedMotion = false,
}: HeroProductModelProps) {
  const rootGroupRef = React.useRef<THREE.Group>(null);
  const phoneGroupRef = React.useRef<THREE.Group>(null);
  const companionPodRef = React.useRef<THREE.Group>(null);

  // Generate a dynamic procedural screen texture for the micro-OLED display
  const screenTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background gradient: Deep Obsidian to Midnight Navy
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    bgGrad.addColorStop(0, "#050A1A");
    bgGrad.addColorStop(0.5, "#0A132C");
    bgGrad.addColorStop(1, "#070E22");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 1024);

    // Glowing Ambient Radial Flare
    const flare = ctx.createRadialGradient(256, 420, 10, 256, 420, 260);
    flare.addColorStop(0, "rgba(50, 123, 255, 0.45)");
    flare.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
    flare.addColorStop(1, "rgba(5, 10, 26, 0)");
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, 512, 1024);

    // Cybernetic Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let y = 120; y < 900; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(472, y);
      ctx.stroke();
    }

    // Top Status Telemetry
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("NEXORA OS 3.0", 50, 80);
    ctx.fillText("99% • 5G-X", 340, 80);

    // Center Large Clock
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 100px sans-serif";
    ctx.fillText("10:42", 125, 340);

    ctx.fillStyle = "#327BFF";
    ctx.font = "600 28px sans-serif";
    ctx.fillText("SPATIAL MATRIX CONNECTED", 65, 400);

    // Dynamic Waveform Graph
    ctx.strokeStyle = "#327BFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 560);
    for (let x = 60; x <= 450; x += 15) {
      const y = 560 + Math.sin((x / 450) * Math.PI * 4) * 35;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bottom Telemetry Dock
    ctx.fillStyle = "rgba(16, 26, 48, 0.8)";
    ctx.beginPath();
    ctx.roundRect(60, 840, 392, 90, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(50, 123, 255, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Iris Neural Engine: Active", 100, 895);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }, []);

  // Frame loop for floating motion, harmonic yaw, and pointer lerp
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (rootGroupRef.current) {
      if (!isReducedMotion) {
        // Idle gentle float (sine wave)
        const floatY = Math.sin(time * 1.2) * 0.08;
        rootGroupRef.current.position.y = floatY;

        // Subtle idle yaw oscillation
        const targetYaw = Math.sin(time * 0.6) * 0.12;

        // Pointer-responsive parallax tilt
        const targetTiltX = -pointerCoordinates.y * 0.35;
        const targetTiltY = pointerCoordinates.x * 0.45 + targetYaw;

        // Smooth dampening / lerp
        rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.x,
          targetTiltX + 0.12, // Slight natural perspective downward angle
          4,
          delta
        );
        rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.y,
          targetTiltY - 0.2, // Studio three-quarter view
          4,
          delta
        );
      } else {
        // Reduced motion: stable studio hero angle
        rootGroupRef.current.rotation.x = 0.08;
        rootGroupRef.current.rotation.y = -0.18;
      }
    }

    // Companion Audio Pod secondary motion
    if (companionPodRef.current && !isReducedMotion) {
      companionPodRef.current.position.y =
        1.1 + Math.sin(time * 1.6 + 1.2) * 0.1;
      companionPodRef.current.rotation.y = time * 0.4;
      companionPodRef.current.rotation.x = Math.sin(time * 0.8) * 0.15;
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* ============================================================ */}
      {/* 1. HERO PRODUCT: NEXORA Nova 1 Pro Flagship Smartphone        */}
      {/* ============================================================ */}
      <group ref={phoneGroupRef} position={[0, 0, 0]}>
        {/* Titanium Chassis Outer Frame */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.1, 4.35, 0.22]} />
          <meshPhysicalMaterial
            color="#141C30"
            metalness={0.92}
            roughness={0.16}
            clearcoat={0.6}
            clearcoatRoughness={0.1}
            reflectivity={0.95}
          />
        </mesh>

        {/* Anodized Edge Chamfers / Accent Ring */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.12, 4.37, 0.18]} />
          <meshStandardMaterial
            color="#327BFF"
            metalness={0.8}
            roughness={0.2}
            emissive="#1E3A8A"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Front Micro-OLED Screen Glass */}
        <mesh position={[0, 0, 0.115]}>
          <planeGeometry args={[1.96, 4.2]} />
          {screenTexture ? (
            <meshStandardMaterial
              map={screenTexture}
              roughness={0.1}
              metalness={0.1}
              emissive="#1D4ED8"
              emissiveIntensity={0.15}
            />
          ) : (
            <meshStandardMaterial color="#0A1226" />
          )}
        </mesh>

        {/* Outer Protective Screen Crystal Layer */}
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[1.98, 4.22]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.8}
            ior={1.5}
            reflectivity={0.9}
          />
        </mesh>

        {/* Front Dynamic Aperture / Sensor Array */}
        <mesh position={[0, 1.88, 0.122]}>
          <capsuleGeometry args={[0.04, 0.28, 4, 8]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        {/* Rear Matte Frosted Sapphire Backplate */}
        <mesh position={[0, 0, -0.115]}>
          <planeGeometry args={[1.98, 4.22]} />
          <meshPhysicalMaterial
            color="#080F24"
            roughness={0.3}
            metalness={0.2}
            clearcoat={0.3}
          />
        </mesh>

        {/* Rear Laser-Etched NEXORA Logo Emblem */}
        <mesh position={[0, -0.3, -0.118]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial
            color="#327BFF"
            emissive="#327BFF"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Camera Visor Plateau */}
        <group position={[-0.32, 1.35, -0.14]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.05, 1.25, 0.08]} />
            <meshPhysicalMaterial
              color="#0F172A"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Primary 1-Inch Optical Sensor Lens */}
          <mesh position={[-0.22, 0.26, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
            <meshPhysicalMaterial
              color="#020617"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.22, 0.26, -0.081]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
            <meshBasicMaterial color="#327BFF" />
          </mesh>

          {/* Periscope Optical Zoom Lens */}
          <mesh position={[-0.22, -0.26, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
            <meshPhysicalMaterial
              color="#020617"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.22, -0.26, -0.081]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 32]} />
            <meshBasicMaterial color="#8B5CF6" />
          </mesh>

          {/* Ultra-Wide Macro Sensor */}
          <mesh position={[0.24, 0.26, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
            <meshPhysicalMaterial
              color="#020617"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>

          {/* Laser LiDAR Emitter */}
          <mesh position={[0.24, -0.15, -0.05]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>

          {/* Dual-Tone Precision Flash */}
          <mesh position={[0.24, -0.36, -0.05]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 2. COMPANION SATELLITE: Floating Acoustic Planar Audio Pod   */}
      {/* ============================================================ */}
      <group ref={companionPodRef} position={[1.65, 0.9, 0.5]}>
        {/* Sleek Aerodynamic Pod Body */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.22, 0.35, 16, 32]} />
          <meshPhysicalMaterial
            color="#0C1630"
            metalness={0.88}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Acoustic Resonance Ring */}
        <mesh position={[0, 0, 0.18]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.1, 0.14, 32]} />
          <meshStandardMaterial
            color="#327BFF"
            emissive="#327BFF"
            emissiveIntensity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Ambient Halo Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.38, 0.015, 16, 64]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>
      </group>

      {/* Soft Contact Floor Grounding Shadow Plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
