import type { PaletteKey, PaletteScore } from '../types';

/** Curated benchmark scores — illustrative, not from live user sessions. */
export const PALETTE_SCORES: Record<PaletteKey, PaletteScore> = {
  calm: { calmness: 8.7, premium: 8.4 },
  warm: { calmness: 6.8, premium: 7.5 },
  verdant: { calmness: 8.9, premium: 8.8 },
  lumina: { calmness: 8.4, premium: 8.9 },
  navy: { calmness: 9.1, premium: 8.7 },
  slate: { calmness: 8.5, premium: 8.3 },
  charcoal: { calmness: 7.6, premium: 9.2 },
  terracotta: { calmness: 7.9, premium: 7.8 },
  honey: { calmness: 8.6, premium: 8.5 },
  cloud: { calmness: 9.0, premium: 8.6 },
  transformative: { calmness: 9.2, premium: 8.8 },
  twilight: { calmness: 8.8, premium: 9.0 },
  oatmeal: { calmness: 9.0, premium: 8.9 },
  sagebrush: { calmness: 9.1, premium: 8.4 },
  arctic: { calmness: 9.3, premium: 8.5 },
  copper: { calmness: 7.4, premium: 9.1 },
  apricot: { calmness: 7.7, premium: 8.0 },
  sandstone: { calmness: 8.3, premium: 8.2 },
  saffron: { calmness: 7.2, premium: 8.4 },
  rosewood: { calmness: 7.8, premium: 9.0 },
  heritageblue: { calmness: 9.4, premium: 8.9 },
  powderera: { calmness: 8.8, premium: 8.1 },
  modernist: { calmness: 9.0, premium: 8.6 },
  huntergreen: { calmness: 9.2, premium: 8.8 },
  tealoffice: { calmness: 8.6, premium: 7.9 },
  goldenage: { calmness: 7.0, premium: 7.6 },
  heritagered: { calmness: 6.5, premium: 7.8 },
  kodakwarm: { calmness: 7.1, premium: 7.5 },
  harvestera: { calmness: 7.5, premium: 7.4 },
  executive: { calmness: 7.3, premium: 8.7 },
  evergreen: { calmness: 9.0, premium: 9.1 },
  aubergine: { calmness: 8.6, premium: 9.2 },
  brass: { calmness: 8.2, premium: 9.0 },
  oxblood: { calmness: 7.6, premium: 9.3 },
};

export const TOP_RATED_PALETTES: PaletteKey[] = (
  Object.entries(PALETTE_SCORES) as [PaletteKey, PaletteScore][]
)
  .sort(([, a], [, b]) => b.calmness + b.premium - (a.calmness + a.premium))
  .slice(0, 8)
  .map(([key]) => key);