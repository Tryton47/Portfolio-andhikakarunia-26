'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, useGLTF } from '@react-three/drei';
import Logo3DModel from './Logo3DModel';
import { CopyPasteToast, useCopyPasteEasterEgg } from './CopyPasteEasterEgg';
import { LOGOS_DATA }   from '../../config/logoData';
import { THEME }        from '../../config/colors';
import { useLogoState } from '../../hooks/useLogoState';
import { getArrangement } from '../../utils/animationPatterns';
import * as THREE from 'three';

// ─── PRELOAD MODELS FOR ACTIVE CATEGORY ───
function PreloadModels({ logos }) {
  logos.forEach((logo) => {
    if (logo.model) {
      try { useGLTF.preload(logo.model); } catch { /* file may not exist yet */ }
    }
  });
  return null;
}

// ─── AMBIENT RING DECORATION ───
function RingDecoration({ color }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <ringGeometry args={[2.75, 2.85, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <ringGeometry args={[0.12, 0.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── CATEGORY LABEL BADGE ───
const CATEGORY_DESCRIPTIONS = {
  data_analyst: 'Circular · Data Flow Orbit',
  full_stack:   'Layered Stack · Frontend / Backend / DB',
  designer:     'Organic Scatter · Golden Angle',
  videographer: 'Timeline · Left to Right Sequence',
};

// ─── MAIN CANVAS ───
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const isAutoPlay     = useLogoState((s) => s.isAutoPlay);
  const selectLogo     = useLogoState((s) => s.selectLogo);

  // Shared hovered state for easter egg
  const [hoveredLogoId, setHoveredLogoId] = useState(null);
  const { feedback: easterFeedback } = useCopyPasteEasterEgg(hoveredLogoId);

  const logos       = LOGOS_DATA[activeCategory] || [];
  const color       = THEME.categories[activeCategory]?.accent || '#06B6D4';
  const arrangement = getArrangement(activeCategory);
  const desc        = CATEGORY_DESCRIPTIONS[activeCategory] || '';

  return (
    <div className="flex flex-col gap-1">
      {/* Category layout description badge */}
      <p className="text-center text-xs font-mono tracking-widest opacity-40 mb-2" style={{ color }}>
        {desc}
      </p>

      <div
        className="w-full rounded-2xl overflow-hidden border border-white/5"
        style={{ height: '500px', background: THEME.base.background }}
      >
        {/* Performance: limit pixel ratio, cap at 1.5x on high-DPI screens */}
        <Canvas
          camera={{ position: [0, 2.5, 8.5], fov: 44 }}
          dpr={[1, 1.5]}
          shadows
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={[THEME.base.background]} />

          {/* Preload models for this category */}
          <PreloadModels logos={logos} />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 6, 0]}   intensity={1.2} color={color} />
          <pointLight position={[6, 4, 4]}   intensity={0.6} />
          <pointLight position={[-6, 2, -4]} intensity={0.5} color={color} />

          <Environment preset="city" />
          <Stars radius={60} depth={20} count={350} factor={2} saturation={0} fade />

          <RingDecoration color={color} />

          {/* Logos arranged per category pattern */}
          {logos.map((logo, idx) => (
            <Logo3DModel
              key={`${activeCategory}-${logo.id}`}
              logo={logo}
              index={idx}
              category={activeCategory}
              color={color}
              position={arrangement(idx, logos.length)}
              onClick={selectLogo}
              onHover={setHoveredLogoId}
            />
          ))}

          <OrbitControls
            enablePan={false}
            autoRotate={isAutoPlay}
            autoRotateSpeed={1.2}
            minDistance={4.5}
            maxDistance={14}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            dampingFactor={0.07}
            enableDamping
          />
        </Canvas>
      </div>

      {/* Easter egg toast rendered outside the canvas (DOM layer) */}
      <CopyPasteToast feedback={easterFeedback} activeCategory={activeCategory} />
    </div>
  );
}
