'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';
import { CATEGORIES } from '../../config/categories';
import { useLogoState } from '../../hooks/useLogoState';
import { getArrangement } from '../../utils/animationPatterns';

// ─── LIGHTING ───────────────────────────────────────────────────────
function Lighting({ color }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[20, 25, 20]} intensity={1.2} />
      <directionalLight position={[-20, 10, -15]} intensity={0.6} color={color} />
      <pointLight position={[0, 10, 15]} intensity={0.5} color={color} />
    </>
  );
}

// ─── GROUND SHADOW ──────────────────────────────────────────────────
function GroundShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#0a0f1a" transparent opacity={0.5} />
    </mesh>
  );
}

// ─── CONNECTION LINES ────────────────────────────────────────────────
function ConnectionLines({ activeLogo, positions, color }) {
  const linesData = useRef([]);

  useFrame(() => {
    if (!activeLogo?.related?.length) {
      linesData.current = [];
      return;
    }

    const newLines = [];
    activeLogo.related.forEach((relName) => {
      const relPos = positions.current[relName];
      const actPos = positions.current[activeLogo.id];
      if (relPos && actPos) {
        const mid = new THREE.Vector3().addVectors(actPos, relPos).multiplyScalar(0.5);
        mid.y += 2;
        newLines.push({
          id: `${activeLogo.id}-${relName}`,
          start: actPos.clone(),
          end: relPos.clone(),
          mid,
        });
      }
    });
    linesData.current = newLines;
  });

  return (
    <group>
      {linesData.current.map((line) => (
        <QuadraticBezierLine
          key={line.id}
          start={line.start}
          end={line.end}
          mid={line.mid}
          color={color}
          lineWidth={2.5}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}

// ─── SCENE ─────────────────────────────────────────────────────────
function Scene({ logos, color, category, isAllView, hoveredId, setHoveredId, selectLogo, positionsRef }) {
  const { selectedLogoId } = useLogoState();

  const handleHover = useCallback((id, isHovered) => {
    if (isHovered) setHoveredId(id);
    else if (hoveredId === id) setHoveredId(null);
  }, [hoveredId, setHoveredId]);

  const activeLogo = useMemo(() => {
    return logos.find(l => l.id === (hoveredId || selectedLogoId));
  }, [hoveredId, selectedLogoId, logos]);

  const dimmedIds = useMemo(() => {
    if (!activeLogo) return [];
    const related = activeLogo.related || [];
    return logos.map(l => l.id).filter(id => id !== activeLogo.id && !related.includes(id));
  }, [activeLogo, logos]);

  const arrangement = getArrangement(category);

  const floatOffsets = useMemo(() => {
    return logos.map((_, i) => ({
      x: Math.sin(i * 1.3) * 2.5,
      y: Math.cos(i * 0.9) * 1.8,
      z: Math.sin(i * 0.7) * 1.5,
      phaseX: i * 0.4,
      phaseY: i * 0.3,
      speed: 0.3 + (i % 3) * 0.1,
    }));
  }, [logos.length]);

  return (
    <>
      <Lighting color={color} />
      <GroundShadow />
      <ConnectionLines activeLogo={activeLogo} positions={positionsRef} color={color} />

      {logos.map((logo, idx) => {
        const basePos = arrangement(idx, logos.length);
        const float = isAllView ? floatOffsets[idx] : null;

        return (
          <Logo3DModel
            key={`${category}-${logo.id}`}
            logo={logo}
            index={idx}
            basePosition={basePos}
            floatOffset={float}
            color={logo.color || color}
            onClick={selectLogo}
            onHover={handleHover}
            onPositionUpdate={(pos) => { positionsRef.current[logo.id] = pos; }}
            dimmedIds={dimmedIds}
            isHovered={hoveredId === logo.id}
            isSelected={selectedLogoId === logo.id}
            isAllView={isAllView}
          />
        );
      })}
    </>
  );
}

// ─── MAIN CANVAS ───────────────────────────────────────────────────
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectLogo = useLogoState((s) => s.selectLogo);
  const [hoveredId, setHoveredId] = useState(null);
  const positionsRef = useRef({});

  const isAllView = !activeCategory;
  const logos = isAllView ? Object.values(LOGOS_DATA).flat() : (LOGOS_DATA[activeCategory] || []);

  const color = activeCategory
    ? THEME.categories[activeCategory]?.accent || '#6366F1'
    : '#6366F1';

  const cameraPos = isAllView
    ? [0, 0, 55]
    : activeCategory === CATEGORIES.FULLSTACK ? [0, -12, 40]
    : activeCategory === CATEGORIES.DATA ? [0, -10, 36]
    : [0, -8, 34];

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
        isAllView={isAllView}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        selectLogo={selectLogo}
        positionsRef={positionsRef}
      />
    </Canvas>
  );
}
