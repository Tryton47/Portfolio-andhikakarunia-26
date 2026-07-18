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
        className={`transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
