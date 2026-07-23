'use client';

import { motion } from 'framer-motion';
import { Link2, Globe, Mail, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/Shared/ScrollReveal';

const SmartContactForm = dynamic(() => import('./SmartContactForm'), { ssr: false });

// Custom GitHub Icon Component
function GithubIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

// ── Social Link Component ──────────────────────────────────────────────────────
function SocialLink({ href, icon: Icon, label, description, color }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center gap-4 p-5 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(30,41,59,0.5)',
        border: '1px solid rgba(99,102,241,0.15)',
        backdropFilter: 'blur(12px)',
      }}
      whileHover={{ scale: 1.02, borderColor: `${color}50` }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}15, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-12 h-12 rounded-lg flex items-center justify-center"
        style={{
          background: `${color}20`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>

      {/* Text */}
      <div className="relative z-10 flex-grow">
        <h4 className="text-sm font-semibold text-text-primary mb-0.5">{label}</h4>
        <p className="text-xs text-text-dim">{description}</p>
      </div>

      {/* Arrow */}
      <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-8px] group-hover:translate-x-0">
        <ArrowUpRight size={18} style={{ color }} />
      </div>
    </motion.a>
  );
}

// ── Main Contact Section ───────────────────────────────────────────────────────
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full py-24 md:py-32 px-6 md:px-12"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #02040A 50%, #0F172A 100%)',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-px h-40"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.3), transparent)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-px h-40"
          style={{
            background: 'linear-gradient(0deg, transparent, rgba(6,182,212,0.3), transparent)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={700}>
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818CF8',
              }}
            >
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Let's Work <span className="text-gradient">Together</span>
            </h2>
            <p className="text-text-muted text-base max-w-lg mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT: Smart Contact Form */}
          <ScrollReveal variant="slide-right" duration={800} delay={100} className="lg:col-span-3">
            <div className="glass-panel border border-border rounded-2xl p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-1">Send a Message</h3>
                <p className="text-sm text-text-dim">Chat with me directly — it's quick and easy.</p>
              </div>
              <SmartContactForm />
            </div>
          </ScrollReveal>

          {/* RIGHT: Social Links + Info */}
          <ScrollReveal variant="slide-left" duration={800} delay={200} className="lg:col-span-2 flex flex-col gap-6">
            {/* Direct Email */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.2)' }}
              >
                <Mail size={24} className="text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Direct Email</h4>
              <a
                href="mailto:andhika@example.com"
                className="text-primary hover:text-primary/80 transition-colors text-sm font-mono"
              >
                andhika@example.com
              </a>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                Connect With Me
              </h3>
              <div className="flex flex-col gap-3">
                <SocialLink
                  href="https://www.linkedin.com/in/andhika-karunia-545166292"
                  icon={Link2}
                  label="LinkedIn"
                  description="Let's network professionally"
                  color="#0A66C2"
                />
                <SocialLink
                  href="https://github.com/yourusername"
                  icon={GithubIcon}
                  label="GitHub"
                  description="Check out my repositories"
                  color="#8B5CF6"
                />
                <SocialLink
                  href="https://www.instagram.com/andhka_rzq"
                  icon={Globe}
                  label="Instagram"
                  description="Behind the scenes & life"
                  color="#E4405F"
                />
              </div>
            </div>

            {/* Response Time */}
            <div
              className="p-5 rounded-xl"
              style={{
                background: 'rgba(6,182,212,0.05)',
                border: '1px solid rgba(6,182,212,0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: '#06B6D4' }}
                  />
                  <div
                    className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                    style={{ background: '#06B6D4', opacity: 0.5 }}
                  />
                </div>
                <p className="text-sm text-text-muted">
                  <span className="text-text-primary font-medium">Usually responds</span> within 24-48 hours
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* CSS for gradient text */}
      <style jsx>{`
        .text-gradient {
          background: linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </section>
  );
}
