"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

type RobotPhase = "idle" | "running" | "warning";

/* ════════════════════════════════════════════════════════════
   CHIBI MECHA v3 — Premium Overhaul
   ════════════════════════════════════════════════════════════ */
function ChibiMecha({ mousePos, colors }: { mousePos: { x: number; y: number }; colors: { primary: string; secondary: string } }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.PointLight>(null);

  const target = useMemo(() => new THREE.Vector3(), []);
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState<RobotPhase>("running");
  const phaseTimerRef = useRef(0);

  useCursor(hovered, "pointer", "auto");

  const triggerWarning = () => {
    setPhase("warning");
    phaseTimerRef.current = 6.0;
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Timer countdown (no setState in useFrame for performance)
    if (phaseTimerRef.current > 0) {
      phaseTimerRef.current -= delta;
      if (phaseTimerRef.current <= 0) {
        phaseTimerRef.current = 0;
        setPhase("running");
      }
    }

    const isWarning = phase === "warning";
    const isRunning = phase === "running";

    // ─── HEAD TRACKING ───
    if (headRef.current) {
      target.set(mousePos.x * 2, mousePos.y * 1.2 + 1.4, 5);
      const dummy = new THREE.Object3D();
      dummy.position.set(0, 1.55, 0);
      dummy.lookAt(target);
      // Clamp rotation so head doesn't spin wildly
      dummy.rotation.x = THREE.MathUtils.clamp(dummy.rotation.x, -0.3, 0.25);
      dummy.rotation.y = THREE.MathUtils.clamp(dummy.rotation.y, -0.4, 0.4);

      if (isWarning) {
        dummy.rotation.x -= 0.15; // slight glare down
        headRef.current.quaternion.slerp(dummy.quaternion, 0.06);
      } else {
        headRef.current.quaternion.slerp(dummy.quaternion, 0.07);
      }
    }

    // ─── BODY FLOAT ───
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.04;
      if (isWarning) {
        // Subtle vibration
        groupRef.current.position.x = Math.sin(t * 45) * 0.008;
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
      }
    }

    // ─── ARM ANIMATION ───
    if (leftArmRef.current && rightArmRef.current) {
      if (isWarning) {
        // Fists clenched, arms tense
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.3, 0.08);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.3, 0.08);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.08);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.08);
      } else if (isRunning) {
        // Typing / working animation
        const base = -Math.PI / 5;
        leftArmRef.current.rotation.x = base + Math.sin(t * 12) * 0.15;
        rightArmRef.current.rotation.x = base + Math.cos(t * 12 + 1) * 0.15;
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, 0.1);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.1);
      } else {
        const base = -Math.PI / 6;
        leftArmRef.current.rotation.x = base + Math.sin(t * 1.5) * 0.03;
        rightArmRef.current.rotation.x = base + Math.cos(t * 1.5) * 0.03;
      }
    }

    // ─── EYES EXPRESSION ───
    if (eyeLeftRef.current && eyeRightRef.current) {
      const warnColor = new THREE.Color("#ff2222");
      const normalColor = new THREE.Color(colors.primary);

      const targetColor = isWarning ? warnColor : normalColor;
      (eyeLeftRef.current.material as THREE.MeshBasicMaterial).color.lerp(targetColor, 0.08);
      (eyeRightRef.current.material as THREE.MeshBasicMaterial).color.lerp(targetColor, 0.08);

      // Eye shape: angry = narrow V shape, running = focused, idle = relaxed
      const scaleY = isWarning ? 0.35 : isRunning ? 0.7 : 1.0;
      const rotL = isWarning ? -0.35 : isRunning ? -0.08 : 0;
      const rotR = isWarning ? 0.35 : isRunning ? 0.08 : 0;

      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y, scaleY, 0.08);
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, scaleY, 0.08);
      eyeLeftRef.current.rotation.z = THREE.MathUtils.lerp(eyeLeftRef.current.rotation.z, rotL, 0.08);
      eyeRightRef.current.rotation.z = THREE.MathUtils.lerp(eyeRightRef.current.rotation.z, rotR, 0.08);

      // Blink every ~4s
      if (Math.sin(t * 1.6) > 0.995 && !isWarning) {
        eyeLeftRef.current.scale.y = 0.05;
        eyeRightRef.current.scale.y = 0.05;
      }
    }

    // ─── AURA LIGHT ───
    if (auraRef.current) {
      if (isWarning) {
        auraRef.current.intensity = THREE.MathUtils.lerp(auraRef.current.intensity, 8 + Math.sin(t * 8) * 4, 0.1);
      } else {
        auraRef.current.intensity = THREE.MathUtils.lerp(auraRef.current.intensity, 0, 0.08);
      }
    }
  });

  const handlePointerDown = (e: unknown) => {
    (e as { stopPropagation?: () => void } | null)?.stopPropagation?.();
    triggerWarning();
  };

  // ─── MATERIALS ───
  const blackMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0d0d0d", metalness: 0.85, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.05,
  }), []);
  const silverMetal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#c8c8c8", metalness: 1.0, roughness: 0.08, clearcoat: 1.0,
  }), []);
  const darkGlass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050510", metalness: 0.9, roughness: 0.02, clearcoat: 1.0,
  }), []);

  const secondaryGlow = useMemo(() => new THREE.MeshBasicMaterial({ color: colors.secondary }), [colors.secondary]);
  const primaryGlow = useMemo(() => new THREE.MeshBasicMaterial({ color: colors.primary }), [colors.primary]);

  const isWarning = phase === "warning";

  return (
    <group
      ref={groupRef}
      scale={[0.95, 0.95, 0.95]}
      rotation={[0, -0.08, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── BODY ─── */}
      <group position={[0, 0.6, 0]}>
        {/* Main torso */}
        <RoundedBox args={[1.05, 0.95, 0.75]} radius={0.18} material={blackMetal} castShadow />
        {/* Chest plate */}
        <RoundedBox args={[0.75, 0.65, 0.78]} radius={0.12} position={[0, 0.05, 0]} material={silverMetal} />
        {/* Core reactor glow */}
        <mesh position={[0, 0.08, 0.4]} material={secondaryGlow}>
          <circleGeometry args={[0.14, 32]} />
        </mesh>
        <mesh position={[0, 0.08, 0.405]}>
          <circleGeometry args={[0.07, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Core reactor ring */}
        <mesh position={[0, 0.08, 0.395]}>
          <ringGeometry args={[0.12, 0.15, 32]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.5} />
        </mesh>
        {/* Waist / hip plate */}
        <RoundedBox args={[0.85, 0.2, 0.6]} radius={0.08} position={[0, -0.55, 0]} material={blackMetal} />
        {/* Thruster skirt */}
        <mesh position={[0, -0.72, 0]} material={silverMetal}>
          <cylinderGeometry args={[0.32, 0.48, 0.22, 16]} />
        </mesh>
        {/* Thruster glow */}
        <mesh position={[0, -0.84, 0]}>
          <circleGeometry args={[0.28, 16]} />
          <meshBasicMaterial color={isWarning ? "#ff2222" : colors.primary} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ─── HEAD ─── */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Neck cylinder */}
        <mesh position={[0, -0.3, 0]} material={silverMetal}>
          <cylinderGeometry args={[0.08, 0.12, 0.25]} />
        </mesh>
        {/* Main head block */}
        <RoundedBox args={[1.0, 0.8, 0.9]} radius={0.15} material={blackMetal} castShadow />
        {/* Face plate */}
        <mesh position={[0, -0.02, 0.42]} material={silverMetal}>
          <boxGeometry args={[0.85, 0.48, 0.1]} />
        </mesh>
        {/* Visor glass */}
        <mesh position={[0, -0.02, 0.48]} material={darkGlass}>
          <boxGeometry args={[0.78, 0.38, 0.04]} />
        </mesh>
        {/* Visor edge glow */}
        <mesh position={[0, -0.02, 0.505]}>
          <boxGeometry args={[0.8, 0.4, 0.005]} />
          <meshBasicMaterial color={isWarning ? "#ff2222" : colors.primary} transparent opacity={0.15} />
        </mesh>

        {/* Eyes */}
        <group position={[0, -0.02, 0.51]}>
          <mesh ref={eyeLeftRef} position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.015]} />
            <meshBasicMaterial color={colors.primary} />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.18, 0, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.015]} />
            <meshBasicMaterial color={colors.primary} />
          </mesh>
        </group>

        {/* Ear panels */}
        <mesh position={[-0.52, 0, 0]} material={silverMetal}>
          <boxGeometry args={[0.06, 0.3, 0.4]} />
        </mesh>
        <mesh position={[0.52, 0, 0]} material={silverMetal}>
          <boxGeometry args={[0.06, 0.3, 0.4]} />
        </mesh>

        {/* V-Fin antenna */}
        <group position={[0, 0.32, 0.3]} scale={[0.85, 0.85, 0.85]}>
          <mesh position={[-0.18, 0.18, 0]} rotation={[0, 0, -0.55]} material={secondaryGlow}>
            <boxGeometry args={[0.04, 0.42, 0.04]} />
          </mesh>
          <mesh position={[0.18, 0.18, 0]} rotation={[0, 0, 0.55]} material={secondaryGlow}>
            <boxGeometry args={[0.04, 0.42, 0.04]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} material={primaryGlow}>
            <boxGeometry args={[0.12, 0.12, 0.08]} />
          </mesh>
        </group>
      </group>

      {/* ─── ARMS ─── */}
      {/* Left */}
      <group position={[-0.68, 0.95, 0]}>
        <mesh material={silverMetal}><sphereGeometry args={[0.18, 16, 16]} /></mesh>
        <group ref={leftArmRef} position={[0, -0.08, 0]} rotation={[-Math.PI / 5, 0, 0]}>
          <mesh position={[0, -0.22, 0]} material={blackMetal}>
            <boxGeometry args={[0.17, 0.42, 0.17]} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.48, 0]} material={silverMetal}>
            <boxGeometry args={[0.14, 0.12, 0.14]} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.58, 0]} material={blackMetal}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
        </group>
      </group>
      {/* Right */}
      <group position={[0.68, 0.95, 0]}>
        <mesh material={silverMetal}><sphereGeometry args={[0.18, 16, 16]} /></mesh>
        <group ref={rightArmRef} position={[0, -0.08, 0]} rotation={[-Math.PI / 5, 0, 0]}>
          <mesh position={[0, -0.22, 0]} material={blackMetal}>
            <boxGeometry args={[0.17, 0.42, 0.17]} />
          </mesh>
          <mesh position={[0, -0.48, 0]} material={silverMetal}>
            <boxGeometry args={[0.14, 0.12, 0.14]} />
          </mesh>
          <mesh position={[0, -0.58, 0]} material={blackMetal}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
        </group>
      </group>

      {/* ─── HOLOGRAM SCREEN ─── */}
      <group position={[0, 0.55, 1.15]} rotation={[-0.08, 0, 0]}>
        {/* Glass panel */}
        <RoundedBox args={[1.6, 1.05, 0.015]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial color="#0a0a20" metalness={0.1} roughness={0.05} transmission={0.6} thickness={0.02} ior={1.5} transparent opacity={0.85} />
        </RoundedBox>
        {/* Glowing border */}
        <RoundedBox args={[1.62, 1.07, 0.008]} radius={0.05} smoothness={4}>
          <meshBasicMaterial color={isWarning ? "#ff2222" : colors.primary} transparent opacity={isWarning ? 0.7 : 0.35} wireframe />
        </RoundedBox>

        {/* HTML Dashboard */}
        <Html position={[0, 0, 0.02]} transform scale={0.012} zIndexRange={[100, 0]}>
          <div
            className="w-[180px] h-[115px] flex flex-col p-2 overflow-hidden rounded-md"
            style={{
              backgroundColor: "rgba(8, 8, 18, 0.95)",
              border: `1px solid ${isWarning ? "#ff2222" : colors.primary}`,
              boxShadow: `0 0 20px ${isWarning ? "rgba(255,34,34,0.4)" : `${colors.primary}33`}`,
              pointerEvents: "none",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-1">
              <span className="text-white text-[5px] font-mono tracking-[0.2em]">
                {isWarning ? "⚠ SYSTEM.ALERT" : "ANALYTICS.SYS"}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: isWarning ? "#ff2222" : colors.secondary,
                  boxShadow: `0 0 6px ${isWarning ? "#ff2222" : colors.secondary}`,
                }}
              />
            </div>

            {/* Analytics Grid */}
            <div className="flex-1 flex gap-1.5">
              {/* Bar chart area */}
              <div className="flex-[2] flex flex-col relative border-l border-b border-white/15 p-1 pt-2">
                <span className="absolute top-0 left-1 text-[3.5px] text-white/40 font-mono uppercase">
                  {isWarning ? "Error Rate" : "Traffic Yield"}
                </span>
                <div className="flex items-end justify-between w-full flex-1 gap-[2px]">
                  {[40, 70, 30, 90, 55, 80, 45, 65].map((h, i) => (
                    <div
                      key={i}
                      className="w-full rounded-t-sm"
                      style={{
                        height: isWarning ? `${20 + Math.random() * 70}%` : `${h}%`,
                        backgroundColor: isWarning ? "#ff2222" : colors.primary,
                        opacity: 0.85,
                        transition: "height 0.3s, background-color 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Side stats */}
              <div className="flex-[1] flex flex-col gap-1 justify-center">
                <div className="bg-white/5 p-1 rounded border border-white/10">
                  <div className="text-[3.5px] text-white/50 font-mono">CPU</div>
                  <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: isWarning ? "98%" : "62%", backgroundColor: isWarning ? "#ff2222" : colors.secondary }} />
                  </div>
                </div>
                <div className="bg-white/5 p-1 rounded border border-white/10">
                  <div className="text-[3.5px] text-white/50 font-mono">MEM</div>
                  <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: isWarning ? "95%" : "44%", backgroundColor: isWarning ? "#ff2222" : colors.primary }} />
                  </div>
                </div>
                <div className="text-right mt-auto">
                  <span
                    className="text-[14px] font-mono text-white font-bold block leading-none"
                    style={{ textShadow: `0 0 8px ${isWarning ? "#ff2222" : colors.primary}` }}
                  >
                    {isWarning ? "ERR!" : "99%"}
                  </span>
                  <span className="text-[3.5px] text-white/40 font-mono">{isWarning ? "OVERLOAD" : "UPTIME"}</span>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* ─── ANGER AURA (always-mounted, intensity controlled in useFrame) ─── */}
      <pointLight ref={auraRef} position={[0, 1.0, 1.5]} intensity={0} color="#ff0000" distance={12} decay={1.5} />

      {/* Extra anger effects */}
      {isWarning && (
        <>
          <pointLight position={[0, 0.5, 0.8]} intensity={3} color="#ff0000" distance={5} decay={2} />
          <pointLight position={[0, 2.0, 0]} intensity={4} color="#ff2222" distance={6} decay={2} />
        </>
      )}
    </group>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT (Canvas + Lights)
   ════════════════════════════════════════════════════════════ */
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
    <div className="relative w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 1.0, 5.8], fov: 45 }} shadows>
        <ambientLight intensity={1.2} />
        <spotLight position={[5, 8, 5]} angle={0.25} penumbra={1} intensity={2.5} castShadow shadow-mapSize={1024} />
        <pointLight position={[-3, 3, 4]} intensity={1.5} color={colors.secondary} />
        <pointLight position={[3, 0, 4]} intensity={1.5} color={colors.primary} />

        <Float speed={1.8} rotationIntensity={0.03} floatIntensity={0.15}>
          <ChibiMecha mousePos={mousePos} colors={colors} />
        </Float>

        <ContactShadows position={[0, -0.95, 0]} opacity={0.6} scale={5} blur={2.5} far={3} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
