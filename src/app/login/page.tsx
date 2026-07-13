'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'andhika47') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-brand-dark">
      
      <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold font-sans text-white">
            Admin Login
          </h1>
          <p className="text-gray-400 text-sm mt-2">Enter credentials to access dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <label className="font-sans text-sm font-medium text-gray-400">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-brand-dark border rounded-lg p-3 font-sans text-sm text-white focus:outline-none transition-colors ${error ? 'border-brand-red text-brand-red' : 'border-brand-border focus:border-brand-red'}`} 
              placeholder="Enter password" 
              autoFocus
            />
            {error && <span className="absolute -bottom-5 left-0 text-brand-red text-xs">Invalid credentials</span>}
          </div>
          
          <button type="submit" className="mt-4 w-full bg-brand-red text-white font-bold font-sans text-sm py-3 rounded-lg hover:bg-red-600 transition-colors">
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-500 hover:text-white font-sans text-xs transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </main>
  );
}
