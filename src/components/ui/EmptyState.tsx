import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional single recovery action (button/link). */
  action?: ReactNode;
  /** Element/heading used for the title (e.g. "h3"). Defaults to a neutral <p>
   *  so the component never imposes a heading level on its host's outline. */
  titleAs?: ElementType;
}

/**
 * Empty state — generalises the dashed-border pattern used in FeedbackSection
 * for reuse (no data, no results, first run).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  titleAs: TitleTag = 'p',
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      {...rest}
      className={`py-10 px-6 text-center border border-dashed border-[var(--border)] rounded-2xl${className ? ` ${className}` : ''}`}
    >
      {Icon && <Icon className="mx-auto w-8 h-8 mb-3 opacity-40" aria-hidden />}
      <TitleTag className="font-medium">{title}</TitleTag>
      {description && (
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
