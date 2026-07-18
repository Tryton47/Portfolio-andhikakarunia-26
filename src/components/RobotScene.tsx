'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─── CHIBI MECHA (BLACK & SILVER) ───
function CoolChibiMecha({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string }, onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  
  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Head looks at cursor
    if (headRef.current) {
      target.set(mousePos.x * 4, mousePos.y * 3 + 1, 5);
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      dummy.lookAt(target);
      headRef.current.quaternion.slerp(dummy.quaternion, 0.15);
    }
    
    // Idle floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
    }
    
    // Typing animation
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * 15) * 0.1;
      rightArmRef.current.rotation.x = -Math.PI / 4 + Math.cos(t * 15) * 0.1;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    
    if (groupRef.current && headRef.current) {
      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      // Cool double spin
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y - Math.PI * 2,
        duration: 0.7,
        ease: "power3.inOut"
      });
    }
  };

  // Materials: Dominant Black and Silver Glossy
  const blackMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#0a0a0a', metalness: 0.8, roughness: 0.2, clearcoat: 0.5 
  });
  const silverMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#c0c0c0', metalness: 1.0, roughness: 0.1, clearcoat: 1.0 
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: '#000000', metalness: 0.9, roughness: 0.05, clearcoat: 1.0
  });
  const glowMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
  const secondaryGlow = new THREE.MeshBasicMaterial({ color: colors.secondary });

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── BODY ─── */}
      <group position={[0, 0.6, 0]}>
        {/* Core Chest */}
        <RoundedBox args={[1.0, 0.9, 0.7]} radius={0.15} material={blackMetal} castShadow />
        {/* Silver Armor Plates */}
        <RoundedBox args={[0.8, 0.7, 0.75]} radius={0.1} position={[0, 0.05, 0]} material={silverMetal} />
        {/* Center Core Reactor */}
        <mesh position={[0, 0.1, 0.38]} material={secondaryGlow}>
          <circleGeometry args={[0.15, 32]} />
        </mesh>
        <mesh position={[0, 0.1, 0.385]} material={new THREE.MeshBasicMaterial({color: '#ffffff'})}>
          <circleGeometry args={[0.08, 32]} />
        </mesh>
        {/* Thruster Skirt (Lower Body) */}
        <mesh position={[0, -0.45, 0]} material={blackMetal}>
          <cylinderGeometry args={[0.4, 0.6, 0.3, 16]} />
        </mesh>
      </group>

      {/* ─── HEAD ─── */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.25, 0]} material={silverMetal}>
          <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        </mesh>
        
        {/* Main Head Box (Angular) */}
        <RoundedBox args={[1.1, 0.9, 1.0]} radius={0.15} material={blackMetal} castShadow />
        
        {/* Face Plate (Silver surround) */}
        <mesh position={[0, -0.05, 0.45]} material={silverMetal}>
          <boxGeometry args={[0.9, 0.5, 0.15]} />
        </mesh>
        
        {/* Glass Visor (Dark) */}
        <mesh position={[0, -0.05, 0.51]} material={darkGlass}>
          <boxGeometry args={[0.8, 0.4, 0.05]} />
        </mesh>
        
        {/* Glowing Eyes */}
        <group position={[0, -0.05, 0.54]}>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]} material={glowMaterial}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.1]} material={glowMaterial}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
          </mesh>
        </group>
        
        {/* V-Fin (Gundam Antenna) */}
        <group position={[0, 0.35, 0.52]}>
          <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, -0.6]} material={secondaryGlow}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
          </mesh>
          <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, 0.6]} material={secondaryGlow}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={glowMaterial}>
            <boxGeometry args={[0.15, 0.15, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* ─── ARMS ─── */}
      <group position={[-0.7, 0.9, 0]}>
        <mesh material={silverMetal}><sphereGeometry args={[0.2, 16, 16]} /></mesh>
        <group ref={leftArmRef} position={[0, -0.1, 0]} rotation={[-Math.PI/4, 0, 0]}>
          <mesh position={[0, -0.3, 0]} material={blackMetal}>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
          </mesh>
        </group>
      </group>
      
      <group position={[0.7, 0.9, 0]}>
        <mesh material={silverMetal}><sphereGeometry args={[0.2, 16, 16]} /></mesh>
        <group ref={rightArmRef} position={[0, -0.1, 0]} rotation={[-Math.PI/4, 0, 0]}>
          <mesh position={[0, -0.3, 0]} material={blackMetal}>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
          </mesh>
        </group>
      </group>

      {/* ─── LAPTOP / CONSOLE ─── */}
      <group position={[0, 0.1, 1.0]}>
        {/* Laptop Base */}
        <RoundedBox args={[1.5, 0.05, 1.0]} radius={0.02} material={silverMetal} castShadow />
        
        {/* Keyboard Glow */}
        <mesh position={[0, 0.03, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.3} />
        </mesh>

        {/* Laptop Screen */}
        <group position={[0, 0.02, -0.45]} rotation={[-0.15, 0, 0]}>
          {/* Screen Lid */}
          <RoundedBox args={[1.5, 1.0, 0.05]} radius={0.02} position={[0, 0.5, 0]} material={blackMetal} />
          
          {/* Glowing Display Background */}
          <mesh position={[0, 0.5, 0.03]}>
            <planeGeometry args={[1.4, 0.9]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          
          {/* HTML UI perfectly matched to screen size */}
          {/* Screen plane is 1.4 x 0.9 units. With scale={0.01}, width=140px, height=90px */}
          {/* Let's use scale={0.005} so we can design in 280x180 px for better resolution */}
          <Html position={[0, 0.5, 0.031]} transform distanceFactor={1} scale={0.005} rotation={[0, 0, 0]}>
            <div 
              className="w-[280px] h-[180px] bg-black/90 border border-white/10 rounded flex flex-col p-2 overflow-hidden"
            >
              <div className="flex justify-between border-b border-white/20 pb-1 mb-2">
                <span className="text-white/80 text-[8px] font-mono tracking-widest">ANALYTICS.SYS</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary }} />
              </div>
              
              <div className="flex-1 flex gap-2">
                {/* Bar chart */}
                <div className="flex-1 flex items-end gap-1">
                  {[40, 70, 30, 90, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: colors.primary }} />
                  ))}
                </div>
                {/* Stats */}
                <div className="w-[80px] flex flex-col gap-2 justify-center">
                   <div className="text-[7px] text-white/50 font-mono">CPU LOAD</div>
                   <div className="w-full h-1 bg-white/10 rounded-full">
                     <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: colors.secondary }} />
                   </div>
                   <div className="text-[7px] text-white/50 font-mono mt-1">MEM USAGE</div>
                   <div className="w-full h-1 bg-white/10 rounded-full">
                     <div className="h-full rounded-full" style={{ width: '45%', backgroundColor: colors.primary }} />
                   </div>
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
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-text-dim font-mono tracking-widest opacity-60 animate-pulse pointer-events-none whitespace-nowrap border-b border-primary/30 pb-1">
        INTERACTIVE MECHA
      </div>

      <Canvas camera={{ position: [0, 1.5, 6], fov: 40 }} shadows>
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2.5} 
          castShadow 
          shadow-mapSize={1024}
        />
        <pointLight position={[-3, 2, 4]} intensity={1.5} color={colors.secondary} />
        <pointLight position={[3, -1, 4]} intensity={1.5} color={colors.primary} />
        
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <CoolChibiMecha mousePos={mousePos} colors={colors} onClick={handleRobotClick} />
        </Float>
        
        <ContactShadows position={[0, -1.2, 0]} opacity={0.7} scale={5} blur={2} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
