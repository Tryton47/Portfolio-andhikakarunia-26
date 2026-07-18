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
        // Calm & natural anger: Slowly tilt head down and stare, no vibrating
        dummy.rotation.x -= 0.2; 
        headRef.current.quaternion.slerp(dummy.quaternion, 0.05);
      } else {
        // Normal smooth tracking
        headRef.current.quaternion.slerp(dummy.quaternion, 0.06);
      }
    }
    
    // Body Animation
    if (groupRef.current) {
      // Smooth floating only. No shaking.
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
    }
    
    // Typing animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isAngry) {
        // Stop working, arms reset to neutral defensive pose
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -Math.PI / 4, 0.1);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 4, 0.1);
      } else {
        // Smoothly and elegantly working
        const typeSpeed = 20;
        const typeIntensity = 0.1;
        leftArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(t * typeSpeed) * typeIntensity;
        rightArmRef.current.rotation.x = -Math.PI / 4 + Math.cos(t * typeSpeed + Math.PI/3) * typeIntensity;
      }
    }
    
    // Natural Expressions (Eyes)
    if (eyeLeftRef.current && eyeRightRef.current) {
      const currentEyeColor = isAngry ? new THREE.Color('#ff3333') : new THREE.Color(colors.primary);
      (eyeLeftRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.1);
      (eyeRightRef.current.material as THREE.MeshBasicMaterial).color.lerp(currentEyeColor, 0.1);

      // Rotate eyes to form an angry expression \ /
      const targetZLeft = isAngry ? -0.3 : 0.05; // default slight tilt
      const targetZRight = isAngry ? 0.3 : -0.05;
      
      // Also scale Y down slightly to squint
      const targetScaleY = isAngry ? 0.4 : 1.0;

      eyeLeftRef.current.rotation.z = THREE.MathUtils.lerp(eyeLeftRef.current.rotation.z, targetZLeft, 0.1);
      eyeRightRef.current.rotation.z = THREE.MathUtils.lerp(eyeRightRef.current.rotation.z, targetZRight, 0.1);
      
      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(eyeLeftRef.current.scale.y, targetScaleY, 0.1);
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(eyeRightRef.current.scale.y, targetScaleY, 0.1);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onClick();
    // Increase angry duration for a calm, long stare
    setAngryTimer(2.5); 
  };

  // Materials: Dominant Black and Silver Glossy
  const blackMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#0a0a0a', metalness: 0.8, roughness: 0.15, clearcoat: 0.8 
  });
  const silverMetal = new THREE.MeshPhysicalMaterial({ 
    color: '#d0d0d0', metalness: 1.0, roughness: 0.1, clearcoat: 1.0 
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: '#000000', metalness: 0.9, roughness: 0.02, clearcoat: 1.0
  });
  const secondaryGlow = new THREE.MeshBasicMaterial({ color: colors.secondary });
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });

  // Premium transparent glass screen for hologram
  const hologramGlass = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.2,
    roughness: 0.05,
    transmission: 1.0, // Fully glass-like
    thickness: 0.05,
    ior: 1.4,
    transparent: true,
    opacity: 1
  });

  return (
    <group 
      ref={groupRef} 
      // Lowered slightly to prevent clipping V-Fin at the top of the canvas
      position={[0, -0.4, 0]} 
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
      <group position={[0, 0.4, 1.2]} rotation={[-0.05, 0, 0]}>
        
        {/* Physical Transparent Glass Screen to catch reflections */}
        <RoundedBox args={[1.7, 1.1, 0.02]} radius={0.05} smoothness={4} material={hologramGlass} />
        
        {/* Holographic Glowing Border */}
        <RoundedBox args={[1.72, 1.12, 0.01]} radius={0.06} smoothness={4}>
          <meshBasicMaterial color={colors.primary} transparent opacity={0.4} wireframe />
        </RoundedBox>
        
        {/* Base Projection Pad */}
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, -0.7, 0.2]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.55, 0.6, 32]} />
          <meshBasicMaterial color={colors.primary} transparent opacity={0.5} />
        </mesh>

        {/* HTML UI Dashboard - 100% visible now. */}
        {/* Placed slightly further in front of glass so transmission doesn't hide it */}
        {/* Adjusted scale to 0.01. So 1.7 units wide = 170px wide in CSS */}
        <Html position={[0, 0, 0.03]} transform distanceFactor={1.2} scale={0.01} rotation={[0, 0, 0]}>
          <div 
            className="w-[170px] h-[110px] flex flex-col p-2 overflow-hidden rounded-md shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(10, 10, 15, 0.85)', // Highly opaque dark base to ensure visibility
              border: `1px solid rgba(var(--theme-primary), 0.8)`
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-1.5">
              <span className="text-white text-[5px] font-mono tracking-[0.2em]">ANALYTICS.SYS</span>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full animate-pulse" style={angryTimer > 0 ? {backgroundColor: '#ff3333'} : { backgroundColor: colors.secondary }} />
              </div>
            </div>
            
            {/* Analytics Grid */}
            <div className="flex-1 flex gap-2">
              {/* Bar chart */}
              <div className="flex-[2] flex flex-col justify-end gap-0.5 relative border-l border-b border-white/10 p-1">
                <span className="absolute top-0 left-1 text-[4px] text-white/50 font-mono">TRAFFIC YIELD</span>
                <div className="flex items-end justify-between w-full h-[60px] gap-0.5">
                  {[40, 70, 30, 90, 60, 80].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-full rounded-t-sm transition-all duration-300" 
                      style={{ 
                        height: angryTimer > 0 ? '10%' : `${h}%`, 
                        backgroundColor: angryTimer > 0 ? '#ff3333' : colors.primary,
                        opacity: 0.9
                      }} 
                    />
                  ))}
                </div>
              </div>
              {/* Side Stats */}
              <div className="flex-[1] flex flex-col gap-1 justify-center">
                 <div className="bg-black/50 p-1 rounded border border-white/10">
                   <div className="text-[4px] text-white/60 mb-0.5 font-mono">CPU LOAD</div>
                   <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all" style={{ width: angryTimer > 0 ? '100%' : '65%', backgroundColor: angryTimer > 0 ? '#ff3333' : colors.secondary }} />
                   </div>
                 </div>
                 <div className="bg-black/50 p-1 rounded border border-white/10">
                   <div className="text-[4px] text-white/60 mb-0.5 font-mono">MEMORY</div>
                   <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all" style={{ width: angryTimer > 0 ? '100%' : '45%', backgroundColor: angryTimer > 0 ? '#ff3333' : colors.primary }} />
                   </div>
                 </div>
                 <div className="mt-auto text-right">
                    <span className="text-lg font-mono text-white tracking-tighter block leading-none" style={{ textShadow: `0 0 5px ${angryTimer > 0 ? '#ff3333' : colors.primary}` }}>
                      {angryTimer > 0 ? 'ERR' : '99%'}
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
