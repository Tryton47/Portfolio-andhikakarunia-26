'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { ExternalLink, Code2, X, ChevronDown, ChevronUp } from 'lucide-react';

/* ─── DATA ─── */
const projects = [
  {
    id: 1,
    title: 'E-Commerce Recommendation Engine',
    desc: 'Full-stack ML-powered recommendation system trained on 240K+ products. Hybrid algorithm with 0.35s inference time.',
    features: ['Hybrid ML Algorithm', '240K+ Product Dataset', 'Real-time Inference', 'REST API Backend'],
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'scikit-learn'],
    category: 'Data Analysis',
    link: 'https://e-commerce-recommendation-engine.vercel.app',
    github: '',
  },
  {
    id: 2,
    title: 'Sales Marketing Web',
    desc: 'Full-stack sales and marketing web application for Alpha Marketing with database-connected backend.',
    features: ['CRUD Operations', 'Database Integration', 'Responsive Design', 'Admin Dashboard'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    category: 'Web Dev',
    link: '',
    github: 'https://github.com/Tryton47/sales-marketing-web',
  },
  {
    id: 3,
    title: 'Employee Turnover Prediction',
    desc: 'Predictive analysis project applying data preprocessing, feature engineering, and classification modeling.',
    features: ['Feature Engineering', 'Classification Models', 'Data Visualization', 'Predictive Analytics'],
    tech: ['Python', 'pandas', 'scikit-learn'],
    category: 'Data Analysis',
    link: '',
    github: 'https://github.com/Tryton47/employee-turnover-prediction',
  },
  {
    id: 4,
    title: 'Wargaverse',
    desc: 'Collaborative full-stack project (3-person team) for community management.',
    features: ['Team Collaboration', 'MVC Architecture', 'Community System', 'User Management'],
    tech: ['Laravel', 'Blade', 'PHP'],
    category: 'Web Dev',
    link: '',
    github: 'https://github.com/JustFarzz/wargaverse',
  },
  {
    id: 5,
    title: 'UI/UX Poster Design',
    desc: 'Creative poster design for marketing campaigns and community events.',
    features: ['Brand Identity', 'Print Design', 'Digital Assets', 'Campaign Materials'],
    tech: ['Figma', 'Canva'],
    category: 'Graphic Design',
    link: '',
    github: '',
  },
  {
    id: 6,
    title: 'SINEDEK Short Movie',
    desc: 'Cinematic short film production and post-production editing.',
    features: ['Cinematography', 'Color Grading', 'Sound Design', 'Post-Production'],
    tech: ['Premiere Pro', 'DaVinci Resolve'],
    category: 'Video Editing',
    link: '',
    github: '',
  },
];

const certificates = [
  { title: 'Data Analytics with Python', issuer: 'DQLab', date: '2025' },
  { title: 'Belajar Dasar Pemrograman Web', issuer: 'Dicoding', date: '2024' },
  { title: 'SQL for Data Analysis', issuer: 'Coursera', date: '2025' },
  { title: 'Microsoft Office Specialist', issuer: 'Certiport', date: '2024' },
  { title: 'TOEFL ITP Score 500+', issuer: 'ETS', date: '2025' },
  { title: 'UI/UX Design Fundamentals', issuer: 'Coursera', date: '2025' },
  { title: 'Google Data Analytics', issuer: 'Google', date: '2025' },
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

/* ─── AMBIENT CANVAS: Node Network ─── */
function NodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      // Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - d / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // Dots
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.fill();
      });
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

/* ─── PORTFOLIO SECTION ─── */
export default function PortfolioSection() {
  const [rootTab, setRootTab] = useState<'projects' | 'certificates' | 'techstack'>('projects');
  const [subFilter, setSubFilter] = useState('Web Dev');
  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.category === subFilter);
  }, [subFilter]);

  const visibleProjects = showMore ? filteredProjects : filteredProjects.slice(0, 3);

  const AmbientBg = useMemo(() => {
    if (rootTab !== 'projects') return null;
    switch (subFilter) {
      case 'Web Dev': return <MatrixCanvas />;
      case 'Data Analysis': return <NodeCanvas />;
      case 'Graphic Design': return <BezierCanvas />;
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
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      {(project.link || project.github) && (
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
                className="glass-panel border border-border rounded-xl p-6 hover:border-neon-cyan/30 transition-all duration-300"
                style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-text-primary text-sm font-bold">{cert.title}</h3>
                  <span className="text-system text-neon-cyan text-[10px]">{cert.date}</span>
                </div>
                <p className="text-text-muted text-xs">{cert.issuer}</p>
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
    </section>
  );
}
