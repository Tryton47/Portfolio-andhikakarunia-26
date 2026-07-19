'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const CATEGORY_COLORS = {
  Data:   '#3776AB',
  Dev:    '#61DAFB',
  Design: '#F24E1E',
  Video:  '#CE2029',
};

function getInitialPosition(index, total) {
  // Scatter tools across the scene in a loose grid with randomness
  const cols = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const spacing = 3.5;
  const offsetX = (cols * spacing) / 2;
  const offsetY = (Math.ceil(total / cols) * spacing) / 2;
  return [
    (col * spacing - offsetX) + (Math.random() - 0.5) * 1.5,
    (row * spacing - offsetY) * -0.9 + (Math.random() - 0.5) * 1.2,
    (Math.random() - 0.5) * 4,
  ];
}

export default function ToolCube({ tool, index, total, onSelect }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive]   = useState(false);
  const floatSeed = useRef(Math.random() * Math.PI * 2);
  const [position] = useState(() => getInitialPosition(index, total));

  // Drag state
  const dragging    = useRef(false);
  const dragStart   = useRef({ x: 0, y: 0 });
  const posRef      = useRef(new THREE.Vector3(...position));
  const velRef      = useRef(new THREE.Vector3());
  const { camera, size, gl } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (!dragging.current) {
      // Organic floating
      const bobY  = Math.sin(t * 0.6 + floatSeed.current) * 0.12;
      const swayX = Math.cos(t * 0.4 + floatSeed.current * 1.3) * 0.07;
      groupRef.current.position.set(
        posRef.current.x + swayX,
        posRef.current.y + bobY,
        posRef.current.z,
      );
      // Drift momentum
      posRef.current.add(velRef.current);
      velRef.current.multiplyScalar(0.96);
    }

    // Slow rotation
    groupRef.current.rotation.x += hovered ? 0.004 : 0.0008;
    groupRef.current.rotation.y += hovered ? 0.007 : 0.0015;
  });

  const color = CATEGORY_COLORS[tool.category] || '#6366F1';

  const handlePointerDown = (e) => {
    e.stopPropagation();
    dragging.current  = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current || !groupRef.current) return;
    const dx = (e.clientX - dragStart.current.x) / size.width  *  18;
    const dy = (e.clientY - dragStart.current.y) / size.height * -18;
    velRef.current.set(dx * 0.02, dy * 0.02, 0);
    posRef.current.x += dx * 0.04;
    posRef.current.y += dy * 0.04;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    dragging.current = false;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setActive((v) => !v);
    onSelect(active ? null : tool);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'grab'; }}
      onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <RoundedBox args={[1.1, 1.1, 1.1]} radius={0.18} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || active ? 0.8 : 0.25}
          metalness={0.5}
          roughness={0.35}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Emoji icon on front face */}
      <Text
        position={[0, 0.06, 0.58]}
        fontSize={0.38}
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        {tool.icon}
      </Text>

      {/* Name label below cube when hovered */}
      {hovered && (
        <Text
          position={[0, -0.85, 0]}
          fontSize={0.17}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {tool.name}
        </Text>
      )}

      {/* Glow ring when selected/active */}
      {active && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.85, 0.025, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}
