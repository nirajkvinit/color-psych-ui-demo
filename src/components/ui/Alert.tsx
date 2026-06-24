import type { ComponentPropsWithRef } from 'react';
import {
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Bell,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Tone } from './tone';

const TONE_ICON: Record<Tone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: OctagonAlert,
  neutral: Bell,
  accent: Sparkles,
};

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  tone?: Tone;
  title: string;
  variant?: 'soft' | 'prominent';
  /** Override the default tone icon, or pass `null` to hide it. */
  icon?: LucideIcon | null;
  /** A single action — more than one dilutes intent (USWDS). */
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  /**
   * Force assertive announcement (role="alert"). Defaults to true only for
   * `danger` — reserve assertive interruptions for genuinely urgent messages.
   */
  assertive?: boolean;
  /**
   * Announce politely (role="status") when the alert is inserted dynamically.
   * Static, always-rendered alerts should stay opt-out (the default) so they
   * don't register as live regions for no reason.
   */
  live?: boolean;
}

export function Alert({
  tone = 'info',
  title,
  children,
  variant = 'soft',
  icon,
  action,
  onDismiss,
  assertive,
  live,
  className,
  ...rest
}: AlertProps) {
  const Icon = icon === null ? null : (icon ?? TONE_ICON[tone]);
  const isAssertive = assertive ?? tone === 'danger';
  const role = isAssertive ? 'alert' : live ? 'status' : undefined;
  const ariaLive = isAssertive ? 'assertive' : live ? 'polite' : undefined;

  return (
    <div
      {...rest}
      className={`alert tone-${tone}${variant === 'prominent' ? ' alert--prominent' : ''}${className ? ` ${className}` : ''}`}
      role={role}
      aria-live={ariaLive}
    >
      {Icon && <Icon className="alert-icon" size={18} aria-hidden />}
      <div className="alert-content">
        <p className="alert-title">{title}</p>
        {children && <div className="alert-message">{children}</div>}
        {action && (
          <div className="alert-actions">
            <button type="button" className="alert-action" onClick={action.onClick}>
              {action.label}
            </button>
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label={`Dismiss: ${title}`}
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
