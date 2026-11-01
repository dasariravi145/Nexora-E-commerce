"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type SpotlightViewMode = "turntable" | "front" | "camera" | "side";

export interface SpotlightModelProps {
  viewMode?: SpotlightViewMode;
  pointerCoordinates?: { x: number; y: number };
  isReducedMotion?: boolean;
  onRotationUpdate?: (angleDegrees: number) => void;
}

/**
 * SpotlightModel: Original, procedural 3D inspection model of the NEXORA Nova 1 Pro.
 * Features realistic proportions, chamfered aerospace titanium chassis,
 * sapphire tri-camera plateau, and active micro-OLED canvas texture.
 */
export function SpotlightModel({
  viewMode = "turntable",
  pointerCoordinates = { x: 0, y: 0 },
  isReducedMotion = false,
  onRotationUpdate,
}: SpotlightModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const currentRotationY = React.useRef(0);

  // Procedural canvas screen texture for the Micro-OLED front panel
  const screenTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deep Obsidian / Navy Background
    const bg = ctx.createLinearGradient(0, 0, 0, 1024);
    bg.addColorStop(0, "#050918");
    bg.addColorStop(0.5, "#0A132C");
    bg.addColorStop(1, "#060B1C");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1024);

    // Glowing Radial Ambient
    const radial = ctx.createRadialGradient(256, 380, 20, 256, 380, 280);
    radial.addColorStop(0, "rgba(50, 123, 255, 0.45)");
    radial.addColorStop(0.6, "rgba(139, 92, 246, 0.18)");
    radial.addColorStop(1, "rgba(5, 9, 24, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 512, 1024);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let y = 140; y < 860; y += 45) {
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(477, y);
      ctx.stroke();
    }

    // Top Header Status
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

    // Telemetry Box
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

    // Bottom Ambient Waveform
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 40; x < 472; x += 10) {
      const y = 800 + Math.sin(x * 0.04) * 22;
      if (x === 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.rotation.y = 0;
      groupRef.current.position.y = 0;
      return;
    }

    // Determine target rotation based on view mode
    let targetY = currentRotationY.current;

    if (viewMode === "turntable") {
      targetY += delta * 0.45;
      currentRotationY.current = targetY;
    } else if (viewMode === "front") {
      targetY = 0;
      currentRotationY.current = THREE.MathUtils.lerp(
        currentRotationY.current,
        targetY,
        delta * 3.5
      );
    } else if (viewMode === "camera") {
      targetY = Math.PI;
      currentRotationY.current = THREE.MathUtils.lerp(
        currentRotationY.current,
        targetY,
        delta * 3.5
      );
    } else if (viewMode === "side") {
      targetY = Math.PI / 2;
      currentRotationY.current = THREE.MathUtils.lerp(
        currentRotationY.current,
        targetY,
        delta * 3.5
      );
    }

    // Subtle pointer tilt response
    const tiltX = pointerCoordinates.y * 0.12;
    const tiltZ = -pointerCoordinates.x * 0.08;

    groupRef.current.rotation.y = currentRotationY.current;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      tiltX,
      delta * 4
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      tiltZ,
      delta * 4
    );

    // Subtle breathing hover
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;

    // Report rotation angle
    if (onRotationUpdate) {
      const degrees =
        Math.round(((currentRotationY.current % (Math.PI * 2)) * 180) / Math.PI + 360) %
        360;
      onRotationUpdate(degrees);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. MAIN CHASSIS: Aerospace Grade-5 Titanium Unibody */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.7, 5.7, 0.24]} />
        <meshPhysicalMaterial
          color="#16223B"
          metalness={0.92}
          roughness={0.24}
          clearcoat={0.35}
          clearcoatRoughness={0.15}
          reflectivity={0.9}
        />
      </mesh>

      {/* 2. CHASSIS BEVEL TRIM: High-Sheen Polished Chamfer */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.73, 5.73, 0.22]} />
        <meshStandardMaterial
          color="#3A568C"
          metalness={0.98}
          roughness={0.12}
        />
      </mesh>

      {/* 3. FRONT DISPLAY: Micro-OLED Panel with Canvas Texture */}
      <mesh position={[0, 0, 0.125]}>
        <planeGeometry args={[2.54, 5.48]} />
        {screenTexture ? (
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#070E22" />
        )}
      </mesh>

      {/* 4. FRONT SAPPHIRE GLASS LAYER */}
      <mesh position={[0, 0, 0.128]}>
        <planeGeometry args={[2.6, 5.56]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.96}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.77}
          reflectivity={0.9}
        />
      </mesh>

      {/* 5. BACK CASING: Obsidian Glass with Laser-Etched Sheen */}
      <mesh position={[0, 0, -0.125]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.58, 5.54]} />
        <meshPhysicalMaterial
          color="#091124"
          metalness={0.7}
          roughness={0.28}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 6. CAMERA MODULE PLATEAU (Rear) */}
      <group position={[0.65, 1.85, -0.18]}>
        {/* Raised Titanium Island */}
        <mesh castShadow>
          <boxGeometry args={[1.15, 1.45, 0.12]} />
          <meshPhysicalMaterial
            color="#141E34"
            metalness={0.92}
            roughness={0.2}
            clearcoat={0.4}
          />
        </mesh>

        {/* Lens 1: 50MP Wide Prime */}
        <group position={[-0.26, 0.35, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.08, 32]} />
            <meshStandardMaterial color="#2B3E63" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.045, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#327BFF"
              emissive="#1E4CB8"
              emissiveIntensity={0.4}
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* Lens 2: Periscope Ultra-Telephoto */}
        <group position={[-0.26, -0.35, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.08, 32]} />
            <meshStandardMaterial color="#2B3E63" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.045, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#8B5CF6"
              emissive="#582BA8"
              emissiveIntensity={0.4}
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* Lens 3: Ultra-Wide & LIDAR Depth Sensor */}
        <group position={[0.28, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.2, 0.08, 32]} />
            <meshStandardMaterial color="#2B3E63" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.045, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.3}
              roughness={0.05}
            />
          </mesh>
        </group>

        {/* Dual-Tone LED Flash Ring */}
        <mesh position={[0.28, 0.44, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshBasicMaterial color="#FFEAA7" />
        </mesh>
      </group>

      {/* 7. HARDWARE ACCENTS: Titanium Antennas & Power Buttons */}
      <mesh position={[1.36, 0.8, 0]}>
        <boxGeometry args={[0.04, 0.6, 0.1]} />
        <meshStandardMaterial color="#3A568C" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-1.36, 1.1, 0]}>
        <boxGeometry args={[0.04, 0.4, 0.1]} />
        <meshStandardMaterial color="#3A568C" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-1.36, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.4, 0.1]} />
        <meshStandardMaterial color="#3A568C" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 8. UNDER-CHASSIS LIGHTING PEDESTAL GLOW */}
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.4, 32]} />
        <meshBasicMaterial
          color="#327BFF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
