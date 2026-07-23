'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, ChevronDown, ChevronUp, Award, Download, Maximize2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useScrollReveal }     from '../hooks/useScrollReveal';
import ScrollReveal from './Shared/ScrollReveal';
import GlassButton from './Shared/GlassButton';
import { useTheme } from '@/context/ThemeContext';

// ─── Dynamic imports to avoid SSR issues with Three.js canvas ───
const Logo3DCanvas = dynamic(() => import('./Logo3D/Logo3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center border border-white/5 rounded-2xl bg-[#0F172A]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-text-dim text-xs font-mono tracking-widest">LOADING 3D ENGINE...</span>
      </div>
    </div>
  ),
});

const CategoryFilter = dynamic(() => import('./Logo3D/CategoryFilter'), { ssr: false });
const InfoPanel      = dynamic(() => import('./Logo3D/InfoPanel'),       { ssr: false });
const KeyboardHelper = dynamic(() => import('./Logo3D/KeyboardHelper'),  { ssr: false });


/* ─── DATA ─── */
const projects = [
  {
    id: 1,
    title: 'Cinevix Works',
    desc: 'Cinematic production and creative works portfolio.',
    features: ['Responsive UI', 'Media Showcase', 'Modern Aesthetic'],
    tech: ['React', 'Next.js', 'Tailwind'],
    category: 'Web Dev',
    link: 'https://cinevix-works.vercel.app/',
    github: '',
  },
  {
    id: 2,
    title: 'E-Commerce Recommendation Engine',
    desc: 'Full-stack ML-powered recommendation system trained on 240K+ products. Hybrid algorithm with 0.35s inference time.',
    features: ['Hybrid ML Algorithm', '240K+ Product Dataset', 'Real-time Inference', 'REST API Backend'],
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'scikit-learn'],
    category: 'Data Analysis',
    link: 'https://e-commerce-recommendation-engine.vercel.app/',
    github: '',
  },
  {
    id: 3,
    title: 'Sales Marketing Web',
    desc: 'Full-stack sales and marketing web application for Alpha Marketing with database-connected backend.',
    features: ['CRUD Operations', 'Database Integration', 'Responsive Design', 'Admin Dashboard'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    category: 'Web Dev',
    link: 'https://sales-marketing-web-u5e1.vercel.app/',
    github: '',
  },
  {
    id: 4,
    title: 'Event Ease',
    desc: 'Event management platform for seamless planning and ticketing.',
    features: ['Ticket Booking', 'Event Dashboard', 'Payment Gateway'],
    tech: ['React', 'Next.js', 'Node.js'],
    category: 'Web Dev',
    link: 'https://event-ease-mauve.vercel.app/',
    github: '',
  },
  {
    id: 5,
    title: 'Organik Pandanrejo',
    desc: 'E-commerce and information portal for organic village products.',
    features: ['Product Catalog', 'Article CMS', 'Shopping Cart'],
    tech: ['Next.js', 'Tailwind', 'Prisma'],
    category: 'Web Dev',
    link: 'https://organik-pandanrejo.vercel.app/',
    github: '',
  },
  {
    id: 6,
    title: 'Hoaks Detector',
    desc: 'AI-based news verification tool to detect hoaxes in real-time.',
    features: ['NLP Algorithm', 'Real-time Analysis', 'News Scraping'],
    tech: ['Python', 'Flask', 'React'],
    category: 'Data Analysis',
    link: 'https://hoaks-detector.vercel.app/',
    github: '',
  },
  {
    id: 7,
    title: 'Wargaverse',
    desc: 'Collaborative full-stack project for community management.',
    features: ['Team Collaboration', 'MVC Architecture', 'Community System', 'User Management'],
    tech: ['Laravel', 'Blade', 'PHP'],
    category: 'Web Dev',
    link: '',
    github: 'https://github.com/JustFarzz/wargaverse',
    isMaintenance: true,
  },
  {
    id: 8,
    title: 'SINEDEK Short Movie',
    desc: 'Cinematic short film production and post-production editing.',
    features: ['Cinematography', 'Color Grading', 'Sound Design', 'Post-Production'],
    tech: ['Premiere Pro', 'DaVinci Resolve'],
    category: 'Video Editing',
    link: '',
    github: '',
    isMaintenance: true,
  },
];

  // orientation: 'landscape' (tidur) | 'portrait' (berdiri)
