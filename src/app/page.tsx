'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ConsoleWidget from '@/components/ConsoleWidget';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <div
        className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          loaded 
            ? 'opacity-100 translate-y-0 scale-100 blur-0' 
            : 'opacity-0 translate-y-12 scale-[0.98] blur-sm pointer-events-none'
        }`}
      >
        <HeroSection />
        <ConsoleWidget />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
      </div>
    </>
  );
}
