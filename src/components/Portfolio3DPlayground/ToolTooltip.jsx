'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ─── ICON COMPONENT ───────────────────────────────────────────────────────────
function ToolIcon({ tool, size = 64 }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Devicon URL
  const deviconSlugs = {
    python: 'python/python-original',
    javascript: 'javascript/javascript-original',
    typescript: 'typescript/typescript-original',
    react: 'react/react-original',
    nextjs: 'nextjs/nextjs-original',
    nodejs: 'nodejs/nodejs-original',
    php: 'php/php-original',
    laravel: 'laravel/laravel-original',
    tailwindcss: 'tailwindcss/tailwindcss-plain',
    git: 'git/git-original',
    postgresql: 'postgresql/postgresql-original',
    mysql: 'mysql/mysql-original',
    figma: 'figma/figma-original',
    visualstudiocode: 'vscode/vscode-original',
    adobe: 'adobe/photoshop-original',
    googlecloud: 'googlecloud/googlecloud-original',
    pandas: 'pandas/pandas-original',
    scikitlearn: 'scikitlearn/scikitlearn-original',
    fastapi: 'fastapi/fastapi-original',
    prisma: 'prisma/prisma-original',
    canva: 'canva/canva-original',
    davinciresolve: 'davinciresolve/davinciresolve-original',
  };

  const slug = deviconSlugs[tool.slug] || `${tool.slug}/${tool.slug}-original`;
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}.svg`;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!hasError && (
        <img
          src={iconUrl}
          alt={tool.name}
          width={size * 0.85}
          height={size * 0.85}
          style={{
            objectFit: 'contain',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          crossOrigin="anonymous"
        />
      )}
      {/* Emoji fallback */}
      {hasError || !loaded ? (
        <span
          style={{
            fontSize: size * 0.7,
            filter: `drop-shadow(0 0 10px ${tool.color})`,
          }}
        >
          {tool.emoji}
        </span>
      ) : null}
    </div>
  );
}

// ─── TOOLTIP MODAL ─────────────────────────────────────────────────────────────
function ToolTooltip({ tool, isVisible, onClose }) {
  if (!tool) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 40,
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.35, type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
              width: '90%',
              maxWidth: '420px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30,41,59,0.98), rgba(15,23,42,0.99))',
                border: `1px solid ${tool.color}40`,
                borderRadius: '24px',
                boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 50px ${tool.color}15`,
                overflow: 'hidden',
              }}
            >
              {/* Top accent */}
              <div
                style={{
                  height: '3px',
                  background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`,
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: tool.color,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                <X size={18} />
              </button>

              {/* Content */}
              <div style={{ padding: '32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      background: `${tool.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 40px ${tool.color}25`,
                    }}
                  >
                    <ToolIcon tool={tool} size={56} />
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#F8FAFC',
                        margin: '0 0 8px 0',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {tool.name}
                    </h3>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: `${tool.color}20`,
                        color: tool.color,
                        border: `1px solid ${tool.color}40`,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {tool.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: '#94A3B8',
                    margin: '0 0 24px 0',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {tool.desc}
                </p>

                {/* Skill bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#64748B',
                      minWidth: '70px',
                    }}
                  >
                    Proficiency
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: i < 4
                            ? `linear-gradient(90deg, ${tool.color}, ${tool.color}aa)`
                            : 'rgba(100,116,139,0.2)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer glow */}
              <div
                style={{
                  height: '60px',
                  opacity: 0.15,
                  background: `radial-gradient(ellipse at center bottom, ${tool.color}, transparent)`,
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ToolTooltip;
