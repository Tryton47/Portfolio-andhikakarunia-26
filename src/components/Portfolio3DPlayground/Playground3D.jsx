'use client';

import { useState, Suspense, useCallback, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ToolCube from './ToolCube';
import ToolTooltip from './ToolTooltip';
import { ALL_TOOLS } from '../../config/allTools';
import './playground.css';

// ─── AMBIENT PARTICLES ───────────────────────────────────────────────────────
function AmbientParticles({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        size={0.06}
        color="#6366F1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  );
}

// ─── FLOATING ORBS ──────────────────────────────────────────────────────────
function FloatingOrbs() {
  const groupRef = useRef();
  const orbsData = useMemo(() => (
    Array.from({ length: 8 }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20 - 10,
      ],
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 1,
    }))
  ), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((orb, i) => {
      const data = orbsData[i];
      orb.position.y = data.position[1] + Math.sin(t * data.speed + data.phase) * 2;
      orb.position.x = data.position[0] + Math.cos(t * data.speed * 0.5 + data.phase) * 1;
      orb.scale.setScalar(data.scale * (0.8 + Math.sin(t * data.speed + data.phase) * 0.2));
    });
  });

  const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#EC4899'];

  return (
    <group ref={groupRef}>
      {orbsData.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={colors[i % 4]}
            transparent
            opacity={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── CAMERA CONTROLLER ─────────────────────────────────────────────────────
function CameraController() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.02;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseRef.current.y * 1.5, 0.02);
  });

  return null;
}

// ─── LIGHTING ──────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-15, -10, -10]} intensity={0.4} color="#8B5CF6" />
      <pointLight position={[0, 0, 25]} intensity={0.5} color="#06B6D4" />
    </>
  );
}

// ─── SCENE ────────────────────────────────────────────────────────────────
function Scene({ onToolSelect, selectedTool }) {
  return (
    <>
      <CameraController />
      <Lighting />
      <fog attach="fog" args={['#0F172A', 25, 70]} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.2} fade speed={0.3} />
      <AmbientParticles />
      <FloatingOrbs />

      {ALL_TOOLS.map((tool, index) => (
        <ToolCube
          key={tool.id}
          tool={tool}
          index={index}
          totalTools={ALL_TOOLS.length}
          onSelect={onToolSelect}
          isSelected={selectedTool?.id === tool.id}
        />
      ))}
    </>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Playground3D() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleToolSelect = useCallback((tool) => {
    setSelectedTool(tool);
    setIsTooltipVisible(true);
  }, []);

  const handleCloseTooltip = useCallback(() => {
    setIsTooltipVisible(false);
    setTimeout(() => setSelectedTool(null), 300);
  }, []);

  return (
    <div className="playground-container">
      {/* Background gradient */}
      <div className="playground-bg" />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 28], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Suspense fallback={null}>
          <Scene onToolSelect={handleToolSelect} selectedTool={selectedTool} />
        </Suspense>
      </Canvas>

      {/* Header */}
      <div className="playground-header">
        <h1 className="playground-title">
          Tech <span className="text-gradient">Playground</span>
        </h1>
        <p className="playground-subtitle">
          <span className="pulse-dot" />
          Click any cube to explore • {ALL_TOOLS.length} technologies
        </p>
      </div>

      {/* Tooltip */}
      {selectedTool && (
        <ToolTooltip
          tool={selectedTool}
          isVisible={isTooltipVisible}
          onClose={handleCloseTooltip}
        />
      )}
    </div>
  );
}
