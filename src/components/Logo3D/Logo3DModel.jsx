'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

// SimpleIcons mapping
const ICON_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  react: 'react', nextjs: 'nextdotjs', nodejs: 'nodedotjs', php: 'php',
  laravel: 'laravel', tailwind: 'tailwind', git: 'git',
  postgresql: 'postgresql', postgres: 'postgresql', mysql: 'mysql',
  figma: 'figma', premiere: 'adobepremierepro', aftereffects: 'adobeaftereffects',
  davinciresolve: 'davinciresolve', canva: 'canva', pandas: 'pandas',
  numpy: 'numpy', matplotlib: 'matplotlib', sklearn: 'scikitlearn',
  fastapi: 'fastapi', prisma: 'prisma', docker: 'docker',
  github: 'github', html: 'html5', css: 'css3',
  powerbi: 'powerbi', excel: 'microsoftexcel', bigquery: 'googlecloud',
  looker: 'looker', sqlite: 'sqlite', sql: 'sqlite',
  photoshop: 'adobephotoshop', illustrator: 'adobeillustrator',
  lightroom: 'adobelightroom', coreldraw: 'coreldraw', audition: 'adobeaudition',
  mediaencoder: 'adobemediaencoder', tiktok: 'tiktok', capcut: 'capcut',
};

const EMOJI_MAP = {
  python: '🐍', javascript: '💛', typescript: '🔷', react: '⚛️',
  nextjs: '▲', nodejs: '🟢', php: '🐘', laravel: '🔥',
  tailwind: '💨', git: '📦', postgresql: '🐘', mysql: '🐬',
  figma: '🎨', premiere: '🎬', davinciresolve: '🎥',
  canva: '🎨', pandas: '🐼', numpy: '🔢', matplotlib: '📊',
  sklearn: '🧠', fastapi: '⚡', prisma: '🔺', docker: '🐳',
  github: '🐙', html: '🌐', css: '🎨', powerbi: '📊',
  excel: '📋', bigquery: '☁️', looker: '📈', sqlite: '🗄️', sql: '📊',
  photoshop: '🖼️', illustrator: '✏️', lightroom: '📷', coreldraw: '🎨',
  audition: '🎵', mediaencoder: '🎞️', tiktok: '🎵', capcut: '✂️',
};

function getIconUrl(id) {
  const slug = ICON_MAP[id] || id;
  return `https://cdn.simpleicons.org/${slug}/white`;
}

