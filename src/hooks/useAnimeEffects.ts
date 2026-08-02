import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type CountUpOptions = {
  duration?: number;
  easing?: string;
  delay?: number;
  suffix?: string;
  decimals?: number;
};

// ── GSAP powered count-up ──
export function useAnimeCountUp(
  target: number,
  observerRef: React.RefObject<Element | null>,
  options: CountUpOptions = {}
) {
  const {
    duration = 2000,
    easing = 'power3.out',
    delay = 0,
    decimals = 0,
  } = options;

  const displayRef = useRef<HTMLSpanElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;

          const obj = { value: 0 };
          gsap.to(obj, {
            value: target,
            duration: duration / 1000,
            ease: easing,
            delay: delay / 1000,
            onUpdate: () => {
              if (displayRef.current) {
                displayRef.current.textContent =
                  decimals > 0
                    ? obj.value.toFixed(decimals)
                    : String(Math.floor(obj.value));
              }
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [target, duration, easing, delay, decimals, observerRef]);

  return displayRef;
}

// ── GSAP 3D card tilt on mouse move ──
export function useAnimeTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(el, {
        rotationX: rotateX,
        rotationY: rotateY,
        z: 10,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: '50% 50% -50px',
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.8)',
        transformOrigin: '50% 50% -50px',
      });
    };

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref]);
}

// ── GSAP stagger grid reveal ──
export function useAnimeStaggerReveal(
  containerRef: React.RefObject<Element | null>,
  itemSelector: string,
  options: { delay?: number; duration?: number } = {}
) {
  const { delay = 0, duration = 700 } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = container.querySelectorAll(itemSelector);
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: duration / 1000,
              delay: delay / 1000,
              stagger: 0.06,
              ease: 'power3.out',
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, itemSelector, delay, duration]);
}

// ── GSAP loading progress bar ──
export function animeProgressBar(
  el: HTMLElement,
  from: number,
  to: number,
  duration: number
) {
  return gsap.fromTo(
    el,
    { width: `${from}%` },
    {
      width: `${to}%`,
      duration: duration / 1000,
      ease: 'power3.inOut',
    }
  );
}

// ── Typing effect ──
export function useAnimeTypewriter(
  ref: React.RefObject<HTMLElement | null>,
  texts: string[],
  options: { typeSpeed?: number; deleteSpeed?: number; pauseMs?: number } = {}
) {
  const { typeSpeed = 80, deleteSpeed = 40, pauseMs = 1800 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let i = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = texts[i % texts.length];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timeout = setTimeout(tick, pauseMs);
          return;
        }
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          i++;
        }
      }

      timeout = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [ref, texts, typeSpeed, deleteSpeed, pauseMs]);
}
