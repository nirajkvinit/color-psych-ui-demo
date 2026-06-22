import type { ContrastResult, PaletteDefinition, PaletteKey } from '../types';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const TOKEN_PAIRS: Array<{ pair: string; fg: string; bg: string; minRatio: number }> = [
  { pair: 'text on bg', fg: '--text', bg: '--bg', minRatio: 4.5 },
  { pair: 'text-muted on bg', fg: '--text-muted', bg: '--bg', minRatio: 4.5 },
  { pair: 'text on surface', fg: '--text', bg: '--surface', minRatio: 4.5 },
  { pair: 'text-muted on surface', fg: '--text-muted', bg: '--surface', minRatio: 4.5 },
  { pair: 'text-muted on surface-2', fg: '--text-muted', bg: '--surface-2', minRatio: 4.5 },
  // Accent is a brand/fill color; legible accent *text* uses the derived --accent-text token.
  { pair: 'accent-text on bg', fg: '--accent-text', bg: '--bg', minRatio: 4.5 },
  { pair: 'accent-text on surface', fg: '--accent-text', bg: '--surface', minRatio: 4.5 },
  { pair: 'accent-text on surface-2', fg: '--accent-text', bg: '--surface-2', minRatio: 4.5 },
  { pair: 'accent-foreground on accent', fg: '--accent-foreground', bg: '--accent', minRatio: 4.5 },
];

export function auditPaletteContrast(
  key: PaletteKey,
  palette: PaletteDefinition,
): ContrastResult[] {
  const results: ContrastResult[] = [];

  for (const mode of ['light', 'dark'] as const) {
    const vars = palette[mode];
    for (const { pair, fg, bg, minRatio } of TOKEN_PAIRS) {
      const foreground = vars[fg];
      const background = vars[bg];
      if (!foreground || !background) continue;

      const ratio = contrastRatio(foreground, background);
      results.push({
        palette: key,
        mode,
        pair,
        foreground,
        background,
        ratio,
        passesAA: ratio >= minRatio,
        passesAALarge: ratio >= 3,
      });
    }
  }

  return results;
}

export function auditAllPalettes(
  palettes: Record<PaletteKey, PaletteDefinition>,
): ContrastResult[] {
  return (Object.keys(palettes) as PaletteKey[]).flatMap((key) =>
    auditPaletteContrast(key, palettes[key]),
  );
}

export function palettePassesContrast(
  key: PaletteKey,
  palette: PaletteDefinition,
): boolean {
  return auditPaletteContrast(key, palette).every((r) => r.passesAA);
}