import { useRef } from 'react';
import { Search, Star, SlidersHorizontal, X } from 'lucide-react';
import type { PaletteCategory } from '../types';
import { CATEGORY_LABELS } from '../data';
import type { SortMode } from '../hooks/usePaletteFilter';

interface PaletteNavigatorProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: PaletteCategory | 'all';
  onCategoryChange: (v: PaletteCategory | 'all') => void;
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
  topRatedOnly: boolean;
  onTopRatedChange: (v: boolean) => void;
  resultCount: number;
  shortlistCount: number;
}

const CATEGORIES: Array<PaletteCategory | 'all'> = [
  'all',
  'modern-calm',
  'historical-calm',
  'modern-warm',
  'historical-warm',
];

/** Short pill labels so the filter row doesn't clip on narrow viewports. */
const CATEGORY_SHORT_LABELS: Record<PaletteCategory | 'all', string> = {
  all: 'All',
  'modern-calm': 'Modern calm',
  'historical-calm': 'Historical calm',
  'modern-warm': 'Modern warm',
  'historical-warm': 'Historical warm',
};

export function PaletteNavigator({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  topRatedOnly,
  onTopRatedChange,
  resultCount,
  shortlistCount,
}: PaletteNavigatorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSearch = search.trim().length > 0;

  const focusSearch = () => inputRef.current?.focus();

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="navigator-panel space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="search-field relative flex-1 min-w-0">
          <button
            type="button"
            onClick={focusSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-md"
            aria-label="Focus search"
            tabIndex={-1}
          >
            <Search className="w-4 h-4" aria-hidden />
          </button>
          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name or psychology…"
            className="input search-input"
            aria-label="Search palettes by name or psychology"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
          />
          {hasSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] shrink-0" aria-hidden />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            className="input w-full sm:w-auto sm:min-w-[9.5rem]"
            aria-label="Sort palettes"
          >
            <option value="combined">Top combined</option>
            <option value="calmness">Calmness</option>
            <option value="premium">Premium</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const fullLabel = cat === 'all' ? 'All palettes' : CATEGORY_LABELS[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              title={fullLabel}
              aria-label={fullLabel}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'accent-bg text-[var(--accent-foreground)]'
                  : 'border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]'
              }`}
            >
              {CATEGORY_SHORT_LABELS[cat]}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onTopRatedChange(!topRatedOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
            topRatedOnly
              ? 'accent-bg text-[var(--accent-foreground)]'
              : 'border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]'
          }`}
        >
          <Star className="w-3 h-3" aria-hidden /> Top 8
        </button>
      </div>

      <p className="navigator-status type-caption flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span>
          Showing {resultCount} palette{resultCount !== 1 ? 's' : ''}
          {shortlistCount > 0 && ` · ${shortlistCount} shortlisted`}
          {hasSearch && ` · matching “${search.trim()}”`}
        </span>
        <span className="hidden sm:inline text-[var(--border)]" aria-hidden>
          |
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">→</kbd>
          <span>cycle palettes</span>
        </span>
      </p>
    </div>
  );
}