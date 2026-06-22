import { describe, it, expect } from 'vitest';
import type { PaletteKey } from '../types';
import { buildRoundRobin } from './tournament';

const pool = ['calm', 'navy', 'verdant', 'slate', 'honey'] as PaletteKey[];

describe('buildRoundRobin', () => {
  it('returns no rounds for pools smaller than 2', () => {
    expect(buildRoundRobin([])).toEqual([]);
    expect(buildRoundRobin(['calm'] as PaletteKey[])).toEqual([]);
  });

  it('is balanced: every candidate meets every other exactly once, no self-pairs', () => {
    // Run many trials because pair order and side are randomised.
    for (let trial = 0; trial < 100; trial++) {
      const rounds = buildRoundRobin(pool);

      expect(rounds).toHaveLength((pool.length * (pool.length - 1)) / 2);

      const appearances: Record<string, number> = {};
      const seenPairs = new Set<string>();
      for (const [a, b] of rounds) {
        expect(a).not.toBe(b); // no self-pairs
        appearances[a] = (appearances[a] ?? 0) + 1;
        appearances[b] = (appearances[b] ?? 0) + 1;
        const key = [a, b].sort().join('|');
        expect(seenPairs.has(key)).toBe(false); // each unordered pair appears once
        seenPairs.add(key);
      }

      // Equal exposure: each candidate appears exactly n-1 times.
      for (const k of pool) expect(appearances[k]).toBe(pool.length - 1);
    }
  });

  it('produces a single round for a pair', () => {
    expect(buildRoundRobin(['calm', 'navy'] as PaletteKey[])).toHaveLength(1);
  });
});
