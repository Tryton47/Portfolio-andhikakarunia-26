import { CATEGORIES } from '../config/categories';

// Clean grid layout
function grid(i, total, cols = 4, spacing = 4.5) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const actualCols = Math.min(cols, total);
  const offsetX = ((actualCols - 1) / 2) * spacing;
  return [col * spacing - offsetX, -row * spacing, 0];
}

// Constellation for all view
function constellation(i, total) {
  const angle = (i / Math.max(total - 1, 1)) * Math.PI * 2;
  const radius = 10 + (i / Math.max(total - 1, 1)) * 18;
  const y = Math.sin(i * 0.8) * 3;
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
}

export const ARRANGEMENTS = {
  // Category grids
  [CATEGORIES.FULLSTACK]: (i, t) => grid(i, t, 4, 4.8),
  [CATEGORIES.DATA]: (i, t) => grid(i, t, 4, 4.5),
  [CATEGORIES.DESIGN]: (i, t) => grid(i, t, 3, 5.5),
  [CATEGORIES.VIDEO]: (i, t) => grid(i, t, 3, 5.5),

  // All view - constellation
  all: constellation,
};

export function getArrangement(category) {
  return ARRANGEMENTS[category] || grid;
}
