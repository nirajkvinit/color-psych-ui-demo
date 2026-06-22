import { Palette, Sun, Moon } from 'lucide-react';
import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { ExportMenu } from './ExportMenu';

interface HeaderProps {
  currentKey: PaletteKey;
  onSelectPalette: (key: PaletteKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onExport: (format: 'css' | 'json' | 'tailwind') => void;
  quickNavKeys: PaletteKey[];
}

export function Header({
  currentKey,
  onSelectPalette,
  isDark,
  onToggleTheme,
  onExport,
  quickNavKeys,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl accent-bg flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold tracking-[-0.5px] text-xl">Aether Lab</div>
              <div className="text-[10px] text-[var(--text-muted)] -mt-1">COLOR PSYCHOLOGY STUDIO</div>
            </div>
          </div>
          <div className="hidden md:block text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
            2026 Research Edition
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-none max-w-[50%]">
          {quickNavKeys.map((key) => {
            const isActive = key === currentKey;
            return (
              <button
                key={key}
                onClick={() => onSelectPalette(key)}
                title={palettes[key].name}
                aria-label={palettes[key].name}
                className={`px-3 py-1.5 rounded-3xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'accent-bg text-[var(--accent-foreground)] shadow'
                    : 'hover:bg-[var(--surface-2)] border border-[var(--border)]'
                }`}
              >
                {palettes[key].name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary p-2.5 rounded-2xl"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <ExportMenu onExport={onExport} />
        </div>
      </div>
    </header>
  );
}