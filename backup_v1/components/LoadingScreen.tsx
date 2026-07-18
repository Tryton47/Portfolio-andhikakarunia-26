'use client';

import { useEffect, useState } from 'react';

const bootSequence = [
  { text: '> SYSTEM BOOT INITIATED...', color: 'text-text-dim', delay: 0 },
  { text: '> Loading kernel modules...', color: 'text-text-dim', delay: 300 },
  { text: '> AUTH LAYER: Verified ✓', color: 'text-neon-cyan', delay: 600 },
  { text: '> Portfolio Core: ONLINE ✓', color: 'text-neon-cyan', delay: 900 },
  { text: '> UI Engine: Ready ✓', color: 'text-neon-cyan', delay: 1200 },
  { text: '> SYSTEM READY — Welcome, Visitor.', color: 'text-neon-red', delay: 1600 },
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
      className={`fixed inset-0 z-[999] bg-obsidian flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,42,67,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-8">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-neon-red pulse-neon" />
            <span className="text-heading text-xs tracking-[0.5em] text-neon-red">PORTFOLIO OS</span>
            <span className="w-3 h-3 rounded-full bg-neon-red pulse-neon" />
          </div>
          <h1 className="text-heading text-4xl md:text-5xl text-text-primary tracking-widest">
            ANDHIKA
          </h1>
          <span className="text-system text-text-dim tracking-[0.4em] text-xs">
            KARUNIA RIZQI — 2026
          </span>
        </div>

        {/* Terminal Boot Log */}
        <div className="w-full glass-panel border border-border rounded-lg p-4 min-h-[160px] font-mono">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`text-xs leading-7 ${line.color}`}
              style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
            >
              {line.text}
            </div>
          ))}
          {lines.length < bootSequence.length && (
            <span className="inline-block w-2 h-4 bg-neon-red/70 animate-pulse ml-1" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-system text-text-dim">Initializing...</span>
            <span className="text-system text-neon-cyan">{progress}%</span>
          </div>
          <div className="w-full h-[2px] bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-red transition-all duration-75 shadow-[0_0_8px_rgba(255,42,67,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-text-dim">
            <span>CORE UI</span>
            <span>PORTFOLIO 2026</span>
            <span>SYS READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
