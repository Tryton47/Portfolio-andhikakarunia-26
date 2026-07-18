/**
 * This script does a final pass to replace any lingering hardcoded
 * rgba(255,42,67) / rgba(0,240,255) / #e0243b patterns with
 * CSS-var based equivalents so the theme switcher works everywhere.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const patterns = [
  // rgba hardcoded red -> primary
  [/rgba\(255,\s*42,\s*67,?\s*([\d.]*)\)/g, (_, a) => `rgba(var(--theme-primary), ${a || '1'})`],
  // rgba hardcoded cyan -> secondary
  [/rgba\(0,\s*240,\s*255,?\s*([\d.]*)\)/g, (_, a) => `rgba(var(--theme-secondary), ${a || '1'})`],
  // bg-[#e0243b] -> primary/90
  [/bg-\[#e0243b\]/g, () => `bg-primary/90`],
  // shadow with red
  [/shadow-\[0_0_\d+px_rgba\(255,42,67,[0-9.]+\)\]/g, () => `shadow-[0_0_15px_rgba(var(--theme-primary),0.25)]`],
  // shadow with cyan
  [/shadow-\[0_0_\d+px_rgba\(0,240,255,[0-9.]+\)\]/g, () => `shadow-[0_0_15px_rgba(var(--theme-secondary),0.25)]`],
  // border-neon-red or border-primary: keep as-is via Tailwind tokens; they inherit --color-primary which ThemeContext updates
];

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (!['.tsx', '.ts', '.css'].some(ext => full.endsWith(ext))) continue;

    let src = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [regex, fn] of patterns) {
      const next = src.replace(regex, fn);
      if (next !== src) { src = next; changed = true; }
    }
    if (changed) {
      fs.writeFileSync(full, src, 'utf8');
      console.log('  fixed:', path.relative(__dirname, full));
    }
  }
}

walk(dir);
console.log('Done.');
