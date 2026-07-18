import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Adds drag-spin + inertia momentum to a mesh ref.
 * Drag fast and release → mesh keeps spinning, gradually decelerating.
 */
export function useDragMomentum(meshRef) {
  const velocity   = useRef(0);
  const isDragging = useRef(false);
  const lastX      = useRef(0);

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    e.stopPropagation();
    e.target.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current || !meshRef.current) return;
    const deltaX = e.clientX - lastX.current;
    velocity.current = deltaX * 0.018;
    lastX.current = e.clientX;
    meshRef.current.rotation.y += velocity.current;
  }, [meshRef]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Per-frame: apply friction when not dragging
  useFrame(() => {
    if (!isDragging.current && Math.abs(velocity.current) > 0.0005) {
      velocity.current *= 0.93; // Friction coefficient — reduce for faster stop
      if (meshRef.current) meshRef.current.rotation.y += velocity.current;
    }
  });

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging,
  };
}
