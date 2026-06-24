import { describe, it, expect } from 'vitest';
import { paletteKeys } from '../data';
import { MAX_SHORTLIST, sanitizeShortlist } from './shortlist';

describe('sanitizeShortlist', () => {
  it('returns [] for non-array input', () => {
    expect(sanitizeShortlist(null)).toEqual([]);
    expect(sanitizeShortlist(undefined)).toEqual([]);
    expect(sanitizeShortlist('calm')).toEqual([]);
    expect(sanitizeShortlist({ 0: 'calm' })).toEqual([]);
  });

  it('keeps valid palette keys in their original order', () => {
    expect(sanitizeShortlist(['navy', 'calm'])).toEqual(['navy', 'calm']);
  });

  it('drops unknown keys', () => {
    expect(sanitizeShortlist(['missing', 'calm', 'nope'])).toEqual(['calm']);
  });

  it('rejects inherited object keys (prototype pollution guard)', () => {
    expect(sanitizeShortlist(['__proto__', 'toString', 'constructor', 'calm'])).toEqual(['calm']);
  });

  it('dedupes repeated keys', () => {
    expect(sanitizeShortlist(['calm', 'calm', 'navy', 'navy'])).toEqual(['calm', 'navy']);
  });

  it('ignores non-string elements', () => {
    expect(sanitizeShortlist([1, { x: 1 }, null, ['calm'], 'calm'])).toEqual(['calm']);
  });

  it(`caps the result at MAX_SHORTLIST (${MAX_SHORTLIST})`, () => {
    // Derive the input from the real palette list so this test stays valid
    // whatever MAX_SHORTLIST is set to (as long as enough palettes exist).
    expect(paletteKeys.length).toBeGreaterThan(MAX_SHORTLIST);
    const many = [...paletteKeys];
    expect(sanitizeShortlist(many)).toHaveLength(MAX_SHORTLIST);
    expect(sanitizeShortlist(many)).toEqual(many.slice(0, MAX_SHORTLIST));
  });
});
