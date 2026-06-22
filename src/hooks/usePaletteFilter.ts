import { useMemo, useState } from 'react';
import type { PaletteCategory, PaletteKey } from '../types';
import { PALETTE_CATEGORIES, palettes, TOP_RATED_PALETTES } from '../data';
import { PALETTE_SCORES } from '../data/scores';

export type SortMode = 'name' | 'calmness' | 'premium' | 'combined';

export function usePaletteFilter(allKeys: PaletteKey[]) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PaletteCategory | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('combined');
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  const filteredKeys = useMemo(() => {
    let keys = [...allKeys];

    if (category !== 'all') {
      keys = keys.filter((k) => PALETTE_CATEGORIES[category].includes(k));
    }

    if (topRatedOnly) {
      keys = keys.filter((k) => TOP_RATED_PALETTES.includes(k));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      keys = keys.filter((k) => {
        const p = palettes[k];
        return (
          p.name.toLowerCase().includes(q) ||
          p.psych.toLowerCase().includes(q) ||
          k.toLowerCase().includes(q)
        );
      });
    }

    keys.sort((a, b) => {
      if (sort === 'name') return palettes[a].name.localeCompare(palettes[b].name);
      if (sort === 'calmness') return PALETTE_SCORES[b].calmness - PALETTE_SCORES[a].calmness;
      if (sort === 'premium') return PALETTE_SCORES[b].premium - PALETTE_SCORES[a].premium;
      const scoreA = PALETTE_SCORES[a].calmness + PALETTE_SCORES[a].premium;
      const scoreB = PALETTE_SCORES[b].calmness + PALETTE_SCORES[b].premium;
      return scoreB - scoreA;
    });

    return keys;
  }, [allKeys, search, category, sort, topRatedOnly]);

  return {
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    topRatedOnly,
    setTopRatedOnly,
    filteredKeys,
  };
}