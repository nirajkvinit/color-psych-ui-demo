import type { ComponentPropsWithRef } from 'react';

export interface SkeletonProps extends ComponentPropsWithRef<'span'> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
}

/**
 * Loading placeholder. Decorative, so it is hidden from assistive tech — wrap a
 * group in an element with `aria-busy` / role="status" to announce loading.
 * The shimmer is disabled under prefers-reduced-motion (see index.css).
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = '0.5rem',
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  return (
    <span
      {...rest}
      className={`skeleton ${className}`.trim()}
      aria-hidden
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
    />
  );
}
