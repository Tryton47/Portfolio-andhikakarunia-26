'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context/ThemeContext';

// Helper to convert RGB string format
const rgbToRgba = (rgb: string, alpha: number) => {
  const normalized = rgb.replace(/ /g, ',');
  return `rgba(${normalized}, ${alpha})`;
};

/* ═══════════════════════════════════════════════════════════════
   CURSOR TRAIL - Partikel yang mengikuti cursor
═══════════════════════════════════════════════════════════════ */
interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<TrailParticle[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const { theme } = useTheme();

  const addParticle = useCallback((x: number, y: number) => {
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 5 + 2,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 35 + 25,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get theme colors
    const primaryRGB = theme.vars.primary;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mousePos.current.x;
      const dy = e.clientY - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        addParticle(e.clientX, e.clientY);
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life < p.maxLife);

      particles.current.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.opacity = 1 - (p.life / p.maxLife);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, rgbToRgba(primaryRGB, p.opacity * 0.6));
        gradient.addColorStop(0.5, rgbToRgba(primaryRGB, p.opacity * 0.25));
        gradient.addColorStop(1, rgbToRgba(primaryRGB, 0));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [addParticle, theme.vars.primary]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR - Glowing cursor dengan outer ring
═══════════════════════════════════════════════════════════════ */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const mouseMoved = useRef(false);
  const { theme } = useTheme();

  // Get theme primary color as RGB for inline styles
  const primaryRGB = theme.vars.primary;

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!cursor || !ring || !dot) return;

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!mouseMoved.current) {
        mouseMoved.current = true;
        // Reveal cursor on first move
        if (ring) ring.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      gsap.to(cursor, { scale: 0.8, duration: 0.1 });
      gsap.to(ring, { scale: 0.7, duration: 0.1 });
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(ring, { scale: 1, duration: 0.2 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      if (isInteractive && !isHovering.current) {
        isHovering.current = true;
        gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 0.5, duration: 0.2 });
      } else if (!isInteractive && isHovering.current) {
        isHovering.current = false;
        gsap.to(ring, { scale: 1, opacity: 0.8, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const animate = () => {
      // Smooth ring follow
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      dot.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [theme]);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[10000] border-2"
        style={{
          borderColor: rgbToRgba(primaryRGB, 0.6),
          mixBlendMode: 'difference',
          boxShadow: `0 0 15px ${rgbToRgba(primaryRGB, 0.4)}, inset 0 0 10px ${rgbToRgba(primaryRGB, 0.1)}`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10001]"
        style={{
          backgroundColor: rgbToRgba(primaryRGB, 1),
          boxShadow: `0 0 10px ${rgbToRgba(primaryRGB, 0.8)}`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROXIMITY GLOW - Elemen menyala saat cursor mendekat
═══════════════════════════════════════════════════════════════ */
interface ProximityGlowProps {
  children: React.ReactNode;
  radius?: number;
  className?: string;
}

export function ProximityGlow({ children, radius = 150, className = '' }: ProximityGlowProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const primaryRGB = theme.vars.primary;

  useEffect(() => {
    const element = elementRef.current;
    const glow = glowRef.current;
    if (!element || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      const near = distance < radius;

      if (near) {
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;

        glow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, ${rgbToRgba(primaryRGB, 0.25)} 0%, ${rgbToRgba(primaryRGB, 0.15)} 40%, transparent 70%)`;
        glow.style.opacity = '1';
        glow.style.transform = `scale(1.05)`;
      } else {
        glow.style.opacity = '0';
        glow.style.transform = `scale(1)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [radius, primaryRGB]);

  return (
    <div ref={elementRef} className={`relative ${className}`}>
      {children}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ease-out z-[-1]"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON - Tombol yang tertarik ke cursor
═══════════════════════════════════════════════════════════════ */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    let animateId: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      target.x = (e.clientX - centerX) * strength;
      target.y = (e.clientY - centerY) * strength;
    };

    const handleMouseLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      gsap.set(button, { x: current.x, y: current.y });
      gsap.set(text, { x: current.x * 0.5, y: current.y * 0.5 });

      animateId = requestAnimationFrame(animate);
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animateId);
    };
  }, [strength]);

  const content = (
    <div
      ref={buttonRef}
      className={`relative inline-block cursor-pointer ${className}`}
      style={{ willChange: 'transform' }}
      onClick={onClick}
    >
      <span ref={textRef} className="inline-block" style={{ willChange: 'transform' }}>
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING PARTICLES - Partikel ambient yang melayang
═══════════════════════════════════════════════════════════════ */
export function FloatingParticles({ count = 20 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get theme primary color
    const primaryRGB = theme.vars.primary;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse = Math.sin(t * p.pulseSpeed + p.pulseOffset);
        const currentOpacity = p.opacity + pulse * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = rgbToRgba(primaryRGB, currentOpacity);
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, rgbToRgba(primaryRGB, currentOpacity * 0.3));
        gradient.addColorStop(1, rgbToRgba(primaryRGB, 0));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [count, theme.vars.primary]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL INDICATOR - Indikator scroll dengan animasi
═══════════════════════════════════════════════════════════════ */
export function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const primaryRGB = theme.vars.primary;

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      style={{
        animation: 'fadeIn 1s ease-out forwards, float 2s ease-in-out infinite',
      }}
    >
      <span className="text-xs font-mono tracking-widest" style={{ color: rgbToRgba(primaryRGB, 0.6) }}>SCROLL</span>
      <div className="w-6 h-10 rounded-full flex justify-center pt-2" style={{ borderColor: rgbToRgba(primaryRGB, 0.4) }}>
        <div
          className="w-1.5 h-3 rounded-full"
          style={{
            backgroundColor: rgbToRgba(primaryRGB, 1),
            animation: 'scrollDot 1.5s ease-in-out infinite',
            boxShadow: `0 0 10px ${rgbToRgba(primaryRGB, 0.6)}`,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION REVEAL ON HOVER - Sections yang muncul saat di-hover
═══════════════════════════════════════════════════════════════ */
interface RevealOnHoverProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealOnHover({ children, className = '' }: RevealOnHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="transition-all duration-500"
        style={{
          filter: isHovered ? 'blur(0)' : 'blur(4px)',
          opacity: isHovered ? 1 : 0.6,
          transform: isHovered ? 'scale(1)' : 'scale(0.98)',
        }}
      >
        {children}
      </div>
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            boxShadow: 'inset 0 0 30px rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        />
      )}
    </div>
  );
}
