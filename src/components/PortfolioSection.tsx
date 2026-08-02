'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, ChevronDown, ChevronUp, Award, Download, Maximize2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/gsap';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useScrollReveal }     from '../hooks/useScrollReveal';
import { useStaggerReveal } from '../hooks/useGSAPReveal';
import ScrollReveal from './Shared/ScrollReveal';
import GlassButton from './Shared/GlassButton';
import { useTheme } from '@/context/ThemeContext';
import { ProximityGlow } from './InteractiveEffects';

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
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 2,
    title: 'E-Commerce Recommendation Engine',
    desc: 'Full-stack ML-powered recommendation system trained on 240K+ products. Hybrid algorithm with 0.35s inference time.',
    features: ['Hybrid ML Algorithm', '240K+ Product Dataset', 'Real-time Inference', 'REST API Backend'],
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'scikit-learn'],
    category: 'Data Analysis',
    link: 'https://e-commerce-recommendation-engine.vercel.app/',
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 3,
    title: 'Sales Marketing Web',
    desc: 'Full-stack sales and marketing web application for Alpha Marketing with database-connected backend.',
    features: ['CRUD Operations', 'Database Integration', 'Responsive Design', 'Admin Dashboard'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    category: 'Web Dev',
    link: 'https://sales-marketing-web-u5e1.vercel.app/',
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 4,
    title: 'Event Ease',
    desc: 'Event management platform for seamless planning and ticketing.',
    features: ['Ticket Booking', 'Event Dashboard', 'Payment Gateway'],
    tech: ['React', 'Next.js', 'Node.js'],
    category: 'Web Dev',
    link: 'https://event-ease-mauve.vercel.app/',
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 5,
    title: 'Organik Pandanrejo',
    desc: 'E-commerce and information portal for organic village products.',
    features: ['Product Catalog', 'Article CMS', 'Shopping Cart'],
    tech: ['Next.js', 'Tailwind', 'Prisma'],
    category: 'Web Dev',
    link: 'https://organik-pandanrejo.vercel.app/',
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 6,
    title: 'Hoaks Detector',
    desc: 'AI-based news verification tool to detect hoaxes in real-time.',
    features: ['NLP Algorithm', 'Real-time Analysis', 'News Scraping'],
    tech: ['Python', 'Flask', 'React'],
    category: 'Data Analysis',
    link: 'https://hoaks-detector.vercel.app/',
    github: 'https://github.com/JustFarzz',
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
    isMaintenance: false,
  },
  {
    id: 8,
    title: 'SINEDEK Short Movie',
    desc: 'Cinematic short film production and post-production editing.',
    features: ['Cinematography', 'Color Grading', 'Sound Design', 'Post-Production'],
    tech: ['Premiere Pro', 'DaVinci Resolve'],
    category: 'Video Editing',
    link: '',
    github: 'https://github.com/JustFarzz',
  },
  {
    id: 9,
    title: 'DPM 25 Promotional Design',
    desc: 'Desain visual & materi promosi untuk kegiatan Dewan Perwakilan Mahasiswa (DPM 25).',
    features: ['Poster Design', 'Visual Identity', 'Social Media Kit', 'Event Branding'],
    tech: ['Photoshop', 'Canva', 'Illustrator'],
    category: 'Graphic Design',
    imageUrl: '/showcase/graphic-design/DPM_25.jpeg',
    link: '/showcase/graphic-design/DPM_25.jpeg',
    github: '',
  },
  {
    id: 10,
    title: 'KKN 4 Pandanrejo Branding',
    desc: 'Desain identitas visual & publikasi program kerja KKN 4 di Desa Pandanrejo.',
    features: ['Branding', 'Banner Design', 'Village Program Kit', 'Documentation'],
    tech: ['Photoshop', 'Canva', 'Figma'],
    category: 'Graphic Design',
    imageUrl: '/showcase/graphic-design/KKN_4_Pandan_rejo.jpeg',
    link: '/showcase/graphic-design/KKN_4_Pandan_rejo.jpeg',
    github: '',
  },
  {
    id: 11,
    title: 'Portfolio Excel & Data Analytics',
    desc: 'Kumpulan analisis data, pivot table, formula kompleks, dan dashboard Excel.',
    features: ['Excel Dashboards', 'Pivot Tables', 'Advanced Formulas', 'VLOOKUP & Index Match'],
    tech: ['Microsoft Excel', 'Data Cleaning', 'Data Visualization'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/PORTO_EXCEL_ANDHIKA.pdf',
    github: '',
  },
  {
    id: 12,
    title: 'Portfolio Data Analyst Batch 6',
    desc: 'Portofolio lengkap dan komprehensif program intensif Data Analyst Batch 6.',
    features: ['Python Analysis', 'SQL Queries', 'Power BI Dashboard', 'Business Insights'],
    tech: ['Python', 'SQL', 'Power BI', 'Excel'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/Portofolio_Data_Analyst_Batch_6.pdf',
    github: '',
  },
  {
    id: 13,
    title: 'Data Analysis Task 7 (Workbook)',
    desc: 'Workbook pengolahan dan analisis data lanjutan menggunakan Microsoft Excel.',
    features: ['Statistical Modeling', 'Excel Formulas', 'Data Preparation'],
    tech: ['Excel', 'Statistics'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/Data_2_DT1_Andhika_Karunia_TUGAS_7.xlsx',
    github: '',
  },
  {
    id: 14,
    title: 'UAS Data Visualization Study',
    desc: 'Laporan akhir & hasil studi visualisasi data interaktif.',
    features: ['Data Storytelling', 'Chart Customization', 'Visual Analytics'],
    tech: ['Tableau', 'Excel', 'Data Viz'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/UAS_Data_Visualization_ANDHIKA_KARUNIA_093.docx',
    github: '',
  },
  {
    id: 15,
    title: 'Tugas 5 Data Cleaning & Analysis',
    desc: 'Laporan analisis dan pembersihan dataset raw.',
    features: ['Data Scrubbing', 'Outlier Detection', 'Data Wrangling'],
    tech: ['Python', 'Excel', 'Data Cleaning'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/TUGAS_5_Andhika_Karunia_Rizqi_093.docx',
    github: '',
  },
  {
    id: 16,
    title: 'Tugas 7 Advanced Data Analytics',
    desc: 'Laporan interpretasi data & analisis statistik lanjutan.',
    features: ['Hypothesis Testing', 'Trend Analysis', 'Statistical Insights'],
    tech: ['Statistics', 'Excel', 'Python'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/TUGAS_7_Andhika_Karunia_Rizqi_Setyawan.docx',
    github: '',
  },
  {
    id: 17,
    title: 'Tugas 8 Data Insights & Reporting',
    desc: 'Laporan temuan bisnis & rekomendasi berbasis data.',
    features: ['Business Intelligence', 'Executive Reporting', 'Strategic Recommendations'],
    tech: ['Data Analytics', 'Reporting', 'Excel'],
    category: 'Data Analysis',
    link: '/showcase/porto-data/TUGAS_8_ANDHIKA_KARUNIA_RIZQI_093.docx',
    github: '',
  },
];

// ─── SHOWCASE GRAPHIC DESIGN ───
const showcaseGraphicDesign = [
  {
    id: 'gd-1',
    title: 'DPM FTI 25',
    desc: 'Mengelola sosial media DPM (TikTok & Instagram). Desain banner, feeds, poster perayaan, editing video acara, twibon, frame acara, editing video konten, foto struktural, dan berbagai desain media sosial lainnya.',
    services: [
      '📱 Manajemen Sosmed TikTok & Instagram',
      '🎨 Desain Banner & Feeds',
      '📋 Desain Poster & Perayaan',
      '🎬 Editing Video Konten & Acara',
      '🖼️ Twibon & Frame Acara',
      '📸 Foto Struktural',
    ],
    images: [
      '/showcase/dpm-fti/01-sosmed-dpm.png',
      '/showcase/dpm-fti/02-banner-poster.png',
    ],
    icon: '🎨',
    year: '2025',
  },
  {
    id: 'gd-2',
    title: 'KKN 4 Pandanrejo',
    desc: 'Mengelola sosial media KKN (TikTok & Instagram). Desain banner, lanyard, ID card, feeds, poster perayaan, editing video acara, twibon, frame acara, editing video konten, foto struktural, dan berbagai desain media sosial lainnya.',
    services: [
      '📱 Manajemen Sosmed TikTok & Instagram',
      '🎨 Desain Banner, Lanyard & ID Card',
      '📋 Desain Feeds & Poster',
      '🎬 Editing Video Konten & Acara',
      '🖼️ Twibon & Frame Acara',
      '📸 Foto Struktural & Dokumentasi',
    ],
    images: [
      '/showcase/kkn-pandanrejo/01-banner-feeds.png',
      '/showcase/kkn-pandanrejo/02-poster-acara.png',
      '/showcase/kkn-pandanrejo/03-twibon-twit.png',
      '/showcase/kkn-pandanrejo/04-video-konten.png',
    ],
    icon: '🌿',
    year: '2024',
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
            <div className="w-full h-full min-h-[250px] rounded-lg border border-border bg-obsidian flex items-center justify-center overflow-hidden">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-contain" />
              ) : (
                <span className="text-system text-text-dim">{project.title} — Preview</span>
              )}
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
  const [rootTab, setRootTab] = useState<'projects' | 'certificates' | 'showcase' | 'techstack'>('projects');
  const [subFilter, setSubFilter] = useState('Web Dev');
  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [selectedCert, setSelectedCert] = useState<(typeof certificates)[0] | null>(null);

  // Showcase Gallery State
  const [selectedGallery, setSelectedGallery] = useState<typeof showcaseGraphicDesign[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ─── Keyboard Shortcuts (D/F/C/V = category, Space = autoplay) ───
  // Only active when the techstack tab is open to avoid conflicting with other tabs
  useKeyboardShortcuts({
    onShowHelp: () => setRootTab('techstack'),
  });

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // ─── Scroll Reveal for section entrance ───
  const { ref: scrollRevealRef, isVisible: isSectionVisible } = useScrollReveal({ threshold: 0.1 });

  // ─── GSAP: section header + tabs entrance ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: tabsRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ─── GSAP Stagger Reveals for Project and Certificate Cards ───
  useStaggerReveal('.project-grid-container', '.project-card-reveal', {
    y: 50,
    stagger: 0.1,
    duration: 0.8,
  });

  useStaggerReveal('.cert-grid-container', '.cert-card-reveal', {
    y: 40,
    stagger: 0.1,
    duration: 0.8,
  });

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
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="portfolio"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 overflow-hidden"
      style={{ background: '#0F172A' }}
    >

      {/* Ambient Background */}
      {AmbientBg}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12" style={{ opacity: 0 }}>
          <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
            Portfolio <span style={{ color: 'var(--theme-primary-hex)' }}>Showcase</span>
          </h2>
          <p className="text-system text-text-dim">
            Explore my journey across disciplines
          </p>
        </div>

        {/* Root Tabs */}
        <div ref={tabsRef} className="flex justify-center flex-wrap gap-4 mb-10 p-2" style={{ opacity: 0 }}>
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
            <div key={subFilter} className="project-grid-container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project) => (
                  <div key={project.id} className="project-card-reveal" style={{ opacity: 0 }}>
                    <ProximityGlow radius={180} className="group h-full">
                      <div
                        className="glass-panel border border-border rounded-xl overflow-hidden group-hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col"
                        style={{ transform: 'translateZ(0)' }}
                      >
                        {/* Card Image Area */}
                        <div className={`w-full ${project.category === 'Graphic Design' ? 'h-80 md:h-[420px]' : 'h-56'} bg-obsidian flex items-center justify-center relative overflow-hidden group/img`}>
                          {project.imageUrl ? (
                            <>
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/20 z-[1]" />
                              {/* Category Tag */}
                              <span className="absolute top-3 left-3 z-[3] text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-obsidian/80 backdrop-blur-md text-primary border border-primary/30 shadow-lg">
                                {project.category.toUpperCase()}
                              </span>
                            </>
                          ) : (
                            <span className="text-system text-text-dim">{project.category}</span>
                          )}

                          {/* Maintenance Overlay */}
                          {project.isMaintenance && (
                            <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center backdrop-blur-sm z-10">
                              <span className="text-system text-primary border border-primary px-3 py-1 rounded bg-obsidian/80">
                                Maintenance
                              </span>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-wrap items-center justify-center gap-2 p-3 z-20">
                            {project.link?.startsWith('http') && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1 shadow-lg shadow-primary/30"
                              >
                                <ExternalLink size={12} /> Live Web
                              </a>
                            )}
                            {project.link?.startsWith('/showcase') && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1 shadow-lg shadow-primary/30"
                              >
                                <ExternalLink size={12} /> View File
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-obsidian/90 text-text-primary border border-border hover:border-primary/50 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                              >
                                <Code2 size={12} /> GitHub
                              </a>
                            )}
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="px-3 py-1.5 border border-primary/40 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-all"
                            >
                              Details ↗
                            </button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-text-primary text-sm font-bold mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
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
                    </ProximityGlow>
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
          <div className="cert-grid-container flex flex-col gap-4 max-w-4xl mx-auto w-full">
            {certificates.map((cert) => (
              <ProximityGlow key={cert.title} radius={200}>
                <div 
                  className="cert-card-reveal group cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                  style={{ opacity: 0 }}
                >
                  {/* Horizontal Card */}
                  <div
                    className="relative flex overflow-hidden rounded-2xl border border-border hover:border-primary/40 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(17,20,34,0.95) 0%, rgba(9,10,15,0.98) 100%)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* LEFT: PDF thumbnail (slightly cropped/visible) */}
                    <div
                      className="relative flex-shrink-0 overflow-hidden"
                      style={{
                        width: cert.orientation === 'landscape' ? '160px' : '110px',
                        minHeight: '100px',
                      }}
                    >
                      {cert.file ? (
                        <iframe
                          src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                          className="absolute inset-0 border-0 pointer-events-none"
                          title={cert.title}
                          style={{
                            width: cert.orientation === 'landscape' ? '340px' : '220px',
                            height: cert.orientation === 'landscape' ? '240px' : '310px',
                            transformOrigin: 'top left',
                            transform: cert.orientation === 'landscape'
                              ? 'scale(0.47)'
                              : 'scale(0.50)',
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-card">
                          <Award size={32} className="text-primary/30" />
                        </div>
                      )}

                      {/* Left edge accent line */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{
                          background: cert.orientation === 'landscape'
                            ? 'linear-gradient(180deg, #06B6D4, #8B5CF6)'
                            : 'linear-gradient(180deg, #EC4899, #F59E0B)',
                        }}
                      />
                    </div>

                    {/* MIDDLE: Gradient fade overlay */}
                    <div
                      className="absolute flex-shrink-0"
                      style={{
                        left: cert.orientation === 'landscape' ? '130px' : '84px',
                        top: 0,
                        bottom: 0,
                        width: '80px',
                        background: 'linear-gradient(90deg, rgba(9,10,15,0) 0%, rgba(9,10,15,0.92) 60%, rgba(9,10,15,1) 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />

                    {/* RIGHT: Info */}
                    <div className="flex flex-col justify-center gap-1.5 px-5 py-4 flex-1 min-w-0 z-10">
                      {/* Badges row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(99,102,241,0.15)',
                            color: '#818CF8',
                            border: '1px solid rgba(99,102,241,0.25)',
                          }}
                        >
                          {cert.issuer}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(6,182,212,0.1)',
                            color: '#06B6D4',
                            border: '1px solid rgba(6,182,212,0.2)',
                          }}
                        >
                          {cert.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-text-primary font-bold text-sm md:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {cert.title}
                      </h3>

                      {/* Description */}
                      <p className="text-text-dim text-xs leading-relaxed line-clamp-2 max-w-lg">
                        {cert.desc}
                      </p>

                      {/* View hint */}
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className="text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5"
                          style={{ color: '#818CF8' }}
                        >
                          <Maximize2 size={11} /> Lihat Sertifikat
                        </span>
                      </div>
                    </div>

                    {/* Hover glow overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                      style={{
                        background: 'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.06), transparent 70%)',
                      }}
                    />
                  </div>
                </div>
              </ProximityGlow>
            ))}
          </div>
        )}

        {/* ═══ SHOWCASE TAB ═══ */}
        {rootTab === 'showcase' && (
          <div className="animate-[fadeIn_0.4s_ease-out]">
            {/* Showcase Intro */}
            <div className="text-center mb-12">
              <h3 className="text-text-primary text-xl md:text-2xl font-bold mb-2">
                Project & Dokumentasi
              </h3>
              <p className="text-text-dim text-sm">
                Koleksi lengkap karya graphic design dan dokumentasi project
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {showcaseGraphicDesign.map((project, idx) => (
                <ProximityGlow key={project.id} radius={200}>
                  <motion.div
                    onClick={() => {
                      setSelectedGallery(project);
                      setCurrentImageIndex(0);
                    }}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Main Image Preview */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

                      {/* Image Count Badge */}
                      <div className="absolute top-4 right-4 bg-obsidian/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-border">
                        <span className="text-primary font-semibold text-sm">{project.images.length}</span>
                        <span className="text-text-dim text-xs">foto</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-obsidian/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-primary/30">
                          <span className="text-primary font-semibold flex items-center gap-2">
                            <Maximize2 size={18} /> Lihat Gallery
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{project.icon}</span>
                          <div>
                            <h3 className="text-white text-lg font-bold">{project.title}</h3>
                            <span className="text-white/50 text-xs">{project.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.services.slice(0, 3).map((service, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">
                            {service}
                          </span>
                        ))}
                        {project.services.length > 3 && (
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/60">
                            +{project.services.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </ProximityGlow>
              ))}
            </div>
          </div>
        )}


        {/* ═══ TECH STACK TAB ═══ */}
        {rootTab === 'techstack' && (
          <div className="relative w-full h-[85vh]" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f172a 50%, #1e293b 100%)' }}>
            {/* Blue tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-indigo-900/20 pointer-events-none" />

            {/* Category filter */}
            <div className="absolute top-6 left-0 right-0 z-20 flex justify-center">
              <CategoryFilter />
            </div>

            {/* 3D Canvas */}
            <Logo3DCanvas />
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

      {/* ═══ GALLERY SLIDESHOW MODAL ═══ */}
      {selectedGallery && (
        <div
          className="fixed inset-0 z-[200] bg-obsidian/98 backdrop-blur-xl flex flex-col"
          onClick={() => setSelectedGallery(null)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selectedGallery.icon}</span>
              <div>
                <h2 className="text-white text-xl font-bold">{selectedGallery.title}</h2>
                <p className="text-white/50 text-sm">{selectedGallery.year}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedGallery(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 flex flex-col lg:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Slideshow Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8 bg-black/30">
              {/* Main Image */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-full"
              >
                <img
                  src={selectedGallery.images[currentImageIndex]}
                  alt={`${selectedGallery.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] lg:max-h-[75vh] object-contain rounded-xl shadow-2xl"
                  style={{ maxHeight: '75vh' }}
                />
              </motion.div>

              {/* Navigation Arrows */}
              {selectedGallery.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === selectedGallery.images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image Counter */}
              {selectedGallery.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center gap-2">
                  {selectedGallery.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-primary w-6'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border/50 overflow-y-auto">
              {/* Description */}
              <div className="p-6 border-b border-border/50">
                <h3 className="text-white font-semibold mb-3">Deskripsi</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {selectedGallery.desc}
                </p>
              </div>

              {/* Services List */}
              <div className="p-6">
                <h3 className="text-white font-semibold mb-4">Layanan & Jasa</h3>
                <ul className="space-y-3">
                  {selectedGallery.services.map((service, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">✦</span>
                      <span className="text-white/70 text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thumbnail Strip */}
              {selectedGallery.images.length > 1 && (
                <div className="p-4 border-t border-border/50">
                  <p className="text-white/50 text-xs mb-3">Gallery Preview</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedGallery.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-primary scale-105'
                            : 'border-transparent hover:border-white/30'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
