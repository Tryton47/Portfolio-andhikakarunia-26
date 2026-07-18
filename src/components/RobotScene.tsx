'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useCursor, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─── PREMIUM CUTE ROBOT (ASTRO / EVE STYLE) ───
function PremiumCuteRobot({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string }, onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((state) => {
    // 1. Head follows cursor
    if (headRef.current) {
      // The camera is at z=6. The robot is at z=0.
      // If mouse is on right (positive X), target should be positive X.
      target.set(mousePos.x * 8, mousePos.y * 5 + 1.5, 6);
      
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      // Offset target so the head rotates naturally
      dummy.lookAt(target);
      
      headRef.current.quaternion.slerp(dummy.quaternion, 0.15);
    }
    
    // 2. Idle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.08 - 0.5;
    }
    
    // 3. Hands typing animation
    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.05 + 0.1;
      rightHandRef.current.position.y = Math.sin(state.clock.elapsedTime * 15 + Math.PI) * 0.05 + 0.1;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    
    // Cute Jump & Spin Interaction
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.8,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        duration: 0.6,
        ease: "power2.inOut"
      });
    }
  };

  // Premium Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#ffffff', // Clean white
    metalness: 0.1, 
    roughness: 0.1, 
    clearcoat: 1.0, 
    clearcoatRoughness: 0.1 
  });
  
  const faceGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#050505',
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.95
  });

  const glowMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
  const screenMaterial = new THREE.MeshBasicMaterial({ color: colors.secondary, transparent: true, opacity: 0.8 });

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.5, 0]} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── FLOATING BODY ─── */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.6, 0.5, 32, 32]} />
        </mesh>
        
        {/* Core Ring Glow */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.61, 0.02, 16, 64]} />
          <meshBasicMaterial color={colors.secondary} />
        </mesh>
      </group>

      {/* ─── HEAD ─── */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Main Head Sphere */}
        <mesh castShadow material={bodyMaterial}>
          <sphereGeometry args={[0.7, 64, 64]} />
        </mesh>
        
        {/* Black Glossy Faceplate */}
        <mesh position={[0, 0.05, 0.25]} material={faceGlassMaterial}>
          <sphereGeometry args={[0.65, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
        </mesh>
        
        {/* Cute Glowing Eyes */}
        <group position={[0, 0.1, 0.83]} rotation={[-0.1, 0, 0]}>
          {/* Left Eye */}
          <mesh position={[-0.25, 0, 0]} material={glowMaterial}>
            <capsuleGeometry args={[0.08, 0.15, 16, 16]} />
          </mesh>
          {/* Right Eye */}
          <mesh position={[0.25, 0, 0]} material={glowMaterial}>
            <capsuleGeometry args={[0.08, 0.15, 16, 16]} />
          </mesh>
        </group>
        
        {/* Cute little antennae */}
        <mesh position={[0, 0.65, -0.1]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, -0.15]} material={glowMaterial}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      </group>

      {/* ─── FLOATING HANDS ─── */}
      <group ref={leftHandRef} position={[-0.8, 0.8, 0.8]}>
        <mesh castShadow material={bodyMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
      </group>
      <group ref={rightHandRef} position={[0.8, 0.8, 0.8]}>
        <mesh castShadow material={bodyMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
      </group>

      {/* ─── SLEEK HOLOGRAPHIC CONSOLE ─── */}
      <group position={[0, 0.4, 1.3]}>
        {/* Console Base */}
        <RoundedBox args={[1.4, 0.1, 0.8]} radius={0.05} smoothness={4} position={[0, 0, 0]} castShadow>
          <meshPhysicalMaterial color="#222" metalness={0.9} roughness={0.1} clearcoat={1.0} />
        </RoundedBox>
        
        {/* Holographic Curved Screen */}
        <group position={[0, 0.4, -0.2]} rotation={[-0.1, 0, 0]}>
          {/* Glowing Screen Mesh */}
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[1.6, 0.9]} />
            <meshBasicMaterial color={colors.primary} transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
          
          {/* Actual HTML UI Dashboard on the screen */}
          <Html position={[0, 0.2, 0.01]} transform distanceFactor={1.2} scale={0.4} rotation={[0, 0, 0]}>
            <div 
              className="w-[300px] h-[180px] rounded-lg border flex flex-col p-3 overflow-hidden shadow-2xl backdrop-blur-md"
              style={{ 
                borderColor: `rgba(var(--theme-secondary), 0.5)`,
                background: `linear-gradient(135deg, rgba(var(--theme-primary), 0.2), rgba(var(--theme-secondary), 0.1))`
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
                <span className="text-white text-xs font-bold tracking-widest font-mono">SYS.DASHBOARD</span>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary }} />
              </div>
              
              {/* Charts */}
              <div className="flex-1 flex gap-3">
                {/* Bar Chart */}
                <div className="flex-1 flex items-end gap-1 pb-1">
                  {[40, 70, 30, 90, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: colors.primary }} />
                  ))}
                </div>
                {/* Side Data */}
                <div className="flex-1 flex flex-col gap-2 justify-center">
                  <div className="h-6 w-full rounded-sm" style={{ backgroundColor: `rgba(var(--theme-primary), 0.3)` }} />
                  <div className="h-6 w-3/4 rounded-sm" style={{ backgroundColor: `rgba(var(--theme-secondary), 0.5)` }} />
                  <div className="text-[10px] text-white/70 font-mono mt-1">STATUS: OPTIMAL</div>
                </div>
              </div>
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
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-text-dim font-mono tracking-wider opacity-50 animate-pulse pointer-events-none whitespace-nowrap">
        * TRY CLICKING ME *
      </div>
      
      {/* Click counter overlay (easter egg) */}
      {clickCount > 0 && (
        <div className="absolute top-2 right-4 text-xs font-mono text-primary z-10 pointer-events-none">
          INTERACTIONS: {clickCount}
        </div>
      )}

      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.8} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2.5} 
          castShadow 
          shadow-mapSize={1024}
        />
        <pointLight position={[-5, -2, -5]} intensity={1} color={colors.secondary} />
        <pointLight position={[0, 2, 5]} intensity={0.8} color={colors.primary} />
        
        <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <PremiumCuteRobot mousePos={mousePos} colors={colors} onClick={handleRobotClick} />
        </Float>
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
