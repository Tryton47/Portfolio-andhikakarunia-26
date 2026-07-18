'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ─── Counter Hook ─── */
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return { count, ref };
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  sublabel,
  target,
}: {
  label: string;
  sublabel: string;
  target: number;
}) {
  const { count, ref } = useCountUp(target);
  return (
    <div
      ref={ref}
      className="glass-panel border border-border rounded-xl p-6 flex items-center justify-between hover:border-neon-red/30 transition-colors group"
    >
      <div>
        <p className="text-system text-text-dim mb-1">{label}</p>
        <p className="text-text-muted text-xs mt-1">{sublabel}</p>
      </div>
      <span className="text-4xl md:text-5xl font-mono font-bold text-text-primary group-hover:text-neon-red transition-colors">
        {count}
      </span>
    </div>
  );
}

/* ─── ABOUT SECTION ─── */
export default function AboutSection() {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 bg-obsidian"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
            About <span className="text-neon-red">Me</span>
          </h2>
          <p className="text-system text-neon-cyan">
            Transforming ideas into digital experiences
          </p>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
          {/* Left: Bio */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h3 className="text-heading text-xl md:text-2xl text-text-primary mb-4">
              Hello, I'm{' '}
              <span className="text-neon-red">Andhika Karunia Rizqi</span>
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
            <div className="border-l-2 border-neon-red pl-5 py-3 mb-8 glass-panel rounded-r-lg">
              <p className="text-text-muted text-sm italic">
                "Leveraging technology as a professional tool to elevate visual
                and data engineering — one project at a time."
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-4">
              <a
                href="/CV_ATS_Andhika_Karunia_Rizqi_2026.pdf"
                download="CV_ATS_Andhika_Karunia_Rizqi_2026.pdf"
                className="px-6 py-3 bg-neon-red text-white text-system rounded-md hover:bg-[#e0243b] transition-colors shadow-[0_0_15px_rgba(255,42,67,0.3)]"
              >
                Download CV
              </a>
              <a
                href="#portfolio"
                className="px-6 py-3 border border-neon-red/40 text-neon-red text-system rounded-md hover:bg-neon-red-dim transition-colors"
              >
                View Projects
              </a>
            </div>
          </div>

          {/* Right: Portrait with sweeping glow */}
          <div className="w-full lg:w-[40%] flex justify-center">
            <div className="relative">
              {/* Sweeping Glow Ring */}
              <div
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(255, 42, 67, 0.5) 30deg, transparent 60deg, transparent 360deg)`,
                  transition: 'none',
                }}
              />
              {/* Portrait Container */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-border bg-charcoal z-10">
                <Image
                  src="/foto-pribadi.png"
                  alt="Andhika Karunia Rizqi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Projects" sublabel="Web, Data, Design, Video" target={8} />
          <StatCard label="Certificates" sublabel="Professional credentials" target={7} />
          <StatCard label="Years Experience" sublabel="Continuous learning" target={2} />
        </div>
      </div>
    </section>
  );
}
