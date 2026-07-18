'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'indigo' | 'rose' | 'emerald' | 'amber';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  /** hex for the dot preview */
  dot: string;
  /** CSS var values injected at :root */
  vars: {
    primary: string;      // e.g. "99 102 241"
    primaryHex: string;   // e.g. "#6366F1"
    secondary: string;    // e.g. "6 182 212"
    secondaryHex: string;
    grad1: string;        // gradient color stop 1 (hex)
    grad2: string;        // gradient color stop 2 (hex)
  };
}

export const THEMES: ThemeConfig[] = [
  {
    name: 'indigo',
    label: 'Indigo',
    dot: '#818CF8',
    vars: {
      primary: '99 102 241',
      primaryHex: '#6366F1',
      secondary: '6 182 212',
      secondaryHex: '#06B6D4',
      grad1: '#6366F1',
      grad2: '#818CF8',
    },
  },
  {
    name: 'rose',
    label: 'Rose',
    dot: '#FB7185',
    vars: {
      primary: '244 63 94',
      primaryHex: '#F43F5E',
      secondary: '251 113 133',
      secondaryHex: '#FB7185',
      grad1: '#F43F5E',
      grad2: '#FB7185',
    },
  },
  {
    name: 'emerald',
    label: 'Emerald',
    dot: '#34D399',
    vars: {
      primary: '16 185 129',
      primaryHex: '#10B981',
      secondary: '52 211 153',
      secondaryHex: '#34D399',
      grad1: '#10B981',
      grad2: '#059669',
    },
  },
  {
    name: 'amber',
    label: 'Amber',
    dot: '#FCD34D',
    vars: {
      primary: '245 158 11',
      primaryHex: '#F59E0B',
      secondary: '252 211 77',
      secondaryHex: '#FCD34D',
      grad1: '#F59E0B',
      grad2: '#D97706',
    },
  },
];

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('indigo');

  const theme = THEMES.find((t) => t.name === themeName) ?? THEMES[0];

  // Inject CSS variables into :root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.vars.primary);
    root.style.setProperty('--theme-primary-hex', theme.vars.primaryHex);
    root.style.setProperty('--theme-secondary', theme.vars.secondary);
    root.style.setProperty('--theme-secondary-hex', theme.vars.secondaryHex);
    root.style.setProperty('--theme-grad1', theme.vars.grad1);
    root.style.setProperty('--theme-grad2', theme.vars.grad2);
    // Also update the Tailwind-consumed tokens via inline
    root.style.setProperty('--color-primary', theme.vars.primaryHex);
    root.style.setProperty('--color-secondary', theme.vars.secondaryHex);
    root.style.setProperty('--color-primary-dim', `rgba(${theme.vars.primary}, 0.15)`);
    root.style.setProperty('--color-secondary-dim', `rgba(${theme.vars.secondary}, 0.15)`);
  }, [theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') as ThemeName | null;
      if (saved && THEMES.find((t) => t.name === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setThemeName(saved);
      }
    } catch {}
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeName(t);
    try { localStorage.setItem('portfolio-theme', t); } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
