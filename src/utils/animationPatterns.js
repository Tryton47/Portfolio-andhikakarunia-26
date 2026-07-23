import { CATEGORIES } from '../config/categories';

// Clean grid layout
function grid(i, total, cols = 4, spacing = 4) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const actualCols = Math.min(cols, total);
  const offsetX = ((actualCols - 1) / 2) * spacing;
  return [col * spacing - offsetX, -row * spacing, 0];
}

// Wide grid for small categories
function wideGrid(i, total, cols = 3, spacing = 5) {
  return grid(i, total, cols, spacing);
}

// Constellation for all view
function constellation(i, total) {
  const angle = (i / total) * Math.PI * 2 * 3;
  const radius = 12 + (i / total) * 20;
  return [Math.cos(angle) * radius, Math.sin(angle * 0.7) * 6, Math.sin(angle) * radius];
}

export const ARRANGEMENTS = {
  [CATEGORIES.FULLSTACK]: (i, t) => grid(i, t, 4, 4.5),
  [CATEGORIES.DATA]: (i, t) => grid(i, t, 4, 4.2),
  [CATEGORIES.DESIGN]: (i, t) => wideGrid(i, t, 3, 5),
  [CATEGORIES.VIDEO]: (i, t) => wideGrid(i, t, 3, 5),
  all: (i, t) => constellation(i, t),
};

export function getArrangement(category) {
  return ARRANGEMENTS[category] || grid;
}
