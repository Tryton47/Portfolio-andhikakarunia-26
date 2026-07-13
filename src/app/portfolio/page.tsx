'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ExternalLink, Github } from 'lucide-react';

// Project Data
const projects = [
  {
    title: "E-Commerce Recommendation Engine",
    desc: "Full-stack ML-powered recommendation system trained on 240K+ products. Hybrid algorithm with 0.35s inference time.",
    tech: ["Python", "FastAPI", "React", "TypeScript", "scikit-learn"],
    category: "Data Analysis",
    link: "https://e-commerce-recommendation-engine.vercel.app",
    github: ""
  },
  {
    title: "Sales Marketing Web",
    desc: "Full-stack sales and marketing web application for Alpha Marketing with database-connected backend.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    category: "Web Development",
    link: "",
    github: "https://github.com/Tryton47/sales-marketing-web"
  },
  {
    title: "Employee Turnover Prediction",
    desc: "Predictive analysis project applying data preprocessing, feature engineering, and classification modeling.",
    tech: ["Python", "pandas", "scikit-learn"],
    category: "Data Analysis",
    link: "",
    github: "https://github.com/Tryton47/employee-turnover-prediction"
  },
  {
    title: "Wargaverse",
    desc: "Collaborative full-stack project (3-person team) for community management.",
    tech: ["Laravel", "Blade", "PHP"],
    category: "Web Development",
    link: "",
    github: "https://github.com/JustFarzz/wargaverse"
  },
  {
    title: "UI/UX Poster Design",
    desc: "Creative poster design for marketing campaigns and community events.",
    tech: ["Figma", "Canva"],
    category: "Graphic Design",
    link: "",
    github: ""
  },
  {
    title: "SINEDEK Short Movie",
    desc: "Cinematic short film production and post-production editing.",
    tech: ["Premiere Pro", "DaVinci Resolve"],
    category: "Video Editing",
    link: "",
    github: ""
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card', 
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [filter]);

  const filteredProjects = filter === "ALL" ? projects : projects.filter(p => p.category === filter);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full pt-32 px-6 md:px-12 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-2">
            Portfolio <span className="text-brand-red">Showcase</span>
          </h1>
          <p className="text-gray-400 font-sans text-sm md:text-base">Explore my journey through projects and technical expertise.</p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 font-sans text-sm font-medium">
          {["ALL", "Web Development", "Data Analysis", "Graphic Design", "Video Editing"].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                filter === cat 
                  ? 'bg-brand-red text-white' 
                  : 'bg-brand-card border border-brand-border text-gray-400 hover:bg-brand-border hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredProjects.map((project, idx) => {
            const hasLink = project.link || project.github;
            
            return (
              <div key={idx} className="project-card bg-brand-card border border-brand-border rounded-2xl overflow-hidden flex flex-col hover:border-brand-red/50 transition-colors shadow-lg">
                
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-brand-dark flex items-center justify-center relative overflow-hidden group">
                  <span className="text-brand-border font-bold text-xl uppercase tracking-widest">{project.category}</span>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors" title="View App">
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="w-12 h-12 bg-brand-border text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors" title="View Code">
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between relative">
                  <div>
                    <h3 className="text-lg font-bold font-sans text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6 line-clamp-3">
                      {project.desc}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1 bg-brand-dark text-gray-300 rounded-lg border border-brand-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
