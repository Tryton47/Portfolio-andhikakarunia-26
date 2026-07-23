'use client';

import { useLogoState } from '../../hooks/useLogoState';
import { LOGOS_DATA } from '../../config/logoData';

export default function InfoPanel() {
  const activeCategory = useLogoState((s) => s.activeCategory);
  const selectedLogoId = useLogoState((s) => s.selectedLogoId);
  const selectLogo = useLogoState((s) => s.selectLogo);

  if (!selectedLogoId) return null;

  let logo = null;
  if (activeCategory) {
    logo = LOGOS_DATA[activeCategory]?.find((l) => l.id === selectedLogoId);
  } else {
    for (const logos of Object.values(LOGOS_DATA)) {
      const found = logos.find((l) => l.id === selectedLogoId);
      if (found) { logo = found; break; }
    }
  }

  if (!logo) return null;

  return (
    <div
      className="absolute right-4 top-1/2 -translate-y-1/2 w-72 p-5 rounded-2xl border backdrop-blur-xl z-50"
      style={{
        borderColor: `${logo.color}40`,
        background: 'rgba(9, 14, 28, 0.95)',
        boxShadow: `0 20px 50px rgba(0,0,0,0.8)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-white">{logo.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: logo.color, background: `${logo.color}20`, border: `1px solid ${logo.color}40` }}>
              {logo.level}
            </span>
            {logo.years && <span className="text-xs text-gray-400">{logo.years} Years</span>}
          </div>
        </div>
        <button onClick={() => selectLogo(selectedLogoId)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-4">{logo.desc}</p>

      {logo.tools?.length > 0 && (
        <div className="mb-3">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {logo.tools.map((tool, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-300">{tool}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
