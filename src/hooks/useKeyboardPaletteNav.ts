import { useEffect } from 'react';
import type { PaletteKey } from '../types';
import { paletteKeys } from '../data';

export function useKeyboardPaletteNav(
  currentKey: PaletteKey,
  onChange: (key: PaletteKey) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Only ←/→ cycle palettes. ArrowUp/Down are left alone so the page can
      // still scroll, and modifier combos (e.g. ⌘←/Alt← back-nav) are ignored.
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      const idx = paletteKeys.indexOf(currentKey);
      e.preventDefault();
      if (e.key === 'ArrowRight') {
        onChange(paletteKeys[(idx + 1) % paletteKeys.length]);
      } else {
        onChange(paletteKeys[(idx - 1 + paletteKeys.length) % paletteKeys.length]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentKey, onChange, enabled]);
}