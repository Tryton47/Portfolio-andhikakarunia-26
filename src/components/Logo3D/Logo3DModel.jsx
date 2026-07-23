'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

const ICON_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  react: 'react', nextjs: 'nextdotjs', nodejs: 'nodedotjs', php: 'php',
  laravel: 'laravel', tailwind: 'tailwind', git: 'git',
  postgresql: 'postgresql', mysql: 'mysql',
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

function getIconUrl(id) {
  const slug = ICON_MAP[id] || id;
  return `https://cdn.simpleicons.org/${slug}/white`;
}

function NameTooltip({ name, color, visible }) {
  return (
    <Html position={[0, -1.8, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
        transition: 'all 0.25s ease',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          background: 'rgba(10, 15, 30, 0.98)',
          backdropFilter: 'blur(16px)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: `1px solid ${color}50`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: `0 0 15px ${color}`,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {name}
          </span>
        </div>
      </div>
    </Html>
  );
}

function IconDisplay({ logo, color, highlighted }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Html center position={[0, 0, 0.12]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div style={{
        width: 80, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        filter: `drop-shadow(0 0 ${highlighted ? 20 : 8}px ${color})`,
        transition: 'filter 0.3s ease',
      }}>
        {!failed && (
          <img
            src={getIconUrl(logo.id)}
            alt={logo.name}
            width={65} height={65}
            style={{
              objectFit: 'contain',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
        {failed && (
          <span style={{ fontSize: 40 }}>{logo.name ? logo.name[0] : '?'}</span>
        )}
      </div>
    </Html>
  );
}

function GlowRing({ color, visible }) {
  const meshRef = useRef();
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const target = visible ? 0.6 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 6);
    if (meshRef.current) {
      meshRef.current.material.opacity = opacityRef.current;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.4, 1.6, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

function LogoCube({ logo, color, isHovered, isSelected, isDimmed, onHover, onClick }) {
  const groupRef = useRef();
  const scaleRef = useRef(1);
  const emissiveRef = useRef(0.15);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = Math.min(delta * 5, 1);

    const targetScale = isSelected ? 1.2 : isHovered ? 1.1 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, speed);
    groupRef.current.scale.setScalar(scaleRef.current);

    const targetEmissive = isSelected ? 0.7 : isHovered ? 0.5 : 0.15;
    emissiveRef.current = THREE.MathUtils.lerp(emissiveRef.current, targetEmissive, speed);
  });

  const glColor = useMemo(() => new THREE.Color(color), [color]);
  const opacity = isDimmed ? 0.15 : 1;

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover && onHover(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onHover && onHover(false); }}
    >
      <RoundedBox args={[2, 2, 0.2]} radius={0.2}>
        <meshPhysicalMaterial
          color={isHovered || isSelected ? '#1a2545' : '#0c1220'}
          emissive={glColor}
          emissiveIntensity={emissiveRef.current}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      <RoundedBox args={[2.1, 2.1, 0.12]} radius={0.22}>
        <meshBasicMaterial color={glColor} transparent opacity={(isHovered || isSelected ? 0.4 : 0.08) * opacity} side={THREE.BackSide} />
      </RoundedBox>

      <IconDisplay logo={logo} color={color} highlighted={isHovered || isSelected} />
      <GlowRing color={color} visible={isHovered || isSelected} />
      <NameTooltip name={logo.name} color={color} visible={isHovered || isSelected} />
    </group>
  );
}

export default function Logo3DModel({
  logo, basePosition, floatOffset, color, onClick, onHover, onPositionUpdate,
  dimmedIds, isHovered, isSelected, isAllView,
}) {
  const meshRef = useRef();
  const posRef = useRef(new THREE.Vector3(...basePosition));

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const speed = Math.min(delta * 3, 1);

    if (floatOffset && isAllView) {
      const t = clock.getElapsedTime();
      const offsetX = Math.sin(t * floatOffset.speed + floatOffset.phaseX) * floatOffset.x;
      const offsetY = Math.cos(t * floatOffset.speed * 0.8 + floatOffset.phaseY) * floatOffset.y;
      const offsetZ = Math.sin(t * floatOffset.speed * 0.6 + floatOffset.phaseX) * floatOffset.z;

      posRef.current.set(
        basePosition[0] + offsetX,
        basePosition[1] + offsetY,
        basePosition[2] + offsetZ
      );
    } else {
      posRef.current.set(...basePosition);
    }

    meshRef.current.position.lerp(posRef.current, speed);

    if (onPositionUpdate) {
      onPositionUpdate(meshRef.current.position);
    }
  });

  const isDimmed = dimmedIds && dimmedIds.includes(logo.id);

  return (
    <group ref={meshRef} position={basePosition}>
      <LogoCube
        logo={logo}
        color={logo.color || color}
        isHovered={isHovered}
        isSelected={isSelected}
        isDimmed={isDimmed}
        onHover={onHover}
        onClick={onClick}
      />
    </group>
  );
}
