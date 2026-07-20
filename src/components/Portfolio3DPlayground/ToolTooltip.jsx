'use client';

import { useRef, useState, useEffect } from 'react';

const CATEGORY_COLORS = {
  Data:   { primary: '#3776AB', dim: 'rgba(55, 118, 171, 0.15)' },
  Dev:    { primary: '#61DAFB', dim: 'rgba(97, 218, 251, 0.15)' },
  Design: { primary: '#F24E1E', dim: 'rgba(242, 78, 30, 0.15)'  },
  Video:  { primary: '#CE2029', dim: 'rgba(206, 32, 41, 0.15)'  },
};

const CATEGORY_LABELS = {
  Data:   '📊 Data Analyst',
  Dev:    '💻 Full Stack Dev',
  Design: '🎨 Graphic Design',
  Video:  '🎬 Video Editing',
};

export default function ToolTooltip({ tool, onClose }) {
  const ref = useRef(null);
  const colors = CATEGORY_COLORS[tool.category] || { primary: '#6366F1', dim: 'rgba(99,102,241,0.15)' };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        animation: 'popIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        minWidth: '260px',
        maxWidth: '320px',
        background: 'rgba(9, 10, 15, 0.97)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.primary}55`,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: `0 0 40px ${colors.primary}30, 0 20px 60px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '10px', right: '12px',
          background: 'none', border: 'none', color: '#64748B',
          fontSize: '20px', cursor: 'pointer', lineHeight: 1,
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
      >×</button>

      {/* Icon */}
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img 
          src={tool.slug ? `https://cdn.simpleicons.org/${tool.slug}/${colors.primary.replace('#', '')}` : `https://cdn.simpleicons.org/react/${colors.primary.replace('#', '')}`}
          alt={tool.name}
          style={{ width: '36px', height: '36px', objectFit: 'contain' }}
        />
      </div>

      {/* Name */}
      <h3 style={{ margin: '0 0 4px 0', color: colors.primary, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-jakarta, sans-serif)' }}>
        {tool.name}
      </h3>

      {/* Category tag */}
      <span style={{
        display: 'inline-block', marginBottom: '12px',
        background: colors.dim, color: colors.primary,
        border: `1px solid ${colors.primary}40`,
        borderRadius: '6px', padding: '2px 10px',
        fontSize: '10px', fontFamily: 'var(--font-jetbrains, monospace)',
        letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        {CATEGORY_LABELS[tool.category] || tool.category}
      </span>

      {/* Description */}
      <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px', lineHeight: 1.6, fontFamily: 'var(--font-inter, sans-serif)' }}>
        {tool.desc}
      </p>
    </div>
  );
}
