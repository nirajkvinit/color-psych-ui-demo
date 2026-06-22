import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { PALETTE_SCORES } from '../data/scores';

interface PalettePreviewProps {
  paletteKey: PaletteKey;
  mode: 'light' | 'dark';
}

export function PalettePreview({ paletteKey, mode }: PalettePreviewProps) {
  const pal = palettes[paletteKey];
  const vars = mode === 'dark' ? pal.dark : pal.light;

  return (
    <div
      className="rounded-xl overflow-hidden border border-[var(--border)]"
      style={{ backgroundColor: vars['--bg'], color: vars['--text'] }}
    >
      <div className="p-4 space-y-3" style={{ backgroundColor: vars['--surface'] }}>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: vars['--accent'] }} />
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: vars['--accent-light'] }} />
          <div
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: vars['--surface-2'], borderColor: vars['--border'] }}
          />
        </div>
        <div className="text-sm font-semibold" style={{ color: vars['--text'] }}>
          {pal.name}
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-lg inline-block font-medium"
          style={{ backgroundColor: vars['--accent'], color: vars['--accent-foreground'] }}
        >
          Sample CTA
        </div>
        <p className="text-xs leading-snug" style={{ color: vars['--text-muted'] }}>
          {pal.psych.substring(0, 120)}...
        </p>
        <div className="flex gap-3 text-[10px] font-mono" style={{ color: vars['--text-muted'] }}>
          <span>Calm {PALETTE_SCORES[paletteKey].calmness}</span>
          <span>Premium {PALETTE_SCORES[paletteKey].premium}</span>
        </div>
      </div>
    </div>
  );
}