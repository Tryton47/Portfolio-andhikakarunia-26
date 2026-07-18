'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─── CHIBI GUNDAM-LIKE ROBOT ───
function ChibiGundam({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string }, onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((state) => {
    if (headRef.current) {
      // Map mouse position to look target. 
      // Multipliers control how much the head turns.
      target.set(mousePos.x * 6, -mousePos.y * 4 + 1, 5);
      
      // Smoothly interpolate current rotation to look at target
      // We use a dummy object to calculate the target quaternion
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      // Offset target relative to head position
      const worldTarget = target.clone().add(new THREE.Vector3(0, 1.5, 0));
      dummy.lookAt(worldTarget);
      
      // Interpolate rotation
      headRef.current.quaternion.slerp(dummy.quaternion, 0.1);
    }
    
    // Idle breathing animation on the whole body
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 - 1.2;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    
    // Simple click animation (Jump & Wave)
    if (groupRef.current && rightArmRef.current) {
      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      
      gsap.to(rightArmRef.current.rotation, {
        x: -Math.PI / 1.2,
        z: -Math.PI / 4,
        duration: 0.2,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(rightArmRef.current!.rotation, { x: -Math.PI/6, z: -Math.PI/8, duration: 0.3 });
        }
      });
    }
  };

  // Materials
  const blackMetal = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.3, metalness: 0.8 });
  const silverMetal = new THREE.MeshStandardMaterial({ color: '#888888', roughness: 0.2, metalness: 0.9 });
  const darkGray = new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.6, metalness: 0.5 });
  const glowMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
  const screenMaterial = new THREE.MeshBasicMaterial({ color: colors.secondary });

  return (
    <group 
      ref={groupRef} 
      position={[0, -1.2, 0]} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── BODY (Chibi Proportions) ─── */}
      <group position={[0, 1.2, 0]}>
        {/* Core Chest */}
        <mesh castShadow receiveShadow material={silverMetal}>
          <boxGeometry args={[1.2, 1, 0.8]} />
        </mesh>
        {/* Chest Plate (Black) */}
        <mesh position={[0, 0, 0.42]} material={blackMetal}>
          <boxGeometry args={[0.9, 0.7, 0.1]} />
        </mesh>
        {/* Center Core Glow */}
        <mesh position={[0, 0, 0.48]} material={glowMaterial}>
          <circleGeometry args={[0.15, 32]} />
        </mesh>
        
        {/* Pelvis */}
        <mesh position={[0, -0.6, 0]} material={darkGray}>
          <boxGeometry args={[1, 0.4, 0.7]} />
        </mesh>
      </group>

      {/* ─── HEAD (Large, Gundam-style) ─── */}
      <group ref={headRef} position={[0, 2.0, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.2, 0]} material={darkGray}>
          <cylinderGeometry args={[0.15, 0.2, 0.4]} />
        </mesh>
        
        {/* Main Helmet (Black) */}
        <mesh position={[0, 0.4, 0]} castShadow material={blackMetal}>
          <boxGeometry args={[1.4, 1.2, 1.3]} />
        </mesh>
        
        {/* Face Plate (Silver) */}
        <mesh position={[0, 0.2, 0.61]} material={silverMetal}>
          <boxGeometry args={[0.8, 0.6, 0.2]} />
        </mesh>
        
        {/* V-Fin (Gundam Antenna) - Gold/Primary */}
        <group position={[0, 0.9, 0.65]}>
          <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, -0.6]} material={glowMaterial}>
            <boxGeometry args={[0.1, 0.8, 0.05]} />
          </mesh>
          <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, 0.6]} material={glowMaterial}>
            <boxGeometry args={[0.1, 0.8, 0.05]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={glowMaterial}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
          </mesh>
        </group>

        {/* Eyes (Glowing) */}
        <mesh position={[-0.25, 0.3, 0.72]} rotation={[0, 0, 0.1]} material={glowMaterial}>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
        </mesh>
        <mesh position={[0.25, 0.3, 0.72]} rotation={[0, 0, -0.1]} material={glowMaterial}>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
        </mesh>
        
        {/* Chin piece (Red/Primary traditionally, using primary) */}
        <mesh position={[0, -0.1, 0.72]} material={glowMaterial}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
        </mesh>
      </group>

      {/* ─── ARMS ─── */}
      {/* Left Arm (Typing on laptop) */}
      <group position={[-0.8, 1.5, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]} material={silverMetal}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
        {/* Arm Segment */}
        <group ref={leftArmRef} position={[0, -0.2, 0]} rotation={[-Math.PI/4, 0, Math.PI/8]}>
          <mesh position={[0, -0.4, 0]} material={blackMetal}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
          </mesh>
        </group>
      </group>
      
      {/* Right Arm (Typing/Resting) */}
      <group position={[0.8, 1.5, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]} material={silverMetal}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
        {/* Arm Segment */}
        <group ref={rightArmRef} position={[0, -0.2, 0]} rotation={[-Math.PI/6, 0, -Math.PI/8]}>
          <mesh position={[0, -0.4, 0]} material={blackMetal}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
          </mesh>
        </group>
      </group>

      {/* ─── LEGS (Sitting position) ─── */}
      {/* Left Leg */}
      <group position={[-0.3, -0.6, 0.4]} rotation={[-Math.PI/2, 0, -0.2]}>
        <mesh position={[0, -0.4, 0]} material={blackMetal}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
        </mesh>
        <mesh position={[0, -0.9, 0.1]} material={silverMetal}>
          <boxGeometry args={[0.5, 0.3, 0.6]} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[0.3, -0.6, 0.4]} rotation={[-Math.PI/2, 0, 0.2]}>
        <mesh position={[0, -0.4, 0]} material={blackMetal}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
        </mesh>
        <mesh position={[0, -0.9, 0.1]} material={silverMetal}>
          <boxGeometry args={[0.5, 0.3, 0.6]} />
        </mesh>
      </group>

      {/* ─── LAPTOP / DESK ─── */}
      <group position={[0, 0.2, 1.2]}>
        {/* Desk Surface (Invisible or subtle) */}
        {/* Laptop Base */}
        <mesh position={[0, 0, 0]} material={silverMetal} castShadow>
          <boxGeometry args={[1.6, 0.1, 1.2]} />
        </mesh>
        {/* Laptop Screen (Tilted open) */}
        <group position={[0, 0.05, -0.5]} rotation={[-0.2, 0, 0]}>
          {/* Screen Lid */}
          <mesh position={[0, 0.5, 0]} material={blackMetal}>
            <boxGeometry args={[1.6, 1, 0.05]} />
          </mesh>
          {/* Glowing Display */}
          <mesh position={[0, 0.5, 0.03]} material={screenMaterial}>
            <planeGeometry args={[1.4, 0.8]} />
          </mesh>
          {/* Floating UI Hologram on screen */}
          <Html position={[0, 0.5, 0.05]} transform distanceFactor={1.5} scale={0.5}>
            <div className="w-[200px] h-[120px] bg-black/80 border border-secondary rounded overflow-hidden p-2 flex flex-col gap-1">
              <div className="text-[10px] text-primary font-mono border-b border-primary/30 pb-1 mb-1">ANALYTICS DB</div>
              <div className="flex gap-2 h-1/2">
                <div className="flex-1 bg-secondary/20 rounded flex items-end p-1">
                  <div className="w-full bg-secondary h-[40%]" />
                </div>
                <div className="flex-1 bg-secondary/20 rounded flex items-end p-1">
                  <div className="w-full bg-secondary h-[70%]" />
                </div>
                <div className="flex-1 bg-secondary/20 rounded flex items-end p-1">
                  <div className="w-full bg-secondary h-[90%]" />
                </div>
              </div>
              <div className="text-[8px] text-white/50 font-mono mt-auto">SYS_OP: NORMAL</div>
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}