// ─── GLOW RINGS ────────────────────────────────────────────────────────
function GlowRings({ color, visible }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const midRef = useRef();

  useFrame((_, delta) => {
    const speed = delta * 8;
    const target = visible ? 1 : 0;

    [outerRef, innerRef, midRef].forEach((ref, i) => {
      if (ref.current) {
        const scale = THREE.MathUtils.lerp(ref.current.scale.x, target * (1 + i * 0.15), speed);
        ref.current.scale.setScalar(scale);
        ref.current.material.opacity = visible ? (0.7 - i * 0.2) : 0;
      }
    });
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={outerRef}>
        <ringGeometry args={[1.6, 1.9, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={innerRef}>
        <ringGeometry args={[1.3, 1.45, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={midRef}>
        <ringGeometry args={[1.1, 1.2, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ─── NAME LABEL ────────────────────────────────────────────────────────
function NameLabel({ name, color, visible }) {
  return (
    <Html position={[0, -2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
        transition: 'all 0.3s ease',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          color: '#ffffff',
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}80`,
          letterSpacing: '0.05em',
          background: `linear-gradient(135deg, ${color}, #ffffff)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {name}
        </span>
      </div>
    </Html>
  );
}

// ─── ICON IMAGE ───────────────────────────────────────────────────────
function IconImage({ logo, color, highlighted }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const emoji = EMOJI_MAP[logo.id] || logo.name?.charAt(0) || '?';
  const iconUrl = getIconUrl(logo.id);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [logo.id]);

  return (
    <Html center position={[0, 0, 0.15]} distanceFactor={7} occlude={false} style={{ pointerEvents: 'none' }}>
      <div style={{
        width: '140px',
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: highlighted ? `radial-gradient(circle, ${color}30 0%, transparent 70%)` : 'transparent',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
      }}>
        {!failed && (
          <img
            key={`img-${logo.id}`}
            src={iconUrl}
            alt={logo.name}
            width={110}
            height={110}
            style={{
              objectFit: 'contain',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s ease, filter 0.3s ease',
              filter: `drop-shadow(0 0 ${highlighted ? '40px' : '15px'} ${color}) brightness(${highlighted ? 1.5 : 1})`,
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            crossOrigin="anonymous"
          />
        )}
        {failed && (
          <span style={{ fontSize: '70px', filter: `drop-shadow(0 0 30px ${color})` }}>
            {emoji}
          </span>
        )}
      </div>
    </Html>
  );
}

// ─── POINT LIGHT ───────────────────────────────────────────────────────
function CubeLight({ color, visible }) {
  const lightRef = useRef();
  const intensityRef = useRef(0);

  useFrame((_, delta) => {
    const target = visible ? 0.8 : 0;
    intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, target, delta * 6);
    if (lightRef.current) lightRef.current.intensity = intensityRef.current;
  });

  return <pointLight ref={lightRef} color={color} intensity={0} distance={10} decay={2} />;
}

// ─── MAIN LOGO CUBE ────────────────────────────────────────────────────
function LogoCube({ logo, color, isHovered, isSelected, isDimmed, onHover, onClick }) {
  const groupRef = useRef();
  const scaleRef = useRef(1);
  const emissiveRef = useRef(0.2);
  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = Math.min(delta * 5, 1);

    const targetScale = isSelected ? 1.25 : isHovered ? 1.12 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, speed);
    groupRef.current.scale.setScalar(scaleRef.current);

    const targetEmissive = isSelected ? 0.8 : isHovered ? 0.6 : 0.2;
    emissiveRef.current = THREE.MathUtils.lerp(emissiveRef.current, targetEmissive, speed);

    const targetRot = isHovered ? 0.08 : 0;
    rotationRef.current = THREE.MathUtils.lerp(rotationRef.current, targetRot, speed * 0.5);
    groupRef.current.rotation.y = rotationRef.current;
  });

  const glColor = useMemo(() => new THREE.Color(color), [color]);
  const opacity = isDimmed ? 0.15 : 1;
  const emissive = emissiveRef.current;

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover?.(true); }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onHover?.(false); }}
    >
      <CubeLight color={color} visible={isHovered || isSelected} />

      <RoundedBox args={[2.4, 2.4, 0.25]} radius={0.25} smoothness={16}>
        <meshPhysicalMaterial
          color={isHovered || isSelected ? '#1e2a4a' : '#0a0e18'}
          emissive={glColor}
          emissiveIntensity={emissive}
          metalness={0.9}
          roughness={isHovered ? 0.05 : 0.12}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transparent
          opacity={opacity}
          envMapIntensity={3}
        />
      </RoundedBox>

      <RoundedBox args={[2.5, 2.5, 0.15]} radius={0.28} smoothness={16}>
        <meshBasicMaterial color={glColor} transparent opacity={(isHovered || isSelected ? 0.5 : 0.1) * opacity} side={THREE.BackSide} depthWrite={false} />
      </RoundedBox>

      <IconImage logo={logo} color={color} highlighted={isHovered || isSelected} />
      <GlowRings color={color} visible={isHovered || isSelected} />
      <NameLabel name={logo.name} color={color} visible={isHovered || isSelected} />
    </group>
  );
}

// ─── MAIN LOGO 3D MODEL ────────────────────────────────────────────────
export default function Logo3DModel({
  logo, index, position, color, onClick, onHover, onPositionUpdate,
  dimmedIds = [], isHovered, isSelected,
}) {
  const meshRef = useRef();
  const targetPos = useRef(new THREE.Vector3(...position));

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speed = Math.min(delta * 3, 1);
    targetPos.current.set(...position);
    meshRef.current.position.lerp(targetPos.current, speed);
    if (onPositionUpdate) onPositionUpdate(meshRef.current.position);
  });

  const effectiveColor = logo.color || color;
  const isDimmed = dimmedIds.includes(logo.id);

  return (
    <group ref={meshRef} position={position}>
      <LogoCube
        logo={logo}
        color={effectiveColor}
        isHovered={isHovered}
        isSelected={isSelected}
        isDimmed={isDimmed}
        onHover={(hovered) => onHover?.(logo.id, hovered)}
        onClick={() => onClick?.(logo.id)}
      />
    </group>
  );
}
