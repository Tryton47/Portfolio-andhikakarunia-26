'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Validation ─────────────────────────────────────────────────────────────────
const validateName    = (v) => !v.trim() ? 'Your name is required' : v.trim().length < 2 ? 'At least 2 characters' : null;
const validateEmail   = (v) => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : null;
const validateMessage = (v) => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'At least 10 characters' : null;

// ── Sub-components ──────────────────────────────────────────────────────────────
function AssistantBubble({ emoji, text, variant = 'default' }) {
  const colors = {
    default: { bg: 'rgba(99,102,241,0.12)', border: '#6366F1' },
    success: { bg: 'rgba(34,197,94,0.12)',  border: '#22C55E' },
  };
  const c = colors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
    >
      <span style={{ fontSize: '22px', minWidth: '32px', lineHeight: '1.5', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' }}>{emoji}</span>
      <div style={{
        flex: 1,
        padding: '14px 18px',
        borderRadius: '14px',
        background: c.bg,
        borderLeft: `3px solid ${c.border}`,
        color: '#E2E8F0',
        fontSize: '14px',
        lineHeight: '1.6',
        fontFamily: 'var(--font-body, sans-serif)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
      }}>
        {text}
      </div>
    </motion.div>
  );
}

function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
        borderRight: '3px solid #8B5CF6',
        color: '#F1F5F9',
        fontSize: '14px',
        lineHeight: '1.6',
        fontFamily: 'var(--font-body, sans-serif)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
      }}>
        {text}
      </div>
    </motion.div>
  );
}

