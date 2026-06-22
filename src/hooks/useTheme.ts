import { useCallback, useEffect, useState } from 'react';
import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { readString, writeString } from '../utils/storage';

export function useTheme(initialPalette: PaletteKey = 'calm') {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = readString('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentPaletteKey, setCurrentPaletteKey] = useState<PaletteKey>(() => {
    const saved = readString('palette') as PaletteKey | null;
    // Object.hasOwn (not `in`/truthiness) so inherited keys like "__proto__" are rejected.
    return saved && Object.hasOwn(palettes, saved) ? saved : initialPalette;
  });

  const applyTheme = useCallback((dark: boolean, paletteKey: PaletteKey) => {
    const root = document.documentElement;
    const palette = palettes[paletteKey];
    const vars = dark ? palette.dark : palette.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.classList.toggle('dark', dark);
    writeString('theme', dark ? 'dark' : 'light');
    writeString('palette', paletteKey);
  }, []);

  useEffect(() => {
    applyTheme(isDark, currentPaletteKey);
  }, [isDark, currentPaletteKey, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!readString('theme')) setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return {
    isDark,
    setIsDark,
    currentPaletteKey,
    setCurrentPaletteKey,
    toggleTheme,
    applyTheme,
    currentPalette: palettes[currentPaletteKey],
  };
}