import type { PaletteDefinition, PaletteKey } from '../types';

export function exportCssVariables(
  palette: PaletteDefinition,
  isDark: boolean,
): string {
  const vars = isDark ? palette.dark : palette.light;
  return `:root {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;
}

export function exportJsonTokens(
  palette: PaletteDefinition,
  key: PaletteKey,
  isDark: boolean,
): string {
  const vars = isDark ? palette.dark : palette.light;
  const payload = {
    name: palette.name,
    key,
    mode: isDark ? 'dark' : 'light',
    tokens: Object.fromEntries(
      Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ''), v]),
    ),
  };
  return JSON.stringify(payload, null, 2);
}

export function exportTailwindTheme(
  palette: PaletteDefinition,
  key: PaletteKey,
  isDark: boolean,
): string {
  const vars = isDark ? palette.dark : palette.light;
  const token = (name: string) => vars[`--${name}`] ?? '';

  return `// Tailwind v4 theme extension for ${palette.name} (${isDark ? 'dark' : 'light'})
@theme {
  --color-background: ${token('bg')};
  --color-surface: ${token('surface')};
  --color-surface-2: ${token('surface-2')};
  --color-foreground: ${token('text')};
  --color-muted: ${token('text-muted')};
  --color-border: ${token('border')};
  --color-accent: ${token('accent')};
  --color-accent-hover: ${token('accent-hover')};
  --color-accent-light: ${token('accent-light')};
  --color-accent-foreground: ${token('accent-foreground')};
  --color-accent-text: ${token('accent-text')};
}

// Palette key: ${key}
`;
}

export type ExportFormat = 'css' | 'json' | 'tailwind';

export function exportTheme(
  palette: PaletteDefinition,
  key: PaletteKey,
  isDark: boolean,
  format: ExportFormat,
): string {
  switch (format) {
    case 'css':
      return exportCssVariables(palette, isDark);
    case 'json':
      return exportJsonTokens(palette, key, isDark);
    case 'tailwind':
      return exportTailwindTheme(palette, key, isDark);
  }
}