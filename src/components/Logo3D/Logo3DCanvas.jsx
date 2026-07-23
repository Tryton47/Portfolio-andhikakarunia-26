'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';
import { CATEGORIES } from '../../config/categories';
import { useLogoState } from '../../hooks/useLogoState';
import { getArrangement } from '../../utils/animationPatterns';

// ─── FLOATING POSITION ─────────────────────────────────────────────────
function FloatingPosition({ index, isAllView }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !isAllView) return;
    const t = clock.getElapsedTime();
    const speed = 0.3 + (index % 5) * 0.1;
    const offset = index * 0.8;
    ref.current.x = Math.sin(t * speed + offset) * 2;
    ref.current.y = Math.cos(t * speed * 0.7 + offset) * 1.5;
  });

  return ref;
}

// ─── CONNECTION LINES ──────────────────────────────────────────────────
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
        mid.y += 1.5;
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
          lineWidth={2}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

// ─── SHADOW PLANE ───────────────────────────────────────────────────
function ShadowPlane({ hoveredPos, color }) {
  const meshRef = useRef();
  const opacityRef = useRef(0);
  const scaleRef = useRef(0);

  useFrame((_, delta) => {
    if (hoveredPos) {
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.3, delta * 5);
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, delta * 5);
    } else {
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, delta * 5);
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, delta * 5);
    }

    if (meshRef.current) {
      meshRef.current.material.opacity = opacityRef.current;
      meshRef.current.scale.x = scaleRef.current * 3;
      meshRef.current.scale.z = scaleRef.current * 3;
      if (hoveredPos) {
        meshRef.current.position.x = hoveredPos.x;
        meshRef.current.position.z = hoveredPos.z;
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 0]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

// ─── LIGHTING ────────────────────────────────────────────────────────
function Lighting({ color }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[20, 25, 20]} intensity={1} />
      <directionalLight position={[-15, 10, -10]} intensity={0.4} color={color} />
      <pointLight position={[0, 10, 15]} intensity={0.4} color={color} />
    </>
  );
}

// ─── SCENE ──────────────────────────────────────────────────────────
function Scene({ logos, color, category, isAllView, hoveredId, setHoveredId, selectLogo, positionsRef, setHoveredPos }) {
  const { selectedLogoId } = useLogoState();

  const handleHover = useCallback((id, isHovered, pos) => {
    if (isHovered) {
      setHoveredId(id);
      setHoveredPos(pos);
    } else if (hoveredId === id) {
      setHoveredId(null);
      setHoveredPos(null);
    }
  }, [hoveredId, setHoveredId, setHoveredPos]);

  const activeLogo = useMemo(() => {
    return logos.find(l => l.id === (hoveredId || selectedLogoId));
  }, [hoveredId, selectedLogoId, logos]);

  const dimmedIds = useMemo(() => {
    if (!activeLogo) return [];
    const related = activeLogo.related || [];
    return logos.map(l => l.id).filter(id => id !== activeLogo.id && !related.includes(id));
  }, [activeLogo, logos]);

  const arrangement = getArrangement(category);

  // Floating offsets for "all" view
  const floatOffsets = useMemo(() => {
    return logos.map((_, i) => ({
      x: Math.sin(i * 0.7) * 1.5,
      y: Math.cos(i * 0.5) * 1,
      phase: i * 0.5,
    }));
  }, [logos.length]);

  return (
    <>
      <Lighting color={color} />

      {/* Shadow underneath */}
      <ShadowPlane hoveredPos={positionsRef.hoveredPos} color={color} />

      {/* Connection lines */}
      <ConnectionLines activeLogo={activeLogo} positions={positionsRef} color={color} />

      {/* Logo cubes */}
      {logos.map((logo, idx) => {
        const basePos = arrangement(idx, logos.length);
        const float = floatOffsets[idx];

        return (
          <Logo3DModel
            key={`${category}-${logo.id}`}
            logo={logo}
            index={idx}
            basePosition={basePos}
            floatOffset={isAllView ? float : null}
            color={logo.color || color}
            onClick={selectLogo}
            onHover={handleHover}
            onPositionUpdate={(pos) => { positionsRef.current[logo.id] = pos; }}
            dimmedIds={dimmedIds}
            isHovered={hoveredId === logo.id}
            isSelected={selectedLogoId === logo.id}
          />
        );
      })}
    </>
  );
}

// ─── MAIN CANVAS ────────────────────────────────────────────────────
export default function Logo3DCanvas() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectLogo = useLogoState((s) => s.selectLogo);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredPos, setHoveredPos] = useState(null);
  const positionsRef = useRef({ hoveredPos: null });
  positionsRef.current.hoveredPos = hoveredPos;

  const isAllView = !activeCategory;
  const logos = isAllView ? Object.values(LOGOS_DATA).flat() : (LOGOS_DATA[activeCategory] || []);

  const color = activeCategory
    ? THEME.categories[activeCategory]?.accent || '#6366F1'
    : '#6366F1';

  const cameraPos = isAllView
    ? [0, 0, 50]
    : activeCategory === CATEGORIES.FULLSTACK ? [0, -10, 38]
    : activeCategory === CATEGORIES.DATA ? [0, -8, 34]
    : [0, -6, 32];

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
        setHoveredPos={setHoveredPos}
      />
    </Canvas>
  );
}
