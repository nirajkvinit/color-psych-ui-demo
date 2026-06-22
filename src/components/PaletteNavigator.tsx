import { Search, Star, SlidersHorizontal } from 'lucide-react';
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
  return (
    <div className="card p-4 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search palettes by name or psychology..."
            className="input pl-10"
            aria-label="Search palettes"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            className="input w-auto min-w-[140px]"
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat
                ? 'accent-bg text-[var(--accent-foreground)]'
                : 'border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {cat === 'all' ? 'All palettes' : CATEGORY_LABELS[cat]}
          </button>
        ))}
        <button
          onClick={() => onTopRatedChange(!topRatedOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
            topRatedOnly
              ? 'accent-bg text-[var(--accent-foreground)]'
              : 'border border-[var(--border)] hover:border-[var(--accent)]'
          }`}
        >
          <Star className="w-3 h-3" /> Top 8 rated
        </button>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Showing {resultCount} palette{resultCount !== 1 ? 's' : ''}
        {shortlistCount > 0 && ` • ${shortlistCount} shortlisted`}
        {' • '}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] font-mono text-[10px]">←</kbd>
        {' '}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] font-mono text-[10px]">→</kbd>
        {' '}to cycle palettes
      </p>
    </div>
  );
}