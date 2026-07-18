"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── DANGER PARTICLES (Smoke + Ember system) ───
const PARTICLE_COUNT = 40;

function DangerParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Points>(null);

  // Generate initial random particle data
  const particles = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: { vx: number; vy: number; vz: number; life: number; maxLife: number; size: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 0.5 - 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 0.8;
      const maxLife = 1.5 + Math.random() * 2.0;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.3 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.4 - 0.1,
        life: Math.random() * maxLife, // stagger starts
        maxLife,
        size: 0.05 + Math.random() * 0.18,
      });
    }
    return { positions, velocities };
  }, []);

  const posRef = useRef(particles.positions.slice());
  const opacityRef = useRef(new Float32Array(PARTICLE_COUNT).fill(0));

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const vel = particles.velocities;
    const targetOpacity = active ? 1 : 0;
    const mat = meshRef.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = vel[i];
      if (!active) continue;
      v.life += delta;
      if (v.life > v.maxLife) {
        // Reset particle
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.15 + Math.random() * 0.5;
        posRef.current[i * 3] = Math.cos(angle) * radius;
        posRef.current[i * 3 + 1] = -0.2 + Math.random() * 0.2;
        posRef.current[i * 3 + 2] = Math.sin(angle) * radius - 0.8;
        v.vx = (Math.random() - 0.5) * 0.4;
        v.vy = 0.4 + Math.random() * 0.9;
        v.vz = (Math.random() - 0.5) * 0.4 - 0.1;
        v.life = 0;
        v.maxLife = 1.5 + Math.random() * 2.0;
      } else {
        posRef.current[i * 3] += v.vx * delta;
        posRef.current[i * 3 + 1] += v.vy * delta;
        posRef.current[i * 3 + 2] += v.vz * delta;
        // drift outward slightly for natural spread
        v.vx *= 1 + delta * 0.3;
        v.vz *= 1 + delta * 0.3;
        v.vy *= 1 - delta * 0.15; // slow down rise over time
      }
      pos.array[i * 3] = posRef.current[i * 3];
      pos.array[i * 3 + 1] = posRef.current[i * 3 + 1];
      pos.array[i * 3 + 2] = posRef.current[i * 3 + 2];
    }
    pos.needsUpdate = true;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(particles.positions.slice(), 3));
    return g;
  }, [particles]);

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#ff2200"
        size={0.18}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── CHIBI MECHA (BLACK & SILVER) ───
type RobotPhase = "idle" | "parsing" | "running" | "results" | "warning";

