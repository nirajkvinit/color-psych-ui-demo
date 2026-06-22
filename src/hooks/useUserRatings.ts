import { useCallback, useState } from 'react';
import type { PaletteKey, UserRating } from '../types';
import { readJson, writeJson } from '../utils/storage';

const STORAGE_KEY = 'userRatings';

export function useUserRatings() {
  const [userRatings, setUserRatings] = useState<UserRating[]>(() =>
    readJson<UserRating[]>(STORAGE_KEY, [], (v): v is UserRating[] => Array.isArray(v)),
  );

  const submitRating = useCallback(
    (palette: PaletteKey, calmness: number, premium: number) => {
      const newRating: UserRating = {
        palette,
        calmness,
        premium,
        timestamp: new Date().toISOString(),
      };
      const updated = [...userRatings, newRating];
      setUserRatings(updated);
      writeJson(STORAGE_KEY, updated);
      return newRating;
    },
    [userRatings],
  );

  const getAverages = useCallback(
    (palette: PaletteKey) => {
      const filtered = userRatings.filter((r) => r.palette === palette);
      if (filtered.length === 0) return { calmness: 0, premium: 0, count: 0 };
      const calmness = filtered.reduce((s, r) => s + r.calmness, 0) / filtered.length;
      const premium = filtered.reduce((s, r) => s + r.premium, 0) / filtered.length;
      return { calmness, premium, count: filtered.length };
    },
    [userRatings],
  );

  const exportCsv = useCallback(() => {
    const header = 'palette,calmness,premium,timestamp';
    const rows = userRatings.map(
      (r) => `${r.palette},${r.calmness},${r.premium},${r.timestamp}`,
    );
    return [header, ...rows].join('\n');
  }, [userRatings]);

  return { userRatings, submitRating, getAverages, exportCsv };
}