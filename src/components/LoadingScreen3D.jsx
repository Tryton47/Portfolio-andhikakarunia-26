'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── ANIMATED LOGO ───────────────────────────────────────────────────────────
function AnimatedLogo() {
  const groupRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();

    // Slow rotation
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

    // Glow pulse
    const glowScale = 1 + Math.sin(t * 2) * 0.15;
    glowRef.current.scale.setScalar(glowScale);
  });

  return (
    <group ref={groupRef}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Core */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#0F172A"
          emissive="#8B5CF6"
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 32, 100]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.02, 32, 80]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function Particles({ count = 80 }) {
  const pointsRef = useRef();
  const positions = useRef(
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 15)
  ).current;

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef} positions={positions} stride={3}>
      <pointsMaterial size={0.04} color="#06B6D4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ─── LOADING BAR ──────────────────────────────────────────────────────────────
function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      targetProgress.current += Math.random() * 15 + 5;
      if (targetProgress.current > 100) targetProgress.current = 100;
    }, 150);

    const animate = () => {
      setProgress(prev => {
        const diff = targetProgress.current - prev;
        if (diff < 0.5) return targetProgress.current;
        return prev + diff * 0.1;
      });
      requestAnimationFrame(animate);
    };
    const animId = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px',
    }}>
      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '3px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
          borderRadius: '2px',
          transition: 'width 0.15s ease-out',
          boxShadow: '0 0 10px #06B6D4',
        }} />
      </div>

      {/* Progress text */}
      <div style={{
        textAlign: 'center',
        marginTop: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        color: '#94A3B8',
        letterSpacing: '0.1em',
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ─── MAIN 3D LOADING SCREEN ─────────────────────────────────────────────────
export default function LoadingScreen3D({ onDone, minDuration = 3000 }) {
  const [loading, setLoading] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const checkDone = () => {
      const elapsed = Date.now() - startTime.current;
      if (elapsed >= minDuration) {
        setLoading(false);
        onDone?.();
      } else {
        setTimeout(checkDone, 50);
      }
    };

    const initialDelay = setTimeout(checkDone, 100);
    return () => clearTimeout(initialDelay);
  }, [minDuration, onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(145deg, #0F172A 0%, #02040A 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#8B5CF6" />
        <pointLight position={[0, 0, 10]} intensity={0.3} color="#06B6D4" />

        {/* Scene */}
        <AnimatedLogo />
        <Particles />
      </Canvas>

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: '#F8FAFC',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          Andhika Portfolio
        </h1>
        <p style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '11px',
          color: '#64748B',
          marginTop: '8px',
          letterSpacing: '0.1em',
        }}>
          Initializing experience
        </p>
      </div>

      {/* Loading bar */}
      <LoadingBar />

      {/* Top gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '150px',
        background: 'linear-gradient(to bottom, #0F172A, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        background: 'linear-gradient(to top, #02040A, transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
