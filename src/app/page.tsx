'use client';

import { useState, useEffect, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import ConsoleWidget from '@/components/ConsoleWidget';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/Contact/ContactSection';
import LoadingScreen3D from '@/components/LoadingScreen3D';

export default function Home() {
  // loading = still showing loading screen, exiting = fading out, done = fully removed
  const [loadingState, setLoadingState] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [showContent, setShowContent] = useState(false);
  const savedScrollY = useRef(0);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedPortfolio');
    if (hasVisited) {
      setLoadingState('done');
      setShowContent(true);
    } else {
      sessionStorage.setItem('hasVisitedPortfolio', 'true');
    }
  }, []);

  // Scroll lock: prevent user from scrolling down during loading
  useEffect(() => {
    if (loadingState === 'loading') {
      savedScrollY.current = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.width = '100%';
    } else if (loadingState === 'exiting') {
      // Keep locked during exit fade
    } else {
      // Restore scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
      setShowContent(true);
    }
  }, [loadingState]);

  const handleLoadingDone = () => {
    // LoadingScreen3D already fades itself out internally (0.7s)
    // We wait that duration before removing it from DOM
    setLoadingState('exiting');
    setTimeout(() => {
      setLoadingState('done');
    }, 750);
  };

  return (
    <>
      {loadingState !== 'done' && (
        <LoadingScreen3D onDone={handleLoadingDone} />
      )}

      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: showContent ? 'auto' : 'none',
        }}
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
