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

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-10">
        {/* Header Typography */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[#64748B] text-[0.7rem] tracking-[0.3em] mb-2">
            [ SYSTEM INITIALIZATION // VER.2026 ]
          </span>
          <h1 className="text-heading text-4xl md:text-5xl text-[#FFFFFF] tracking-[0.4em] font-extrabold drop-shadow-sm">
            ANDHIKA
          </h1>
          <span className="font-body text-[#475569] tracking-[0.2em] text-xs font-medium uppercase mt-1">
            KARUNIA RIZQI — 2026
          </span>
        </div>

        {/* Terminal Boot Log */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-[#1E293B] rounded-lg p-5 min-h-[160px] font-mono shadow-2xl">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`text-xs leading-7 ${line.color} transition-colors duration-300`}
              style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
            >
              {line.text}
            </div>
          ))}
          {lines.length < bootSequence.length && (
            <span className="inline-block w-2 h-4 bg-[#64748B] animate-pulse ml-1 align-middle" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-[#94A3B8] tracking-widest">INITIALIZING...</span>
            <span className="text-[#94A3B8]">{progress}%</span>
          </div>
          <div className="w-full h-[2px] bg-[#1E293B] overflow-hidden rounded-full">
            <div
              className="h-full bg-primary transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
