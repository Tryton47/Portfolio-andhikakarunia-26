'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';

export default function InfoPanel() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectedLogoId = useLogoState((s) => s.selectedLogoId);
  const selectLogo = useLogoState((s) => s.selectLogo);

  if (!selectedLogoId) return null;

  // Find logo in all categories
  let logo = null;
  if (activeCategory) {
    logo = LOGOS_DATA[activeCategory]?.find((l) => l.id === selectedLogoId);
  } else {
    for (const catLogos of Object.values(LOGOS_DATA)) {
      const found = catLogos.find((l) => l.id === selectedLogoId);
      if (found) {
        logo = found;
        break;
      }
    }
  }

  if (!logo) return null;

  const color = logo.color || '#6366F1';

  return (
    <div
      className="absolute right-4 top-1/2 -translate-y-1/2 w-80 p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 z-50"
      style={{
        borderColor: `${color}40`,
        background: 'rgba(9, 14, 28, 0.9)',
        boxShadow: `0 20px 60px -10px rgba(0,0,0,0.9), 0 0 40px ${color}10`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{logo.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                color: color,
                background: `${color}15`,
                border: `1px solid ${color}40`,
              }}
            >
              {logo.level || 'Intermediate'}
            </span>
            {logo.years && (
              <span className="text-xs text-slate-400">{logo.years} Years</span>
            )}
          </div>
        </div>
        <button
          onClick={() => selectLogo(selectedLogoId)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-5">
        {logo.desc || 'A core technology in my stack.'}
      </p>

      {/* Key Skills */}
      {logo.tools && logo.tools.length > 0 && (
        <div className="mb-5">
          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
            Key Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {logo.tools.map((tool, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {logo.related && logo.related.length > 0 && (
        <div>
          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
            Related
          </h4>
          <div className="flex flex-wrap gap-2">
            {logo.related.map((rel, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400"
              >
                {rel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent 60%)` }}
      />
    </div>
  );
}
