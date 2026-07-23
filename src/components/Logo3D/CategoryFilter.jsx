'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { CATEGORY_LIST } from '../../config/categories';
import { THEME } from '../../config/colors';
import GlassButton from '../Shared/GlassButton';

export default function CategoryFilter() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const setCategory = useLogoState((s) => s.setCategory);

  const isAllActive = activeCategory === null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ALL Button */}
      <GlassButton
        onClick={() => setCategory(null)}
        isActive={isAllActive}
        activeColor="#6366F1"
        className="px-8 py-3 text-xs font-bold tracking-widest"
      >
        ✦ ALL STACKS
      </GlassButton>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORY_LIST.map((cat) => {
          const color = THEME.categories[cat.id]?.accent || '#06B6D4';
          const isActive = activeCategory === cat.id;
          return (
            <GlassButton
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              isActive={isActive}
              activeColor={color}
              className="px-5 py-2 text-xs font-bold tracking-widest whitespace-nowrap"
            >
              {cat.label.toUpperCase()}
            </GlassButton>
          );
        })}
      </div>
    </div>
  );
}
