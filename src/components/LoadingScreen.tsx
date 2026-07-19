'use client';

import { useEffect, useState } from 'react';

const bootSequence = [
  { text: '> SYSTEM BOOT INITIATED...', color: 'text-[#64748B]', delay: 0 },
  { text: '> Loading kernel modules...', color: 'text-[#64748B]', delay: 300 },
  { text: '> AUTH LAYER: Verified ✓', color: 'text-emerald-500', delay: 600 },
  { text: '> Portfolio Core: ONLINE ✓', color: 'text-emerald-500', delay: 900 },
  { text: '> UI Engine: Ready ✓', color: 'text-emerald-500', delay: 1200 },
  { text: '> SYSTEM READY — Welcome, Visitor.', color: 'text-[#818CF8]', delay: 1600 },
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<typeof bootSequence>([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show boot lines
    bootSequence.forEach((line) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, line.delay);
    });

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    // Fade out after 3 seconds
    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const doneTimer = setTimeout(() => onDone(), 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-[radial-gradient(ellipse_at_center,var(--color-charcoal)_0%,var(--color-obsidian)_100%)] flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Grid overlay (Subtle) */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none mix-blend-overlay" />

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-12">
        {/* Header Typography with Logo Mark */}
        <div className="flex flex-col items-center gap-4">
          {/* Hexagon / Cyber Logo Mark */}
          <div className="w-16 h-16 relative flex items-center justify-center mb-2">
            <div className="absolute inset-0 border-2 border-primary/20 rotate-45 rounded-sm animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 border border-secondary/40 rotate-[22.5deg] rounded-sm animate-[spin_6s_linear_infinite_reverse]" />
            <div className="w-6 h-6 bg-primary/20 shadow-[0_0_15px_rgba(var(--theme-primary),0.5)] rotate-45 backdrop-blur-md" />
          </div>

          <span className="font-mono text-secondary text-[9px] md:text-[0.65rem] tracking-widest md:tracking-[0.4em] mb-1 opacity-80 text-center">
            [ SECURE CONNECTION ESTABLISHED ]
          </span>
          <h1 className="text-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.2em] md:tracking-[0.5em] font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ml-2 md:ml-4 text-center">
            ANDHIKA
          </h1>
          <div className="flex items-center gap-2 md:gap-4 mt-1 opacity-60">
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-text-dim" />
            <span className="font-body text-text-muted tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] font-medium uppercase whitespace-nowrap">
              PORTFOLIO 2026
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-text-dim" />
          </div>
        </div>

        {/* Terminal Boot Log */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-md rounded-lg" />
          <div className="relative w-full bg-[#050507]/80 backdrop-blur-xl border border-white/5 rounded-lg p-5 min-h-[170px] font-mono shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Window controls */}
            <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>

            {lines.map((line, i) => (
              <div
                key={i}
                className={`text-[11px] md:text-xs leading-7 ${line.color} transition-colors duration-300`}
                style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
              >
                {line.text}
              </div>
            ))}
            {lines.length < bootSequence.length && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-2 align-middle shadow-[0_0_8px_var(--color-primary)]" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-primary tracking-widest animate-pulse">INITIALIZING NEURAL NET...</span>
            <span className="text-secondary font-bold tracking-wider">{progress}%</span>
          </div>
          <div className="w-full h-[3px] bg-white/5 overflow-hidden rounded-full relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 ease-linear shadow-[0_0_12px_var(--color-secondary)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
