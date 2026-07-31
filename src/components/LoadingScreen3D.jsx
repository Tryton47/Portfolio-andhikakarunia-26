'use client';

import { useState, useEffect, useRef } from 'react';

const BOOT_LINES = [
  { text: '> SYSTEM BOOT INITIATED...', type: 'dim' },
  { text: '> Kernel modules loaded', type: 'dim' },
  { text: '> Neural interface: ONLINE ✓', type: 'accent' },
  { text: '> AUTH LAYER: Verified ✓', type: 'accent' },
  { text: '> Portfolio Core: READY ✓', type: 'accent' },
  { text: '> WELCOME — ANDHIKA KARUNIA', type: 'highlight' },
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  speed: 15 + Math.random() * 25,
  delay: Math.random() * 8,
  opacity: 0.1 + Math.random() * 0.5,
  color: i % 3 === 0 ? '99,102,241' : i % 3 === 1 ? '6,182,212' : '139,92,246',
}));

export default function LoadingScreen3D({ onDone, minDuration = 3500 }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState([]);
  const [phase, setPhase] = useState('enter'); // enter | idle | exit
  const [showName, setShowName] = useState(false);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  // Phase 1: Cinematic entrance
  useEffect(() => {
    const t1 = setTimeout(() => setShowName(true), 400);
    return () => clearTimeout(t1);
  }, []);

  // Phase 2: Terminal typewriter
  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i++];
        setLines(prev => [...prev, line]);
        setTimeout(tick, i < 3 ? 350 : 280);
      }
    };
    setTimeout(tick, 600);
  }, []);

  // Phase 3: Smooth eased progress
  useEffect(() => {
    const total = minDuration;
    const step = () => {
      const elapsed = Date.now() - startRef.current;
      const linear = Math.min(elapsed / total, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - linear, 3);
      setProgress(eased * 100);
      if (eased < 0.999) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setProgress(100);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [minDuration]);

  // Phase 4: Exit trigger
  useEffect(() => {
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(minDuration - elapsed, 0);
    const t = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => onDone?.(), 900);
    }, remaining);
    return () => clearTimeout(t);
  }, [minDuration, onDone]);

  const isExiting = phase === 'exit';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#020408',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Curtain-split exit: scale up + fade
        transform: isExiting ? 'scale(1.04)' : 'scale(1)',
        opacity: isExiting ? 0 : 1,
        transition: isExiting
          ? 'opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)'
          : 'none',
        pointerEvents: isExiting ? 'none' : 'all',
      }}
    >
      <style>{`
        @keyframes ls-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes ls-spin-cw { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes ls-spin-ccw{ from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes ls-spin-tilt{ from{transform:rotate(30deg)} to{transform:rotate(390deg)}  }
        @keyframes ls-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(0.9)} }
        @keyframes ls-glow-ring{ 0%,100%{box-shadow:0 0 18px rgba(99,102,241,0.25)} 50%{box-shadow:0 0 42px rgba(99,102,241,0.6),0 0 90px rgba(99,102,241,0.2)} }
        @keyframes ls-shimmer  { 0%{background-position:-300% center} 100%{background-position:300% center} }
        @keyframes ls-fadein   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ls-scanline { 0%{top:-8%} 100%{top:110%} }
        @keyframes ls-particle { 0%{transform:translateY(0) scale(1);opacity:var(--op)} 100%{transform:translateY(-140px) scale(0.1);opacity:0} }
        @keyframes ls-namein   { 0%{opacity:0;letter-spacing:0.8em;filter:blur(12px)} 100%{opacity:1;letter-spacing:0.35em;filter:blur(0)} }
        @keyframes ls-tagline  { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes ls-dot      { 0%,80%,100%{transform:scale(0.4);opacity:0.3} 40%{transform:scale(1.1);opacity:1} }
        @keyframes ls-bar-glow { 0%,100%{box-shadow:0 0 8px rgba(6,182,212,0.5)} 50%{box-shadow:0 0 22px rgba(6,182,212,0.9),0 0 40px rgba(99,102,241,0.4)} }
        @keyframes ls-cornerbl { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes ls-hexrotate{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ─── Starfield BG ─── */}
      <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none' }}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position:'absolute',
            left:`${p.x}%`,
            bottom:`${-p.size * 2}px`,
            width:`${p.size}px`,
            height:`${p.size}px`,
            borderRadius:'50%',
            background:`rgba(${p.color},${p.opacity})`,
            '--op': p.opacity,
            animation:`ls-particle ${p.speed}s linear ${p.delay}s infinite`,
            boxShadow:`0 0 ${p.size * 2}px rgba(${p.color},0.6)`,
          }}/>
        ))}
      </div>

      {/* ─── Grid overlay ─── */}
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)',
        backgroundSize:'48px 48px',
        pointerEvents:'none',
      }}/>

      {/* ─── Scan line ─── */}
      <div style={{
        position:'absolute',left:0,right:0,height:'2px',
        background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(6,182,212,0.6),rgba(99,102,241,0.4),transparent)',
        animation:'ls-scanline 4s linear infinite',
        pointerEvents:'none',
      }}/>

      {/* ─── Radial glow center ─── */}
      <div style={{
        position:'absolute',top:'50%',left:'50%',
        width:'700px',height:'700px',
        transform:'translate(-50%,-50%)',
        background:'radial-gradient(circle,rgba(99,102,241,0.06) 0%,rgba(6,182,212,0.03) 40%,transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* ─── Corner decorations ─── */}
      {[
        { top:20, left:20, borderTop:'1px solid', borderLeft:'1px solid' },
        { top:20, right:20, borderTop:'1px solid', borderRight:'1px solid' },
        { bottom:20, left:20, borderBottom:'1px solid', borderLeft:'1px solid' },
        { bottom:20, right:20, borderBottom:'1px solid', borderRight:'1px solid' },
      ].map((s, i) => (
        <div key={i} style={{
          position:'absolute', ...s,
          width:28, height:28,
          borderColor:'rgba(99,102,241,0.4)',
          animation:`ls-cornerbl 2s ease-in-out ${i*0.5}s infinite`,
          pointerEvents:'none',
        }}/>
      ))}

      {/* ─── MAIN CONTENT ─── */}
      <div style={{
        position:'relative',zIndex:10,
        display:'flex',flexDirection:'column',alignItems:'center',
        gap:32,maxWidth:500,width:'100%',padding:'0 28px',
      }}>

        {/* Orbital Ring System */}
        <div style={{ position:'relative',width:160,height:160,animation:'ls-float 4s ease-in-out infinite' }}>

          {/* Outer ring */}
          <div style={{
            position:'absolute',inset:0,borderRadius:'50%',
            border:'1.5px solid rgba(99,102,241,0.2)',
            animation:'ls-spin-cw 14s linear infinite',
          }}>
            <div style={{
              position:'absolute',top:-5,left:'50%',marginLeft:-5,
              width:10,height:10,borderRadius:'50%',
              background:'#6366F1',
              boxShadow:'0 0 14px 4px rgba(99,102,241,0.7)',
            }}/>
            {/* Opposite dot */}
            <div style={{
              position:'absolute',bottom:-3,left:'50%',marginLeft:-3,
              width:6,height:6,borderRadius:'50%',
              background:'rgba(99,102,241,0.4)',
              boxShadow:'0 0 8px rgba(99,102,241,0.5)',
            }}/>
          </div>

          {/* Mid ring */}
          <div style={{
            position:'absolute',inset:16,borderRadius:'50%',
            border:'1.5px solid rgba(6,182,212,0.3)',
            animation:'ls-spin-ccw 9s linear infinite',
          }}>
            <div style={{
              position:'absolute',top:-4,left:'50%',marginLeft:-4,
              width:8,height:8,borderRadius:'50%',
              background:'#06B6D4',
              boxShadow:'0 0 12px 3px rgba(6,182,212,0.8)',
            }}/>
          </div>

          {/* Inner ring (tilted feel) */}
          <div style={{
            position:'absolute',inset:30,borderRadius:'50%',
            border:'1px solid rgba(139,92,246,0.35)',
            animation:'ls-spin-tilt 6s linear infinite',
          }}>
            <div style={{
              position:'absolute',top:-3.5,left:'50%',marginLeft:-3.5,
              width:7,height:7,borderRadius:'50%',
              background:'#8B5CF6',
              boxShadow:'0 0 10px 3px rgba(139,92,246,0.9)',
            }}/>
          </div>

          {/* Innermost hex ring */}
          <div style={{
            position:'absolute',inset:46,borderRadius:'50%',
            border:'1px solid rgba(99,102,241,0.15)',
            animation:'ls-spin-ccw 4s linear infinite',
          }}/>

          {/* Core */}
          <div style={{
            position:'absolute',inset:52,borderRadius:'50%',
            background:'linear-gradient(135deg,#1E1B4B 0%,#0F172A 100%)',
            border:'1px solid rgba(99,102,241,0.4)',
            display:'flex',alignItems:'center',justifyContent:'center',
            animation:'ls-glow-ring 2.8s ease-in-out infinite',
          }}>
            <div style={{
              width:22,height:22,
              background:'linear-gradient(135deg,#6366F1 0%,#06B6D4 100%)',
              borderRadius:5,
              transform:'rotate(45deg)',
              animation:'ls-pulse 2.2s ease-in-out infinite',
            }}/>
          </div>
        </div>

        {/* Name + Tagline */}
        <div style={{ textAlign:'center',display:'flex',flexDirection:'column',gap:10 }}>
          <div style={{
            fontFamily:'system-ui,-apple-system,monospace',
            fontSize:11,letterSpacing:'0.45em',
            color:'#06B6D4',textTransform:'uppercase',
            opacity:showName ? 0.85 : 0,
            transition:'opacity 0.6s 0.3s ease-out',
          }}>
            ⬡ SECURE CONNECTION ESTABLISHED ⬡
          </div>

          <h1 style={{
            fontFamily:'system-ui,-apple-system,sans-serif',
            fontSize:'clamp(30px,7vw,52px)',
            fontWeight:900,
            margin:0,
            textTransform:'uppercase',
            background:'linear-gradient(135deg,#FFFFFF 0%,#C7D2FE 30%,#60A5FA 60%,#FFFFFF 100%)',
            backgroundSize:'300% auto',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            animation: showName
              ? 'ls-namein 1s cubic-bezier(0.22,1,0.36,1) both, ls-shimmer 4s linear 1s infinite'
              : 'none',
          }}>
            ANDHIKA
          </h1>

          <div style={{
            fontFamily:'system-ui,-apple-system,sans-serif',
            fontSize:11,letterSpacing:'0.3em',color:'#64748B',
            animation: showName ? 'ls-tagline 0.8s 0.9s ease-out both' : 'none',
          }}>
            PORTFOLIO 2026 · FULL STACK DEVELOPER
          </div>
        </div>

        {/* Terminal */}
        <div style={{
          width:'100%',
          background:'rgba(2,4,10,0.85)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:12,padding:'14px 16px',
          minHeight:120,
          fontFamily:'monospace',
          backdropFilter:'blur(24px)',
          boxShadow:'0 0 0 1px rgba(99,102,241,0.08),inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* Window chrome */}
          <div style={{display:'flex',gap:6,marginBottom:10,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            {['rgba(239,68,68,0.55)','rgba(245,158,11,0.55)','rgba(34,197,94,0.55)'].map((c,i)=>(
              <div key={i} style={{width:8,height:8,borderRadius:'50%',background:c}}/>
            ))}
            <span style={{marginLeft:'auto',fontSize:9,color:'rgba(99,102,241,0.5)',letterSpacing:'0.1em'}}>BOOT_LOG.sys</span>
          </div>
          {lines.map((line, i) => (
            <div key={i} style={{
              fontSize:11,lineHeight:1.9,
              color: line.type==='highlight' ? '#818CF8' : line.type==='accent' ? '#34D399' : '#475569',
              animation:'ls-fadein 0.3s ease-out both',
            }}>
              {line.text}
            </div>
          ))}
          {lines.length < BOOT_LINES.length && (
            <span style={{
              display:'inline-block',
              width:8,height:14,verticalAlign:'middle',marginTop:2,
              background:'rgba(99,102,241,0.8)',
              animation:'ls-pulse 0.75s ease-in-out infinite',
            }}/>
          )}
        </div>

        {/* Progress */}
        <div style={{width:'100%'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontFamily:'monospace',fontSize:10}}>
            <span style={{color:'#6366F1',letterSpacing:'0.15em',animation:'ls-pulse 2s ease-in-out infinite'}}>
              {progress < 100 ? 'INITIALIZING PORTFOLIO...' : 'LAUNCH READY ✓'}
            </span>
            <span style={{color:'#06B6D4',fontWeight:700}}>{Math.round(progress)}%</span>
          </div>
          <div style={{position:'relative',width:'100%',height:4,background:'rgba(255,255,255,0.05)',borderRadius:4,overflow:'hidden'}}>
            <div style={{
              height:'100%',
              width:`${progress}%`,
              background:'linear-gradient(90deg,#4F46E5,#6366F1,#06B6D4)',
              borderRadius:4,
              transition:'width 0.15s ease-out',
              animation:'ls-bar-glow 1.5s ease-in-out infinite',
            }}/>
            {/* Shimmer sweep on bar */}
            <div style={{
              position:'absolute',top:0,left:0,right:0,bottom:0,
              background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)',
              backgroundSize:'200% 100%',
              animation:'ls-shimmer 1.5s linear infinite',
            }}/>
          </div>
        </div>

        {/* Animated dots */}
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {[['#6366F1',0],['#06B6D4',0.2],['#8B5CF6',0.4]].map(([color,delay],i)=>(
            <div key={i} style={{
              width:7,height:7,borderRadius:'50%',
              background:color,
              boxShadow:`0 0 8px ${color}`,
              animation:`ls-dot 1.3s ease-in-out ${delay}s infinite`,
            }}/>
          ))}
        </div>
      </div>

      {/* Edge vignettes */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:140,background:'linear-gradient(to bottom,rgba(2,4,8,0.9),transparent)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:140,background:'linear-gradient(to top,rgba(2,4,8,0.9),transparent)',pointerEvents:'none'}}/>
    </div>
  );
}
