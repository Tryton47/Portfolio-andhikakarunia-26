'use client';

import { useEffect, useState, useRef } from 'react';

const logLines = [
  '> initializing portfolio_core...',
  '> loading modules: [react, next, prisma, gsap]',
  '> build /app — compiled successfully',
  '> RUNTIME status: all green',
  '> connecting db: sqlite://dev.db',
  '> Server Node: Secure (TLS 1.3)',
  '> Cloud Sync: ☁️  active',
  '> system ready. awaiting input...',
];

const professions = [
  'Web Developer',
  'Data Analyst',
  'Graphic Designer',
  'Videographer',
];

const techBadges = [
  { name: 'React', category: 'dev' },
  { name: 'Next.js', category: 'dev' },
  { name: 'TypeScript', category: 'dev' },
  { name: 'Tailwind', category: 'dev' },
  { name: 'Python', category: 'data' },
  { name: 'SQL', category: 'data' },
  { name: 'Power BI', category: 'data' },
  { name: 'Figma', category: 'design' },
  { name: 'Premiere Pro', category: 'video' },
];

export default function ConsoleWidget() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentProfession, setCurrentProfession] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-typing terminal log
  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < logLines.length) {
        const currentLine = logLines[lineIdx];
        lineIdx++;
        setVisibleLines((prev) => [...prev, currentLine]);
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  // Profession typing animation
  useEffect(() => {
    const current = professions[currentProfession];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === current) {
      setTimeout(() => setIsDeleting(true), 1800);
      return;
    }
    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentProfession((prev) => (prev + 1) % professions.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) => {
        if (isDeleting) return prev.slice(0, -1);
        return current.slice(0, prev.length + 1);
      });
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentProfession]);

  return (
    <section className="relative w-full bg-charcoal border-y border-border py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
        {/* LEFT: Headline + Badges */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <p className="text-system text-neon-red mb-4">Multi-Disciplinary Creator</p>
          <h2 className="text-heading text-2xl sm:text-3xl md:text-4xl text-text-primary leading-tight mb-4">
            I am a{' '}
            <span className="text-neon-red inline-block min-w-[200px]">
              {displayText}
              <span className="inline-block w-[2px] h-[1em] bg-neon-red ml-1 animate-pulse align-middle" />
            </span>
          </h2>
          <p className="text-text-body text-sm md:text-base leading-relaxed max-w-lg mb-10">
            A creative and multidisciplinary digital professional with a passion
            for transforming ideas into exceptional visual and functional
            experiences across development, analytics, and design.
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-3">
            {techBadges.map((badge, i) => (
              <span
                key={badge.name}
                className="px-4 py-2 border border-border rounded-full text-system text-text-muted hover:border-neon-red/40 hover:text-neon-red transition-colors cursor-default"
                style={{
                  animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {badge.name}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Terminal Widget */}
        <div className="w-full lg:w-[45%]">
          <div className="glass-panel rounded-lg overflow-hidden border border-border">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-charcoal">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-neon-red pulse-neon" />
                <span className="text-system text-text-primary text-[10px]">
                  System Online — IT Core
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-system text-neon-red text-[10px]">{'>_'} CLI Shell</span>
                <span className="text-system text-text-dim text-[10px]">☁️ Cloud Sync</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalRef}
              className="p-4 h-[260px] overflow-y-auto bg-obsidian"
              style={{ scrollbarWidth: 'none' }}
            >
              {visibleLines.map((line, i) => (
                <div
                  key={i}
                  className="font-mono text-xs text-text-muted leading-7 flex"
                  style={{
                    animation: 'fadeInUp 0.3s ease-out forwards',
                  }}
                >
                  <span className="text-neon-red mr-2 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={line.includes('ready') || line.includes('Secure') ? 'text-neon-cyan' : ''}>
                    {line}
                  </span>
                </div>
              ))}
              {/* Blinking cursor */}
              {visibleLines.length > 0 && (
                <div className="flex items-center mt-1">
                  <span className="text-neon-red font-mono text-xs mr-2 select-none">
                    {String(visibleLines.length + 1).padStart(2, '0')}
                  </span>
                  <span className="w-2 h-4 bg-neon-red/70 animate-pulse" />
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-charcoal">
              <span className="text-system text-text-dim text-[10px]">
                Server Node: Secure
              </span>
              <span className="text-system text-neon-cyan text-[10px]">
                Runtime Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
