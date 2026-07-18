'use client';

import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLogoState } from '../../hooks/useLogoState';

// ─── FALLBACK SHAPE ───
// Shown when .glb is missing, failed, or not yet loaded
function FallbackShape({ color, isSelected, isHovered, name }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += isSelected ? 0.03 : 0.007;
    // Subtle scale pulse when selected
    if (isSelected) {
      ref.current.scale.setScalar(1.3 + Math.sin(clock.elapsedTime * 3) * 0.05);
    }
  });

  return (
    <group>
      <RoundedBox
        ref={ref}
        args={[1, 1, 1]}
        radius={0.15}
        smoothness={6}
        scale={isSelected ? 1.3 : 1}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 0.7 : 0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </RoundedBox>
      
      {/* Glow ring under the logo */}
      {(isSelected || isHovered) && (
        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.6 : 0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ─── GLB LOADER ───
function GLBModel({ path, color, isSelected, isHovered }) {
  // Lazy-require useGLTF only when needed to avoid SSR issues
  // We use dynamic require pattern for safe Next.js App Router usage
  const { useGLTF } = require('@react-three/drei');
  const { scene } = useGLTF(path);
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += isSelected ? 0.03 : 0.007;
    }
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      if (!child.material._originalEmissive) {
        child.material._originalEmissive = child.material.emissive?.clone() || new THREE.Color(0, 0, 0);
      }
      child.material.emissive = new THREE.Color(color);
      child.material.emissiveIntensity = isHovered || isSelected ? 0.5 : 0.05;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={isSelected ? 1.35 : 1}
    />
  );
}

// ─── SAFE GLB WRAPPER ───
// Catches errors so a failed .glb doesn't crash the whole canvas
class ErrorBoundaryGLB extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackShape
          color={this.props.color}
          isSelected={this.props.isSelected}
          isHovered={this.props.isHovered}
          name={this.props.name}
        />
      );
    }
    return this.props.children;
  }
}

// Must import React for the class component above
import React from 'react';

// ─── MAIN LOGO 3D MODEL ───
export default function Logo3DModel({ logo, position, color, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = useLogoState((s) => s.selectedLogoId === logo.id);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(logo.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <ErrorBoundaryGLB color={color} isSelected={isSelected} isHovered={isHovered} name={logo.name}>
        <Suspense fallback={
          <FallbackShape color={color} isSelected={isSelected} isHovered={isHovered} name={logo.name} />
        }>
          {logo.model ? (
            <GLBModel
              path={logo.model}
              color={color}
              isSelected={isSelected}
              isHovered={isHovered}
            />
          ) : (
            <FallbackShape color={color} isSelected={isSelected} isHovered={isHovered} name={logo.name} />
          )}
        </Suspense>
      </ErrorBoundaryGLB>

      {/* Hover Tooltip */}
      {isHovered && (
        <Html distanceFactor={8} position={[0, 1.1, 0]} center>
          <div style={{
            background: 'rgba(15,23,42,0.92)',
            color: '#F1F5F9',
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: 'nowrap',
            border: `1px solid ${color}`,
            boxShadow: `0 0 12px ${color}55`,
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}>
            {logo.name}
            {logo.tools?.length > 0 && (
              <span style={{ color, marginLeft: 6, fontSize: 10 }}>
                · {logo.tools[0]}
              </span>
            )}
          </div>
        </Html>
      )}

      {/* Selected Label */}
      {isSelected && (
        <Html distanceFactor={8} position={[0, -1.2, 0]} center>
          <div style={{
            background: color,
            color: '#0F172A',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          }}>
            {logo.tools?.join(' · ') || logo.name}
          </div>
        </Html>
      )}
    </group>
  );
}
