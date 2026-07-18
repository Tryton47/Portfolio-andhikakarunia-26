'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'andhika47') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-obsidian bg-grid">
      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,42,67,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-sm glass-panel border border-border rounded-xl p-8 relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-neon-red/30 bg-neon-red-dim flex items-center justify-center">
            <Lock size={24} className="text-neon-red" />
          </div>
        </div>

        <h1 className="text-heading text-lg text-text-primary text-center mb-1">
          Admin Login
        </h1>
        <p className="text-system text-text-dim text-center mb-8">
          Restricted Access
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Password */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-system text-text-dim">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-obsidian border rounded-lg p-3.5 pr-12 text-sm text-text-primary font-mono focus:outline-none transition-colors ${
                  error
                    ? 'border-neon-red text-neon-red'
                    : 'border-border focus:border-neon-red/50'
                }`}
                placeholder="Enter password"
                autoFocus
              />
              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-neon-red transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <span className="text-neon-red text-xs font-mono mt-1 animate-pulse">
                ✕ Access Denied — Invalid Credentials
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-neon-red text-white text-system rounded-lg hover:bg-[#e0243b] transition-colors shadow-[0_0_15px_rgba(255,42,67,0.3)]"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-text-dim text-system hover:text-neon-red transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={12} /> Back to Portfolio
          </a>
        </div>
      </div>
    </main>
  );
}
