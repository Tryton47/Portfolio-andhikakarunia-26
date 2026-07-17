'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { ExternalLink, Code2, X, ChevronDown, ChevronUp } from 'lucide-react';

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

const certificates = [
  { 
    title: 'Data Analyst Capstone', 
    issuer: 'Coursera', 
    date: '2023',
    file: '/E-Sertif/Coursera_Data_Analyst.pdf',
    desc: 'Sertifikasi kompetensi analisis data Google Capstone dari Coursera.'
  },
  { 
    title: 'Data Analyst Batch 6', 
    issuer: 'Karirnex', 
    date: '2023',
    file: '/E-Sertif/Karirnex_Data_Analyst.pdf',
    desc: 'Program intensif penguasaan analisis data komprehensif.'
  },
  { 
    title: 'Sertifikat Excel Batch 8', 
    issuer: 'Karirnex', 
    date: '2023',
    file: '/E-Sertif/Excel_Batch_8.pdf',
    desc: 'Penguasaan pemrosesan data menggunakan Microsoft Excel pada tingkat mahir.'
  },
  { 
    title: 'Rekomendasi Keahlian Excel', 
    issuer: 'Karirnex', 
    date: '2023',
    file: '/E-Sertif/Karirnex_Excel.pdf',
    desc: 'Surat rekomendasi keahlian Excel yang diakui oleh Karirnex.'
  },
  { 
    title: 'AI Fundamental', 
    issuer: 'NVIDIA', 
    date: '2024',
    file: '/E-Sertif/NVIDIA_Sertif.pdf',
    desc: 'Sertifikasi pengenalan Artificial Intelligence.'
  },
  { 
    title: 'Huawei Certificate', 
    issuer: 'Huawei', 
    date: '2024',
    file: '/E-Sertif/Huawei_Sertif.pdf',
    desc: 'Sertifikasi pengembangan inovasi teknologi dari Huawei.'
  },
  { 
    title: 'Data Scientist', 
    issuer: 'KT&G Career Prep', 
    date: '2023',
    file: '/E-Sertif/KTG_Data_Science.pdf',
    desc: 'Pelatihan persiapan karir spesialisasi Data Science.'
  },
  { 
    title: 'Graphic Designer', 
    issuer: 'KT&G Career Prep', 
    date: '2023',
    file: '/E-Sertif/KTG_Graphic_Designer.pdf',
    desc: 'Pelatihan persiapan karir spesialisasi Graphic Design.'
  },
  { 
    title: 'Digital Marketing', 
    issuer: 'KT&G Career Prep', 
    date: '2023',
    file: '/E-Sertif/KTG_Digital_Marketing.pdf',
    desc: 'Pelatihan persiapan karir spesialisasi Digital Marketing.'
  },
  { 
    title: 'Personal Branding', 
    issuer: 'KT&G Career Prep', 
    date: '2023',
    file: '/E-Sertif/KTG_Personal_Branding.pdf',
    desc: 'Pengembangan personal branding yang kuat dalam platform profesional.'
  },
  { 
    title: 'Career Preparation', 
    issuer: 'KT&G Career Prep', 
    date: '2023',
    file: '/E-Sertif/KTG_Career_Prep.pdf',
    desc: 'Sertifikat kelulusan persiapan karier komprehensif.'
  },
  { 
    title: 'IT Fundamental', 
    issuer: 'SmartPath', 
    date: '2024',
    file: '/E-Sertif/SmartPath_IT.pdf',
    desc: 'Keahlian dasar IT dan pengenalan ke industri teknologi digital.'
  },
  { 
    title: 'Ngangsu Kawruh MH', 
    issuer: 'Event Organiser', 
    date: '2023',
    file: '/E-Sertif/Ngangsu_MH.pdf',
    desc: 'Sertifikat apresiasi partisipasi dalam acara kemahasiswaan atau event terkait.'
  },
  { 
    title: 'Panitia FTI', 
    issuer: 'Universitas', 
    date: '2023',
    file: '/E-Sertif/Panitia_FTI.pdf',
    desc: 'Penghargaan dedikasi dan kontribusi sebagai panitia kegiatan FTI.'
  },
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/=;:';

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 11, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 42, 67, 0.12)';
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    // Static bar chart data
    const bars = [0.4, 0.7, 0.55, 0.85, 0.6, 0.9, 0.5, 0.75, 0.65, 0.8];
    // Scatter points
    const scatter = Array.from({ length: 40 }, () => ({
      x: Math.random() * W * 0.6 + W * 0.3,
      y: Math.random() * H * 0.5 + H * 0.1,
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
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = H * (i / 7);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Bar chart (left side) ──
      const barW = 16;
      const barGap = 10;
      const barBaseY = H * 0.85;
      bars.forEach((v, i) => {
        const x = 20 + i * (barW + barGap);
        const barH = v * H * 0.55;
        // Bar fill with gradient
        const grad = ctx.createLinearGradient(x, barBaseY - barH, x, barBaseY);
        grad.addColorStop(0, `rgba(0, 240, 255, ${0.3 + Math.sin(t * 0.02 + i) * 0.1})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0.03)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, barBaseY - barH, barW, barH);
        // Top highlight
        ctx.fillStyle = `rgba(0, 240, 255, ${0.6 + Math.sin(t * 0.02 + i) * 0.2})`;
        ctx.fillRect(x, barBaseY - barH, barW, 2);
      });

      // ── Animated line chart (top right area) ──
      const lineStartX = W * 0.45;
      const lineEndX = W * 0.98;
      const lineBaseY = H * 0.7;
      ctx.beginPath();
      lineData.forEach((v, i) => {
        const x = lineStartX + (i / (lineData.length - 1)) * (lineEndX - lineStartX);
        const y = lineBaseY - v * H * 0.5 + Math.sin(t * 0.03 + i * 0.5) * 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Fill under line
      ctx.lineTo(lineEndX, lineBaseY);
      ctx.lineTo(lineStartX, lineBaseY);
      ctx.closePath();
      const lineGrad = ctx.createLinearGradient(0, lineBaseY - H * 0.5, 0, lineBaseY);
      lineGrad.addColorStop(0, 'rgba(255, 42, 67, 0.1)');
      lineGrad.addColorStop(1, 'rgba(255, 42, 67, 0)');
      ctx.fillStyle = lineGrad;
      ctx.fill();

      // ── Scatter dots (right area) ──
      scatter.forEach((p) => {
        const pulse = Math.sin(t * 0.04 + p.pulse);
        const alpha = 0.15 + pulse * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + pulse * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      });

      // ── Floating metric labels ──
      ctx.font = '9px JetBrains Mono, monospace';
      const metrics = ['AVG: 72.4%', 'R²: 0.94', 'n=1,240', 'σ: 3.2'];
      metrics.forEach((m, i) => {
        ctx.fillStyle = `rgba(0, 240, 255, ${0.2 + Math.sin(t * 0.02 + i) * 0.05})`;
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Timeline track (horizontal bar) ──
      const trackY = H * 0.55;
      const trackH = 28;
      ctx.fillStyle = 'rgba(255, 42, 67, 0.05)';
      ctx.fillRect(0, trackY, W, trackH);
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(0, trackY, W, trackH);

      // ── Film frames on timeline ──
      const frameW = 40;
      const numFrames = Math.ceil(W / frameW) + 1;
      const offset = (t * 0.8) % frameW;
      for (let i = -1; i < numFrames; i++) {
        const fx = i * frameW - offset;
        ctx.strokeStyle = 'rgba(255, 42, 67, 0.25)';
        ctx.strokeRect(fx, trackY + 2, frameW - 2, trackH - 4);
        // Film perfs top/bottom
        for (let p = 0; p < 3; p++) {
          ctx.fillStyle = 'rgba(255, 42, 67, 0.15)';
          ctx.fillRect(fx + 4 + p * 11, trackY + 4, 7, 4);
          ctx.fillRect(fx + 4 + p * 11, trackY + trackH - 8, 7, 4);
        }
      }

      // ── Playhead ──
      const playX = W * 0.4 + Math.sin(t * 0.02) * 20;
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(playX, trackY - 12); ctx.lineTo(playX, trackY + trackH + 12); ctx.stroke();
      ctx.fillStyle = 'rgba(255, 42, 67, 0.8)';
      ctx.beginPath();
      ctx.moveTo(playX - 6, trackY - 12);
      ctx.lineTo(playX + 6, trackY - 12);
      ctx.lineTo(playX, trackY - 4);
      ctx.fill();

      // ── Audio waveform ──
      const waveY = H * 0.75;
      ctx.strokeStyle = 'rgba(255, 42, 67, 0.3)';
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
        ctx.fillStyle = `rgba(255, 42, 67, ${0.15 + Math.sin(t * 0.02 + i) * 0.05})`;
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
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
        ctx.strokeStyle = `rgba(255, 42, 67, 0.08)`;
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
            className="text-system text-neon-red hover:text-text-primary transition-colors flex items-center gap-2"
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
            <h4 className="text-system text-neon-cyan mb-3">Key Features</h4>
            <ul className="space-y-2 mb-8">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-text-muted text-sm">
                  <span className="text-neon-red mt-0.5">✦</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Tech Tags */}
            <h4 className="text-system text-neon-cyan mb-3">Technologies</h4>
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
                  className="px-5 py-2 bg-neon-red text-white text-system rounded-md hover:bg-[#e0243b] transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 border border-border text-text-muted text-system rounded-md hover:border-neon-red/40 hover:text-neon-red transition-colors flex items-center gap-2"
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
    <div className="fixed inset-0 z-[200] bg-obsidian/95 backdrop-blur-md flex items-start justify-center overflow-y-auto pt-8 pb-12 px-4">
      <div className="w-full max-w-3xl glass-panel border border-border rounded-xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-charcoal">
          <button
            onClick={onClose}
            className="text-system text-neon-red hover:text-text-primary transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
          <span className="text-system text-text-dim">Certificate</span>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row">
          {/* Left: Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <h3 className="text-heading text-xl text-text-primary mb-2">
              {cert.title}
            </h3>
            <p className="text-system text-neon-cyan mb-6">{cert.issuer}</p>
            <p className="text-text-body text-sm leading-relaxed mb-6">
              {cert.desc}
            </p>
          </div>

          {/* Right: PDF Preview */}
          <div className="w-full md:w-1/2 bg-charcoal flex items-center justify-center p-4">
            <div className="w-full h-[300px] md:h-full relative rounded-lg overflow-hidden border border-border bg-obsidian flex items-center justify-center">
              {cert.file ? (
                <iframe src={`${cert.file}#toolbar=0&navpanes=0`} className="w-full h-full border-0 bg-white" />
              ) : (
                <span className="text-system text-text-dim">No File Available</span>
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

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.category === subFilter);
  }, [subFilter]);

  const visibleProjects = showMore ? filteredProjects : filteredProjects.slice(0, 3);

  const AmbientBg = useMemo(() => {
    if (rootTab !== 'projects') return null;
    switch (subFilter) {
      case 'Web Dev': return <MatrixCanvas />;
      case 'Data Analysis': return <DataAnalystCanvas />;
      case 'Graphic Design': return <BezierCanvas />;
      case 'Video Editing': return <VideoCanvas />;
      default: return null;
    }
  }, [rootTab, subFilter]);

  return (
    <section
      id="portfolio"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 bg-charcoal overflow-hidden"
    >
      {/* Ambient Background */}
      {AmbientBg}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
            Portfolio <span className="text-neon-red">Showcase</span>
          </h2>
          <p className="text-system text-text-dim">
            Explore my journey across disciplines
          </p>
        </div>

        {/* Root Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['projects', 'certificates', 'techstack'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRootTab(tab)}
              className={`px-6 py-3 rounded-lg text-system transition-all duration-300 ${
                rootTab === tab
                  ? 'bg-neon-red text-white shadow-[0_0_15px_rgba(255,42,67,0.3)]'
                  : 'border border-border text-text-muted hover:border-neon-red/30 hover:text-neon-red'
              }`}
            >
              {tab === 'techstack' ? 'Tech Stack' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ═══ PROJECTS TAB ═══ */}
        {rootTab === 'projects' && (
          <>
            {/* Sub-filter */}
            <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2">
              {subCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSubFilter(cat); setShowMore(false); }}
                  className={`px-5 py-2 rounded-full text-system whitespace-nowrap transition-all duration-300 ${
                    subFilter === cat
                      ? 'border border-neon-red text-neon-red bg-neon-red-dim'
                      : 'border border-border text-text-dim hover:border-neon-red/30 hover:text-neon-red'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="glass-panel border border-border rounded-xl overflow-hidden group hover:border-neon-red/40 transition-all duration-300"
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
                        <span className="text-system text-neon-red border border-neon-red px-3 py-1 rounded bg-obsidian/80">
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
                          className="px-4 py-2 bg-neon-red text-white text-system rounded-md hover:bg-[#e0243b] transition-colors flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> View App
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 border border-neon-red/40 text-neon-red text-system rounded-md hover:bg-neon-red-dim transition-colors"
                      >
                        Details ↗
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-text-primary text-sm font-bold mb-2 group-hover:text-neon-red transition-colors">
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

            {/* See More / Less */}
            {filteredProjects.length > 3 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-3 border border-border text-system text-text-muted rounded-lg hover:border-neon-red/30 hover:text-neon-red transition-colors flex items-center gap-2"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCert(cert)}
                className="group relative bg-obsidian/40 backdrop-blur-md border border-white/5 rounded-xl p-6 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-white/20 hover:bg-obsidian/60"
                style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both` }}
              >
                {/* Layer 1: Elegant Soft Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />

                <div className="relative z-10 flex items-start justify-between mb-4">
                  <h3 className="text-text-primary text-sm font-semibold group-hover:text-white transition-colors tracking-wide">{cert.title}</h3>
                  <span className="text-[10px] tracking-[0.2em] text-white/50 bg-white/5 px-2 py-1 rounded-sm border border-white/10 backdrop-blur-md">VERIFIED</span>
                </div>
                <p className="relative z-10 text-text-muted text-xs group-hover:text-white/80 transition-colors">{cert.issuer}</p>

                {/* Layer 2: The Document (PDF) Preview - Clean, Monochrome */}
                {cert.file && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-15 pointer-events-none transition-all duration-700 z-0 overflow-hidden scale-95 group-hover:scale-100">
                    <iframe src={`${cert.file}#view=FitH&toolbar=0&navpanes=0`} className="w-[300%] h-[300%] origin-top-left scale-[0.33] pointer-events-none grayscale" tabIndex={-1} />
                    {/* Fade overlay so the PDF doesn't look too sharp/messy */}
                    <div className="absolute inset-0 bg-obsidian/30 backdrop-blur-[2px] z-10" />
                  </div>
                )}
                
                {/* Subtle border glowing line at bottom */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white/40 group-hover:w-full transition-all duration-700 ease-out z-10" />
              </div>
            ))}
          </div>
        )}

        {/* ═══ TECH STACK TAB ═══ */}
        {rootTab === 'techstack' && (
          <div className="space-y-10">
            {['Web', 'Data', 'Design', 'Video'].map((cat) => (
              <div key={cat}>
                <h3 className="text-system text-neon-red mb-4">
                  {cat === 'Web' ? 'Web Development' : cat === 'Data' ? 'Data Analytics' : cat === 'Design' ? 'Graphic Design' : 'Video Editing'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {techStack
                    .filter((t) => t.cat === cat)
                    .map((t, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 glass-panel border border-border rounded-lg text-system text-text-muted hover:border-neon-red/40 hover:text-neon-red transition-colors"
                        style={{
                          animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
                        }}
                      >
                        {t.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
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
