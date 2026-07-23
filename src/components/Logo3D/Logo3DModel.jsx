'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

// Icon mapping
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

const EMOJI = {
  python: '🐍', javascript: '💛', typescript: '🔷', react: '⚛️',
  nextjs: '▲', nodejs: '🟢', php: '🐘', laravel: '🔥', tailwind: '💨',
  git: '📦', figma: '🎨', premiere: '🎬', davinciresolve: '🎥', canva: '🎨',
  pandas: '🐼', numpy: '🔢', matplotlib: '📊', sklearn: '🧠', fastapi: '⚡',
  prisma: '🔺', docker: '🐳', github: '🐙', html: '🌐', css: '🎨',
  powerbi: '📊', excel: '📋', bigquery: '☁️', looker: '📈', sqlite: '🗄️',
  sql: '📊', photoshop: '🖼️', illustrator: '✏️', lightroom: '📷',
  coreldraw: '🎨', audition: '🎵', mediaencoder: '🎞️', tiktok: '🎵', capcut: '✂️',
};

function getIconUrl(id) {
  const slug = ICON_MAP[id] || id;
  return `https://cdn.simpleicons.org/${slug}/white`;
}

// ─── TOOLTIP INFO ─────────────────────────────────────────────────
function TooltipInfo({ logo, visible }) {
  return (
    <Html
      position={[0, -1.8, 0]}
      center
      distanceFactor={12}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            background: 'rgba(9, 14, 28, 0.98)',
            backdropFilter: 'blur(16px)',
            padding: '12px 20px',
            borderRadius: '16px',
            border: `1px solid ${logo.color}40`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${logo.color}20`,
            minWidth: '200px',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            {logo.name}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: logo.level ? 8 : 0 }}>
            {logo.desc?.slice(0, 80)}...
          </div>
          {logo.level && (
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: 10,
                fontWeight: 600,
                background: `${logo.color}20`,
                color: logo.color,
                border: `1px solid ${logo.color}40`,
              }}
            >
              {logo.level}
            </div>
          )}
        </div>
      </div>
    </Html>
  );
}

// ─── ICON ────────────────────────────────────────────────────────
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
              filter: `drop-shadow(0 0 ${highlighted ? 25 : 10}px ${color}) brightness(${highlighted ? 1.4 : 1})`,
              transition: 'all 0.3s ease',
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <span style={{ fontSize: 50 }}>{EMOJI[logo.id] || logo.name?.[0] || '?'}</span>
        )}
      </div>
    </Html>
  );
}

// ─── GLOW RING ──────────────────────────────────────────────────
function GlowRing({ color, visible }) {
  const meshRef = useRef();
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const target = visible ? 0.6 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 6);
    if (meshRef.current) meshRef.current.material.opacity = opacityRef.current;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.4, 1.65, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

// ─── CUBE ──────────────────────────────────────────────────────
function Cube({ logo, color, isHovered, isSelected, isDimmed, onHover, onClick, onPositionUpdate }) {
  const groupRef = useRef();
  const scaleRef = useRef(1);
  const emissiveRef = useRef(0.15);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const speed = Math.min(delta * 5, 1);

    const targetScale = isSelected ? 1.2 : isHovered ? 1.1 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, speed);
    groupRef.current.scale.setScalar(scaleRef.current);

    const targetEmissive = isSelected ? 0.7 : isHovered ? 0.5 : 0.15;
    emissiveRef.current = THREE.MathUtils.lerp(emissiveRef.current, targetEmissive, speed);

    if (onPositionUpdate) {
      onPositionUpdate(groupRef.current.position);
    }
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
      <RoundedBox args={[2.2, 2.2, 0.22]} radius={0.22}>
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

      <RoundedBox args={[2.3, 2.3, 0.14]} radius={0.24}>
        <meshBasicMaterial color={glColor} transparent opacity={(isHovered || isSelected ? 0.4 : 0.08) * opacity} side={THREE.BackSide} />
      </RoundedBox>

      <Icon logo={logo} color={color} highlighted={isHovered || isSelected} />
      <GlowRing color={color} visible={isHovered || isSelected} />
      <TooltipInfo logo={logo} visible={isHovered || isSelected} />
    </group>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────
export default function Logo3DModel({
  logo, basePosition, floatOffset, color, onClick, onHover, onPositionUpdate,
  dimmedIds, isHovered, isSelected,
}) {
  const meshRef = useRef();
  const posRef = useRef(new THREE.Vector3(...basePosition));
  const floatRef = useRef({ x: 0, y: 0 });

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const speed = Math.min(delta * 3, 1);

    // Floating animation for "all" view
    if (floatOffset) {
      const t = clock.getElapsedTime();
      floatRef.current.x = Math.sin(t * 0.5 + floatOffset.phase) * floatOffset.x;
      floatRef.current.y = Math.cos(t * 0.4 + floatOffset.phase) * floatOffset.y;
    } else {
      floatRef.current.x = THREE.MathUtils.lerp(floatRef.current.x, 0, speed);
      floatRef.current.y = THREE.MathUtils.lerp(floatRef.current.y, 0, speed);
    }

    posRef.current.set(
      basePosition[0] + floatRef.current.x,
      basePosition[1] + floatRef.current.y,
      basePosition[2]
    );

    meshRef.current.position.lerp(posRef.current, speed);
  });

  return (
    <group ref={meshRef} position={basePosition}>
      <Cube
        logo={logo}
        color={logo.color || color}
        isHovered={isHovered}
        isSelected={isSelected}
        isDimmed={dimmedIds.includes(logo.id)}
        onHover={onHover}
        onClick={onClick}
        onPositionUpdate={onPositionUpdate}
      />
    </group>
  );
}
