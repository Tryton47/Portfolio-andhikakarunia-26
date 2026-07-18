"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── CHIBI MECHA (BLACK & SILVER) ───
type RobotPhase = "idle" | "parsing" | "running" | "results" | "warning";

function CoolChibiMecha({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }; colors: { primary: string; secondary: string }; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const fogRef = useRef<THREE.Mesh>(null);

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

    if (fogRef.current) {
      const mat = fogRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isWarning ? 0.4 + Math.sin(t * 3) * 0.1 : 0, 0.05);
      fogRef.current.scale.setScalar(THREE.MathUtils.lerp(fogRef.current.scale.x, isWarning ? 1.8 + Math.sin(t * 2) * 0.1 : 0.5, 0.03));
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

        {/* HTML UI Dashboard - 2D HUD Overlay (Guaranteed to be visible) */}
        <Html position={[0, 0, 0.1]} center zIndexRange={[100, 0]}>
          <div
            style={{
              width: "320px",
              height: "200px",
              backgroundColor: isWarning ? "rgba(40, 10, 10, 0.85)" : "rgba(10, 10, 15, 0.75)",
              border: `1px solid ${isWarning ? "#ff3333" : colors.primary}`,
              boxShadow: `0 0 30px ${isWarning ? "rgba(255,20,20,0.5)" : `${colors.primary}44`}`,
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              fontFamily: "monospace",
              color: "white",
              transform: "translateY(-15px)", // Align visually with the 3D glass
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "2px", fontWeight: "bold", color: isWarning ? "#ff3333" : "white" }}>
                {isWarning ? "⚠ SYSTEM ALERT" : "ANALYTICS.SYS"}
              </span>
              <div
                style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  backgroundColor: isWarning ? "#ff3333" : colors.secondary,
                  boxShadow: `0 0 10px ${isWarning ? "#ff3333" : colors.secondary}`
                }}
              />
            </div>

            {/* Analytics Grid */}
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              {/* Bar Chart */}
              <div style={{ flex: 2, display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingLeft: "8px", position: "relative" }}>
                <span style={{ position: "absolute", top: 0, left: "8px", fontSize: "8px", color: "rgba(255,255,255,0.5)" }}>
                  {isWarning ? "ERROR RATE" : "TRAFFIC YIELD"}
                </span>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", flex: 1, gap: "4px" }}>
                  {[40, 70, 30, 90, 60, 80, 50].map((h, i) => {
                    const height = isWarning ? `${Math.max(20, h * 0.18 + (phaseTimer / 6.0) * 80)}%` : `${h}%`;
                    return (
                      <div
                        key={i}
                        style={{
                          width: "100%",
                          height,
                          backgroundColor: isWarning ? "#ff3333" : colors.primary,
                          opacity: 0.9,
                          borderTopLeftRadius: "2px",
                          borderTopRightRadius: "2px",
                          transition: "height 0.2s"
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Side Stats */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>CPU LOAD</div>
                  <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: isWarning ? "98%" : "65%", backgroundColor: isWarning ? "#ff3333" : colors.secondary, borderRadius: "2px", transition: "width 0.5s" }} />
                  </div>
                </div>
                <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>MEMORY</div>
                  <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: isWarning ? "95%" : "45%", backgroundColor: isWarning ? "#ff3333" : colors.primary, borderRadius: "2px", transition: "width 0.5s" }} />
                  </div>
                </div>
                <div style={{ marginTop: "auto", textAlign: "right" }}>
                  <span style={{ fontSize: "24px", fontWeight: "bold", textShadow: `0 0 10px ${isWarning ? "#ff3333" : colors.primary}`, color: isWarning ? "#ff3333" : "white" }}>
                    {isWarning ? "ERR" : "99%"}
                  </span>
                  <div style={{ fontSize: "8px", color: isWarning ? "rgba(255,50,50,0.8)" : "rgba(255,255,255,0.5)" }}>
                    {isWarning ? "CRITICAL" : "UPTIME"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Aura Merah saat Marah */}
      {isWarning && (
        <pointLight position={[0, 1.0, 2.5]} intensity={50} color="#ff0000" distance={15} decay={1.5} />
      )}

      {/* Kabut Aura Merah di Belakang */}
      <mesh ref={fogRef} position={[0, 0.8, -1.0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#ff1111" transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>
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
