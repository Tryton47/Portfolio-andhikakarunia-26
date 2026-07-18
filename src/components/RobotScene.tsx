'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── CHIBI MECHA (BLACK & SILVER) ───
function CoolChibiMecha({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string }, onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  
  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);
  const [angryTimer, setAngryTimer] = useState(0);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (angryTimer > 0) {
      setAngryTimer((prev) => prev - delta);
    }
    const isAngry = angryTimer > 0;

    // Head looks at cursor (Restricted and smooth)
    if (headRef.current) {
      target.set(mousePos.x * 2.5, mousePos.y * 1.5 + 1.2, 6);
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      dummy.lookAt(target);

      if (isAngry) {
        // Angry: Head shakes rapidly and looks down/aggressively
        headRef.current.rotation.y = (Math.random() - 0.5) * 0.2;
        headRef.current.rotation.z = (Math.random() - 0.5) * 0.1;
        headRef.current.rotation.x = -0.2 + (Math.random() - 0.5) * 0.1;
      } else {
        // Normal smooth tracking
        headRef.current.quaternion.slerp(dummy.quaternion, 0.06);
      }
    }
    
    // Body Animation
    if (groupRef.current) {
      if (isAngry) {
        // Angry vibrating
        groupRef.current.position.x = (Math.random() - 0.5) * 0.05;
        groupRef.current.position.y = (Math.random() - 0.5) * 0.05;
      } else {
        // Smooth floating + reset X
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
        groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
      }
    }
    
    // Busy working/typing animation
    if (leftArmRef.current && rightArmRef.current) {
      const typeSpeed = isAngry ? 50 : 25; // Types aggressively when angry, very fast normally ("umek bekerja")
      const typeIntensity = isAngry ? 0.3 : 0.15;
      
      leftArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * typeSpeed) * typeIntensity;
      rightArmRef.current.rotation.x = -Math.PI / 4 + Math.cos(t * typeSpeed + Math.PI/3) * typeIntensity;
    }
    
    // Dynamic Eye Colors
    if (eyeLeftRef.current && eyeRightRef.current) {
      const currentEyeColor = isAngry ? new THREE.Color('#ff0000') : new THREE.Color(colors.primary);
      (eyeLeftRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.2);
      (eyeRightRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.2);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    setAngryTimer(1.5); // Stay angry for 1.5 seconds
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
  const secondaryGlow = new THREE.MeshBasicMaterial({ color: colors.secondary });
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });

  // Premium transparent glass screen for hologram
  const hologramGlass = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.95, // Fully glass-like
    thickness: 0.05,
    ior: 1.4,
    transparent: true,
    opacity: 1
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      scale={[1.1, 1.1, 1.1]} 
      // Angled slightly so we see it in 3/4 perspective
      rotation={[0, -Math.PI / 8, 0]}
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
          <mesh ref={eyeLeftRef} position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]} material={eyeMaterial.clone()}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.2, 0, 0]} rotation={[0, 0, -0.1]} material={eyeMaterial.clone()}>
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
          <mesh position={[0, 0, 0]} material={eyeMaterial}>
            <boxGeometry args={[0.15, 0.15, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* ─── ARMS (Busy typing fast) ─── */}
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

      {/* ─── PURE HOLOGRAM ANALYTICS ─── */}
      <group position={[0, 0.4, 1.2]} rotation={[-0.1, 0, 0]}>
        
        {/* Physical Transparent Glass Screen to catch reflections */}
        <RoundedBox args={[1.7, 1.1, 0.02]} radius={0.05} smoothness={4} material={hologramGlass} />
        
        {/* Holographic Glowing Border */}
        <RoundedBox args={[1.72, 1.12, 0.01]} radius={0.06} smoothness={4}>
          <meshBasicMaterial color={colors.primary} transparent opacity={0.4} wireframe />
        </RoundedBox>
        
        {/* Glowing Base Projection Pad (below hologram) */}
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.55, 0.6, 32]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.6} />
        </mesh>

        {/* HTML UI Dashboard - Partially transparent so we can see the physical glass reflections */}
        {/* HTML Scale 0.005, Plane is 1.7 x 1.1 => CSS 340px x 220px */}
        <Html position={[0, 0, 0.015]} transform distanceFactor={1.2} scale={0.005} rotation={[0, 0, 0]}>
          <div 
            className="w-[340px] h-[220px] flex flex-col p-3 overflow-hidden rounded shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ 
              backgroundColor: 'rgba(5, 5, 5, 0.4)', // highly transparent to let glass show
              border: `1px solid rgba(var(--theme-primary), 0.5)`,
              backdropFilter: 'blur(2px)' // slight CSS blur in addition to 3D glass
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/20 pb-1.5 mb-2">
              <span className="text-white/90 text-[10px] font-mono tracking-[0.2em]">ANALYTICS.SYS</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-white/50 font-mono">LIVE</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={angryTimer > 0 ? {backgroundColor: '#ff0000'} : { backgroundColor: colors.secondary }} />
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
                      className="w-full rounded-t-sm transition-all duration-300 opacity-80" 
                      style={{ 
                        height: angryTimer > 0 ? `${Math.random() * 100}%` : `${h}%`, 
                        backgroundColor: angryTimer > 0 ? '#ff0000' : colors.primary 
                      }} 
                    />
                  ))}
                </div>
              </div>
              {/* Side Stats */}
              <div className="w-1/3 flex flex-col gap-2 justify-center">
                 <div className="bg-black/40 p-1.5 rounded border border-white/5">
                   <div className="text-[7px] text-white/50 mb-1 font-mono">CPU LOAD</div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all" style={{ width: angryTimer > 0 ? '99%' : '65%', backgroundColor: angryTimer > 0 ? '#ff0000' : colors.secondary }} />
                   </div>
                 </div>
                 <div className="bg-black/40 p-1.5 rounded border border-white/5">
                   <div className="text-[7px] text-white/50 mb-1 font-mono">MEM USAGE</div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all" style={{ width: angryTimer > 0 ? '99%' : '45%', backgroundColor: angryTimer > 0 ? '#ff0000' : colors.primary }} />
                   </div>
                 </div>
                 <div className="mt-auto text-right pr-1">
                    <span className="text-xl font-mono text-white tracking-tighter block leading-none" style={{ textShadow: `0 0 10px ${angryTimer > 0 ? '#ff0000' : colors.primary}` }}>
                      {angryTimer > 0 ? 'ERR' : '99%'}
                    </span>
                    <span className="text-[6px] text-white/60 tracking-widest font-mono">
                      {angryTimer > 0 ? 'CRITICAL' : 'SYSTEM READY'}
                    </span>
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

  return (
    <div className="relative w-full h-full min-h-[350px]">
      {/* Removed the "INTERACTIVE MECHA" text here as requested */}
      
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
          <CoolChibiMecha mousePos={mousePos} colors={colors} onClick={() => {}} />
        </Float>
        
        <ContactShadows position={[0, -1.8, 0]} opacity={0.8} scale={6} blur={2.5} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
