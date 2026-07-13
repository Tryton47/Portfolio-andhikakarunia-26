'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fade-up', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full pt-32 px-6 md:px-12 pb-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Title */}
        <div className="fade-up mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4">
            About <span className="text-brand-red">Me</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-sans max-w-2xl mx-auto">
            Transforming ideas into digital experiences
          </p>
        </div>

        {/* Photo and Intro Text */}
        <div className="w-full flex flex-col md:flex-row items-center gap-12 mb-16 fade-up">
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-3xl font-bold font-sans text-brand-red mb-4">
              Hello, I'm <br />
              <span className="text-white">Andhika Karunia Rizqi</span>
            </h2>
            <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6">
              I'm an Information Systems student with a strong interest in technology and data. On the development side, I've built projects using JavaScript, PHP, Laravel, Next.js, and Tailwind CSS. On the data side, I work with SQL, Python (Colab), and Power BI to build dashboards and derive insights.
            </p>
            <div className="border-l-2 border-brand-red pl-4 text-sm font-sans italic text-gray-500">
              "Building to learn, learning to build."
            </div>
            
            <div className="mt-8 flex gap-4">
              <a href="#" className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">
                Download CV
              </a>
              <a href="/portfolio" className="px-6 py-3 border border-brand-red text-brand-red rounded-lg hover:bg-brand-red/10 transition-colors font-medium text-sm">
                View Projects
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden relative border-4 border-brand-border bg-brand-card shadow-[0_0_40px_rgba(255,77,77,0.1)]">
              <Image 
                src="/foto-pribadi.png" 
                alt="Andhika Karunia"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stat Boxes */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 fade-up">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div className="text-left">
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">TOTAL PROJECTS</p>
              <p className="text-gray-300 text-xs mt-1">Web, Data, Design</p>
            </div>
            <span className="text-4xl font-bold text-white">8</span>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div className="text-left">
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">CERTIFICATES</p>
              <p className="text-gray-300 text-xs mt-1">Professional skills</p>
            </div>
            <span className="text-4xl font-bold text-white">7</span>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div className="text-left">
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">EXPERIENCE</p>
              <p className="text-gray-300 text-xs mt-1">Continuous learning</p>
            </div>
            <span className="text-4xl font-bold text-white">2</span>
          </div>
        </div>

      </div>
    </main>
  );
}
