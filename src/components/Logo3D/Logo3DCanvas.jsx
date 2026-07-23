'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';
import { CATEGORIES } from '../../config/categories';
import { useLogoState } from '../../hooks/useLogoState';
import { getArrangement } from '../../utils/animationPatterns';

// ─── PARTICLES ─────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef();
  const count = 50;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref} positions={positions} stride={3}>
      <PointMaterial color="#6366F1" size={0.05} transparent opacity={0.4} />
    </points>
  );
}

// ─── LIGHTING ──────────────────────────────────────────────────────────
function Lighting({ color }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[20, 20, 20]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 10, 15]} intensity={0.5} color={color} />
      <pointLight position={[-10, -5, 10]} intensity={0.3} color="#6366F1" />
    </>
  );
}

// ─── SCENE ────────────────────────────────────────────────────────────
function Scene({ logos, color, category, hoveredId, setHoveredId, selectLogo }) {
  const { selectedLogoId } = useLogoState();
  const positionsRef = useRef({});

  const handleHover = (id, isHovered) => {
    if (isHovered) setHoveredId(id);
    else if (hoveredId === id) setHoveredId(null);
  };

  const activeLogo = logos.find(l => l.id === (selectedLogoId || hoveredId));

  const dimmedIds = (() => {
    if (!activeLogo) return [];
    const related = activeLogo.related || [];
    return logos.map(l => l.id).filter(id => id !== activeLogo.id && !related.includes(id));
  })();

  const arrangement = getArrangement(category);

  return (
    <>
      <fog attach="fog" args={['#010204', 20, 60]} />
      <Lighting color={color} />
      <Stars radius={80} depth={40} count={1500} factor={3} fade speed={0.3} />
      <Particles />

      {logos.map((logo, idx) => {
        const pos = arrangement(idx, logos.length);
        return (
          <Logo3DModel
            key={`${category}-${logo.id}`}
            logo={logo}
            index={idx}
            position={pos}
            color={logo.color || color}
            onClick={selectLogo}
            onHover={handleHover}
            onPositionUpdate={(p) => { positionsRef.current[logo.id] = p; }}
            dimmedIds={dimmedIds}
            isHovered={hoveredId === logo.id}
            isSelected={selectedLogoId === logo.id}
          />
        );
      })}
    </>
  );
}

// ─── MAIN CANVAS ────────────────────────────────────────────────────────
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectLogo = useLogoState((s) => s.selectLogo);
  const [hoveredId, setHoveredId] = useState(null);

  const isAllView = !activeCategory;
  const logos = isAllView ? Object.values(LOGOS_DATA).flat() : (LOGOS_DATA[activeCategory] || []);

  const color = activeCategory
    ? THEME.categories[activeCategory]?.accent || '#6366F1'
    : '#6366F1';

  const cameraPos = isAllView
    ? [0, 0, 50]
    : activeCategory === CATEGORIES.FULLSTACK ? [0, -12, 38]
    : activeCategory === CATEGORIES.DATA ? [0, -10, 34]
    : [0, -8, 32];

  const categoryKey = isAllView ? 'all' : activeCategory;

  return (
    <Canvas
      camera={{ position: cameraPos, fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene
        logos={logos}
        color={color}
        category={categoryKey}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        selectLogo={selectLogo}
      />
    </Canvas>
  );
}
