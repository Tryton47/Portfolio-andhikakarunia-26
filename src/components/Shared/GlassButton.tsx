'use client';
import { useRef, useState, useEffect, MouseEvent } from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  activeColor?: string;
  href?: string;
  style?: React.CSSProperties;
}

export default function GlassButton({
  children,
  isActive,
  onClick,
  className = '',
  activeColor = 'var(--theme-primary-hex)',
  href,
  style: externalStyle,
}: GlassButtonProps) {
  const btnRef = useRef<any>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Use ref-based coords to avoid setState in mousemove (prevents max-update-depth)
  const coordsRef = useRef({ x: -100, y: -100 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!btnRef.current || !highlightRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    coordsRef.current = { x, y };
    // Direct DOM update — no setState, no re-render
    highlightRef.current.style.background = `radial-gradient(circle 80px at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 100%)`;
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (highlightRef.current) {
      highlightRef.current.style.background = 'transparent';
    }
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={btnRef}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-full transition-all duration-500 overflow-hidden ${className} ${
        isActive
          ? 'text-white scale-105 backdrop-blur-2xl'
          : 'text-slate-300 hover:text-white hover:scale-105 backdrop-blur-md'
      }`}
      style={{
        border: isActive
          ? '1px solid rgba(255, 255, 255, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderBottomColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        borderRightColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        background: isActive
          ? `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))`
          : 'rgba(255, 255, 255, 0.03)',
        boxShadow: isActive
          ? `0 8px 32px 0 rgba(0,0,0,0.3), inset 0 0 20px rgba(var(--theme-primary), 0.4)`
          : '0 4px 20px rgba(0,0,0,0.1)',
        textShadow: isActive ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
        ...externalStyle,
      }}
    >
      {/* Interactive Cursor Highlight Layer (ref-based, no setState) */}
      <div
        ref={highlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{ opacity: isHovering ? 1 : 0 }}
      />

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </Component>
  );
}
