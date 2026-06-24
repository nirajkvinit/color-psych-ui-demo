import { cloneElement, isValidElement, useId, useState, type ReactElement } from 'react';

export interface TooltipProps {
  /** Tooltip text. Linked to the trigger via aria-describedby. */
  label: string;
  /** A SINGLE focusable element (button/link/`tabIndex` element) — the tooltip
   *  clones it to attach aria-describedby directly to the focusable node. */
  children: ReactElement;
}

/**
 * Accessible tooltip: opens on hover *and* focus, closes on blur/leave/Escape.
 * aria-describedby is merged onto the actual trigger (not a wrapper) so screen
 * readers announce the description when the trigger receives focus.
 */
export function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open ? id : undefined,
      })
    : children;

  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      {trigger}
      <span role="tooltip" id={id} className={`tooltip-bubble${open ? ' visible' : ''}`}>
        {label}
      </span>
    </span>
  );
}
