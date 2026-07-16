'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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
          ctx.arc(
            cx + r * b.d * Math.cos(b.a),
            cy + r * b.d * Math.sin(b.a),
            3,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            cx + r * b.d * Math.cos(b.a),
            cy + r * b.d * Math.sin(b.a),
            6,
            0,
            Math.PI * 2
          );
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
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]"
      />
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-heading text-xs text-neon-red tracking-[0.3em]">
          WELCOME
        </span>
      </div>
    </div>
  );
}

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
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-grid"
    >
      {/* TOP HUD STATUS */}
      <div className="relative z-10 flex justify-between items-start px-6 md:px-12 pt-24 md:pt-28">
        {/* Left Status */}
        <div className="flex flex-col gap-1">
          <span className="text-system text-neon-red">System Ready</span>
          <span className="text-system text-text-dim">Portfolio 2026</span>
          <span className="text-system text-text-dim">UI Loading.</span>
        </div>
        {/* Right Status */}
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
          style={{
            transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <h1 className="text-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.15] mb-6">
            Welcome to my{' '}
            <span className="text-neon-red">Portfolio</span>{' '}
            Website
          </h1>
          <p className="text-text-body font-body text-sm md:text-base leading-relaxed max-w-xl mb-10">
            Building modern, reliable, and fast digital experiences with a focus
            on clean UI and solid engineering. Bridging the gap between data
            insights, creative design, and robust development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="px-6 py-3 bg-neon-red text-white text-system rounded-md hover:bg-[#e0243b] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,67,0.3)]"
            >
              Projects ↗
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-neon-red/40 text-neon-red text-system rounded-md hover:bg-neon-red-dim transition-colors flex items-center gap-2"
            >
              Contact ↗
            </a>
          </div>
        </div>

        {/* Right: Radar */}
        <div
          className="w-full md:w-[40%] flex flex-col items-center gap-6"
          style={{
            transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <RadarWidget />
          {/* Status Metrics */}
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

      {/* BOTTOM ACTION PANEL */}
      <div className="relative z-10 flex items-center gap-4 px-6 md:px-12 pb-8">
        <a
          href="#portfolio"
          className="px-4 py-2 border border-neon-red/30 rounded text-system text-neon-red hover:bg-neon-red-dim transition-colors"
        >
          {'</>'} Code
        </a>
        <a
          href="#about"
          className="px-4 py-2 border border-border rounded text-system text-text-muted hover:border-neon-red/30 hover:text-neon-red transition-colors"
        >
          Profile
        </a>
        <a
          href="https://github.com/Tryton47/Portfolio-andhikakarunia-26"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 border border-border rounded text-system text-text-muted hover:border-neon-cyan/30 hover:text-neon-cyan transition-colors"
        >
          Source
        </a>
      </div>

      {/* BACKGROUND AMBIENT GRADIENT */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,42,67,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,240,255,0.03)_0%,transparent_60%)] pointer-events-none" />
    </section>
  );
}
