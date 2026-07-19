'use client';

import { useState, useRef, useEffect } from 'react';

// ── Validation ────────────────────────────────────────────────────────────────
const validateName    = (v) => !v.trim() ? 'Your name is required' : v.trim().length < 2 ? 'At least 2 characters' : null;
const validateEmail   = (v) => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : null;
const validateMessage = (v) => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'At least 10 characters' : null;

// ── Assistant messages ────────────────────────────────────────────────────────
const getAssistantMsg = (step, name, submitted) => {
  if (submitted) return `Thanks ${name.split(' ')[0]}! 🎉 I'll get back to you within 24–48 hours.`;
  return [
    "Hey! Let's connect. What's your name?",
    `Nice to meet you, ${name || '...'} ! What's your email address?`,
    "Perfect! Now tell me — what's on your mind?",
  ][step - 1] ?? '';
};

// ── Sub-components ────────────────────────────────────────────────────────────
function AssistantBubble({ emoji, text, variant = 'default' }) {
  const colours = {
    default: { bg: 'rgba(99,102,241,0.12)', border: '#6366F1' },
    success: { bg: 'rgba(34,197,94,0.12)',  border: '#22C55E' },
  };
  const c = colours[variant];
  return (
    <div style={{ display: 'flex', gap: '10px', animation: 'scfSlideIn 0.35s ease-out' }}>
      <span style={{ fontSize: '20px', minWidth: '28px', lineHeight: '1.6' }}>{emoji}</span>
      <div style={{
        flex: 1, padding: '12px 16px', borderRadius: '10px',
        background: c.bg, borderLeft: `2px solid ${c.border}`,
        color: '#E2E8F0', fontSize: '14px', lineHeight: '1.6',
        fontFamily: 'var(--font-inter, sans-serif)',
      }}>
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'scfSlideIn 0.3s ease-out' }}>
      <div style={{
        maxWidth: '75%', padding: '10px 16px', borderRadius: '10px',
        background: 'rgba(99,102,241,0.18)', borderRight: '2px solid #818CF8',
        color: '#E2E8F0', fontSize: '14px', lineHeight: '1.6',
        fontFamily: 'var(--font-inter, sans-serif)',
      }}>
        {text}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SmartContactForm() {
  const [step,      setStep]      = useState(1);
  const [data,      setData]      = useState({ name: '', email: '', message: '' });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, submitted]);

  const clearErr = (k) => setErrors((e) => ({ ...e, [k]: null }));

  const handleNext = (s) => {
    const validators = { 1: validateName, 2: validateEmail };
    const field      = { 1: 'name',       2: 'email' };
    const err = validators[s]?.(data[field[s]]);
    if (err) { setErrors((e) => ({ ...e, [field[s]]: err })); return; }
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
    // Persist to API
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
    } catch { /* silently fail */ }
    setSending(false);
    setSubmitted(true);
    setTimeout(() => { setData({ name: '', email: '', message: '' }); setStep(1); setSubmitted(false); }, 4000);
  };

  // Shared input style
  const inputStyle = (errKey) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px',
    background: 'rgba(30, 41, 59, 0.8)',
    border: `1.5px solid ${errors[errKey] ? '#EF4444' : 'rgba(99,102,241,0.3)'}`,
    borderRadius: '8px', color: '#F1F5F9', fontSize: '14px',
    fontFamily: 'var(--font-inter, sans-serif)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  const btnBase = {
    padding: '10px 22px', borderRadius: '8px', fontWeight: 700,
    fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
    cursor: 'pointer', border: 'none', transition: 'all 0.25s',
    fontFamily: 'var(--font-jetbrains, monospace)',
  };

  const primaryBtn = { ...btnBase, background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: '#fff' };
  const ghostBtn   = { ...btnBase, background: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.25)' };

  return (
    <div>
      {/* ── Style injection ── */}
      <style>{`
        @keyframes scfSlideIn { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
        @keyframes scfSlideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scfPop     { from { opacity:0; transform:scale(0.6); }      to { opacity:1; transform:scale(1); } }
        @keyframes scfShake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        .scf-input:focus { border-color:#6366F1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
      `}</style>

      {/* ── Chat window ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxHeight: '520px', overflowY: 'auto', overflowX: 'hidden',
        padding: '20px', marginBottom: '0',
        background: 'rgba(9,10,15,0.6)',
        border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: '14px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(99,102,241,0.3) transparent',
      }}>

        {/* Greeting */}
        <AssistantBubble emoji="👋" text="Hi! I'm Andhika's assistant. Let's get you connected." />

        {/* ── STEP 1: Name ── */}
        <AssistantBubble emoji="💬" text={step === 1 ? "What's your name?" : `Got it — ${data.name}!`} />
        {step === 1 && (
          <div style={{ animation: 'scfSlideUp 0.35s ease-out' }}>
            <input
              className="scf-input"
              style={inputStyle('name')} type="text"
              placeholder="e.g. Budi Santoso"
              value={data.name}
              autoFocus
              onChange={(e) => { setData((d) => ({ ...d, name: e.target.value })); clearErr('name'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleNext(1)}
            />
            {errors.name && <p style={{ color:'#EF4444', fontSize:'12px', margin:'6px 0 0', animation:'scfShake 0.3s' }}>⚠ {errors.name}</p>}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'10px' }}>
              <button style={{ ...primaryBtn, opacity: data.name.trim() ? 1 : 0.5 }} onClick={() => handleNext(1)}>Next →</button>
            </div>
          </div>
        )}
        {step > 1 && <UserBubble text={data.name} />}

        {/* ── STEP 2: Email ── */}
        {step >= 2 && (
          <>
            <AssistantBubble emoji="📧" text={step === 2 ? `Nice, ${data.name}! What's your email address?` : `Email saved: ${data.email}`} />
            {step === 2 && (
              <div style={{ animation: 'scfSlideUp 0.35s ease-out' }}>
                <input
                  className="scf-input"
                  style={inputStyle('email')} type="email"
                  placeholder="your@email.com"
                  value={data.email}
                  autoFocus
                  onChange={(e) => { setData((d) => ({ ...d, email: e.target.value })); clearErr('email'); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext(2)}
                />
                {errors.email && <p style={{ color:'#EF4444', fontSize:'12px', margin:'6px 0 0', animation:'scfShake 0.3s' }}>⚠ {errors.email}</p>}
                <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'10px' }}>
                  <button style={ghostBtn} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...primaryBtn, opacity: data.email.trim() ? 1 : 0.5 }} onClick={() => handleNext(2)}>Next →</button>
                </div>
              </div>
            )}
            {step > 2 && <UserBubble text={data.email} />}
          </>
        )}

        {/* ── STEP 3: Message ── */}
        {step >= 3 && (
          <>
            <AssistantBubble emoji="✍️" text="What would you like to discuss? A project, opportunity, or collaboration?" />
            {step === 3 && !submitted && (
              <div style={{ animation: 'scfSlideUp 0.35s ease-out' }}>
                <textarea
                  className="scf-input"
                  style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '100px', lineHeight: '1.6' }}
                  placeholder="Tell me about your idea, project, or question..."
                  value={data.message}
                  rows={4}
                  autoFocus
                  onChange={(e) => { setData((d) => ({ ...d, message: e.target.value })); clearErr('message'); }}
                />
                {errors.message && <p style={{ color:'#EF4444', fontSize:'12px', margin:'6px 0 0', animation:'scfShake 0.3s' }}>⚠ {errors.message}</p>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'6px' }}>
                  <span style={{ color:'#475569', fontSize:'11px', fontFamily:'var(--font-jetbrains,monospace)' }}>
                    {data.message.length} chars {data.message.length < 10 ? `(${10 - data.message.length} more needed)` : '✓'}
                  </span>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <button style={ghostBtn} onClick={() => setStep(2)}>← Back</button>
                    <button
                      style={{ ...primaryBtn, opacity: (sending || data.message.trim().length < 10) ? 0.5 : 1 }}
                      onClick={handleSubmit}
                      disabled={sending || data.message.trim().length < 10}
                    >
                      {sending ? '⏳ Sending…' : 'Send 🚀'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Success ── */}
        {submitted && (
          <>
            <AssistantBubble emoji="✨" text={getAssistantMsg(3, data.name, true)} variant="success" />
            <div style={{ textAlign:'center', fontSize:'40px', animation:'scfPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>🎉</div>
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
