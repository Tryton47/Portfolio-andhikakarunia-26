'use client';
import { useRef, useState, MouseEvent } from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  activeColor?: string;
  href?: string;
}

export default function GlassButton({
  children,
  isActive,
  onClick,
  className = '',
  activeColor = 'var(--theme-primary-hex)',
  href
}: GlassButtonProps) {
  const btnRef = useRef<any>(null);
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={btnRef}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
        borderRightColor:  isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        background: isActive 
          ? `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))` 
          : 'rgba(255, 255, 255, 0.03)',
        boxShadow: isActive 
          ? `0 8px 32px 0 rgba(0,0,0,0.3), inset 0 0 20px rgba(var(--theme-primary), 0.4)` 
          : '0 4px 20px rgba(0,0,0,0.1)',
        textShadow: isActive ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Interactive Cursor Highlight Layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(circle 70px at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.35), transparent 100%)`,
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </Component>
  );
}
