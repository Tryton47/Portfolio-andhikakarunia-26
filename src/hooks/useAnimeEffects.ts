import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

type CountUpOptions = {
  duration?: number;
  easing?: string;
  delay?: number;
  suffix?: string;
  decimals?: number;
};

// ── Anime.js powered count-up ──
export function useAnimeCountUp(
  target: number,
  observerRef: React.RefObject<Element | null>,
  options: CountUpOptions = {}
) {
  const {
    duration = 2000,
    easing = 'easeOutExpo',
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
          animate({
            targets: obj,
            value: target,
            duration,
            easing,
            delay,
            round: decimals === 0 ? 1 : undefined,
            update: () => {
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

// ── Anime.js 3D card tilt on mouse move ──
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

      anime({
        targets: el,
        rotateX,
        rotateY,
        translateZ: 10,
        duration: 300,
        easing: 'easeOutQuart',
        transformOrigin: '50% 50% -50px',
      });
    };

    const onLeave = () => {
      anime({
        targets: el,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        duration: 600,
        easing: 'easeOutElastic(1, 0.8)',
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

// ── Anime.js stagger grid reveal ──
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
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [30, 0],
            duration,
            delay: anime.stagger(60, { start: delay }),
            easing: 'easeOutCubic',
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, itemSelector, delay, duration]);
}

// ── Anime.js loading progress bar ──
export function animeProgressBar(
  el: HTMLElement,
  from: number,
  to: number,
  duration: number
) {
  return anime({
    targets: el,
    width: [`${from}%`, `${to}%`],
    duration,
    easing: 'easeInOutQuart',
  });
}

// ── Anime.js typing effect ──
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
