import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// ── Stagger reveal: fade + translateY from below ──
export function useStaggerReveal(
  containerSelector: string,
  itemSelector: string,
  options: {
    y?: number;
    stagger?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const {
    y = 40,
    stagger = 0.08,
    duration = 0.8,
    delay = 0,
    ease = 'power3.out',
    start = 'top 85%',
  } = options;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const containers = document.querySelectorAll(containerSelector);
      containers.forEach((container) => {
        const items = container.querySelectorAll(itemSelector);
        if (!items.length) return;

        gsap.fromTo(
          items,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease,
            scrollTrigger: {
              trigger: container,
              start,
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [containerSelector, itemSelector, y, stagger, duration, delay, ease, start]);
}

// ── Slide reveal from left or right ──
export function useSlideReveal(
  ref: React.RefObject<Element | null>,
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  options: { duration?: number; delay?: number; ease?: string } = {}
) {
  const { duration = 1, delay = 0, ease = 'power3.out' } = options;

  useEffect(() => {
    if (!ref.current) return;

    const from: gsap.TweenVars = { opacity: 0 };
    if (direction === 'left') from.x = -60;
    else if (direction === 'right') from.x = 60;
    else if (direction === 'up') from.y = 50;
    else if (direction === 'down') from.y = -50;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, from, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 80%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, direction, duration, delay, ease]);
}

// ── Parallax: element scrolls at different speed ──
export function useParallax(
  ref: React.RefObject<Element | null>,
  strength: number = 80
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        y: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, strength]);
}

// ── Character-by-character text reveal ──
export function useCharReveal(
  ref: React.RefObject<Element | null>,
  options: { stagger?: number; delay?: number; duration?: number } = {}
) {
  const { stagger = 0.03, delay = 0.2, duration = 0.6 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current as HTMLElement;
    const originalText = el.innerText;

    // Split into spans
    el.innerHTML = originalText
      .split('')
      .map((char) =>
        char === ' '
          ? '<span style="display:inline-block;width:0.3em">&nbsp;</span>'
          : `<span style="display:inline-block">${char}</span>`
      )
      .join('');

    const spans = el.querySelectorAll('span');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0, y: 30, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          stagger,
          delay,
          ease: 'back.out(1.5)',
        }
      );
    });

    return () => ctx.revert();
  }, [ref, stagger, delay, duration]);
}

// ── Clip path reveal (image/panel reveals by clip) ──
export function useClipReveal(
  ref: React.RefObject<Element | null>,
  direction: 'right' | 'up' = 'right',
  options: { duration?: number; delay?: number } = {}
) {
  const { duration = 1.2, delay = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const fromClip =
      direction === 'right'
        ? 'inset(0 100% 0 0)'
        : 'inset(100% 0 0 0)';
    const toClip = 'inset(0 0% 0 0)';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { clipPath: fromClip, webkitClipPath: fromClip },
        {
          clipPath: toClip,
          webkitClipPath: toClip,
          duration,
          delay,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: ref.current!,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, direction, duration, delay]);
}

// ── Navbar: hide on scroll down, show on scroll up ──
export function useNavbarScrollBehavior(navRef: React.RefObject<Element | null>) {
  useEffect(() => {
    if (!navRef.current) return;

    let lastY = 0;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
          const currentY = self.scroll();
          const direction = currentY > lastY ? 'down' : 'up';
          lastY = currentY;

          if (direction === 'down' && currentY > 120) {
            gsap.to(navRef.current!, {
              yPercent: -100,
              duration: 0.4,
              ease: 'power2.inOut',
            });
          } else {
            gsap.to(navRef.current!, {
              yPercent: 0,
              duration: 0.4,
              ease: 'power2.inOut',
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, [navRef]);
}
