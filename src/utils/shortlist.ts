import type { PaletteKey } from '../types';
import { palettes } from '../data';

export const MAX_SHORTLIST = 5;

/**
 * Drop unknown/duplicate keys and cap length so corrupt or legacy persisted data
 * can't reach the UI. Uses `Object.hasOwn` (not `in`) so inherited object keys such
 * as "__proto__"/"toString"/"constructor" are rejected, not treated as palette ids.
 */
export function sanitizeShortlist(raw: unknown, max = MAX_SHORTLIST): PaletteKey[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const clean: PaletteKey[] = [];
  for (const k of raw) {
    if (typeof k === 'string' && Object.hasOwn(palettes, k) && !seen.has(k)) {
      seen.add(k);
      clean.push(k as PaletteKey);
      if (clean.length >= max) break;
    }
  }
  return clean;
}
