'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Cloud, Lock, Server, Terminal } from 'lucide-react';

const professions = ["Data Analyst.", "Web Developer.", "Graphic Designer.", "Videographer."];

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [profIndex, setProfIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentProf = professions[profIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && displayText === currentProf) {
      typingSpeed = 2000;
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setProfIndex((prev) => (prev + 1) % professions.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(prev => {
        if (isDeleting) return prev.slice(0, -1);
        return currentProf.slice(0, prev.length + 1);
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, profIndex]);

  return (
    <main className="relative min-h-screen w-full pt-32 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
      {/* Background Decor - Big text "WELCOME" in background like reference */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-white/5 font-sans whitespace-nowrap pointer-events-none -z-10 select-none">
        PORTFOLIO
      </div>

      <div className="flex flex-col z-10 w-full md:w-1/2">
        <h1 className="text-5xl md:text-7xl font-bold font-sans text-brand-red mb-4 tracking-tight leading-tight">
          Full Stack <br /> Developer
        </h1>
        
        {/* Dynamic Typing Role */}
        <h2 className="text-xl md:text-3xl font-light font-sans text-white mb-6 h-10 flex items-center">
          <span>{displayText}</span>
          <span className="w-[2px] h-[80%] bg-brand-red ml-1 animate-pulse"></span>
        </h2>
        
        <p className="text-gray-400 font-sans mb-8 max-w-lg leading-relaxed text-sm md:text-base">
          A creative and multidisciplinary digital professional with a passion for transforming ideas into exceptional visual and functional experiences. I specialize in designing, building, and deploying intuitive, fast, and user-centric digital applications.
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["React", "Javascript", "Node.js", "Tailwind"].map((tech) => (
            <span key={tech} className="px-4 py-2 border border-brand-border rounded-lg bg-brand-card text-gray-300 text-xs font-mono">
              {tech}
            </span>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 font-sans text-sm font-medium">
          <Link href="/portfolio" className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            Projects <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-brand-red text-brand-red rounded-lg hover:bg-brand-red/10 transition-colors flex items-center gap-2">
            Contact
          </Link>
        </div>
      </div>

      {/* Right Side UI Card (Console/System) */}
      <div className="hidden md:flex flex-col z-10 w-[45%] lg:w-[40%] bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            <span className="text-white text-xs font-mono uppercase tracking-widest">System Online</span>
          </div>
          <span className="text-gray-500 text-xs font-mono tracking-widest">IT CORE</span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs font-mono border-b border-brand-border pb-2">
            <div className="flex items-center gap-2 text-gray-300">
              <Terminal size={14} className="text-brand-red" />
              <span>CLI Shell</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Cloud size={14} />
              <span>Cloud Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-brand-dark border border-brand-border rounded-lg p-4">
              <div className="flex justify-between text-xs font-mono mb-4 text-gray-400">
                <span>build /app</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-brand-red rounded-full"></div>
                </div>
                <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-brand-red/50 rounded-full"></div>
                </div>
                <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-dark border border-brand-border rounded-lg p-4">
              <div className="flex justify-between text-xs font-mono mb-4 text-gray-400">
                <span>RUNTIME</span>
              </div>
              <div className="w-full h-12 flex items-end gap-1">
                {[40, 70, 30, 80, 50, 90, 60, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-red/80 rounded-t-sm transition-all hover:bg-brand-red" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-brand-border">
          <div className="flex items-center gap-2 bg-brand-dark px-3 py-1.5 rounded text-xs font-mono text-gray-400">
            <Server size={12} /> Server Node
          </div>
          <div className="flex items-center gap-2 bg-brand-dark px-3 py-1.5 rounded text-xs font-mono text-gray-400">
            <Lock size={12} /> Secure
          </div>
        </div>
      </div>
    </main>
  );
}
