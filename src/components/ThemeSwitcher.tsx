'use client';

import { useState } from 'react';
import { useTheme, THEMES, type ThemeName } from '@/context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 md:right-5 top-20 md:top-[72px] z-[200]">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle theme switcher"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-border)] backdrop-blur-md shadow-lg hover:border-[var(--theme-primary-hex)] transition-all duration-300 group"
        style={{ boxShadow: `0 0 16px rgba(${theme.vars.primary}, 0.15)` }}
      >
        {/* Gradient circle preview */}
        <span
          className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${theme.vars.grad1}, ${theme.vars.grad2})`,
            boxShadow: `0 0 8px rgba(${theme.vars.primary}, 0.5)`,
          }}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 top-12 w-48 rounded-xl border border-[var(--color-border)] overflow-hidden shadow-2xl origin-top-right"
          style={{ 
            background: 'rgba(9, 10, 15, 0.92)', 
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#64748B]">
              Accent Theme
            </p>
          </div>

          {/* Theme options */}
          <div className="p-2 flex flex-col gap-1">
            {THEMES.map((t) => {
              const isActive = t.name === theme.name;
              return (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name as ThemeName); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-left group"
                  style={{
                    background: isActive
                      ? `rgba(${t.vars.primary}, 0.12)`
                      : 'transparent',
                    border: isActive
                      ? `1px solid rgba(${t.vars.primary}, 0.3)`
                      : '1px solid transparent',
                  }}
                >
                  {/* Color dot */}
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${t.vars.grad1}, ${t.vars.grad2})`,
                      boxShadow: isActive ? `0 0 10px rgba(${t.vars.primary}, 0.6)` : 'none',
                    }}
                  />
                  {/* Label */}
                  <span
                    className="text-xs font-mono tracking-wide transition-colors duration-200"
                    style={{ color: isActive ? t.vars.primaryHex : '#94A3B8' }}
                  >
                    {t.label}
                  </span>
                  {/* Active checkmark */}
                  {isActive && (
                    <span
                      className="ml-auto text-[10px]"
                      style={{ color: t.vars.primaryHex }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-[var(--color-border)]">
            <p className="text-[9px] tracking-widest uppercase font-mono text-[#475569] text-center">
              Preference Saved
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
