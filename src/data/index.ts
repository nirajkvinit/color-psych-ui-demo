export { palettes } from './palettes';
export { PALETTE_SCORES, TOP_RATED_PALETTES } from './scores';
export {
  MODERN_CALM_PALETTES,
  HISTORICAL_CALM_PALETTES,
  MODERN_WARM_PALETTES,
  HISTORICAL_WARM_PALETTES,
  CALM_PALETTES,
  WARM_PALETTES,
  PALETTE_CATEGORIES,
  CATEGORY_LABELS,
  getPaletteCategory,
} from './paletteGroups';

import type { PaletteKey } from '../types';
import { palettes } from './palettes';

export const paletteKeys = Object.keys(palettes) as PaletteKey[];