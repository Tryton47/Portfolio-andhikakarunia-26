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

const professions = ['Web Developer', 'Data Analyst', 'Graphic Designer', 'Videographer'];

/* SVG Tech Stack Logos */
const techLogos: { name: string; category: string; svg: React.ReactNode }[] = [
  {
    name: 'React',
    category: 'dev',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    category: 'dev',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'dev',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3178C6]">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'data',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#387EB8" d="M11.996 0c-5.748 0-5.518 2.483-5.518 2.483v2.664h5.602v.816h-5.8c-2.31 0-3.613 1.157-3.613 3.633v2.6c0 2.49 1.144 3.518 3.5 3.518h1.228v-3.324s-.044-1.928 1.884-1.928h5.68s2.008.064 2.008-1.922v-6.08c0-1.874-2.025-2.46-4.97-2.46zM9.9 1.76a1.134 1.134 0 11.002 2.268 1.134 1.134 0 01-.002-2.268z"/>
        <path fill="#FFE052" d="M20.274 9.775s2.44-.022 2.44 2.462v6.08c0 1.986-1.866 1.93-1.866 1.93h-5.68s-1.928-.052-1.928 1.878v3.315h-1.229c-2.355 0-3.5 1.03-3.5 3.518v-2.6c0-2.476 1.303-3.633 3.613-3.633h5.8v-.817h-5.602v-2.664s-.23-2.483 5.518-2.483zM14.1 20.086a1.134 1.134 0 11.001 2.269 1.134 1.134 0 01-.001-2.269z"/>
      </svg>
    ),
  },
  {
    name: 'Power BI',
    category: 'data',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#F2C811" d="M9 13v9H4v-9h5zm6-5v14h-5V8h5zm6-6v20h-5V2h5z"/>
      </svg>
    ),
  },
  {
    name: 'SQL',
    category: 'data',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F29111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
  },
  {
    name: 'Figma',
    category: 'design',
    svg: (
      <svg viewBox="0 0 38 57" className="w-5 h-5">
        <path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19C14.7467 19 19 23.2533 19 28.5Z" fill="#1ABCFE"/>
        <path d="M0 47.5C0 52.7467 4.25329 57 9.5 57C14.7467 57 19 52.7467 19 47.5V38H9.5C4.25329 38 0 42.2533 0 47.5Z" fill="#0ACF83"/>
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
        <path d="M19 19V38H28.5C33.7467 38 38 33.7467 38 28.5C38 23.2533 33.7467 19 28.5 19H19Z" fill="#A259FF"/>
      </svg>
    ),
  },
  {
    name: 'Premiere',
    category: 'video',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <rect width="24" height="24" rx="4" fill="#00005b"/>
        <path fill="#ea77ff" d="M7 6.5h3.6c2.4 0 4.1 1.4 4.1 3.5 0 2.2-1.8 3.5-4 3.5H8.7V18H7V6.5zm1.7 5.6h1.9c1.3 0 2.3-.6 2.3-2.1 0-1.4-1-2.1-2.2-2.1H8.7v4.2zM15.4 11.5h1.6v1.3c.4-.9 1.4-1.5 2.5-1.5.2 0 .5 0 .7.1v1.7c-.3-.1-.5-.1-.8-.1-1.3 0-2.3 1-2.3 2.5V18h-1.7v-6.5z"/>
      </svg>
    ),
  },
  {
    name: 'Git',
    category: 'dev',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#F05032]">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" />
      </svg>
    ),
  },
];

export default function ConsoleWidget() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentProfession, setCurrentProfession] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Looping terminal — fills all lines, pauses 2s, then restarts
  useEffect(() => {
    let lineIdx = 0;
    let running = true;

    const runLoop = () => {
      if (!running) return;
      lineIdx = 0;
      setVisibleLines([]);

      const tick = () => {
        if (!running) return;
        if (lineIdx < logLines.length) {
          const line = logLines[lineIdx];
          lineIdx++;
          setVisibleLines((prev) => [...prev, line]);
          setTimeout(tick, 600);
        } else {
          // all lines shown — wait 2s then restart
          setTimeout(() => {
            if (running) runLoop();
          }, 2000);
        }
      };
      tick();
    };

    runLoop();
    return () => { running = false; };
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
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === current) {
      const t = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(t);
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

          {/* Fix text overflow — block layout, profession on its own line */}
          <h2 className="text-heading text-2xl sm:text-3xl md:text-4xl text-text-primary leading-tight mb-4">
            I am a
          </h2>
          <h2 className="text-heading text-2xl sm:text-3xl md:text-4xl text-neon-red leading-tight mb-4 min-h-[1.4em]">
            {displayText}
            <span className="inline-block w-[2px] h-[0.9em] bg-neon-red ml-1 animate-pulse align-middle" />
          </h2>

          <p className="text-text-body text-sm md:text-base leading-relaxed max-w-lg mb-10">
            A creative and multidisciplinary digital professional with a passion
            for transforming ideas into exceptional visual and functional
            experiences across development, analytics, and design.
          </p>

          {/* Tech Logo Badges */}
          <div className="flex flex-wrap gap-3">
            {techLogos.map((badge, i) => (
              <div
                key={badge.name}
                title={badge.name}
                className="flex flex-col items-center gap-1.5 px-3 py-2 border border-border rounded-xl glass-panel hover:border-neon-red/40 transition-all duration-300 cursor-default group"
                style={{
                  animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {badge.svg}
                </span>
                <span className="text-[9px] font-mono text-text-dim group-hover:text-neon-red transition-colors">
                  {badge.name}
                </span>
              </div>
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
                <span className="text-system text-neon-red text-[10px]">{'> _'} CLI Shell</span>
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
                  key={`${i}-${line}`}
                  className="font-mono text-xs text-text-muted leading-7 flex"
                  style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
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
              {visibleLines.length > 0 && visibleLines.length < logLines.length && (
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
              <span className="text-system text-text-dim text-[10px]">Server Node: Secure</span>
              <span className="text-system text-neon-cyan text-[10px]">Runtime Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
