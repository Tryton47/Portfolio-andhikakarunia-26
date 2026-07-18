'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME }      from '../../config/colors';
import { useLogoState } from '../../hooks/useLogoState';
import * as THREE from 'three';

// ─── RING POSITIONS ───
function calculatePosition(index, total) {
  const radius = 2.8;
  const angle  = (index / total) * Math.PI * 2;
  return [
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius,
  ];
}

// ─── SUBTLE AMBIENT RING ON GROUND PLANE ───
function RingDecoration({ color }) {
  return (
    <group>
      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <ringGeometry args={[2.75, 2.85, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Center dot glow */}
      <mesh position={[0, -0.9, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── MAIN CANVAS ───
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const isAutoPlay     = useLogoState((s) => s.isAutoPlay);
  const selectLogo     = useLogoState((s) => s.selectLogo);

  const logos = LOGOS_DATA[activeCategory] || [];
  const color = THEME.categories[activeCategory]?.accent || '#06B6D4';

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/5"
      style={{ height: '500px', background: THEME.base.background }}
    >
      <Canvas camera={{ position: [0, 2.5, 8.5], fov: 44 }} shadows>
        <color attach="background" args={[THEME.base.background]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 6, 0]}  intensity={1.2} color={color} />
        <pointLight position={[6, 4, 4]}  intensity={0.6} />
        <pointLight position={[-6, 2, -4]} intensity={0.5} color={color} />

        {/* Environment */}
        <Environment preset="city" />
        <Stars radius={60} depth={20} count={350} factor={2} saturation={0} fade />

        {/* Ground Ring Decoration */}
        <RingDecoration color={color} />

        {/* Logo Models — now pass index and category for transitions */}
        {logos.map((logo, idx) => (
          <Logo3DModel
            key={`${activeCategory}-${logo.id}`}
            logo={logo}
            index={idx}
            category={activeCategory}
            color={color}
            position={calculatePosition(idx, logos.length)}
            onClick={selectLogo}
          />
        ))}

        {/* Camera orbit controls — disabled pan for cleaner UX */}
        <OrbitControls
          enablePan={false}
          autoRotate={isAutoPlay}
          autoRotateSpeed={1.2}
          minDistance={4.5}
          maxDistance={13}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.07}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
