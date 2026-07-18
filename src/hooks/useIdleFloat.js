import { useFrame } from '@react-three/fiber';

/**
 * Adds a gentle continuous floating bobbing animation to a mesh.
 * Each logo can have a different phase so they don't all move in sync.
 * @param {React.RefObject} meshRef
 * @param {{ amplitude, speed, phase, paused }} options
 */
export function useIdleFloat(meshRef, {
  amplitude = 0.06,
  speed     = 1.3,
  phase     = 0,
  paused    = false,
} = {}) {
  useFrame(({ clock }) => {
    if (paused || !meshRef.current) return;
    const t = clock.getElapsedTime();
    // Additive bobbing — doesn't fight with transition system
    meshRef.current.position.y += Math.sin(t * speed + phase) * 0.0008 * (amplitude * 10);
  });
}
