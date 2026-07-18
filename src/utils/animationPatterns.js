import { CATEGORIES } from '../config/categories';

/**
 * Arrangement functions per category.
 * Each returns [x, y, z] for logo at index `i` of `total` logos.
 */
export const ARRANGEMENTS = {
  // ─── DATA ANALYST: Circular "data flow" ring ───
  [CATEGORIES.DATA]: (i, total) => {
    const angle = (i / total) * Math.PI * 2;
    const radius = 2.6;
    return [
      Math.cos(angle) * radius,
      Math.sin(i * 0.6) * 0.25,   // slight vertical wave
      Math.sin(angle) * radius,
    ];
  },

  // ─── FULL STACK: 3-layer stack (frontend top / backend mid / DB bottom) ───
  [CATEGORIES.FULLSTACK]: (i, total) => {
    const layer = i % 3;
    const col   = Math.floor(i / 3);
    const cols  = Math.ceil(total / 3);
    return [
      (col - (cols - 1) / 2) * 2.0,
      1.4 - layer * 1.4,
      0,
    ];
  },

  // ─── DESIGNER: Organic scatter using golden angle ───
  [CATEGORIES.DESIGN]: (i) => {
    const seed = i * 137.508; // golden angle (degrees)
    const r    = 1.6 + (i % 3) * 0.6;
    const rad  = (seed * Math.PI) / 180;
    return [
      Math.cos(rad) * r,
      ((i % 2) - 0.5) * 1.2,
      Math.sin(rad) * r,
    ];
  },

  // ─── VIDEOGRAPHER: Horizontal timeline (left → right like a playhead) ───
  [CATEGORIES.VIDEO]: (i, total) => [
    (i - (total - 1) / 2) * 2.0,
    0,
    0,
  ],
};

/**
 * Returns the arrangement function for a given category.
 * Falls back to the circular DATA arrangement.
 */
export function getArrangement(category) {
  return ARRANGEMENTS[category] || ARRANGEMENTS[CATEGORIES.DATA];
}

/**
 * Returns camera position best suited for each arrangement.
 */
export const CAMERA_PRESETS = {
  [CATEGORIES.DATA]:      [0, 2.5, 8.5],
  [CATEGORIES.FULLSTACK]: [0, 1.5, 8.0],
  [CATEGORIES.DESIGN]:    [0, 2.0, 8.0],
  [CATEGORIES.VIDEO]:     [0, 2.0, 9.5],
};

export function getCameraPreset(category) {
  return CAMERA_PRESETS[category] || [0, 2.5, 8.5];
}
