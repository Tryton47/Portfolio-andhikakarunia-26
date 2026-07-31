'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { useAnimeCountUp } from '@/hooks/useAnimeEffects';

/* ─── Stat Card with Anime.js Count-Up ─── */
function StatCard({
  label,
  sublabel,
  target,
  suffix = '+',
}: {
  label: string;
  sublabel: string;
  target: number;
  suffix?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const displayRef = useAnimeCountUp(target, cardRef, {
    duration: 2200,
    easing: 'easeOutExpo',
    delay: 100,
  });

  return (
    <div
      ref={cardRef}
      className="glass-panel border border-border rounded-xl p-6 flex items-center justify-between transition-colors group hover:scale-[1.02] transition-transform duration-300"
      style={{ borderColor: 'var(--color-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--theme-primary-hex)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <div>
        <p className="text-system text-text-dim mb-1">{label}</p>
        <p className="text-text-muted text-xs mt-1">{sublabel}</p>
      </div>
      <span
        className="text-4xl md:text-5xl font-mono font-bold text-text-primary"
        style={{ color: 'var(--theme-primary-hex)' }}
      >
        <span ref={displayRef}>0</span>
        <span className="text-2xl">{suffix}</span>
      </span>
    </div>
  );
}

function TiltPortrait() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // GSAP clip-path reveal
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.4,
          ease: 'power4.inOut',
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.clipPath = 'none';
            }
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxTilt = 20;
    setRotateX(-((y - centerY) / centerY) * maxTilt);
    setRotateY(((x - centerX) / centerX) * maxTilt);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer"
      style={{ perspective: '1200px', opacity: 0 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotateX(0); setRotateY(0); }}
    >
      <div
        className="relative transition-transform duration-200 ease-out z-10"
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Sweeping Glow Ring */}
        <div
          className="absolute inset-[-8px] rounded-2xl opacity-70"
          style={{
            background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, var(--theme-primary-hex) 30deg, transparent 60deg, transparent 360deg)`,
            filter: 'blur(10px)',
            transform: 'translateZ(-20px)',
          }}
        />

        {/* 3D Card */}
        <div
          className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border border-border bg-charcoal shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Image
            src="/foto-pribadi.png"
            alt="Andhika Karunia Rizqi"
            fill
            className="object-cover"
            priority
            style={{ transform: 'translateZ(10px) scale(1.05)' }}
          />

          {/* Glare Effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              mixBlendMode: 'overlay',
              transform: 'translateZ(20px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT SECTION ─── */
export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        }
      );

      // Bio text slide in from left
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: bioRef.current, start: 'top 80%', once: true },
        }
      );

      // Stats stagger up
      if (statsContainerRef.current) {
        const cards = statsContainerRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: statsContainerRef.current, start: 'top 85%', once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 px-6 md:px-12 bg-obsidian"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
            About <span style={{ color: 'var(--theme-primary-hex)' }}>Me</span>
          </h2>
          <p className="text-system" style={{ color: 'var(--theme-secondary-hex)' }}>
            Transforming ideas into digital experiences
          </p>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
          {/* Left: Bio */}
          <div
            ref={bioRef}
            className="w-full lg:w-[55%] flex flex-col"
            style={{ opacity: 0 }}
          >
            <h3 className="text-heading text-xl md:text-2xl text-text-primary mb-4">
              Hello, I'm{' '}
              <span style={{ color: 'var(--theme-primary-hex)' }}>Andhika Karunia Rizqi</span>
            </h3>
            <p className="text-text-body text-sm md:text-base leading-relaxed mb-6">
              I'm an Information Systems student with a strong interest in
              technology and data. On the development side, I've built projects
              using JavaScript, PHP, Laravel, Next.js, and Tailwind CSS. On the
              data side, I work with SQL, Python (Colab), and Power BI to build
              dashboards and derive insights.
            </p>
            <p className="text-text-body text-sm md:text-base leading-relaxed mb-8">
              Creatively, I've been doing video editing and graphic design since
              high school using Figma, Premiere Pro, and DaVinci Resolve.
              Whether it's crafting a UI, analyzing a dataset, or directing a
              short film, I build to learn and learn to build.
            </p>

            {/* Quote Box */}
            <div
              className="border-l-2 pl-5 py-3 mb-8 glass-panel rounded-r-lg"
              style={{ borderColor: 'var(--theme-primary-hex)' }}
            >
              <p className="text-text-muted text-sm italic">
                "Leveraging technology as a professional tool to elevate visual
                and data engineering — one project at a time."
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href="/CV_ATS_Andhika_Karunia_Rizqi_2026.pdf"
                download="CV_ATS_Andhika_Karunia_Rizqi_2026.pdf"
                className="px-6 py-3 text-white text-system rounded-md transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, var(--theme-grad1), var(--theme-grad2))`,
                  boxShadow: '0 0 20px rgba(var(--theme-primary), 0.25)',
                }}
              >
                Download CV
              </a>
              <a
                href="#portfolio"
                className="px-6 py-3 border text-system rounded-md transition-all duration-300 hover:scale-105"
                style={{ borderColor: 'var(--theme-primary-hex)', color: 'var(--theme-primary-hex)' }}
              >
                View Projects
              </a>
            </div>
          </div>

          {/* Right: 3D Portrait */}
          <div className="w-full lg:w-[40%] flex justify-center">
            <TiltPortrait />
          </div>
        </div>

        {/* Counter Cards with Anime.js */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="stat-card" style={{ opacity: 0 }}>
            <StatCard label="Total Projects" sublabel="Web, Data, Design, Video" target={8} />
          </div>
          <div className="stat-card" style={{ opacity: 0 }}>
            <StatCard label="Certificates" sublabel="Professional credentials" target={7} />
          </div>
          <div className="stat-card" style={{ opacity: 0 }}>
            <StatCard label="Years Experience" sublabel="Continuous learning" target={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
