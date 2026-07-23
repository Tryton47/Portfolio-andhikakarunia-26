'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Points, PointMaterial, QuadraticBezierLine, Stars } from '@react-three/drei';
import * as THREE from 'three';

import Logo3DModel from './Logo3DModel';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';
import { CATEGORIES } from '../../config/categories';
import { useLogoState } from '../../hooks/useLogoState';
import { getArrangement } from '../../utils/animationPatterns';

// ─── CAMERA CONTROLLER ──────────────────────────────────────────────────
function CameraController({ targetPosition }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...targetPosition));

  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 2, 1);
    targetRef.current.set(...targetPosition);
    camera.position.lerp(targetRef.current, lerpFactor);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── STARFIELD ─────────────────────────────────────────────────────────
function Starfield() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={3000}
      factor={6}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}

// ─── FLOATING PARTICLES ─────────────────────────────────────────────────
function FloatingParticles() {
  const ref = useRef();
  const count = 100;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#c8d4f0"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </Points>
  );
}

// ─── GRID FLOOR ───────────────────────────────────────────────────────
function GridFloor() {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.y = -18 + Math.sin(clock.getElapsedTime() * 0.3) * 0.3;
    }
  });

  return (
    <group ref={gridRef} position={[0, -18, 0]}>
      <gridHelper args={[80, 40, '#1e3a5f', '#1e3a5f']} />
    </group>
  );
}

// ─── LIGHTING ─────────────────────────────────────────────────────────
function Lighting({ color }) {
  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[25, 30, 25]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-25, 20, -20]} intensity={0.8} color={color} />
      <pointLight position={[0, 15, 20]} intensity={1} color={color} distance={50} />
      <pointLight position={[20, -10, 10]} intensity={0.6} color="#6366F1" distance={40} />
      <pointLight position={[-20, 10, -10]} intensity={0.6} color="#06B6D4" distance={40} />
      <Environment preset="night" blur={0.8} />
    </>
  );
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
      const relatedPos = positions.current[relName];
      const activePos = positions.current[activeLogo.id];

      if (relatedPos && activePos) {
        const midPoint = new THREE.Vector3()
          .addVectors(activePos, relatedPos)
          .multiplyScalar(0.5);
        midPoint.y += 2.5;

        newLines.push({
          id: `${activeLogo.id}-${relName}`,
          start: activePos.clone(),
          end: relatedPos.clone(),
          mid: midPoint,
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
          lineWidth={3}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  );
}

// ─── SCENE ────────────────────────────────────────────────────────────
function Scene({ logos, color, category, hoveredId, setHoveredId, selectLogo }) {
  const { selectedLogoId } = useLogoState();
  const activeId = selectedLogoId || hoveredId;
  const positionsRef = useRef({});

  const handleHover = useCallback((id, isHovered) => {
    if (isHovered) {
      setHoveredId(id);
    } else if (hoveredId === id) {
      setHoveredId(null);
    }
  }, [hoveredId, setHoveredId]);

  const activeLogo = useMemo(() => {
    return logos.find(l => l.id === activeId);
  }, [activeId, logos]);

  const { dimmedIds } = useMemo(() => {
    if (!activeLogo) return { dimmedIds: [] };
    const related = activeLogo.related || [];
    const allIds = logos.map(l => l.id);
    const dimmed = allIds.filter(id => id !== activeId && !related.includes(id));
    return { dimmedIds: dimmed };
  }, [activeLogo, logos]);

  const arrangement = getArrangement(category);

  return (
    <>
      {/* Background */}
      <fog attach="fog" args={['#010203', 20, 80]} />
      <Starfield />
      <Lighting color={color} />
      <FloatingParticles />
      <GridFloor />

      {/* Connection lines */}
      <ConnectionLines
        activeLogo={activeLogo}
        positions={positionsRef}
        color={color}
      />

      {/* Logo cubes */}
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
            onPositionUpdate={(worldPos) => {
              positionsRef.current[logo.id] = worldPos;
            }}
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
  const logos = isAllView
    ? Object.values(LOGOS_DATA).flat()
    : LOGOS_DATA[activeCategory] || [];

  const color = activeCategory
    ? THEME.categories[activeCategory]?.accent || '#6366F1'
    : '#6366F1';

  let cameraPos;
  if (isAllView) {
    cameraPos = [0, 0, 55];
  } else if (activeCategory === CATEGORIES.FULLSTACK) {
    cameraPos = [0, -14, 40];
  } else if (activeCategory === CATEGORIES.DATA) {
    cameraPos = [0, -12, 35];
  } else {
    cameraPos = [0, -10, 32];
  }

  const categoryKey = isAllView ? 'all' : activeCategory;

  return (
    <Canvas
      camera={{ position: cameraPos, fov: 60 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
        alpha: false,
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #010203 0%, #020408 50%, #010305 100%)',
      }}
    >
      <CameraController targetPosition={cameraPos} />
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
