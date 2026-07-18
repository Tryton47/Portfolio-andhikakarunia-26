'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float } from '@react-three/drei';
import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';
import { useLogoState } from '../../hooks/useLogoState';
import * as THREE from 'three';

// ─── COMPUTE RING POSITIONS ───
function calculatePosition(index, total) {
  const radius = 2.8;
  const angle = (index / total) * Math.PI * 2;
  return [
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius,
  ];
}

// ─── AMBIENT RING DECORATION ───
function RingDecoration({ color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
      <ringGeometry args={[2.6, 2.7, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── CANVAS ───
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const isAutoPlay     = useLogoState((s) => s.isAutoPlay);
  const selectLogo     = useLogoState((s) => s.selectLogo);

  const logos = LOGOS_DATA[activeCategory] || [];
  const color = THEME.categories[activeCategory]?.accent || '#06B6D4';

  return (
    <div style={{ width: '100%', height: '520px', borderRadius: '16px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2.5, 8], fov: 45 }} shadows>
        {/* Background match portfolio theme */}
        <color attach="background" args={[THEME.base.background]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 5, 0]} intensity={1.0} color={color} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -2, -5]} intensity={0.5} color={color} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.4}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        {/* Environment */}
        <Environment preset="city" />

        {/* Decorative stars in bg */}
        <Stars radius={60} depth={20} count={400} factor={2} saturation={0} fade />

        {/* Ring decoration */}
        <RingDecoration color={color} />

        {/* Logo models in a circle */}
        {logos.map((logo, idx) => (
          <Float
            key={logo.id}
            speed={1.5}
            rotationIntensity={0.1}
            floatIntensity={0.3}
          >
            <Logo3DModel
              logo={logo}
              color={color}
              position={calculatePosition(idx, logos.length)}
              onClick={selectLogo}
            />
          </Float>
        ))}

        {/* Orbit camera controls */}
        <OrbitControls
          enablePan={false}
          autoRotate={isAutoPlay}
          autoRotateSpeed={1.5}
          minDistance={4}
          maxDistance={14}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
