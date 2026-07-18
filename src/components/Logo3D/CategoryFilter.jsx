'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { CATEGORY_LIST } from '../../config/categories';
import { THEME } from '../../config/colors';

export default function CategoryFilter() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const isAutoPlay     = useLogoState((s) => s.isAutoPlay);
  const setCategory    = useLogoState((s) => s.setCategory);
  const toggleAutoPlay = useLogoState((s) => s.toggleAutoPlay);
  
  const color = THEME.categories[activeCategory]?.accent || '#06B6D4';

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORY_LIST.map((cat) => {
          const catColor = THEME.categories[cat.id]?.accent || '#06B6D4';
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="relative px-5 py-2 rounded-full text-sm font-mono tracking-widest transition-all duration-300"
              style={{
                background: isActive ? catColor : 'transparent',
                color: isActive ? '#0F172A' : catColor,
                border: `1px solid ${catColor}`,
                boxShadow: isActive ? `0 0 20px ${catColor}66` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className="opacity-50 mr-1 text-xs">[{cat.key}]</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* AutoPlay Toggle */}
      <button
        onClick={toggleAutoPlay}
        className="flex items-center gap-2 text-xs font-mono tracking-widest transition-all duration-200"
        style={{ color: isAutoPlay ? color : '#94A3B8' }}
      >
        <span
          className="w-2 h-2 rounded-full transition-all"
          style={{ backgroundColor: isAutoPlay ? color : '#94A3B8', boxShadow: isAutoPlay ? `0 0 6px ${color}` : 'none' }}
        />
        {isAutoPlay ? 'AUTO-ROTATE: ON' : 'AUTO-ROTATE: OFF'}
      </button>
    </div>
  );
}
