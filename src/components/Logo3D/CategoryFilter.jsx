'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { CATEGORY_LIST } from '../../config/categories';
import { THEME }         from '../../config/colors';
import GlassButton       from '../Shared/GlassButton';

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
            <GlassButton
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              isActive={isActive}
              activeColor={color}
              className="px-6 py-2.5 text-xs font-bold tracking-widest whitespace-nowrap"
            >
              {cat.label.toUpperCase()}
              <span className="opacity-40 text-[10px] ml-2">[{cat.key}]</span>
            </GlassButton>
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
