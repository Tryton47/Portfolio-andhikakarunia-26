'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useState, Suspense, useRef } from 'react';
import ToolCube from './ToolCube';
import ToolTooltip from './ToolTooltip';
import { ALL_TOOLS } from '../../config/allTools';

const CATEGORY_FILTERS = ['All', 'Data', 'Dev', 'Design', 'Video'];
const CATEGORY_LABELS  = { All: 'All Tools', Data: '📊 Data', Dev: '💻 Dev', Design: '🎨 Design', Video: '🎬 Video' };

function SceneContent({ tools, onSelect }) {
  return (
    <>
      <color attach="background" args={['#090A0F']} />
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 10]} intensity={1.5} color="#6366F1" />
      <pointLight position={[-15, -10, -10]} intensity={0.8} color="#06B6D4" />
      <pointLight position={[0, -15, 10]} intensity={0.4} color="#F24E1E" />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={30}
        zoomSpeed={0.5}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.3}
        makeDefault
      />
      {tools.map((tool, i) => (
        <ToolCube
          key={tool.id}
          tool={tool}
          index={i}
          total={tools.length}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function Playground3D() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [filter, setFilter]             = useState('All');

  const filteredTools = filter === 'All'
    ? ALL_TOOLS
    : ALL_TOOLS.filter((t) => t.category === filter);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1E293B' }}>
      {/* Ambient radial bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.05) 0%, transparent 55%)',
      }} />

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 18], fov: 52 }} style={{ width: '100%', height: '100%' }} gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <SceneContent tools={filteredTools} onSelect={setSelectedTool} />
        </Suspense>
      </Canvas>

      {/* Category Filter Buttons — top left */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', zIndex: 10 }}>
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => { setFilter(cat); setSelectedTool(null); }}
            style={{
              padding: '5px 14px',
              borderRadius: '8px',
              border: `1px solid ${filter === cat ? 'var(--theme-primary-hex, #6366F1)' : '#1E293B'}`,
              background: filter === cat ? 'rgba(99,102,241,0.15)' : 'rgba(9,10,15,0.7)',
              color: filter === cat ? 'var(--theme-primary-hex, #6366F1)' : '#64748B',
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains, monospace)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Count badge — top right */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'rgba(9,10,15,0.75)', backdropFilter: 'blur(12px)',
        border: '1px solid #1E293B', borderRadius: '10px', padding: '5px 14px',
        color: '#64748B', fontSize: '11px', fontFamily: 'var(--font-jetbrains, monospace)',
        letterSpacing: '0.1em', zIndex: 10,
      }}>
        {filteredTools.length} tools
      </div>

      {/* Tooltip overlay (centered over canvas) */}
      {selectedTool && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <ToolTooltip tool={selectedTool} onClose={() => setSelectedTool(null)} />
          </div>
        </div>
      )}

      {/* Hint bar at bottom */}
      <div style={{
        position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
        color: '#475569', fontSize: '11px', fontFamily: 'var(--font-jetbrains, monospace)',
        letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        background: 'rgba(9,10,15,0.6)', backdropFilter: 'blur(8px)',
        padding: '5px 16px', borderRadius: '20px', border: '1px solid #1E293B',
        zIndex: 10, pointerEvents: 'none',
      }}>
        Drag to orbit · Scroll to zoom · Click cube for info
      </div>
    </div>
  );
}
