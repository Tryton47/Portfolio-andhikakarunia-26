'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import ConsoleWidget from '@/components/ConsoleWidget';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/Contact/ContactSection';
import LoadingScreen3D from '@/components/LoadingScreen3D';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  const handleLoadingDone = () => {
    setLoaded(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      {!loaded && (
        <LoadingScreen3D onDone={handleLoadingDone} minDuration={3000} />
      )}

      <div
        className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          loaded && showContent
            ? 'opacity-100 translate-y-0 scale-100 blur-0'
            : loaded
              ? 'opacity-100 translate-y-0 scale-100 blur-0 pointer-events-none'
              : 'opacity-0 pointer-events-none'
        }`}
      >
        <HeroSection />
        <ConsoleWidget />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />

        <footer style={{ background: '#02040A', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <p style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: '#64748B',
            }}>
              © 2025 Andhika Karunia Rizqi. Crafted with passion.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
