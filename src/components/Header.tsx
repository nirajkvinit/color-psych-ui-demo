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
  allPaletteKeys: PaletteKey[];
}

export function Header({
  currentKey,
  onSelectPalette,
  isDark,
  onToggleTheme,
  onExport,
  quickNavKeys,
  allPaletteKeys,
}: HeaderProps) {
  const current = palettes[currentKey];

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl accent-bg flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold tracking-[-0.5px] text-xl">Aether Lab</div>
              <div className="type-caption -mt-0.5">COLOR PSYCHOLOGY STUDIO</div>
            </div>
          </div>
          <div className="hidden lg:block text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
            2026 Research Edition
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center md:justify-end md:flex-none md:max-w-[50%]">
          <div className="md:hidden flex items-center gap-2 min-w-0 max-w-[min(100%,220px)]">
            <div
              className="color-swatch shrink-0"
              style={{ backgroundColor: current.light['--accent'] }}
              aria-hidden
            />
            <select
              value={currentKey}
              onChange={(e) => onSelectPalette(e.target.value as PaletteKey)}
              className="input text-xs py-2 min-w-0 truncate"
              aria-label="Select palette"
            >
              {allPaletteKeys.map((key) => (
                <option key={key} value={key}>
                  {palettes[key].name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-none">
            {quickNavKeys.map((key) => {
              const isActive = key === currentKey;
              return (
                <button
                  key={key}
                  onClick={() => onSelectPalette(key)}
                  title={palettes[key].name}
                  aria-label={palettes[key].name}
                  aria-current={isActive ? 'true' : undefined}
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