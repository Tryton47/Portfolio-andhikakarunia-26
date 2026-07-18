'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { CATEGORY_LIST } from '../../config/categories';
import { THEME }         from '../../config/colors';

export default function CategoryFilter() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const isAutoPlay     = useLogoState((s) => s.isAutoPlay);
  const setCategory    = useLogoState((s) => s.setCategory);
  const toggleAutoPlay = useLogoState((s) => s.toggleAutoPlay);

  return (
    <div className="flex flex-col items-center gap-4 mb-5">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORY_LIST.map((cat) => {
          const color    = THEME.categories[cat.id]?.accent || '#06B6D4';
          const glow     = THEME.categories[cat.id]?.glow   || 'rgba(6,182,212,0.3)';
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border"
              style={{
                borderColor: isActive ? color           : 'rgba(148,163,184,0.2)',
                background:  isActive ? `${color}22`   : 'transparent',
                color:       isActive ? color           : THEME.base.textMuted,
                boxShadow:   isActive ? `0 0 22px ${glow}` : 'none',
                transform:   isActive ? 'scale(1.07)'  : 'scale(1)',
              }}
            >
              {cat.label}
              <span className="opacity-40 text-xs ml-2 font-mono">[{cat.key}]</span>
            </button>
          );
        })}
      </div>

      {/* AutoPlay Toggle */}
      <button
        onClick={toggleAutoPlay}
        className="flex items-center gap-2 text-xs font-mono tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300"
        style={{
          borderColor: isAutoPlay ? THEME.categories[activeCategory]?.accent : 'rgba(148,163,184,0.15)',
          color:       isAutoPlay ? THEME.categories[activeCategory]?.accent : THEME.base.textMuted,
          background:  isAutoPlay ? `${THEME.categories[activeCategory]?.accent}12` : 'transparent',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full transition-all"
          style={{
            backgroundColor: isAutoPlay ? THEME.categories[activeCategory]?.accent : '#64748b',
            boxShadow:       isAutoPlay ? `0 0 6px ${THEME.categories[activeCategory]?.accent}` : 'none',
          }}
        />
        {isAutoPlay ? 'AUTO-ROTATE · ON' : 'AUTO-ROTATE · OFF'}
      </button>
    </div>
  );
}
