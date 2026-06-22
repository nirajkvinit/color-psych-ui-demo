import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { PaletteKey } from '../types';
import { readJson, writeJson } from '../utils/storage';
import { MAX_SHORTLIST, sanitizeShortlist } from '../utils/shortlist';

const STORAGE_KEY = 'paletteShortlist';

export { MAX_SHORTLIST };

export function useShortlist() {
  const [shortlist, setShortlist] = useState<PaletteKey[]>(() =>
    sanitizeShortlist(readJson<unknown>(STORAGE_KEY, [])),
  );

  // Self-heal: write the sanitized list back so any corrupt/legacy value stops lingering.
  useEffect(() => {
    writeJson(STORAGE_KEY, shortlist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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