import type { PaletteCategory, PaletteKey } from '../types';

export const MODERN_CALM_PALETTES: PaletteKey[] = [
  'calm', 'verdant', 'lumina', 'navy', 'slate', 'cloud',
  'transformative', 'twilight', 'oatmeal', 'sagebrush', 'arctic',
  'evergreen', 'aubergine',
];

export const HISTORICAL_CALM_PALETTES: PaletteKey[] = [
  'heritageblue', 'powderera', 'modernist', 'huntergreen', 'tealoffice',
];

export const MODERN_WARM_PALETTES: PaletteKey[] = [
  'warm', 'charcoal', 'terracotta', 'honey',
  'copper', 'apricot', 'sandstone', 'saffron', 'rosewood',
  'brass', 'oxblood',
];

export const HISTORICAL_WARM_PALETTES: PaletteKey[] = [
  'goldenage', 'heritagered', 'kodakwarm', 'harvestera', 'executive',
];

export const CALM_PALETTES: PaletteKey[] = [
  ...MODERN_CALM_PALETTES,
  ...HISTORICAL_CALM_PALETTES,
];

export const WARM_PALETTES: PaletteKey[] = [
  ...MODERN_WARM_PALETTES,
  ...HISTORICAL_WARM_PALETTES,
];

export const PALETTE_CATEGORIES: Record<PaletteCategory, PaletteKey[]> = {
  'modern-calm': MODERN_CALM_PALETTES,
  'historical-calm': HISTORICAL_CALM_PALETTES,
  'modern-warm': MODERN_WARM_PALETTES,
  'historical-warm': HISTORICAL_WARM_PALETTES,
};

export const CATEGORY_LABELS: Record<PaletteCategory, string> = {
  'modern-calm': 'Modern Corporate Calm',
  'historical-calm': 'Historical Corporate Calm',
  'modern-warm': 'Modern Corporate Warmth',
  'historical-warm': 'Historical Corporate Warmth',
};

export function getPaletteCategory(key: PaletteKey): PaletteCategory {
  if (MODERN_CALM_PALETTES.includes(key)) return 'modern-calm';
  if (HISTORICAL_CALM_PALETTES.includes(key)) return 'historical-calm';
  if (MODERN_WARM_PALETTES.includes(key)) return 'modern-warm';
  return 'historical-warm';
}