const certificates = [
  { title: 'Google Data Analytics Certificate',   issuer: 'Google / Coursera',      date: '2023', file: '/E-Sertif/Coursera_Data_Analyst.pdf',  orientation: 'landscape', desc: 'Program sertifikasi resmi Google Data Analytics yang mencakup pembersihan, analisis, dan visualisasi data menggunakan SQL, R, dan Tableau.' },
  { title: 'Data Analyst Batch 6',                issuer: 'Karirnex',               date: '2023', file: '/E-Sertif/Karirnex_Data_Analyst.pdf', orientation: 'landscape', desc: 'Program intensif penguasaan analisis data end-to-end: Python, SQL, Power BI, dan machine learning dasar.' },
  { title: 'Microsoft Excel Expert — Batch 8',    issuer: 'Karirnex',               date: '2023', file: '/E-Sertif/Excel_Batch_8.pdf',          orientation: 'landscape', desc: 'Sertifikasi keahlian Microsoft Excel tingkat mahir mencakup pivot, VLOOKUP, macro, dan dashboard interaktif.' },
  { title: 'Rekomendasi Keahlian Excel',           issuer: 'Karirnex',               date: '2023', file: '/E-Sertif/Karirnex_Excel.pdf',         orientation: 'landscape', desc: 'Surat rekomendasi resmi yang menyatakan keahlian Excel tingkat lanjut, diakui oleh Karirnex untuk keperluan profesional.' },
  { title: 'Generative AI with Diffusion Models', issuer: 'NVIDIA',                  date: '2024', file: '/E-Sertif/NVIDIA_Sertif.pdf',          orientation: 'landscape', desc: 'Sertifikasi pemahaman dan implementasi Generative AI menggunakan model difusi dari NVIDIA Deep Learning Institute.' },
  { title: 'AI Fundamentals',                      issuer: 'NVIDIA',                  date: '2024', file: '/E-Sertif/NVIDIA_Sertif_2.pdf',        orientation: 'landscape', desc: 'Pengenalan konsep-konsep fundamental kecerdasan buatan dan machine learning dari NVIDIA.' },
  { title: 'Huawei ICT Competition Certificate',   issuer: 'Huawei',                  date: '2024', file: '/E-Sertif/Huawei_Sertif.pdf',          orientation: 'portrait',  desc: 'Sertifikat partisipasi kompetisi Huawei ICT, mencakup jaringan, cloud, dan AI.' },
  { title: 'Data Scientist Bootcamp',              issuer: 'KT&G Career Prep',        date: '2023', file: '/E-Sertif/KTG_Data_Science.pdf',       orientation: 'portrait',  desc: 'Program intensif persiapan karir Data Scientist mencakup Python, statistik, machine learning, dan storytelling data.' },
  { title: 'Graphic Designer Bootcamp',            issuer: 'KT&G Career Prep',        date: '2023', file: '/E-Sertif/KTG_Graphic_Designer.pdf',   orientation: 'portrait',  desc: 'Pelatihan desain grafis profesional mencakup prinsip desain, Canva, Adobe, dan branding visual.' },
  { title: 'Digital Marketing Bootcamp',           issuer: 'KT&G Career Prep',        date: '2023', file: '/E-Sertif/KTG_Digital_Marketing.pdf',  orientation: 'portrait',  desc: 'Pelatihan pemasaran digital meliputi SEO, social media marketing, content strategy, dan Google Ads.' },
  { title: 'Personal Branding Bootcamp',           issuer: 'KT&G Career Prep',        date: '2023', file: '/E-Sertif/KTG_Personal_Branding.pdf',  orientation: 'portrait',  desc: 'Pengembangan personal brand yang kuat di LinkedIn dan platform profesional lainnya.' },
  { title: 'Career Preparation Certificate',       issuer: 'KT&G Career Prep',        date: '2023', file: '/E-Sertif/KTG_Career_Prep.pdf',        orientation: 'portrait',  desc: 'Sertifikat kelulusan program persiapan karier komprehensif KT&G meliputi CV, interview, dan soft skills.' },
  { title: 'IT Fundamental Bootcamp',              issuer: 'SmartPath',               date: '2024', file: '/E-Sertif/SmartPath_IT.pdf',           orientation: 'portrait',  desc: 'Penguasaan dasar-dasar IT: jaringan komputer, sistem operasi, cloud computing, dan keamanan siber.' },
  { title: 'Ngangsu Kawruh MH',                    issuer: 'Mahkamah Hukum (MH)',     date: '2023', file: '/E-Sertif/Ngangsu_MH.pdf',             orientation: 'landscape', desc: 'Sertifikat apresiasi sebagai peserta aktif dalam seminar hukum kemahasiswaan Ngangsu Kawruh.' },
  { title: 'Panitia Kegiatan FTI',                 issuer: 'Universitas UNMER Malang', date: '2023', file: '/E-Sertif/Panitia_FTI.pdf',            orientation: 'portrait',  desc: 'Penghargaan atas dedikasi dan kontribusi sebagai panitia dalam kegiatan kemahasiswaan Fakultas Teknologi Industri.' },
  { title: 'Sertifikat Prestasi',                  issuer: 'Institusi Pendidikan',    date: '2023', file: '/E-Sertif/Certificate_Andhika.pdf',    orientation: 'landscape', desc: 'Sertifikat penghargaan atas prestasi akademis dan non-akademis yang dicapai selama masa studi.' },
  { title: 'Sertifikat Partisipasi',               issuer: 'Institusi Pendidikan',    date: '2024', file: '/E-Sertif/Certificate_Andhika_2.pdf',  orientation: 'landscape', desc: 'Sertifikat apresiasi atas partisipasi aktif dalam kegiatan akademis dan kemahasiswaan.' },
];

