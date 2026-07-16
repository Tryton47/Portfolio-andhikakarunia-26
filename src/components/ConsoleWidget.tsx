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
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3776AB]">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01h5.09l.19-.02.19-.05.18-.09.17-.12.14-.16.11-.19.08-.21.06-.24.04-.27.01-.29V3.54l.02-.29.06-.28.1-.25.15-.23.2-.2.26-.17.3-.13.35-.1.38-.07.4-.05.4-.02.39-.01h.38l.36.01.34.02.31.04.28.06.25.07.22.09.19.1.17.12.15.14.12.15.1.17.07.18.06.2.03.21.01.22v4.06l-.01.22-.03.2-.06.19-.09.17-.12.16-.14.14-.17.12-.19.1-.22.07-.24.05-.26.03-.27.01h-2.52l-.24.01-.24.04-.23.07-.22.1-.2.13-.18.16-.16.18-.13.21-.1.23-.07.25-.04.27-.01.29v1.05l-.01.18.01.17.03.15.06.14.09.12.12.11.15.08.18.06.21.04.24.01h7.56l.21-.01.2-.03.19-.06.18-.09.16-.12.14-.16.1-.19.07-.22.04-.24.01-.26v-4.1l-.01-.25-.03-.23-.06-.21-.1-.19-.13-.16-.17-.14-.2-.11-.23-.08-.26-.05-.28-.02h-1.24l-.23.01-.21.04-.2.07-.18.11-.16.14-.13.17-.1.2-.07.22-.04.24-.02.25v1.6l.01.19.04.18.07.16.1.13.13.1.15.07.17.04.19.01h.83l.18-.01.17-.03.15-.06.13-.1.1-.12.08-.15.05-.17.03-.19.01-.2V9.18l-.01-.19-.03-.19-.06-.18-.1-.16-.13-.14-.16-.11-.19-.09-.22-.06-.24-.04-.27-.01h-3.38l-.28.01-.27.03-.25.07-.23.1-.2.13-.18.17-.15.2-.12.24-.09.27-.05.3-.02.33v10.7l.02.34.06.31.1.28.15.24.19.21.23.18.27.14.3.1.33.07.35.04.36.01h.79l.35-.01.33-.04.3-.07.28-.1.25-.13.23-.17.2-.2.16-.24.13-.27.09-.3.06-.33.02-.35V14.47l-.02-.33-.06-.3-.1-.27-.14-.24-.19-.2-.22-.17-.26-.13-.3-.1-.33-.06-.35-.03-.37-.01h-.79l-.36.01-.34.03-.31.06-.29.1-.26.12-.23.16-.2.2-.17.23-.13.27-.09.3-.06.33-.02.36v1.24l.02.29.06.26.1.22.15.19.19.16.22.12.25.08.28.05.3.02h1.95l.27-.02.24-.06.22-.1.19-.13.16-.17.13-.2.09-.23.06-.25.03-.28.01-.3V8.5l-.01-.28-.03-.26-.07-.23-.11-.2-.15-.17-.19-.14-.22-.1-.26-.06-.28-.03z" />
      </svg>
    ),
  },
  {
    name: 'Power BI',
    category: 'data',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#F2C811]">
        <path d="M9.5 3.5C9.5 2.119 10.619 1 12 1s2.5 1.119 2.5 2.5v17c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5v-17zm-7 5C2.5 7.119 3.619 6 5 6s2.5 1.119 2.5 2.5v12C7.5 21.881 6.381 23 5 23s-2.5-1.119-2.5-2.5v-12zm14 3c0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5v9c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5v-9z" />
      </svg>
    ),
  },
  {
    name: 'SQL',
    category: 'data',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#F29111]">
        <path d="M12 3C7.589 3 4 4.343 4 6v12c0 1.657 3.589 3 8 3s8-1.343 8-3V6c0-1.657-3.589-3-8-3zm0 2c3.866 0 6 1.006 6 1s-2.134 1-6 1-6-1.006-6-1 2.134-1 6-1zm6 12c0 .994-2.134 2-6 2s-6-1.006-6-2v-2.268c1.478.765 3.682 1.268 6 1.268s4.522-.503 6-1.268V17zm0-4c0 .994-2.134 2-6 2s-6-1.006-6-2v-2.268C7.478 11.497 9.682 12 12 12s4.522-.503 6-1.268V13z" />
      </svg>
    ),
  },
  {
    name: 'Figma',
    category: 'design',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#F24E1E]">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49c2.489 0 4.515 2.014 4.515 4.49S10.661 24 8.172 24zm0-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019zm7.77 7.51h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49S18.418 24 15.942 24zm-.098-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
      </svg>
    ),
  },
  {
    name: 'Premiere',
    category: 'video',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#9999FF]">
        <path d="M0 0v24h24V0H0zm5.76 15.93c-.35.14-.71.21-1.08.21-.37 0-.73-.05-1.08-.15V9.96l2.14-.28v6.25h.02zm4.51.15c-.52.18-1.07.27-1.64.27-.57 0-1.1-.09-1.57-.27-.47-.18-.87-.43-1.2-.75v-5.4l2.14-.28v5.06c0 .25.05.44.15.57.1.13.26.19.48.19.22 0 .37-.06.46-.19.09-.13.14-.32.14-.57v-5.06l2.14-.28v5.4c-.11.47-.33.85-.64 1.14-.31.3-.71.52-1.19.68h-.27zm4.33.06c-.66 0-1.2-.14-1.61-.42-.41-.28-.62-.69-.62-1.24V7.75l2.14-.28v7.93c0 .17.04.3.12.4.08.1.2.15.36.15.1 0 .2-.02.28-.06l.28 1.6c-.29.12-.6.18-.95.18v-.13zm5.69-1.34c-.31.4-.76.71-1.35.91-.59.21-1.27.31-2.04.31-.3 0-.61-.03-.93-.08l-.08-1.74c.27.07.55.1.84.1.55 0 .96-.1 1.24-.29.28-.19.42-.49.42-.89 0-.31-.1-.55-.3-.74-.2-.19-.45-.28-.76-.28-.3 0-.57.08-.8.25-.23.17-.35.37-.35.6v.12l-2.07-.37c.12-.52.36-.96.72-1.31.36-.35.81-.6 1.35-.75.54-.15 1.12-.23 1.73-.23.73 0 1.34.1 1.83.29.49.19.84.48 1.06.86.22.38.33.86.33 1.44 0 .71-.18 1.3-.54 1.77l-.3-.07z" />
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
