'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

// Valid hex color helper
function isValidHex(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function getSafeColor(color, fallback = '#6366F1') {
  if (!color || !isValidHex(color)) return fallback;
  return color;
}

// Devicon slugs mapping
const DEVICON_SLUGS = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  react: 'react', nextjs: 'nextjs', nodejs: 'nodejs', php: 'php',
  laravel: 'laravel', tailwindcss: 'tailwindcss', git: 'git',
  postgresql: 'postgresql', postgres: 'postgresql', mysql: 'mysql',
  figma: 'figma', powerbi: 'powerbi', googlecloud: 'googlecloud',
  looker: 'googlecloud', pandas: 'pandas', scikitlearn: 'scikitlearn',
  fastapi: 'fastapi', prisma: 'prisma', canva: 'canva',
  davinciresolve: 'davinciresolve', sqlite: 'sqlite',
  adobepremierepro: 'adobepremierepro', tiktok: 'tiktok',
};

function getDeviconUrl(slug) {
  const path = DEVICON_SLUGS[slug] || slug;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}/${path}-original.svg`;
}

// ─── ICON DISPLAY ───────────────────────────────────────────────────────
function IconDisplay({ tool, isHovered, isSelected }) {
  const [iconLoaded, setIconLoaded] = useState(false);
  const [iconError, setIconError] = useState(false);

  const iconUrl = getDeviconUrl(tool.slug);
  const safeColor = getSafeColor(tool.color);

  useEffect(() => {
    setIconLoaded(false);
    setIconError(false);
  }, [tool.slug]);

  return (
    <Html
      center
      position={[0, 0, 0.78]}
      distanceFactor={1.5}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: isHovered || isSelected
            ? `drop-shadow(0 0 25px ${safeColor}) brightness(1.3)`
            : 'drop-shadow(0 3px 10px rgba(0,0,0,0.5))',
          transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: isHovered || isSelected ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        {!iconError ? (
          <img
            key={tool.slug}
            src={iconUrl}
            alt={tool.name}
            width={80}
            height={80}
            style={{
              objectFit: 'contain',
              opacity: iconLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setIconLoaded(true)}
            onError={() => setIconError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <span style={{ fontSize: '50px', filter: `drop-shadow(0 0 18px ${safeColor})` }}>
            {tool.emoji}
          </span>
        )}
      </div>
    </Html>
  );
}

// ─── FLOATING CUBE ─────────────────────────────────────────────────────
function ToolCube({ tool, index, totalTools, onSelect, isSelected }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { camera, gl } = useThree();
  const safeColor = getSafeColor(tool.color);

  // Initial position
  const initialPosition = useMemo(() => {
    const angle = (index / totalTools) * Math.PI * 3.5;
    const radius = 4 + (index / totalTools) * 14;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle * 0.6) * (radius * 0.35);
    const z = (Math.random() - 0.5) * 4;
    return {
      x, y, z,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      rotSpeed: 0.05 + Math.random() * 0.05,
    };
  }, [index, totalTools]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);

  // Animation
  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();

    if (!isDragging) {
      const floatX = Math.sin(t * 0.25 + initialPosition.phaseX) * 0.6;
      const floatY = Math.cos(t * 0.2 + initialPosition.phaseY) * 0.5;
      const floatZ = Math.sin(t * 0.15 + initialPosition.phaseZ) * 0.4;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialPosition.x + floatX, 0.03);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, initialPosition.y + floatY, 0.03);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, initialPosition.z + floatZ, 0.03);

      if (Math.abs(dragVelocity.x) > 0.001 || Math.abs(dragVelocity.y) > 0.001) {
        groupRef.current.position.x += dragVelocity.x * 0.015;
        groupRef.current.position.y += dragVelocity.y * 0.015;
        setDragVelocity(prev => ({
          x: prev.x * 0.97,
          y: prev.y * 0.97,
          z: prev.z * 0.97,
        }));
      }

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.15 + index) * 0.12, 0.04);
      groupRef.current.rotation.y += initialPosition.rotSpeed * 0.02;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.cos(t * 0.12 + index) * 0.08, 0.04);
    } else {
      const vector = new THREE.Vector3(mousePos.x, mousePos.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance * 0.6));

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos.x, 0.12);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos.y, 0.12);

      setDragVelocity({
        x: (pos.x - groupRef.current.position.x) * 0.4,
        y: (pos.y - groupRef.current.position.y) * 0.4,
        z: 0,
      });

      groupRef.current.rotation.x += 0.02;
      groupRef.current.rotation.y += 0.03;
    }

    const targetScale = isSelected ? 1.4 : isHovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = isHovered ? 'grab' : 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isDragging && Math.abs(dragVelocity.x) < 0.15 && Math.abs(dragVelocity.y) < 0.15) {
      onSelect(tool);
    }
  };

  const glColor = useMemo(() => new THREE.Color(safeColor), [safeColor]);
  const emissiveIntensity = isSelected ? 0.9 : isHovered ? 0.6 : 0.2;

  return (
    <group
      ref={groupRef}
      position={[initialPosition.x, initialPosition.y, initialPosition.z]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        gl.domElement.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (!isDragging) gl.domElement.style.cursor = 'auto';
      }}
    >
      {/* Main cube */}
      <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={10} ref={meshRef}>
        <meshPhysicalMaterial
          color={isHovered || isSelected ? safeColor : '#0F172A'}
          emissive={glColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.7}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.98}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Glow rings */}
      {(isHovered || isSelected) && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.2, 48]} />
            <meshBasicMaterial color={safeColor} transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[1.0, 1.2, 48]} />
            <meshBasicMaterial color={safeColor} transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* Icon */}
      <IconDisplay tool={tool} isHovered={isHovered} isSelected={isSelected} />

      {/* Name label */}
      <Html center position={[0, -1.3, 0]} distanceFactor={4} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '10px 20px',
            borderRadius: '12px',
            border: `1px solid ${safeColor}50`,
            color: '#F1F5F9',
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 600,
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${safeColor}15`,
            opacity: isHovered || isSelected ? 1 : 0.65,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: isHovered || isSelected ? 'translateY(-5px)' : 'translateY(0)',
          }}
        >
          {tool.name}
        </div>
      </Html>
    </group>
  );
}

export default ToolCube;
