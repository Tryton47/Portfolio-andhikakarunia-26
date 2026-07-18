/**
 * Returns a delay in seconds for staggered entrance animation.
 * @param {number} index - Logo index in the array
 * @param {number} staggerMs - Milliseconds between each logo's entrance
 */
export function useEntranceStagger(index, staggerMs = 80) {
  return (index * staggerMs) / 1000;
}