const techStack = [
  { name: 'JavaScript', cat: 'Web' },
  { name: 'TypeScript', cat: 'Web' },
  { name: 'React', cat: 'Web' },
  { name: 'Next.js', cat: 'Web' },
  { name: 'Node.js', cat: 'Web' },
  { name: 'PHP', cat: 'Web' },
  { name: 'Laravel', cat: 'Web' },
  { name: 'Tailwind CSS', cat: 'Web' },
  { name: 'Python', cat: 'Data' },
  { name: 'SQL', cat: 'Data' },
  { name: 'Pandas', cat: 'Data' },
  { name: 'Scikit-learn', cat: 'Data' },
  { name: 'Power BI', cat: 'Data' },
  { name: 'Looker Studio', cat: 'Data' },
  { name: 'Figma', cat: 'Design' },
  { name: 'Canva', cat: 'Design' },
  { name: 'Premiere Pro', cat: 'Video' },
  { name: 'DaVinci Resolve', cat: 'Video' },
  { name: 'CapCut', cat: 'Video' },
  { name: 'MySQL', cat: 'Data' },
  { name: 'PostgreSQL', cat: 'Data' },
  { name: 'Prisma', cat: 'Web' },
  { name: 'Git', cat: 'Web' },
  { name: 'FastAPI', cat: 'Data' },
];

const subCategories = ['Web Dev', 'Data Analysis', 'Graphic Design', 'Video Editing'];