// ─── MAIN COMPONENT ───
export default function RobotScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const [colors, setColors] = useState({ primary: '#6366F1', secondary: '#06B6D4' });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue('--theme-primary-hex').trim() || '#6366F1';
      const secondary = getComputedStyle(root).getPropertyValue('--theme-secondary-hex').trim() || '#06B6D4';
      setColors({ primary, secondary });
    };
    
    updateColors();
    const interval = setInterval(updateColors, 500);
    return () => clearInterval(interval);
  }, []);

  const handleRobotClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-full min-h-[350px]">
      {/* Tooltip hint */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-text-dim font-mono tracking-wider opacity-50 animate-pulse pointer-events-none">
        * TRY CLICKING ME *
      </div>
      
      {/* Click counter overlay (easter egg) */}
      {clickCount > 0 && (
        <div className="absolute top-2 right-4 text-xs font-mono text-primary z-10 pointer-events-none">
          INTERACTIONS: {clickCount}
        </div>
      )}

      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.25} 
          penumbra={1} 
          intensity={2} 
          castShadow 
          shadow-mapSize={1024}
        />
        <pointLight position={[-5, -2, -5]} intensity={0.5} color={colors.secondary} />
        <pointLight position={[0, 0, 5]} intensity={0.5} color={colors.primary} />
        
        {/* Floating robot assembly */}
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <ChibiGundam mousePos={mousePos} colors={colors} onClick={handleRobotClick} />
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
