import { describe, it, expect } from 'vitest';
import { getToastDuration } from './toastDuration';

describe('getToastDuration', () => {
  it('floors short messages at 5000ms', () => {
    expect(getToastDuration('Palette applied')).toBe(5000); // 2 words → 2000, floored
    expect(getToastDuration('Saved')).toBe(5000);
  });

  it('scales with word count above the floor (~500ms/word + 1s buffer)', () => {
    const msg = 'one two three four five six seven eight nine ten eleven twelve'; // 12 words
    expect(getToastDuration(msg)).toBe(12 * 500 + 1000); // 7000
  });

  it('never auto-dismisses actionable toasts', () => {
    expect(getToastDuration('Palette archived', true)).toBe(Infinity);
  });

  it('never auto-dismisses long-form toasts (>140 chars)', () => {
    expect(getToastDuration('x'.repeat(141))).toBe(Infinity);
  });

  it('handles empty / whitespace-only messages without NaN', () => {
    expect(getToastDuration('')).toBe(5000);
    expect(getToastDuration('   ')).toBe(5000);
  });
});
