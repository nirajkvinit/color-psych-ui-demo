import { describe, it, expect } from 'vitest';
import { resolveProgress } from './progress';

describe('resolveProgress', () => {
  it('treats undefined as indeterminate', () => {
    expect(resolveProgress(undefined)).toEqual({ indeterminate: true, value: 0 });
  });

  it('treats non-finite numbers (NaN / Infinity) as indeterminate, not NaN', () => {
    expect(resolveProgress(NaN)).toEqual({ indeterminate: true, value: 0 });
    expect(resolveProgress(Infinity)).toEqual({ indeterminate: true, value: 0 });
    expect(resolveProgress(-Infinity)).toEqual({ indeterminate: true, value: 0 });
  });

  it('clamps to the 0–100 range', () => {
    expect(resolveProgress(-10)).toEqual({ indeterminate: false, value: 0 });
    expect(resolveProgress(150)).toEqual({ indeterminate: false, value: 100 });
  });

  it('passes through valid values', () => {
    expect(resolveProgress(0)).toEqual({ indeterminate: false, value: 0 });
    expect(resolveProgress(42)).toEqual({ indeterminate: false, value: 42 });
    expect(resolveProgress(100)).toEqual({ indeterminate: false, value: 100 });
  });
});
