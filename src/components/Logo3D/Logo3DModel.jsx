'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

// Simple icon mapping
const ICON_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  react: 'react', nextjs: 'nextdotjs', nodejs: 'nodedotjs', php: 'php',
  laravel: 'laravel', tailwind: 'tailwind', git: 'git',
  postgresql: 'postgresql', postgres: 'postgresql', mysql: 'mysql',
  figma: 'figma', premiere: 'adobepremierepro', davinciresolve: 'davinciresolve',
  canva: 'canva', pandas: 'pandas', numpy: 'numpy', matplotlib: 'matplotlib',
  sklearn: 'scikitlearn', fastapi: 'fastapi', prisma: 'prisma', docker: 'docker',
  github: 'github', html: 'html5', css: 'css3', powerbi: 'powerbi',
  excel: 'microsoftexcel', bigquery: 'googlecloud', looker: 'looker',
  sqlite: 'sqlite', sql: 'sqlite', photoshop: 'adobephotoshop',
  illustrator: 'adobeillustrator', lightroom: 'adobelightroom',
  coreldraw: 'coreldraw', audition: 'adobeaudition',
  mediaencoder: 'adobemediaencoder', tiktok: 'tiktok', capcut: 'capcut',
};

const EMOJI_MAP = {
  python: '🐍', javascript: '💛', typescript: '🔷', react: '⚛️',
  nextjs: '▲', nodejs: '🟢', php: '🐘', laravel: '🔥', tailwind: '💨',
  git: '📦', figma: '🎨', premiere: '🎬', davinciresolve: '🎥', canva: '🎨',
  pandas: '🐼', numpy: '🔢', matplotlib: '📊', sklearn: '🧠', fastapi: '⚡',
  prisma: '🔺', docker: '🐳', github: '🐙', html: '🌐', css: '🎨',
  powerbi: '📊', excel: '📋', bigquery: '☁️', looker: '📈', sqlite: '🗄️',
  sql: '📊', photoshop: '🖼️', illustrator: '✏️', lightroom: '📷',
  coreldraw: '🎨', audition: '🎵', mediaencoder: '🎞️', tiktok: '🎵',
  capcut: '✂️',
};

function getIconUrl(id) {
  const slug = ICON_MAP[id] || id;
  return `https://cdn.simpleicons.org/${slug}/white`;
}

// ─── ICON ────────────────────────────────────────────────────────────
function Icon({ logo, color, highlighted }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [logo.id]);

  return (
    <Html center position={[0, 0, 0.12]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!failed ? (
          <img
            src={getIconUrl(logo.id)}
            alt={logo.name}
            width={80}
            height={80}
            style={{
              objectFit: 'contain',
              opacity: loaded ? 1 : 0,
              filter: `drop-shadow(0 0 ${highlighted ? 20 : 8}px ${color})`,
              transition: 'opacity 0.3s'
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <span style={{ fontSize: 50 }}>{EMOJI_MAP[logo.id] || logo.name?.[0] || '?'}</span>
        )}
      </div>
    </Html>
  );
}

// ─── LABEL ───────────────────────────────────────────────────────────
function Label({ name, color, visible }) {
  return (
    <Html position={[0, -1.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.2s',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        <span style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 13,
          fontWeight: 600,
          color: '#ffffff',
          textShadow: `0 0 15px ${color}`
        }}>
          {name}
        </span>
      </div>
    </Html>
  );
}

// ─── GLOW RING ────────────────────────────────────────────────────────
function GlowRing({ color, visible }) {
  const meshRef = useRef();
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const target = visible ? 0.5 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 6);
    if (meshRef.current) meshRef.current.material.opacity = opacityRef.current;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.3, 1.5, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

// ─── LOGO CUBE ────────────────────────────────────────────────────────
function LogoCube({ logo, color, isHovered, isSelected, isDimmed, onHover, onClick }) {
  const groupRef = useRef();
  const scaleRef = useRef(1);
  const emissiveRef = useRef(0.2);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = Math.min(delta * 5, 1);

    const targetScale = isSelected ? 1.2 : isHovered ? 1.08 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, speed);
    groupRef.current.scale.setScalar(scaleRef.current);

    const targetEmissive = isSelected ? 0.6 : isHovered ? 0.4 : 0.15;
    emissiveRef.current = THREE.MathUtils.lerp(emissiveRef.current, targetEmissive, speed);
  });

  const glColor = useMemo(() => new THREE.Color(color), [color]);
  const opacity = isDimmed ? 0.15 : 1;

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover?.(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onHover?.(false); }}
    >
      <RoundedBox args={[2, 2, 0.2]} radius={0.2}>
        <meshPhysicalMaterial
          color={isHovered || isSelected ? '#1a2240' : '#0d1220'}
          emissive={glColor}
          emissiveIntensity={emissiveRef.current}
          metalness={0.9}
          roughness={0.12}
          clearcoat={1}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      <RoundedBox args={[2.1, 2.1, 0.12]} radius={0.22}>
        <meshBasicMaterial color={glColor} transparent opacity={(isHovered || isSelected ? 0.3 : 0.06) * opacity} side={THREE.BackSide} />
      </RoundedBox>

      <Icon logo={logo} color={color} highlighted={isHovered || isSelected} />
      <GlowRing color={color} visible={isHovered || isSelected} />
      <Label name={logo.name} color={color} visible={isHovered || isSelected} />
    </group>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────
export default function Logo3DModel({ logo, position, color, onClick, onHover, dimmedIds, isHovered, isSelected }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speed = Math.min(delta * 3, 1);
    meshRef.current.position.lerp(new THREE.Vector3(...position), speed);
  });

  return (
    <group ref={meshRef} position={position}>
      <LogoCube
        logo={logo}
        color={logo.color || color}
        isHovered={isHovered}
        isSelected={isSelected}
        isDimmed={dimmedIds.includes(logo.id)}
        onHover={(hovered) => onHover?.(logo.id, hovered)}
        onClick={() => onClick?.(logo.id)}
      />
    </group>
  );
}
