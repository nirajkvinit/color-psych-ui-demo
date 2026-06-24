import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { resolveProgress } from '../../utils/progress';
import { TONE_FILL, type Tone } from './tone';

export interface ProgressProps extends Omit<ComponentPropsWithRef<'div'>, 'role'> {
  /** 0–100. Omit (or pass a non-finite number) for an indeterminate bar. */
  value?: number;
  tone?: Tone;
  /** Accessible label (required — a bare progressbar is unlabelled). */
  label: string;
}

export function Progress({ value, tone = 'accent', label, className, style, ...rest }: ProgressProps) {
  const { indeterminate, value: pct } = resolveProgress(value);

  return (
    <div
      {...rest}
      className={`progress-track${className ? ` ${className}` : ''}`}
      style={{ ['--tone']: TONE_FILL[tone], ...style } as CSSProperties}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
    >
      <div
        className={`progress-bar${indeterminate ? ' progress-bar--indeterminate' : ''}`}
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
}
