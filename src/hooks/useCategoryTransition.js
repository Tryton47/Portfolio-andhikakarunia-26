import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * Provides smooth fly-out → fly-in transition when activeCategory changes.
 * @param {[number,number,number]} targetPosition - Final 3D position [x, y, z]
 * @param {string} categoryKey - The active category string (triggers transition on change)
 * @param {number} delay - Stagger delay in seconds (per logo index)
 * @returns {{ liveRef, isEntering }}
 */
export function useCategoryTransition(targetPosition, categoryKey, delay = 0) {
  const liveRef    = useRef([...targetPosition]);
  const tweenProxy = useRef({ x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] });
  const [isEntering, setIsEntering] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip fly-out on first mount — just enter from slightly below
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const proxy = tweenProxy.current;
      proxy.x = targetPosition[0];
      proxy.y = targetPosition[1] - 4; // Start below
      proxy.z = targetPosition[2];
      liveRef.current = [proxy.x, proxy.y, proxy.z];

      gsap.to(proxy, {
        y: targetPosition[1],
        duration: 0.8,
        delay,
        ease: 'back.out(1.4)',
        onUpdate: () => { liveRef.current = [proxy.x, proxy.y, proxy.z]; },
        onStart: () => setIsEntering(true),
        onComplete: () => setIsEntering(false),
      });
      return;
    }

    // Category changed: fly out, then fly in
    const proxy = tweenProxy.current;
    setIsEntering(false);

    // Phase 1: fly down and out
    gsap.killTweensOf(proxy);
    gsap.to(proxy, {
      y: proxy.y - 3,
      duration: 0.22,
      ease: 'power2.in',
      onUpdate: () => { liveRef.current = [proxy.x, proxy.y, proxy.z]; },
      onComplete: () => {
        // Teleport to new target start position (above)
        proxy.x = targetPosition[0];
        proxy.z = targetPosition[2];
        proxy.y = targetPosition[1] + 4;

        // Phase 2: fly into final position
        gsap.to(proxy, {
          y: targetPosition[1],
          duration: 0.7,
          delay,
          ease: 'back.out(1.4)',
          onUpdate: () => { liveRef.current = [proxy.x, proxy.y, proxy.z]; },
          onStart: () => setIsEntering(true),
          onComplete: () => setIsEntering(false),
        });
      },
    });
  }, [categoryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { liveRef, isEntering };
}
