'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useCursor, Html, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─── PREMIUM EVE/ASTRO-STYLE ROBOT ───
function UltraPremiumRobot({ mousePos, colors, onClick }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string }, onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  
  const target = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // 1. Head follows cursor
    if (headRef.current) {
      // Invert the x and y mapping so it looks at the cursor correctly
      // Camera is positive Z, so positive X mouse should make head look positive X (right)
      target.set(mousePos.x * 6, mousePos.y * 4 + 1.5, 6);
      
      const dummy = new THREE.Object3D();
      dummy.position.copy(headRef.current.position);
      dummy.lookAt(target);
      
      // Extremely smooth slerp for a premium feel
      headRef.current.quaternion.slerp(dummy.quaternion, 0.08);
    }
    
    // 2. Idle floating animation (body)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
    }
    
    // 3. Hands typing animation on the glass keyboard
    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y = Math.sin(t * 12) * 0.03 + 0.1;
      leftHandRef.current.position.x = -0.7 + Math.sin(t * 4) * 0.05;
      
      rightHandRef.current.position.y = Math.sin(t * 12 + Math.PI) * 0.03 + 0.1;
      rightHandRef.current.position.x = 0.7 + Math.cos(t * 4) * 0.05;
    }

    // 4. Random Blinking Logic
    if (leftEyeRef.current && rightEyeRef.current) {
      // Blink every 3-5 seconds randomly
      const blinkCycle = Math.sin(t * 3) + Math.cos(t * 2.5);
      if (blinkCycle > 1.95) {
        // Blinking (scale Y goes to 0.1)
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 0.1, 0.5);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 0.1, 0.5);
      } else {
        // Open
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 1, 0.2);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 1, 0.2);
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    
    // Expressive Happy Spin & Jump
    if (groupRef.current && headRef.current) {
      // Jump
      gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.8,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      // Spin
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        duration: 0.8,
        ease: "back.out(1.5)"
      });
      // Happy head nod
      gsap.to(headRef.current.rotation, {
        x: -0.5,
        duration: 0.2,
        yoyo: true,
        repeat: 3
      });
    }
  };

  // ─── PREMIUM MATERIALS ───
  // High-gloss ceramic/white plastic (Apple/EVE style)
  const ceramicMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#ffffff',
    metalness: 0.1, 
    roughness: 0.1, 
    clearcoat: 1.0, 
    clearcoatRoughness: 0.1 
  });
  
  // Glossy Black screen for face
  const faceGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#000000',
    metalness: 0.8,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  // Glowing eyes (changes with theme)
  const glowMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });

  // Ultra-premium Glass Dashboard (Frosted glass)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.95, // Glass effect
    thickness: 0.1,     // Refraction thickness
    ior: 1.5,
    transparent: true,
    opacity: 1
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      {/* ─── BODY (Sleek Pod) ─── */}
      <group position={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow material={ceramicMaterial}>
          <capsuleGeometry args={[0.55, 0.6, 32, 64]} />
        </mesh>
        
        {/* Core Ring Glow */}
        <mesh position={[0, -0.1, 0.45]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.2, 0.015, 16, 64]} />
          <meshBasicMaterial color={colors.secondary} />
        </mesh>
      </group>

      {/* ─── HEAD (Wide, Cute Screen) ─── */}
      <group ref={headRef} position={[0, 1.6, 0]}>
        {/* Main Head Casing (Wide Rounded Box) */}
        <RoundedBox args={[1.5, 1, 1]} radius={0.3} smoothness={16} castShadow material={ceramicMaterial} />
        
        {/* Glossy Black Faceplate */}
        <RoundedBox args={[1.4, 0.9, 1.05]} radius={0.25} smoothness={16} position={[0, 0, 0.02]} material={faceGlassMaterial} />
        
        {/* Expressive Glowing Eyes */}
        <group position={[0, 0, 0.54]}>
          {/* Left Eye */}
          <mesh ref={leftEyeRef} position={[-0.3, 0.1, 0]} material={glowMaterial}>
            <capsuleGeometry args={[0.08, 0.15, 16, 16]} />
          </mesh>
          {/* Right Eye */}
          <mesh ref={rightEyeRef} position={[0.3, 0.1, 0]} material={glowMaterial}>
            <capsuleGeometry args={[0.08, 0.15, 16, 16]} />
          </mesh>
          
          {/* Cute digital blush/cheeks */}
          <mesh position={[-0.45, -0.15, 0]} material={new THREE.MeshBasicMaterial({ color: colors.secondary, transparent: true, opacity: 0.5 })}>
            <circleGeometry args={[0.06, 32]} />
          </mesh>
          <mesh position={[0.45, -0.15, 0]} material={new THREE.MeshBasicMaterial({ color: colors.secondary, transparent: true, opacity: 0.5 })}>
            <circleGeometry args={[0.06, 32]} />
          </mesh>
        </group>
        
        {/* Little Antenna */}
        <mesh position={[0, 0.5, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.7, -0.2]} material={glowMaterial}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
      </group>

      {/* ─── FLOATING HANDS ─── */}
      <group ref={leftHandRef} position={[-0.7, 0.6, 0.6]}>
        <mesh castShadow material={ceramicMaterial}>
          <capsuleGeometry args={[0.12, 0.2, 16, 32]} />
        </mesh>
      </group>
      <group ref={rightHandRef} position={[0.7, 0.6, 0.6]}>
        <mesh castShadow material={ceramicMaterial}>
          <capsuleGeometry args={[0.12, 0.2, 16, 32]} />
        </mesh>
      </group>

      {/* ─── GLASS SCI-FI DASHBOARD (Replaces old laptop) ─── */}
      <group position={[0, 0.2, 1.2]}>
        {/* Floating Glass Screen */}
        <group position={[0, 0.4, -0.1]} rotation={[-0.2, 0, 0]}>
          <RoundedBox args={[2.2, 1.4, 0.05]} radius={0.05} smoothness={8} material={glassMaterial} castShadow />
          
          {/* Holographic glowing edges */}
          <RoundedBox args={[2.25, 1.45, 0.02]} radius={0.06} smoothness={8} position={[0,0,-0.01]}>
             <meshBasicMaterial color={colors.primary} transparent opacity={0.15} wireframe />
          </RoundedBox>
          
          {/* Real HTML UI embedded on the glass */}
          <Html position={[0, 0, 0.03]} transform distanceFactor={1.2} scale={0.4} rotation={[0, 0, 0]}>
            <div 
              className="w-[450px] h-[280px] rounded-xl flex flex-col p-4 overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, rgba(var(--theme-primary), 0.1), rgba(var(--theme-secondary), 0.05))`
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
                <span className="text-white text-sm font-bold tracking-[0.3em] font-mono">SYS.DASHBOARD V2</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-[10px] font-mono">LIVE</span>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary }} />
                </div>
              </div>
              
              {/* Premium Charts Grid */}
              <div className="flex-1 flex gap-4">
                {/* Main Graph */}
                <div className="w-2/3 flex flex-col justify-end gap-2 border-l border-b border-white/20 p-2 relative">
                  <div className="absolute top-2 left-2 text-[10px] text-white/50 font-mono">TRAFFIC YIELD</div>
                  <div className="flex items-end justify-between w-full h-[120px] gap-1">
                    {[30, 50, 40, 70, 60, 90, 80, 100].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-full rounded-t-sm transition-all duration-500 hover:opacity-100 opacity-70" 
                        style={{ height: `${h}%`, backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}40` }} 
                      />
                    ))}
                  </div>
                </div>
                {/* Side Stats */}
                <div className="w-1/3 flex flex-col gap-3 justify-center">
                  <div className="bg-black/20 p-2 rounded border border-white/10 backdrop-blur-sm">
                     <div className="text-[9px] text-white/50 mb-1 font-mono">CPU USAGE</div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: colors.secondary }} />
                     </div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/10 backdrop-blur-sm">
                     <div className="text-[9px] text-white/50 mb-1 font-mono">MEMORY</div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: colors.primary }} />
                     </div>
                  </div>
                  <div className="mt-auto text-right">
                     <span className="text-3xl font-mono text-white tracking-tighter" style={{ textShadow: `0 0 15px ${colors.primary}` }}>99.9%</span>
                     <div className="text-[8px] text-white/60 tracking-widest font-mono">SYSTEM OPTIMAL</div>
                  </div>
                </div>
              </div>
            </div>
          </Html>
        </group>
        
        {/* Minimal Glass Keyboard/Base */}
        <RoundedBox args={[1.8, 0.05, 0.6]} radius={0.02} smoothness={4} position={[0, -0.3, 0.4]} material={glassMaterial} castShadow />
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
    <div className="relative w-full h-full min-h-[450px]">
      {/* Tooltip hint */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-text-dim font-mono tracking-widest opacity-60 animate-pulse pointer-events-none whitespace-nowrap bg-obsidian/50 px-3 py-1 rounded-full border border-border/50 backdrop-blur-md">
        TRY CLICKING ME
      </div>
      
      {/* Click counter overlay (easter egg) */}
      {clickCount > 0 && (
        <div className="absolute top-2 right-4 text-xs font-mono text-primary z-10 pointer-events-none bg-primary/10 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md">
          INTERACTIONS: {clickCount}
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 7.5], fov: 40 }} shadows>
        {/* Lighting setup for premium glossy look */}
        <ambientLight intensity={1.2} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={3} 
          castShadow 
          shadow-mapSize={2048}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-5, -2, -5]} intensity={1.5} color={colors.secondary} />
        <pointLight position={[0, 2, 5]} intensity={1.5} color={colors.primary} />
        
        <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.4}>
          <UltraPremiumRobot mousePos={mousePos} colors={colors} onClick={handleRobotClick} />
        </Float>
        
        {/* Soft, premium contact shadow on the "floor" */}
        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
        
        {/* Studio environment for high-quality reflections on glass/ceramic */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
