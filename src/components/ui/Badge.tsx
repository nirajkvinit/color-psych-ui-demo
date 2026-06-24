import type { ComponentPropsWithRef } from 'react';
import type { Tone } from './tone';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: Tone;
  variant?: 'soft' | 'outline';
  /** Leading status dot — carries the tone colour without relying on text. */
  dot?: boolean;
}

/**
 * Status pill.
 * - `soft`: tone-coloured text on the tone's own ground (AA on every palette).
 * - `outline`: neutral `--text` label + tone border/dot — tone text on an
 *   arbitrary palette surface can't be guaranteed >= 4.5:1, so the label stays
 *   neutral and the colour is carried by the border and an optional dot.
 */
export function Badge({
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  children,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} tone-${tone}${className ? ` ${className}` : ''}`} {...rest}>
      {dot && <span className="badge-dot" aria-hidden />}
      {children}
    </span>
  );
}
