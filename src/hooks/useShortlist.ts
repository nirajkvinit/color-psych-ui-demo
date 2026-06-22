import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { PaletteKey } from '../types';
import { readJson, writeJson } from '../utils/storage';

const STORAGE_KEY = 'paletteShortlist';
export const MAX_SHORTLIST = 5;

export function useShortlist() {
  const [shortlist, setShortlist] = useState<PaletteKey[]>(() =>
    readJson<PaletteKey[]>(STORAGE_KEY, [], (v): v is PaletteKey[] => Array.isArray(v)),
  );

  const persist = useCallback((next: PaletteKey[]) => {
    setShortlist(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const toggleShortlist = useCallback(
    (key: PaletteKey) => {
      if (shortlist.includes(key)) {
        persist(shortlist.filter((k) => k !== key));
      } else if (shortlist.length < MAX_SHORTLIST) {
        persist([...shortlist, key]);
      } else {
        toast.error(`Shortlist is full (max ${MAX_SHORTLIST})`, {
          description: 'Remove a palette before adding another.',
        });
      }
    },
    [shortlist, persist],
  );

  const clearShortlist = useCallback(() => persist([]), [persist]);

  return { shortlist, toggleShortlist, clearShortlist, isShortlisted: (key: PaletteKey) => shortlist.includes(key) };
}