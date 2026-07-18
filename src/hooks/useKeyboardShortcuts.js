import { useEffect } from 'react';
import { CATEGORIES } from '../config/categories';
import { useLogoState } from './useLogoState';

const KEY_MAP = {
  d: CATEGORIES.DATA,
  f: CATEGORIES.FULLSTACK,
  c: CATEGORIES.DESIGN,
  v: CATEGORIES.VIDEO,
};

export function useKeyboardShortcuts({ onShowHelp } = {}) {
  const setCategory    = useLogoState((s) => s.setCategory);
  const toggleAutoPlay = useLogoState((s) => s.toggleAutoPlay);

  useEffect(() => {
    function handleKeyDown(e) {
      // Don't trigger while user is typing in a form
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = e.key.toLowerCase();

      if (KEY_MAP[key]) {
        setCategory(KEY_MAP[key]);
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
        return;
      }
      if (key === '?') {
        onShowHelp?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCategory, toggleAutoPlay, onShowHelp]);
}
