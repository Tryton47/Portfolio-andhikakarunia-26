'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLogoState }          from '../../hooks/useLogoState';
import { useCategoryTransition } from '../../hooks/useCategoryTransition';
import { useEntranceStagger }    from '../../hooks/useEntranceStagger';
import { useDragMomentum }       from '../../hooks/useDragMomentum';
import { useIdleFloat }          from '../../hooks/useIdleFloat';

// ─── FALLBACK SHAPE ───
function FallbackShape({ color, isSelected, isHovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (isSelected) {
      ref.current.scale.setScalar(1.25 + Math.sin(clock.elapsedTime * 3) * 0.04);
    }
  });
  return (
    <group>
      <RoundedBox
        ref={ref}
        args={[1, 1, 1]}
        radius={0.15}
        smoothness={6}
        scale={isSelected ? 1.25 : 1}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 0.8 : 0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </RoundedBox>
      {(isSelected || isHovered) && (
        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isSelected ? 0.6 : 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── GLB MODEL ───
function GLBModel({ path, color, isSelected, isHovered }) {
  const { useGLTF } = require('@react-three/drei');
  const { scene }   = useGLTF(path);
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (isSelected) {
      ref.current.scale.setScalar(1.35 + Math.sin(clock.elapsedTime * 3) * 0.03);
    }
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color(color);
      child.material.emissiveIntensity = isHovered || isSelected ? 0.5 : 0.05;
    }
  });

  return <primitive ref={ref} object={scene} scale={isSelected ? 1.35 : 1} />;
}

// ─── ERROR BOUNDARY ───
class ErrorBoundaryGLB extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <FallbackShape color={this.props.color} isSelected={this.props.isSelected} isHovered={this.props.isHovered} />;
    }
    return this.props.children;
  }
}

// ─── MAIN LOGO 3D MODEL (with all animation hooks) ───
export default function Logo3DModel({ logo, index, position, color, category, onClick }) {
  const meshRef    = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = useLogoState((s) => s.selectedLogoId === logo.id);

  // ── Animation Hooks ──
  const delay = useEntranceStagger(index, 90);
  const { liveRef } = useCategoryTransition(position, category, delay);
  const { onPointerDown, onPointerMove, onPointerUp, isDragging } = useDragMomentum(meshRef);
  useIdleFloat(meshRef, { phase: index * 0.7, paused: isHovered || isDragging.current });

  // Sync transition position to mesh every frame (x & z only; y is additive via idle float)
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, liveRef.current[0], 0.12);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, liveRef.current[2], 0.12);
    // Snap y on first appearance
    if (Math.abs(meshRef.current.position.y - liveRef.current[1]) > 0.5) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, liveRef.current[1], 0.08);
    }
    // Slow idle spin when not hovered/selected/dragging
    if (!isHovered && !isSelected && !isDragging.current) {
      meshRef.current.rotation.y += 0.006;
    }
  });

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1] - 4, position[2]]} // Start below for entrance
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={(e) => { e.stopPropagation(); onClick(logo.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setIsHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <ErrorBoundaryGLB color={color} isSelected={isSelected} isHovered={isHovered}>
        <Suspense fallback={<FallbackShape color={color} isSelected={isSelected} isHovered={isHovered} />}>
          {logo.model ? (
            <GLBModel path={logo.model} color={color} isSelected={isSelected} isHovered={isHovered} />
          ) : (
            <FallbackShape color={color} isSelected={isSelected} isHovered={isHovered} />
          )}
        </Suspense>
      </ErrorBoundaryGLB>

      {/* Hover Tooltip */}
      {isHovered && !isSelected && (
        <Html distanceFactor={8} position={[0, 1.1, 0]} center>
          <div style={{
            background: 'rgba(15,23,42,0.92)',
            color: '#F1F5F9',
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: 'nowrap',
            border: `1px solid ${color}`,
            boxShadow: `0 0 14px ${color}55`,
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}>
            {logo.name}
            {logo.tools?.length > 0 && (
              <span style={{ color, marginLeft: 6, fontSize: 10 }}>· {logo.tools[0]}</span>
            )}
          </div>
        </Html>
      )}

      {/* Selected Ring Glow */}
      {isSelected && (
        <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
