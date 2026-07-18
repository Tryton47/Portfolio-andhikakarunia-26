import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element when it scrolls into view using IntersectionObserver.
 * @param {number} threshold  - 0.0–1.0, how much of element must be visible
 * @param {number} rootMargin - CSS-style margin string e.g. "0px 0px -80px 0px"
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export function useScrollReveal(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Trigger only once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
