'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── SVG Social Icons ─── */
function IconGithub({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconLinkedIn({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ─── RADAR WIDGET ─── */
function RadarWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, w, h);

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner rings
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * (i / 4), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 42, 67, ${0.08 + i * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Crosshair
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweep glow cone
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle - 0.5, angle, false);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, 'rgba(255, 42, 67, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 42, 67, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Blips
      const blips = [
        { a: 0.8, d: 0.6 },
        { a: 2.5, d: 0.4 },
        { a: 4.2, d: 0.8 },
        { a: 5.5, d: 0.3 },
      ];
      blips.forEach((b) => {
        const dist = Math.abs(((angle - b.a + Math.PI) % (Math.PI * 2)) - Math.PI);
        const alpha = dist < 1.5 ? (1.5 - dist) / 1.5 : 0;
        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(cx + r * b.d * Math.cos(b.a), cy + r * b.d * Math.sin(b.a), 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + r * b.d * Math.cos(b.a), cy + r * b.d * Math.sin(b.a), 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.2})`;
          ctx.fill();
        }
      });

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 42, 67, 0.8)';
      ctx.fill();

      angle += 0.012;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={280} height={280} className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-heading text-xs text-neon-red tracking-[0.3em]">WELCOME</span>
      </div>
    </div>
  );
}

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Tryton47',
    icon: <IconGithub size={20} />,
    color: 'hover:text-text-primary hover:border-text-muted',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/andhka_rzq',
    icon: <IconInstagram size={20} />,
    color: 'hover:text-[#E1306C] hover:border-[#E1306C]/40',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/andhika-karunia-545166292',
    icon: <IconLinkedIn size={20} />,
    color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40',
  },
];

/* ─── HERO SECTION ─── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-grid">
      {/* TOP HUD STATUS */}
      <div className="relative z-10 flex justify-between items-start px-6 md:px-12 pt-24 md:pt-28">
        <div className="flex flex-col gap-1">
          <span className="text-system text-neon-red">System Ready</span>
          <span className="text-system text-text-dim">Portfolio 2026</span>
          <span className="text-system text-text-dim">UI Loading.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-system text-text-dim">Core UI</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-red pulse-neon" />
            <span className="text-system text-neon-red">Online</span>
          </div>
        </div>
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-0 gap-12">
        {/* Left: Text */}
        <div
          className="w-full md:w-[55%] flex flex-col"
          style={{ transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -5}px)`, transition: 'transform 0.3s ease-out' }}
        >
          <h1 className="text-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.15] mb-6">
            Welcome to my{' '}
            <span className="text-neon-red">Portfolio</span>{' '}
            Website
          </h1>
          <p className="text-text-body font-body text-sm md:text-base leading-relaxed max-w-xl mb-6">
            Building modern, reliable, and fast digital experiences with a focus
            on clean UI and solid engineering. Bridging the gap between data
            insights, creative design, and robust development.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mb-10">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className={`w-10 h-10 rounded-lg glass-panel border border-border flex items-center justify-center text-text-muted transition-all duration-300 ${s.color} shadow-sm hover:shadow-[0_0_12px_rgba(255,42,67,0.2)]`}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="px-6 py-3 bg-neon-red text-white text-system rounded-md hover:bg-[#e0243b] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,67,0.3)]"
            >
              Projects ↗
            </a>
            <a
              href="#about"
              className="px-6 py-3 border border-neon-red/40 text-neon-red text-system rounded-md hover:bg-neon-red-dim transition-colors flex items-center gap-2"
            >
              Profile ↗
            </a>
          </div>
        </div>

        {/* Right: Radar */}
        <div
          className="w-full md:w-[40%] flex flex-col items-center gap-6"
          style={{ transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`, transition: 'transform 0.3s ease-out' }}
        >
          <RadarWidget />
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-system text-text-dim">Modules</span>
              <span className="text-system text-neon-cyan">06 Loaded</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-system text-text-dim">Latency</span>
              <span className="text-system text-neon-cyan">12ms Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION PANEL — only Profile */}
      <div className="relative z-10 flex items-center gap-4 px-6 md:px-12 pb-8">
        <a
          href="#about"
          className="px-4 py-2 border border-border rounded text-system text-text-muted hover:border-neon-red/30 hover:text-neon-red transition-colors"
        >
          Profile
        </a>
      </div>

      {/* BACKGROUND AMBIENT GRADIENT */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,42,67,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,240,255,0.03)_0%,transparent_60%)] pointer-events-none" />
    </section>
  );
}