function ChatInput({ value, onChange, onKeyDown, placeholder, autoFocus, type = 'text' }) {
  return (
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px 18px',
        background: 'rgba(30,41,59,0.8)',
        border: '1.5px solid rgba(99,102,241,0.3)',
        borderRadius: '12px',
        color: '#F1F5F9',
        fontSize: '14px',
        fontFamily: 'var(--font-body, sans-serif)',
        outline: 'none',
        transition: 'all 0.3s ease',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#6366F1';
        e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'rgba(99,102,241,0.3)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

function TextareaInput({ value, onChange, placeholder, rows = 4 }) {
  return (
    <motion.textarea
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px 18px',
        background: 'rgba(30,41,59,0.8)',
        border: '1.5px solid rgba(99,102,241,0.3)',
        borderRadius: '12px',
        color: '#F1F5F9',
        fontSize: '14px',
        fontFamily: 'var(--font-body, sans-serif)',
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
        lineHeight: '1.6',
        transition: 'all 0.3s ease',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#6366F1';
        e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'rgba(99,102,241,0.3)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

function Button({ children, onClick, variant = 'primary', disabled = false, loading = false }) {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-jetbrains, monospace)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: disabled || loading ? 0.5 : 1,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
    },
    ghost: {
      background: 'rgba(148,163,184,0.08)',
      color: '#94A3B8',
      border: '1px solid rgba(148,163,184,0.2)',
    },
    success: {
      background: 'linear-gradient(135deg, #22C55E, #4ADE80)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
    },
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {loading ? (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          Processing...
        </>
      ) : children}
    </motion.button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SmartContactForm() {
  const [step,      setStep]      = useState(1);
  const [data,      setData]      = useState({ name: '', email: '', message: '' });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [step, submitted, data]);

  const clearErr = (k) => setErrors((e) => ({ ...e, [k]: null }));

  const handleNext = (s) => {
    const validators = { 1: validateName, 2: validateEmail };
    const field      = { 1: 'name',       2: 'email' };
    const err = validators[s]?.(data[field[s]]);
    if (err) {
      setErrors((e) => ({ ...e, [field[s]]: err }));
      // Shake animation
      const input = document.querySelector(`[data-field="${field[s]}"]`);
      if (input) {
        input.style.animation = 'shake 0.4s ease';
        setTimeout(() => input.style.animation = '', 400);
      }
      return;
    }
    setErrors({});
    setStep(s + 1);
  };

  const handleSubmit = async () => {
    const nameErr = validateName(data.name);
    const emailErr = validateEmail(data.email);
    const msgErr  = validateMessage(data.message);
    if (nameErr || emailErr || msgErr) {
      setErrors({ name: nameErr, email: emailErr, message: msgErr });
      return;
    }
    setSending(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
    } catch { /* silently fail */ }
    setSending(false);
    setSubmitted(true);
    setTimeout(() => {
      setData({ name: '', email: '', message: '' });
      setStep(1);
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div>
      {/* Style injection */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Chat window */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '24px',
        background: 'rgba(9,10,15,0.7)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(99,102,241,0.3) transparent',
      }}>
        {/* Greeting */}
        <AssistantBubble emoji="👋" text="Hi there! I'm Andhika's digital assistant. Let's have a conversation and get you connected! ✨" />

        {/* ── STEP 1: Name ── */}
        <AssistantBubble emoji="💬" text={step === 1 ? "First things first — what's your name?" : `Nice to meet you, ${data.name.split(' ')[0]}!`} />
        {step === 1 && (
          <div data-field="name">
            <ChatInput
              value={data.name}
              onChange={(v) => { setData((d) => ({ ...d, name: v })); clearErr('name'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleNext(1)}
              placeholder="e.g. Sarah Chen"
              autoFocus
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#EF4444', fontSize: '12px', margin: '8px 0 0', fontFamily: 'var(--font-body)' }}
              >
                ⚠️ {errors.name}
              </motion.p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button onClick={() => handleNext(1)} disabled={!data.name.trim()}>
                Next <span>→</span>
              </Button>
            </div>
          </div>
        )}
        {step > 1 && <UserBubble text={data.name} />}

        {/* ── STEP 2: Email ── */}
        {step >= 2 && (
          <>
            <AssistantBubble emoji="📧" text={step === 2 ? `Great ${data.name.split(' ')[0]}! What's your email address?` : `Email confirmed: ${data.email}`} />
            {step === 2 && (
              <div data-field="email">
                <ChatInput
                  type="email"
                  value={data.email}
                  onChange={(v) => { setData((d) => ({ ...d, email: v })); clearErr('email'); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext(2)}
                  placeholder="your@email.com"
                  autoFocus
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#EF4444', fontSize: '12px', margin: '8px 0 0', fontFamily: 'var(--font-body)' }}
                  >
                    ⚠️ {errors.email}
                  </motion.p>
                )}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                  <Button onClick={() => handleNext(2)} disabled={!data.email.trim()}>
                    Next <span>→</span>
                  </Button>
                </div>
              </div>
            )}
            {step > 2 && <UserBubble text={data.email} />}
          </>
        )}

        {/* ── STEP 3: Message ── */}
        {step >= 3 && (
          <>
            <AssistantBubble emoji="✍️" text="Awesome! Now tell me — what would you like to discuss? A project idea, job opportunity, or just saying hello?" />
            {step === 3 && !submitted && (
              <div data-field="message">
                <TextareaInput
                  value={data.message}
                  onChange={(v) => { setData((d) => ({ ...d, message: v })); clearErr('message'); }}
                  placeholder="Share your thoughts, questions, or ideas..."
                  rows={4}
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#EF4444', fontSize: '12px', margin: '8px 0 0', fontFamily: 'var(--font-body)' }}
                  >
                    ⚠️ {errors.message}
                  </motion.p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ color: data.message.length >= 10 ? '#22C55E' : '#64748B', fontSize: '11px', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                    {data.message.length} chars {data.message.length >= 10 ? '✓' : `(${10 - data.message.length} more needed)`}
                  </span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                    <Button
                      variant="success"
                      onClick={handleSubmit}
                      disabled={sending || data.message.trim().length < 10}
                      loading={sending}
                    >
                      Send <span>🚀</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Success ── */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <AssistantBubble emoji="🎉" text={`Perfect! I've received your message, ${data.name.split(' ')[0]}! I'll get back to you within 24-48 hours.`} variant="success" />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '40px' }}>
              <span style={{ animation: 'confetti 1s ease forwards', animationDelay: '0s' }}>🎊</span>
              <span style={{ animation: 'confetti 1s ease forwards', animationDelay: '0.1s' }}>✨</span>
              <span style={{ animation: 'confetti 1s ease forwards', animationDelay: '0.2s' }}>🌟</span>
            </div>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', marginTop: '12px', fontFamily: 'var(--font-body)' }}>
              Your conversation will reset shortly...
            </p>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
