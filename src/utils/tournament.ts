import type { PaletteKey } from '../types';

/**
 * Round-robin pairings: every candidate is compared head-to-head with every other
 * exactly once, so each appears the same number of times (pool.length - 1). This is
 * provably balanced with no self-pairs — the final win-count is a real ranking, not
 * an artefact of which random matchups happened to come up. Pair order and left/right
 * side are shuffled so the session doesn't feel deterministic.
 */
export function buildRoundRobin(pool: PaletteKey[]): Array<[PaletteKey, PaletteKey]> {
  if (pool.length < 2) return [];
  const pairs: Array<[PaletteKey, PaletteKey]> = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) pairs.push([pool[i], pool[j]]);
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[k]] = [pairs[k], pairs[i]];
  }
  return pairs.map(([a, b]) => (Math.random() < 0.5 ? [a, b] : [b, a]));
}
