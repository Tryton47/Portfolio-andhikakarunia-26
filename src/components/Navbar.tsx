'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = 0;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
          const currentY = self.scroll();
          const dir = currentY > lastY ? 'down' : 'up';
          lastY = currentY;

          if (dir === 'down' && currentY > 150) {
            gsap.to(navRef.current, {
              yPercent: -110,
              duration: 0.45,
              ease: 'power2.inOut',
              overwrite: true,
            });
          } else {
            gsap.to(navRef.current, {
              yPercent: 0,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: true,
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-[100] backdrop-blur-xl border-b border-border/80 transition-colors duration-300"
      style={{ background: 'rgba(5,5,7,0.75)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <a
          href="#hero"
          className="text-heading text-sm md:text-base text-text-primary hover:text-primary transition-colors tracking-[0.1em] truncate mr-2"
        >
          <span className="hidden sm:inline">Andhika Karunia Rizqi</span>
          <span className="sm:hidden">Andhika K.R.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-system text-text-muted hover:text-primary transition-colors relative group"
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--theme-primary-hex)' }}
              />
            </a>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 group p-2 -mr-2"
          aria-label="Menu"
          id="mobile-menu-toggle"
        >
          <span className="w-6 h-[2px] bg-text-primary transition-all group-hover:bg-primary" />
          <span className="w-4 h-[2px] bg-text-muted group-hover:bg-primary transition-colors" />
          <span className="w-6 h-[2px] bg-text-primary transition-all group-hover:bg-primary" />
        </button>
      </div>
    </header>
  );
}
