'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';

export default function InfoPanel() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectedLogoId = useLogoState((s) => s.selectedLogoId);
  const selectLogo     = useLogoState((s) => s.selectLogo);

  if (!selectedLogoId) return null;

  const logo = LOGOS_DATA[activeCategory]?.find((l) => l.id === selectedLogoId);
  if (!logo) return null;

  const color = THEME.categories[activeCategory]?.accent || '#06B6D4';
  const glow  = THEME.categories[activeCategory]?.glow   || 'rgba(6,182,212,0.3)';

  return (
    <div
      className="max-w-md mx-auto mt-5 p-5 rounded-2xl border transition-all duration-400 animate-fadeIn"
      style={{
        borderColor: color,
        background: `linear-gradient(135deg, ${color}0d, ${color}06)`,
        boxShadow: `0 0 30px ${glow}, inset 0 1px 0 ${color}22`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4
            className="font-semibold text-lg tracking-wide"
            style={{ color }}
          >
            {logo.name}
          </h4>
          <p className="text-xs font-mono mt-0.5" style={{ color: `${color}99` }}>
            {activeCategory.replace('_', ' ').toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => selectLogo(selectedLogoId)} // deselect
          className="text-xs font-mono px-2 py-1 rounded-full border transition-opacity opacity-50 hover:opacity-100"
          style={{ borderColor: color, color }}
        >
          ✕ ESC
        </button>
      </div>

      {/* Tools Chips */}
      <div className="flex flex-wrap gap-2">
        {logo.tools?.map((tool) => (
          <span
            key={tool}
            className="text-xs px-3 py-1.5 rounded-full font-mono tracking-wide transition-all"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}44`,
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