/* ─── AMBIENT CANVAS: Matrix ─── */
function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pRGB = theme.vars.primary.split(' ').join(', ');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/=;:';

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 11, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(${pRGB}, 0.12)`;
      ctx.font = '12px JetBrains Mono, monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── AMBIENT CANVAS: Data Analyst (Charts + Scatter) ─── */
function DataAnalystCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pRGB = theme.vars.primary.split(' ').join(', ');
    const sRGB = theme.vars.secondary.split(' ').join(', ');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    // Static bar chart data
    const bars = [0.4, 0.7, 0.55, 0.85, 0.6, 0.9, 0.5, 0.75, 0.65, 0.8];
    // Scatter points
    const scatter = Array.from({ length: 40 }, () => ({
      x: Math.random() * W * 0.6 + W * 0.3,
      y: Math.random() * H * 0.8 + H * 0.1,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));
    // Line chart data
    const lineData = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.9, 0.75, 0.85, 0.7, 0.95];

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Grid lines ──
      ctx.strokeStyle = `rgba(${sRGB}, 0.04)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = H * (i / 7);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Bar chart (left side) ──
      const barW = 16;
      const barGap = 10;
      const barBaseY = H * 0.95;
      bars.forEach((v, i) => {
        const x = 20 + i * (barW + barGap);
        const barH = v * H * 0.55;
        // Bar fill with gradient
        const grad = ctx.createLinearGradient(x, barBaseY - barH, x, barBaseY);
        grad.addColorStop(0, `rgba(${sRGB}, ${0.3 + Math.sin(t * 0.02 + i) * 0.1})`);
        grad.addColorStop(1, `rgba(${sRGB}, 0.03)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, barBaseY - barH, barW, barH);
        // Top highlight
        ctx.fillStyle = `rgba(${sRGB}, ${0.6 + Math.sin(t * 0.02 + i) * 0.2})`;
        ctx.fillRect(x, barBaseY - barH, barW, 2);
      });

      // ── Animated line chart (top right area) ──
      const lineStartX = W * 0.45;
      const lineEndX = W * 0.98;
      const lineBaseY = H * 0.85;
      ctx.beginPath();
      lineData.forEach((v, i) => {
        const x = lineStartX + (i / (lineData.length - 1)) * (lineEndX - lineStartX);
        const y = lineBaseY - v * H * 0.5 + Math.sin(t * 0.03 + i * 0.5) * 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = `rgba(${pRGB}, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Fill under line
      ctx.lineTo(lineEndX, lineBaseY);
      ctx.lineTo(lineStartX, lineBaseY);
      ctx.closePath();
      const lineGrad = ctx.createLinearGradient(0, lineBaseY - H * 0.5, 0, lineBaseY);
      lineGrad.addColorStop(0, `rgba(${pRGB}, 0.1)`);
      lineGrad.addColorStop(1, `rgba(${pRGB}, 0)`);
      ctx.fillStyle = lineGrad;
      ctx.fill();

      // ── Scatter dots (right area) ──
      scatter.forEach((p) => {
        const pulse = Math.sin(t * 0.04 + p.pulse);
        const alpha = 0.15 + pulse * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + pulse * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sRGB}, ${alpha})`;
        ctx.fill();
      });

      // ── Floating metric labels ──
      ctx.font = '9px JetBrains Mono, monospace';
      const metrics = ['AVG: 72.4%', 'R²: 0.94', 'n=1,240', 'σ: 3.2'];
      metrics.forEach((m, i) => {
        ctx.fillStyle = `rgba(${sRGB}, ${0.2 + Math.sin(t * 0.02 + i) * 0.05})`;
        ctx.fillText(m, W * 0.5 + i * 70, H * 0.15 + Math.sin(t * 0.01 + i) * 4);
      });

      t++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── AMBIENT CANVAS: Video Editing (Film Strip + Waveform) ─── */
function VideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pRGB = theme.vars.primary.split(' ').join(', ');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Timeline track (horizontal bar) ──
      const trackY = H * 0.75;
      const trackH = 28;
      ctx.fillStyle = `rgba(${pRGB}, 0.05)`;
      ctx.fillRect(0, trackY, W, trackH);
      ctx.strokeStyle = `rgba(${pRGB}, 0.15)`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(0, trackY, W, trackH);

      // ── Film frames on timeline ──
      const frameW = 40;
      const numFrames = Math.ceil(W / frameW) + 1;
      const offset = (t * 0.8) % frameW;
      for (let i = -1; i < numFrames; i++) {
        const fx = i * frameW - offset;
        ctx.strokeStyle = `rgba(${pRGB}, 0.25)`;
        ctx.strokeRect(fx, trackY + 2, frameW - 2, trackH - 4);
        // Film perfs top/bottom
        for (let p = 0; p < 3; p++) {
          ctx.fillStyle = `rgba(${pRGB}, 0.15)`;
          ctx.fillRect(fx + 4 + p * 11, trackY + 4, 7, 4);
          ctx.fillRect(fx + 4 + p * 11, trackY + trackH - 8, 7, 4);
        }
      }

      // ── Playhead ──
      const playX = W * 0.4 + Math.sin(t * 0.02) * 20;
      ctx.strokeStyle = `rgba(${pRGB}, 0.8)`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(playX, trackY - 12); ctx.lineTo(playX, trackY + trackH + 12); ctx.stroke();
      ctx.fillStyle = `rgba(${pRGB}, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(playX - 6, trackY - 12);
      ctx.lineTo(playX + 6, trackY - 12);
      ctx.lineTo(playX, trackY - 4);
      ctx.fill();

      // ── Audio waveform ──
      const waveY = H * 0.90;
      ctx.strokeStyle = `rgba(${pRGB}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const amp = (Math.sin(x * 0.05 + t * 0.06) * 0.6 +
          Math.sin(x * 0.13 + t * 0.04) * 0.3 +
          Math.sin(x * 0.03 - t * 0.05) * 0.1) * 18;
        if (x === 0) ctx.moveTo(x, waveY + amp);
        else ctx.lineTo(x, waveY + amp);
      }
      ctx.stroke();

      // ── Floating time codes ──
      ctx.font = '9px JetBrains Mono, monospace';
      const times = ['00:00:12:14', '00:00:24:08', '00:01:03:22'];
      times.forEach((tc, i) => {
        ctx.fillStyle = `rgba(${pRGB}, ${0.15 + Math.sin(t * 0.02 + i) * 0.05})`;
        ctx.fillText(tc, (W / 4) * i + 20, H * 0.3 + Math.sin(t * 0.015 + i) * 5);
      });

      // ── Lens flares / light streaks ──
      for (let i = 0; i < 3; i++) {
        const lx = (W * (i + 1)) / 4 + Math.sin(t * 0.01 + i * 2) * 30;
        const ly = H * 0.2 + Math.cos(t * 0.012 + i) * 20;
        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 30);
        grad.addColorStop(0, `rgba(255, 200, 100, ${0.06 + Math.sin(t * 0.02 + i) * 0.03})`);
        grad.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(lx, ly, 30, 0, Math.PI * 2); ctx.fill();
      }

      t++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── AMBIENT CANVAS: Bezier Curves ─── */
function BezierCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pRGB = theme.vars.primary.split(' ').join(', ');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let t = 0;
    let animId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(11, 11, 15, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 3; i++) {
        const offset = i * 120 + t;
        ctx.beginPath();
        ctx.moveTo(
          (Math.sin(offset * 0.01) * 0.5 + 0.5) * canvas.width,
          (Math.cos(offset * 0.013) * 0.5 + 0.5) * canvas.height
        );
        ctx.bezierCurveTo(
          (Math.sin(offset * 0.008 + 1) * 0.5 + 0.5) * canvas.width,
          (Math.cos(offset * 0.011 + 2) * 0.5 + 0.5) * canvas.height,
          (Math.sin(offset * 0.009 + 3) * 0.5 + 0.5) * canvas.width,
          (Math.cos(offset * 0.012 + 4) * 0.5 + 0.5) * canvas.height,
          (Math.sin(offset * 0.007 + 5) * 0.5 + 0.5) * canvas.width,
          (Math.cos(offset * 0.01 + 6) * 0.5 + 0.5) * canvas.height
        );
        ctx.strokeStyle = `rgba(${pRGB}, 0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      t += 0.5;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── PROJECT DETAIL MODAL ─── */
function ProjectModal({
  project,
  onClose,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian/95 backdrop-blur-md flex items-start justify-center overflow-y-auto pt-8 pb-12 px-4">
      <div className="w-full max-w-5xl glass-panel border border-border rounded-xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-charcoal">
          <button
            onClick={onClose}
            className="text-system text-primary hover:text-text-primary transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
          <span className="text-system text-text-dim">{project.category}</span>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Left: Info */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col">
            <h3 className="text-heading text-xl md:text-2xl text-text-primary mb-4">
              {project.title}
            </h3>
            <p className="text-text-body text-sm leading-relaxed mb-6">
              {project.desc}
            </p>

            {/* Features */}
            <h4 className="text-system text-secondary mb-3">Key Features</h4>
            <ul className="space-y-2 mb-8">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-text-muted text-sm">
                  <span className="text-primary mt-0.5">✦</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Tech Tags */}
            <h4 className="text-system text-secondary mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-border rounded-full text-system text-text-muted text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-primary text-white text-system rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 border border-border text-text-muted text-system rounded-md hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Code2 size={14} /> GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right: Mockup Preview */}
          <div className="w-full lg:w-1/2 bg-charcoal flex items-center justify-center p-8 min-h-[300px]">
            <div className="w-full h-full min-h-[250px] rounded-lg border border-border bg-obsidian flex items-center justify-center">
              <span className="text-system text-text-dim">{project.title} — Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CERTIFICATE DETAIL MODAL ─── */
function CertModal({
  cert,
  onClose,
}: {
  cert: (typeof certificates)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
      <div
        className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.1)',
        }}
      >
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: '1px solid rgba(99,102,241,0.15)',
            background: 'rgba(15,23,42,0.5)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.2)' }}
            >
              <Award size={16} className="text-primary" />
            </div>
            <span className="text-system text-primary text-xs">Certificate</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            style={{ color: '#94A3B8' }}
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row overflow-hidden" style={{ maxHeight: 'calc(95vh - 80px)' }}>
          {/* Left: Info */}
          <div className="w-full lg:w-1/3 p-6 lg:p-8 overflow-y-auto" style={{ borderRight: '1px solid rgba(99,102,241,0.1)' }}>
            {/* Accent line */}
            <div
              className="w-12 h-1 rounded-full mb-6"
              style={{
                background: cert.orientation === 'landscape'
                  ? 'linear-gradient(90deg, #06B6D4, #8B5CF6)'
                  : 'linear-gradient(90deg, #EC4899, #F59E0B)',
              }}
            />

            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4 leading-tight">
              {cert.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-mono"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818CF8',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {cert.issuer}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono"
                style={{
                  background: 'rgba(6,182,212,0.1)',
                  color: '#06B6D4',
                  border: '1px solid rgba(6,182,212,0.2)',
                }}
              >
                {cert.date}
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: '#94A3B8' }}>
              {cert.desc}
            </p>

            {/* Download button */}
            {cert.file && (
              <a
                href={cert.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                }}
              >
                <Download size={16} />
                Download PDF
              </a>
            )}
          </div>

          {/* Right: PDF Viewer */}
          <div className="w-full lg:w-2/3 p-6 bg-black/20 flex items-center justify-center">
            <div
              className="w-full max-w-2xl relative rounded-xl overflow-hidden"
              style={{
                aspectRatio: cert.orientation === 'portrait' ? '210/297' : '297/160',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {cert.file ? (
                <iframe
                  src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                  className="absolute inset-0 w-full h-full border-0"
                  title={cert.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#1E293B' }}>
                  <span className="text-system text-text-dim">No File Available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PORTFOLIO SECTION ─── */
export default function PortfolioSection() {
  const [rootTab, setRootTab] = useState<'projects' | 'certificates' | 'techstack'>('projects');
  const [subFilter, setSubFilter] = useState('Web Dev');
  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [selectedCert, setSelectedCert] = useState<(typeof certificates)[0] | null>(null);

  // ─── Keyboard Shortcuts (D/F/C/V = category, Space = autoplay) ───
  // Only active when the techstack tab is open to avoid conflicting with other tabs
  useKeyboardShortcuts({
    onShowHelp: () => setRootTab('techstack'),
  });

  // ─── Scroll Reveal for section entrance ───
  const { ref: sectionRef, isVisible: isSectionVisible } = useScrollReveal({ threshold: 0.1 });

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.category === subFilter);
  }, [subFilter]);

  const visibleProjects = showMore ? filteredProjects : filteredProjects.slice(0, 3);

  const AmbientBg = useMemo(() => {
    if (rootTab !== 'projects') return null;
    let CanvasComp = null;
    switch (subFilter) {
      case 'Web Dev': CanvasComp = <MatrixCanvas />; break;
      case 'Data Analysis': CanvasComp = <DataAnalystCanvas />; break;
      case 'Graphic Design': CanvasComp = <BezierCanvas />; break;
      case 'Video Editing': CanvasComp = <VideoCanvas />; break;
    }
    
    return (
      <div
        key={subFilter}
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          animation: 'fadeIn 0.8s ease-out forwards'
        }}
      >
        {CanvasComp}
      </div>
    );
  }, [rootTab, subFilter]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 overflow-hidden transition-all duration-1000"
      style={{
        background: '#0F172A',
        opacity:   isSectionVisible ? 1 : 0,
        transform: isSectionVisible ? 'translateY(0)' : 'translateY(40px)',
      }}
    >

      {/* Ambient Background */}
      {AmbientBg}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={700}>
          <div className="text-center mb-12">
            <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
              Portfolio <span style={{ color: 'var(--theme-primary-hex)' }}>Showcase</span>
            </h2>
            <p className="text-system text-text-dim">
              Explore my journey across disciplines
            </p>
          </div>
        </ScrollReveal>

        {/* Root Tabs */}
        <ScrollReveal variant="fade-up" duration={700} delay={150}>
          <div className="flex justify-center flex-wrap gap-4 mb-10 p-2">
            {(['projects', 'certificates', 'techstack'] as const).map((tab) => (
              <GlassButton
                key={tab}
                isActive={rootTab === tab}
                onClick={() => setRootTab(tab)}
                className="px-4 md:px-8 py-2 md:py-3.5 font-bold tracking-wide text-xs md:text-sm"
              >
                {tab === 'techstack' ? 'Tech Stack' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </GlassButton>
            ))}
          </div>
        </ScrollReveal>

        {/* ═══ PROJECTS TAB ═══ */}
        {rootTab === 'projects' && (
          <>
            {/* Sub-filter */}
            <div className="flex justify-center flex-wrap gap-4 mb-12 p-3">
              {subCategories.map((cat) => (
                <GlassButton
                  key={cat}
                  isActive={subFilter === cat}
                  onClick={() => { setSubFilter(cat); setShowMore(false); }}
                  className="px-3 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs font-bold tracking-widest whitespace-nowrap"
                >
                  {cat.toUpperCase()}
                </GlassButton>
              ))}
            </div>

            {/* Project Grid */}
            <div key={subFilter} className="animate-[fadeIn_0.4s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="glass-panel border border-border rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                  {/* Card Image Area */}
                  <div className="w-full h-44 bg-obsidian flex items-center justify-center relative overflow-hidden">
                    <span className="text-system text-text-dim">{project.category}</span>
                    
                    {/* Maintenance Overlay */}
                    {project.isMaintenance && (
                      <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center backdrop-blur-sm z-10">
                        <span className="text-system text-primary border border-primary px-3 py-1 rounded bg-obsidian/80">
                          Maintenance
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20">
                      {(project.link || project.github) && !project.isMaintenance && (
                        <a
                          href={project.link || project.github || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-primary text-white text-system rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> View App
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 border border-primary/40 text-primary text-system rounded-md hover:bg-primary-dim transition-colors"
                      >
                        Details ↗
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-text-primary text-sm font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2">
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-1 border border-border rounded text-text-dim"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[10px] font-mono px-2 py-1 text-text-dim">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* See More / Less */}
            {filteredProjects.length > 3 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-3 border border-border text-system text-text-muted rounded-lg hover:border-primary/30 hover:text-primary transition-colors flex items-center gap-2"
                >
                  {showMore ? (
                    <><ChevronUp size={14} /> See Less</>
                  ) : (
                    <><ChevronDown size={14} /> See More</>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* ═══ CERTIFICATES TAB ═══ */}
        {rootTab === 'certificates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {certificates.map((cert, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedCert(cert)}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                {/* Card */}
                <div
                  className="relative bg-gradient-to-br from-card to-obsidian rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
                  style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: cert.orientation === 'landscape'
                        ? 'linear-gradient(90deg, #06B6D4, #8B5CF6)'
                        : 'linear-gradient(180deg, #EC4899, #F59E0B)',
                    }}
                  />

                  {/* Content */}
                  <div className="p-5">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(99,102,241,0.15)' }}>
                      <Award size={20} className="text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="text-text-primary text-sm font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>

                    {/* Issuer & Date */}
                    <p className="text-text-dim text-xs mb-3">{cert.issuer}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-text-dim px-2 py-1 rounded bg-card">
                        {cert.date}
                      </span>
                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <Maximize2 size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1), transparent 70%)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ═══ TECH STACK TAB ═══ */}
        {rootTab === 'techstack' && (
          <div className="relative w-full h-[90vh] bg-[#010203] overflow-hidden">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#010203] via-[#020408] to-[#010305] pointer-events-none z-0" />

            {/* Category Navigation overlayed at the top */}
            <div className="absolute top-8 left-0 w-full z-30 flex flex-col items-center justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <CategoryFilter />
              </div>
            </div>

            {/* 3D Canvas Scene */}
            <div className="absolute inset-0 z-10">
              <Logo3DCanvas />
            </div>

            {/* InfoPanel positioned absolutely on the right */}
            <div className="absolute top-0 right-10 bottom-0 flex items-center pointer-events-none z-40">
              <InfoPanel />
            </div>

            {/* Keyboard Helper positioned bottom left */}
            <div className="absolute bottom-8 left-8 z-30 pointer-events-none opacity-50">
              <KeyboardHelper />
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <CertModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </section>
  );
}
