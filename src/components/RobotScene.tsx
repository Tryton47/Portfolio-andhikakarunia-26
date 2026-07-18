'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── ROBOT MODEL ───
function Robot({ mousePos }: { mousePos: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  
  // Create a target vector for the head to look at
  const target = new THREE.Vector3();

  useFrame((state) => {
    if (headRef.current) {
      // Map mouse position (-1 to 1) to a 3D target point in front of the robot
      target.set(mousePos.x * 5, -mousePos.y * 5, 5);
      // Smoothly interpolate the head's rotation to look at the target
      headRef.current.lookAt(target);
      // Limit extreme rotations if necessary, but lookAt usually handles it well enough for this simple effect.
    }
    
    if (radarRef.current) {
      // Slowly rotate the radar disc
      radarRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* --- BODY --- */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.5, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
      </mesh>
      
      {/* Shoulders / Core details */}
      <mesh position={[0, 1.5, 0.55]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* --- HEAD --- */}
      <group ref={headRef} position={[0, 2.5, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#444444" metalness={0.8} />
        </mesh>
        
        {/* Head Box */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1, 0.8, 1]} />
          <meshStandardMaterial color="#222222" roughness={0.6} metalness={0.4} />
        </mesh>
        
        {/* Eye Visor */}
        <mesh position={[0, 0.2, 0.51]}>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Glowing Eyes (Theme Color) */}
        <mesh position={[-0.2, 0.2, 0.52]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial color="var(--theme-primary-hex, #6366F1)" />
        </mesh>
        <mesh position={[0.2, 0.2, 0.52]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial color="var(--theme-primary-hex, #6366F1)" />
        </mesh>
      </group>

      {/* --- ARMS HOLDING RADAR --- */}
      {/* Left Arm */}
      <group position={[-0.8, 1.8, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, -0.6, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.8, 1.8, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, -0.6, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>

      {/* --- RADAR / HOLOGRAPHIC DISC --- */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group ref={radarRef} position={[0, 1.2, 1.5]} rotation={[0.2, 0, 0]}>
          {/* Base Disc */}
          <mesh>
            <cylinderGeometry args={[1, 1, 0.05, 32]} />
            <meshStandardMaterial 
              color="var(--theme-primary-hex, #6366F1)" 
              transparent 
              opacity={0.3} 
              wireframe 
            />
          </mesh>
          {/* Inner Core */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <MeshDistortMaterial 
              color="var(--theme-secondary-hex, #06B6D4)" 
              distort={0.4} 
              speed={3} 
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Ring */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.85, 32]} />
            <meshBasicMaterial color="var(--theme-primary-hex, #6366F1)" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// ─── MAIN COMPONENT ───
export default function RobotScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  // To properly read CSS variables in ThreeJS materials, we ideally pass them via props, 
  // but since we are using plain strings like "var(--theme-primary-hex)", ThreeJS doesn't natively parse CSS variables in materials.
  // We need to read the computed style or use the theme context.
  
  // Wait, ThreeJS Color does NOT support CSS variables. 
  // Let's use standard hex strings by reading them from a state.
  const [colors, setColors] = useState({ primary: '#6366F1', secondary: '#06B6D4' });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue('--theme-primary-hex').trim() || '#6366F1';
      const secondary = getComputedStyle(root).getPropertyValue('--theme-secondary-hex').trim() || '#06B6D4';
      setColors({ primary, secondary });
    };
    
    updateColors();
    // Re-check colors periodically or listen to a custom event if theme changes
    const interval = setInterval(updateColors, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] cursor-crosshair">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Passing dynamic colors via context/props to the materials */}
        <RobotWithColors mousePos={mousePos} colors={colors} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Re-defining the Robot with proper color injection
function RobotWithColors({ mousePos, colors }: { mousePos: { x: number; y: number }, colors: { primary: string, secondary: string } }) {
  const headRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const target = new THREE.Vector3();

  useFrame(() => {
    if (headRef.current) {
      target.set(mousePos.x * 5, mousePos.y * 5, 5);
      headRef.current.lookAt(target);
    }
    if (radarRef.current) {
      radarRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.2, 1.5, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[0, 1.5, 0.55]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 2.5, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#444444" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1, 0.8, 1]} />
          <meshStandardMaterial color="#222222" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0.51]}>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.2, 0.2, 0.52]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial color={colors.primary} />
        </mesh>
        <mesh position={[0.2, 0.2, 0.52]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial color={colors.primary} />
        </mesh>
      </group>

      {/* Arms */}
      <group position={[-0.8, 1.8, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, -0.6, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>
      <group position={[0.8, 1.8, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, -0.6, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>

      {/* Holographic Radar */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group ref={radarRef} position={[0, 1.2, 1.5]} rotation={[0.2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[1, 1, 0.05, 32]} />
            <meshStandardMaterial color={colors.primary} transparent opacity={0.3} wireframe />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <MeshDistortMaterial color={colors.secondary} distort={0.4} speed={3} roughness={0.2} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.85, 32]} />
            <meshBasicMaterial color={colors.primary} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
