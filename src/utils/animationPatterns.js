import { CATEGORIES } from '../config/categories';

/**
 * Clean grid arrangement - neat rows and columns
 */
function gridLayout(i, total, cols = 4, spacing = 4.2) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const actualCols = Math.min(cols, total);
  const offsetX = ((actualCols - 1) / 2) * spacing;
  const x = col * spacing - offsetX;
  const y = -row * spacing;
  return [x, y, 0];
}

/**
 * Wide grid for smaller categories
 */
function wideGrid(i, total, cols = 3, spacing = 5) {
  return gridLayout(i, total, cols, spacing);
}

/**
 * Constellation for all logos view
 */
function constellation(i, total, opts = {}) {
  const { radiusMin = 12, radiusMax = 28, seed = 7 } = opts;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const t = total > 1 ? (i + seed * 0.1) / (total - 1) : 0.5;
  const angle = i * goldenAngle + seed;
  const radius = radiusMin + t * (radiusMax - radiusMin);
  const y = (t - 0.5) * 8;

  return [
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius,
  ];
}

// Arrangements per category
export const ARRANGEMENTS = {
  // Full Stack - 16 items, 4 columns
  [CATEGORIES.FULLSTACK]: (i, total) => gridLayout(i, total, 4, 4.5),

  // Data Analyst - 12 items, 4 columns
  [CATEGORIES.DATA]: (i, total) => gridLayout(i, total, 4, 4.3),

  // Designer - 6 items, 3 columns
  [CATEGORIES.DESIGN]: (i, total) => wideGrid(i, total, 3, 5),

  // Videographer - 6 items, 3 columns
  [CATEGORIES.VIDEO]: (i, total) => wideGrid(i, total, 3, 5),

  // All logos - constellation
  all: (i, total) => constellation(i, total, { radiusMin: 14, radiusMax: 30, seed: 7 }),
};

export function getArrangement(category) {
  return ARRANGEMENTS[category] || ARRANGEMENTS[CATEGORIES.FULLSTACK];
}

// Camera positions
export const CAMERA_PRESETS = {
  [CATEGORIES.FULLSTACK]: [0, -12, 38],
  [CATEGORIES.DATA]: [0, -10, 34],
  [CATEGORIES.DESIGN]: [0, -6, 32],
  [CATEGORIES.VIDEO]: [0, -6, 32],
  all: [0, 0, 55],
};

export function getCameraPreset(category) {
  return CAMERA_PRESETS[category] || [0, 0, 40];
}
