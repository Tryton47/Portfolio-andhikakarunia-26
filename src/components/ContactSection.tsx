'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Link2, Globe, Video, User, ImagePlus } from 'lucide-react';
import ScrollReveal from '@/components/Shared/ScrollReveal';

/* ─── CONTACT & COMMENTS SECTION ─── */
export default function ContactSection() {
  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Comment state
  const [comments, setComments] = useState<
    { name: string; message: string; avatar?: string; date: string }[]
  >([]);
  const [commentForm, setCommentForm] = useState({ name: '', message: '' });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved comments from API on mount
  useEffect(() => {
    fetch('/api/comments')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, []);

  /* ── Contact form validation ── */
  const validateContact = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Nama wajib diisi';
    if (!formData.email.trim()) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Format email tidak valid';
    if (!formData.message.trim()) errs.message = 'Pesan wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact()) return;
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  /* ── Comment submission ── */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;

    const newComment = {
      name: commentForm.name,
      message: commentForm.message,
      avatar: avatarPreview || undefined,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    // Optimistic update
    setComments((prev) => [newComment, ...prev]);
    setCommentForm({ name: '', message: '' });
    setAvatarPreview(null);

    // Persist to API
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newComment.name,
          email: 'visitor@portfolio.com',
          message: newComment.message,
        }),
      });
    } catch {
      // silently fail for now
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Max file size is 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 bg-obsidian"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={700}>
          <div className="text-center mb-14">
            <h2 className="text-heading text-3xl md:text-4xl text-text-primary mb-3">
              Get In <span style={{ color: 'var(--theme-primary-hex)' }}>Touch</span>
            </h2>
            <p className="text-system text-text-dim">
              Open for opportunities & collaboration
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ═══ LEFT: Contact Form ═══ */}
          <ScrollReveal variant="slide-left" duration={850} delay={100} className="w-full lg:w-1/2 flex flex-col gap-8">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full bg-charcoal border rounded-lg p-3.5 text-sm text-text-primary focus:outline-none transition-colors ${
                    errors.name ? 'border-primary' : 'border-border focus:border-primary/50'
                  }`}
                  placeholder="Nama Anda"
                />
                {errors.name && (
                  <span className="text-primary text-xs">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full bg-charcoal border rounded-lg p-3.5 text-sm text-text-primary focus:outline-none transition-colors ${
                    errors.email ? 'border-primary' : 'border-border focus:border-primary/50'
                  }`}
                  placeholder="Email Anda"
                />
                {errors.email && (
                  <span className="text-primary text-xs">{errors.email}</span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  className={`w-full bg-charcoal border rounded-lg p-3.5 text-sm text-text-primary focus:outline-none transition-colors resize-none ${
                    errors.message ? 'border-primary' : 'border-border focus:border-primary/50'
                  }`}
                  placeholder="Tulis pesan Anda disini..."
                />
                {errors.message && (
                  <span className="text-primary text-xs">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-white text-system rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, var(--theme-grad1), var(--theme-grad2))`, boxShadow: '0 0 20px rgba(var(--theme-primary), 0.25)' }}
              >
                <Send size={14} /> Kirim Pesan
              </button>

              {submitStatus === 'success' && (
                <p className="text-secondary text-xs text-center">
                  ✓ Pesan berhasil terkirim!
                </p>
              )}
            </form>

            {/* Social Links */}
            <div>
              <h3 className="text-system text-text-dim mb-4">Connect With Me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://www.linkedin.com/in/andhika-karunia-545166292"
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel border border-border rounded-lg p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
                >
                  <Link2 size={18} className="text-text-dim group-hover:text-primary transition-colors" />
                  <span className="text-text-muted text-xs group-hover:text-text-primary transition-colors">
                    LinkedIn
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/andhka_rzq"
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel border border-border rounded-lg p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
                >
                  <Globe size={18} className="text-text-dim group-hover:text-primary transition-colors" />
                  <span className="text-text-muted text-xs group-hover:text-text-primary transition-colors">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* ═══ RIGHT: Live Comment Board ═══ */}
          <ScrollReveal variant="slide-right" duration={850} delay={150} className="w-full lg:w-1/2">
            <div className="glass-panel border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border bg-charcoal flex items-center justify-between">
                <h3 className="text-system text-text-primary text-[11px]">
                  Live Comment Board
                </h3>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary pulse-neon" />
                  <span className="text-system text-secondary text-[10px]">Live</span>
                </span>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="p-4 border-b border-border flex flex-col gap-3">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border border-border bg-charcoal flex items-center justify-center shrink-0 overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={14} className="text-text-dim" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    className="flex-grow bg-charcoal border border-border rounded-lg p-2.5 text-xs text-text-primary focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex gap-3">
                  <textarea
                    rows={2}
                    placeholder="Write a comment..."
                    value={commentForm.message}
                    onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                    className="flex-grow bg-charcoal border border-border rounded-lg p-2.5 text-xs text-text-primary focus:outline-none focus:border-primary/50 resize-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-primary text-white rounded-lg text-system hover:bg-primary/90 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Comment Feed */}
              <div className="max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {comments.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-text-dim text-xs">No comments yet. Be the first!</p>
                  </div>
                ) : (
                  comments.map((c, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 border-b border-border last:border-b-0 hover:bg-charcoal/50 transition-colors"
                      style={{
                        animation: i === 0 ? 'fadeInUp 0.5s ease-out' : undefined,
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {c.avatar ? (
                          <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={14} className="text-text-dim" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary text-xs font-bold">{c.name}</span>
                          <span className="text-text-dim text-[10px]">{c.date}</span>
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed">{c.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
