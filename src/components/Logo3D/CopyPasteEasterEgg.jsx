'use client';

import { useEffect, useState } from 'react';
import { LOGOS_DATA } from '../../config/logoData';
import { THEME } from '../../config/colors';

/**
 * Hook: listens for Ctrl+C (while hovering a logo) and Ctrl+V.
 * Returns feedback state for use by the toast component.
 */
export function useCopyPasteEasterEgg(hoveredLogoId) {
  const [feedback,    setFeedback]    = useState(null);  // {type: 'copy'|'paste', id}
  const [lastCopied,  setLastCopied]  = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      const isCopy  = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';

      if (isCopy && hoveredLogoId) {
        setLastCopied(hoveredLogoId);
        setFeedback({ type: 'copy', id: hoveredLogoId });
        setTimeout(() => setFeedback(null), 1200);
      }

      if (isPaste && lastCopied) {
        setFeedback({ type: 'paste', id: lastCopied });
        setTimeout(() => setFeedback(null), 1200);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredLogoId, lastCopied]);

  return { feedback, lastCopied };
}

/**
 * Toast UI shown when copy/paste easter egg triggers.
 */
export function CopyPasteToast({ feedback, activeCategory }) {
  const activeColor = THEME.categories[activeCategory]?.accent || '#06B6D4';

  if (!feedback) return null;

  // Look up the logo name from the id stored in feedback
  const allLogos = Object.values(LOGOS_DATA).flat();
  const logo = allLogos.find((l) => l.id === feedback.id);
  const name = logo?.name || 'Logo';

  const messages = {
    copy:  { emoji: '✂️',  text: `${name} tersalin!`,  hint: 'Ctrl+V untuk paste' },
    paste: { emoji: '📋', text: `${name} di-paste!`,   hint: 'Object ditempel ✨' },
  };

  const msg = messages[feedback.type];

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
      style={{ animation: 'easterEggPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border backdrop-blur-md"
        style={{
          background:   'rgba(15,23,42,0.95)',
          borderColor:  activeColor,
          boxShadow:    `0 0 30px ${activeColor}55`,
          color:        '#F1F5F9',
        }}
      >
        <span className="text-lg">{msg.emoji}</span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{msg.text}</span>
          <span className="text-xs opacity-50 font-mono">{msg.hint}</span>
        </div>
      </div>

      <style>{`
        @keyframes easterEggPop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.7) translateY(10px); }
          60%  { opacity: 1; transform: translateX(-50%) scale(1.05) translateY(-4px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
