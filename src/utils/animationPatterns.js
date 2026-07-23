import { CATEGORIES } from '../config/categories';

// Grid layout for category views (no floating)
function grid(i, total, cols = 4, spacing = 5) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const actualCols = Math.min(cols, total);
  const offsetX = ((actualCols - 1) / 2) * spacing;
  return [col * spacing - offsetX, -row * spacing, 0];
}

// Constellation layout for "all" view - evenly distributed sphere
function constellation(i, total) {
  if (total === 0) return [0, 0, 0];

  // Golden angle for even distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const t = i / Math.max(total - 1, 1);
  const angle = i * goldenAngle;

  // Fibonacci sphere distribution
  const radius = 14 + t * 16;
  const y = (i - (total - 1) / 2) * 1.5;

  return [
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius,
  ];
}

export const ARRANGEMENTS = {
  // Category grids (static, no floating)
  [CATEGORIES.FULLSTACK]: (i, t) => grid(i, t, 4, 5),
  [CATEGORIES.DATA]: (i, t) => grid(i, t, 4, 5),
  [CATEGORIES.DESIGN]: (i, t) => grid(i, t, 3, 6),
  [CATEGORIES.VIDEO]: (i, t) => grid(i, t, 3, 6),

  // All view - sphere constellation
  all: constellation,
};

export function getArrangement(category) {
  return ARRANGEMENTS[category] || grid;
}
