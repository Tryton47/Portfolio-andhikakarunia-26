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
    
    // Head looks at cursor (Restricted and smooth)
    if (headRef.current) {
      // Reduced multipliers so the head doesn't snap backwards or turn too far.
      // The cursor maps to -1 to 1.
      target.set(mousePos.x * 2.5, mousePos.y * 1.5 + 1.2, 6);
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      dummy.lookAt(target);
      // Slower slerp for ultra-smooth turning
      headRef.current.quaternion.slerp(dummy.quaternion, 0.06);
    }
    
    // Idle floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
    }
    
    // Typing/Interacting animation
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * 10) * 0.08;
      rightArmRef.current.rotation.x = -Math.PI / 4 + Math.cos(t * 10) * 0.08;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    
    if (groupRef.current && headRef.current) {
      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.5,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      // Cool double spin
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y - Math.PI * 2,
        duration: 0.8,
        ease: "power3.inOut"
      });
    }
  };

  // Materials: Dominant Black and Silver Glossy
  const blackMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#080808', metalness: 0.8, roughness: 0.2, clearcoat: 0.6 
  });
  const silverMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#d0d0d0', metalness: 1.0, roughness: 0.1, clearcoat: 1.0 
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
      // Scale up the entire robot slightly to make it proportional
      scale={[1.2, 1.2, 1.2]} 
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
        
        <group position={[0, -0.05, 0.54]}>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]} material={glowMaterial}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.1]} material={glowMaterial}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
          </mesh>
        </group>
        
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

      {/* ─── PURE HOLOGRAM ANALYTICS (No Laptop) ─── */}
      {/* Positioned floating in front of the robot */}
      <group position={[0, 0.5, 1.2]} rotation={[-0.1, 0, 0]}>
        
        {/* Holographic Border/Frame */}
        <RoundedBox args={[1.6, 1.0, 0.02]} radius={0.05} smoothness={4}>
          <meshBasicMaterial color={colors.primary} transparent opacity={0.3} wireframe />
        </RoundedBox>
        
        {/* Glowing Base Projection Pad (below hologram) */}
        <mesh position={[0, -0.6, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, -0.6, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.55, 0.6, 32]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.6} />
        </mesh>

        {/* HTML UI Dashboard */}
        {/* Plane size is 1.6 x 1.0. If scale=0.005, CSS width should be 1.6/0.005 = 320px, height = 200px */}
        <Html position={[0, 0, 0.02]} transform distanceFactor={1.2} scale={0.005} rotation={[0, 0, 0]}>
          <div 
            className="w-[320px] h-[200px] flex flex-col p-3 overflow-hidden rounded shadow-2xl backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(5, 5, 5, 0.7)',
              border: `1px solid rgba(var(--theme-primary), 0.5)`
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/20 pb-1.5 mb-2">
              <span className="text-white/90 text-[10px] font-mono tracking-[0.2em]">ANALYTICS.SYS</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-white/50 font-mono">LIVE</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary }} />
              </div>
            </div>
            
            {/* Analytics Grid */}
            <div className="flex-1 flex gap-3">
              {/* Bar chart */}
              <div className="w-2/3 flex flex-col justify-end gap-1 relative border-l border-b border-white/10 p-1">
                <span className="absolute top-1 left-1 text-[7px] text-white/40 font-mono">TRAFFIC YIELD</span>
                <div className="flex items-end justify-between w-full h-[120px] gap-1">
                  {[40, 70, 30, 90, 60, 80].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-full rounded-t-sm transition-all duration-500 opacity-80" 
                      style={{ height: `${h}%`, backgroundColor: colors.primary }} 
                    />
                  ))}
                </div>
              </div>
              {/* Side Stats */}
              <div className="w-1/3 flex flex-col gap-2 justify-center">
                 <div className="bg-black/40 p-1.5 rounded border border-white/5">
                   <div className="text-[7px] text-white/50 mb-1 font-mono">CPU LOAD</div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: colors.secondary }} />
                   </div>
                 </div>
                 <div className="bg-black/40 p-1.5 rounded border border-white/5">
                   <div className="text-[7px] text-white/50 mb-1 font-mono">MEM USAGE</div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full rounded-full" style={{ width: '45%', backgroundColor: colors.primary }} />
                   </div>
                 </div>
                 <div className="mt-auto text-right pr-1">
                    <span className="text-xl font-mono text-white tracking-tighter block leading-none" style={{ textShadow: `0 0 10px ${colors.primary}` }}>99%</span>
                    <span className="text-[6px] text-white/60 tracking-widest font-mono">SYSTEM READY</span>
                 </div>
              </div>
            </div>
          </div>
        </Html>
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
      // Mapping cursor slightly constrained so it doesn't flip out
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

      <Canvas camera={{ position: [0, 1.5, 6.5], fov: 40 }} shadows>
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3} 
          castShadow 
          shadow-mapSize={1024}
        />
        <pointLight position={[-3, 2, 4]} intensity={2} color={colors.secondary} />
        <pointLight position={[3, -1, 4]} intensity={2} color={colors.primary} />
        
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <CoolChibiMecha mousePos={mousePos} colors={colors} onClick={handleRobotClick} />
        </Float>
        
        <ContactShadows position={[0, -1.8, 0]} opacity={0.8} scale={6} blur={2.5} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