function CoolChibiMecha({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }; colors: { primary: string; secondary: string }; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  // fogRef removed - replaced by DangerParticles component

  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState<RobotPhase>("running");
  const [phaseTimer, setPhaseTimer] = useState(0);

  const triggerWarning = () => {
    onClick();
    setPhase("warning");
    // Bikin marahnya 6 detik lalu normal
    setPhaseTimer(6.0);
  };

  useCursor(hovered, "pointer", "auto");

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (phaseTimer > 0) {
      setPhaseTimer((prev) => prev - delta);
    } else if (phase === "warning") {
      setPhase("running");
    }

    // Derived state
    const isWarning = phase === "warning" || phaseTimer > 0;
    const isParsing = phase === "parsing";
    const isRunning = phase === "running";
    const isResults = phase === "results";

    // Head looks at cursor (Restricted and smooth)
    if (headRef.current) {
      target.set(mousePos.x * 2.5, mousePos.y * 1.5 + 1.2, 6);
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      dummy.lookAt(target);

      if (isWarning) {
        // Warning: head down + heavy stare
        dummy.rotation.x -= 0.28;
        headRef.current.quaternion.slerp(dummy.quaternion, 0.04);
      } else {
        // Normal smooth tracking, slightly faster on active
        const lookSlerp = isRunning ? 0.075 : isParsing ? 0.06 : 0.06;
        headRef.current.quaternion.slerp(dummy.quaternion, lookSlerp);
      }
    }

    // Body Animation
    if (groupRef.current) {
      // Smooth floating only. No shaking.
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
    }

    // Analytics arm animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isWarning) {
        // Stop working, arms reset to defensive pose
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -Math.PI / 4, 0.12);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 4, 0.12);
      } else if (isParsing) {
        // “Parsing CSV / cleaning data” slow precise moves
        const base = -Math.PI / 4;
        const intensity = 0.06;
        leftArmRef.current.rotation.x = base + Math.sin(t * 6) * intensity;
        rightArmRef.current.rotation.x = base + Math.cos(t * 6 + Math.PI / 3) * intensity;
      } else if (isRunning) {
        // “Running model / SQL query” faster elegant work
        const base = -Math.PI / 4;
        const intensity = 0.12;
        leftArmRef.current.rotation.x = base + Math.sin(t * 18) * intensity;
        rightArmRef.current.rotation.x = base + Math.cos(t * 18 + Math.PI / 3) * intensity;
      } else if (isResults) {
        // “Result visualization” calmer, slight nod
        const base = -Math.PI / 4;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, base + 0.05 * Math.sin(t * 2), 0.06);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, base + 0.05 * Math.cos(t * 2), 0.06);
      } else {
        // idle breathing
        const base = -Math.PI / 4;
        leftArmRef.current.rotation.x = base + Math.sin(t * 2) * 0.03;
        rightArmRef.current.rotation.x = base + Math.cos(t * 2) * 0.03;
      }
    }

    // Natural Expressions (Eyes)
    if (eyeLeftRef.current && eyeRightRef.current) {
      const warn = isWarning;
      const activeBoost = hovered && !warn && (isParsing || isRunning);

      const currentEyeColor = warn ? new THREE.Color("#ff3333") : new THREE.Color(activeBoost ? colors.secondary : colors.primary);
      (eyeLeftRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.1);
      (eyeRightRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.1);

      // Expression targets
      const targetZLeft = warn ? -0.3 : isResults ? 0.12 : isRunning ? -0.1 : 0.05;
      const targetZRight = warn ? 0.3 : isResults ? -0.12 : isRunning ? 0.1 : -0.05;

      const targetScaleY = warn ? 0.4 : isRunning ? 0.75 : isParsing ? 0.9 : 1.0;

      eyeLeftRef.current.rotation.z = THREE.MathUtils.lerp(eyeLeftRef.current.rotation.z, targetZLeft, 0.1);
      eyeRightRef.current.rotation.z = THREE.MathUtils.lerp(eyeRightRef.current.rotation.z, targetZRight, 0.1);

      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y, targetScaleY, 0.1);
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, targetScaleY, 0.1);
    }
  });

  const handlePointerDown = (e: unknown) => {
    // react-three-fiber passes a pointer event-like object; keep typing safe.
    (e as { stopPropagation?: () => void } | null)?.stopPropagation?.();
    triggerWarning();
  };

  // Materials: Dominant Black and Silver Glossy
  const blackMetal = new THREE.MeshPhysicalMaterial({
    color: "#0a0a0a",
    metalness: 0.8,
    roughness: 0.15,
    clearcoat: 0.8,
  });
  const silverMetal = new THREE.MeshPhysicalMaterial({
    color: "#d0d0d0",
    metalness: 1.0,
    roughness: 0.1,
    clearcoat: 1.0,
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: "#000000",
    metalness: 0.9,
    roughness: 0.02,
    clearcoat: 1.0,
  });
  const secondaryGlow = new THREE.MeshBasicMaterial({ color: colors.secondary });
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });

  const isWarning = phase === "warning" || phaseTimer > 0;

  return (
    <group
      ref={groupRef}
      position={[0, -0.2, 0]}
      scale={[1.0, 1.0, 1.0]}
      // Straighter perspective
      rotation={[0, -Math.PI / 24, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── BODY ─── */}
      <group position={[0, 0.6, 0]}>
        <RoundedBox args={[1.0, 0.9, 0.7]} radius={0.15} material={blackMetal} castShadow />
        <RoundedBox args={[0.8, 0.7, 0.75]} radius={0.1} position={[0, 0.05, 0]} material={silverMetal} />
        {/* Center Core Reactor */}
        <mesh position={[0, 0.1, 0.38]} material={secondaryGlow}>
          <circleGeometry args={[0.15, 32]} />
        </mesh>
        <mesh position={[0, 0.1, 0.385]} material={new THREE.MeshBasicMaterial({ color: "#ffffff" })}>
          <circleGeometry args={[0.08, 32]} />
        </mesh>
        {/* Thruster Skirt (Lower Body) */}
        <mesh position={[0, -0.45, 0]} material={blackMetal}>
          <cylinderGeometry args={[0.4, 0.6, 0.3, 16]} />
        </mesh>
      </group>

      {/* ─── HEAD ─── */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        <mesh position={[0, -0.25, 0]} material={silverMetal}>
          <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        </mesh>

        <RoundedBox args={[1.1, 0.9, 1.0]} radius={0.15} material={blackMetal} castShadow />

        <mesh position={[0, -0.05, 0.45]} material={silverMetal}>
          <boxGeometry args={[0.9, 0.5, 0.15]} />
        </mesh>

        <mesh position={[0, -0.05, 0.51]} material={darkGlass}>
          <boxGeometry args={[0.8, 0.4, 0.05]} />
        </mesh>

        {/* Eyes Group */}
        <group position={[0, -0.05, 0.54]}>
          <mesh ref={eyeLeftRef} position={[-0.2, 0, 0]} material={eyeMaterial.clone()}>
            <boxGeometry args={[0.25, 0.12, 0.02]} />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.2, 0, 0]} material={eyeMaterial.clone()}>
            <boxGeometry args={[0.25, 0.12, 0.02]} />
          </mesh>
        </group>

        {/* V-Fin (Gundam Antenna) - Scaled down slightly to prevent clipping */}
        <group position={[0, 0.35, 0.52]} scale={[0.8, 0.8, 0.8]}>
          <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, -0.6]} material={secondaryGlow}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
          </mesh>
          <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, 0.6]} material={secondaryGlow}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={eyeMaterial}>
            <boxGeometry args={[0.15, 0.15, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* ─── ARMS ─── */}
      <group position={[-0.7, 0.9, 0]}>
        <mesh material={silverMetal}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
        <group ref={leftArmRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 4, 0, 0]}>
          <mesh position={[0, -0.3, 0]} material={blackMetal}>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
          </mesh>
        </group>
      </group>

      <group position={[0.7, 0.9, 0]}>
        <mesh material={silverMetal}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
        <group ref={rightArmRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 4, 0, 0]}>
          <mesh position={[0, -0.3, 0]} material={blackMetal}>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
          </mesh>
        </group>
      </group>

      {/* ─── PURE HOLOGRAM ANALYTICS ─── */}
      <group position={[0, 0.4, 1.2]} rotation={[-0.05, 0, 0]}>
        {/* Physical Transparent Glass Screen to catch reflections */}
        <RoundedBox args={[1.7, 1.1, 0.02]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial 
            color={isWarning ? "#ff2222" : "#0a0a1a"}
            metalness={0.1}
            roughness={0.05}
            transmission={0.8}
            thickness={0.05}
            ior={1.4}
            transparent={true}
            opacity={0.8}
          />
        </RoundedBox>

        {/* Holographic Glowing Border */}
        <RoundedBox args={[1.72, 1.12, 0.01]} radius={0.06} smoothness={4}>
          <meshBasicMaterial color={colors.primary} transparent opacity={0.4} wireframe />
        </RoundedBox>

        {/* Base Projection Pad */}
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.6, 32]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.5} />
        </mesh>

        {/* PURE WEBGL DASHBOARD (Moved IN FRONT of glass to avoid transmission culling, DoubleSide so it's visible when mirrored) */}
        <group position={[0, 0, 0.04]} rotation={[0, Math.PI, 0]}>
          {/* HEADER */}
          <Text position={[-0.7, 0.42, 0]} fontSize={0.06} anchorX="left" anchorY="middle">
            <meshBasicMaterial attach="material" color={isWarning ? "#ff3333" : "#ffffff"} side={THREE.DoubleSide} />
            {isWarning ? "⚠ SYSTEM ALERT" : "ANALYTICS.SYS"}
          </Text>
          <mesh position={[0.7, 0.42, 0]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color={isWarning ? "#ff3333" : colors.secondary} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <planeGeometry args={[1.5, 0.005]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          {/* BAR CHART */}
          <group position={[-0.7, -0.4, 0]}>
            <Text position={[0.02, 0.65, 0]} fontSize={0.04} anchorX="left">
              <meshBasicMaterial attach="material" color="rgba(255,255,255,0.5)" side={THREE.DoubleSide} />
              {isWarning ? "ERROR RATE" : "TRAFFIC YIELD"}
            </Text>
            {[40, 70, 30, 90, 60, 80, 50].map((val, i) => {
              const baseH = isWarning ? Math.max(20, val * 0.18 + (phaseTimer / 6.0) * 80) : val;
              const h = (baseH / 100) * 0.55;
              return (
                <mesh key={i} position={[i * 0.12 + 0.05, h / 2, 0]}>
                  <planeGeometry args={[0.08, h]} />
                  <meshBasicMaterial color={isWarning ? "#ff3333" : colors.primary} transparent opacity={0.9} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>

          {/* SIDE STATS */}
          <group position={[0.35, -0.4, 0]}>
            <Text position={[0, 0.65, 0]} fontSize={0.04} anchorX="left">
              <meshBasicMaterial attach="material" color="rgba(255,255,255,0.5)" side={THREE.DoubleSide} />
              CPU LOAD
            </Text>
            <mesh position={[0.18, 0.58, 0]}>
              <planeGeometry args={[0.36, 0.02]} />
              <meshBasicMaterial color="rgba(255,255,255,0.2)" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[isWarning ? 0.17 : 0.11, 0.58, 0.001]}>
              <planeGeometry args={[isWarning ? 0.34 : 0.22, 0.02]} />
              <meshBasicMaterial color={isWarning ? "#ff3333" : colors.secondary} side={THREE.DoubleSide} />
            </mesh>

            <Text position={[0, 0.45, 0]} fontSize={0.04} anchorX="left">
              <meshBasicMaterial attach="material" color="rgba(255,255,255,0.5)" side={THREE.DoubleSide} />
              MEMORY
            </Text>
            <mesh position={[0.18, 0.38, 0]}>
              <planeGeometry args={[0.36, 0.02]} />
              <meshBasicMaterial color="rgba(255,255,255,0.2)" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[isWarning ? 0.165 : 0.07, 0.38, 0.001]}>
              <planeGeometry args={[isWarning ? 0.33 : 0.14, 0.02]} />
              <meshBasicMaterial color={isWarning ? "#ff3333" : colors.primary} side={THREE.DoubleSide} />
            </mesh>

            <Text position={[0.35, 0.12, 0]} fontSize={0.16} anchorX="right">
              <meshBasicMaterial attach="material" color={isWarning ? "#ff3333" : "#ffffff"} side={THREE.DoubleSide} />
              {isWarning ? "ERR" : "99%"}
            </Text>
            <Text position={[0.35, -0.02, 0]} fontSize={0.04} anchorX="right">
              <meshBasicMaterial attach="material" color={isWarning ? "#ff5555" : "rgba(255,255,255,0.5)"} side={THREE.DoubleSide} />
              {isWarning ? "CRITICAL" : "UPTIME"}
            </Text>
          </group>
        </group>
      </group>

      {/* Aura Merah saat Marah – red point light */}
      {isWarning && (
        <pointLight position={[0, 1.0, 1.5]} intensity={60} color="#ff2200" distance={12} decay={1.5} />
      )}

      {/* Dynamic Danger Particles – smoke & embers */}
      <DangerParticles active={isWarning} />
    </group>
  );
}

// ─── MAIN COMPONENT ───
export default function RobotScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [colors, setColors] = useState({ primary: "#6366F1", secondary: "#06B6D4" });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue("--theme-primary-hex").trim() || "#6366F1";
      const secondary = getComputedStyle(root).getPropertyValue("--theme-secondary-hex").trim() || "#06B6D4";
      setColors({ primary, secondary });
    };

    updateColors();
    const interval = setInterval(updateColors, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px]">
      <Canvas camera={{ position: [0, 1.2, 7.5], fov: 42 }} shadows>
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={3} castShadow shadow-mapSize={1024} />
        <pointLight position={[-3, 2, 4]} intensity={2} color={colors.secondary} />
        <pointLight position={[3, -1, 4]} intensity={2} color={colors.primary} />

        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <CoolChibiMecha mousePos={mousePos} colors={colors} onClick={() => {}} />
        </Float>

        <ContactShadows position={[0, -1.8, 0]} opacity={0.8} scale={6} blur={2.5} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
