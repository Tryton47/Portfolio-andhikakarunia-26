'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { CATEGORY_LIST } from '../../config/categories';
import { THEME } from '../../config/colors';
import GlassButton from '../Shared/GlassButton';

export default function CategoryFilter() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const setCategory = useLogoState((s) => s.setCategory);

  return (
    <div className="flex flex-col items-center gap-3">
      <GlassButton
        onClick={() => setCategory(null)}
        isActive={activeCategory === null}
        activeColor="#6366F1"
        className="px-6 py-2.5 text-xs font-bold tracking-widest"
      >
        ✦ ALL
      </GlassButton>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORY_LIST.map((cat) => (
          <GlassButton
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            isActive={activeCategory === cat.id}
            activeColor={THEME.categories[cat.id]?.accent || '#06B6D4'}
            className="px-4 py-2 text-[10px] font-bold tracking-widest"
          >
            {cat.label.toUpperCase()}
          </GlassButton>
        ))}
      </div>
    </div>
  );
}
