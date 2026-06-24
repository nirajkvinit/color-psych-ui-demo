/**
 * Normalises a progress value for the Progress primitive. Non-finite input
 * (NaN/Infinity/undefined) becomes indeterminate rather than leaking `NaN` into
 * `aria-valuenow` / `width: NaN%`. Pure + standalone so it unit-tests without
 * rendering and keeps Progress.tsx a component-only module (Fast Refresh).
 */
export function resolveProgress(value?: number): { indeterminate: boolean; value: number } {
  if (typeof value !== 'number' || !Number.isFinite(value)) return { indeterminate: true, value: 0 };
  return { indeterminate: false, value: Math.max(0, Math.min(100, value)) };
}
