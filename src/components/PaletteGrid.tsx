import { Star } from 'lucide-react';
import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { PALETTE_SCORES } from '../data/scores';

interface PaletteGridProps {
  keys: PaletteKey[];
  currentKey: PaletteKey;
  onSelect: (key: PaletteKey) => void;
  isShortlisted: (key: PaletteKey) => boolean;
  onToggleShortlist: (key: PaletteKey) => void;
  groupTitle?: string;
  groupBadge?: string;
}

export function PaletteGrid({
  keys,
  currentKey,
  onSelect,
  isShortlisted,
  onToggleShortlist,
  groupTitle,
  groupBadge,
}: PaletteGridProps) {
  if (keys.length === 0) return null;

  return (
    <div>
      {groupTitle && (
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold tracking-tight">{groupTitle}</h3>
          {groupBadge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
              {groupBadge}
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {keys.map((key) => {
          const pal = palettes[key];
          const isActive = key === currentKey;
          const shortlisted = isShortlisted(key);
          return (
            <div key={key} className="relative group/card">
              <button
                onClick={() => onSelect(key)}
                className={`palette-pill text-left flex-col items-start h-auto py-5 px-6 w-full ${
                  isActive ? 'active ring-1 ring-offset-2 ring-offset-[var(--bg)] ring-[var(--accent)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 w-full mb-3">
                  <div className="flex -space-x-1">
                    <div className="color-swatch" style={{ backgroundColor: pal.light['--accent'] }} />
                    <div className="color-swatch" style={{ backgroundColor: pal.dark['--accent'] }} />
                  </div>
                  <div className="font-semibold text-lg tracking-tight flex-1">{pal.name}</div>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-snug">{pal.psych}</p>
                <div className="mt-2 flex gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                  <span>Calm {PALETTE_SCORES[key].calmness}</span>
                  <span>Premium {PALETTE_SCORES[key].premium}</span>
                </div>
                {isActive && (
                  <div className="mt-3 text-[10px] font-mono accent-text">CURRENTLY ACTIVE • LIVE PREVIEW</div>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleShortlist(key);
                }}
                className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors ${
                  shortlisted
                    ? 'accent-bg text-[var(--accent-foreground)]'
                    : 'bg-[var(--surface)] border border-[var(--border)] opacity-0 group-hover/card:opacity-100 text-[var(--text-muted)]'
                }`}
                aria-label={shortlisted ? `Remove ${pal.name} from shortlist` : `Shortlist ${pal.name}`}
                title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist (max 5)'}
              >
                <Star className={`w-3.5 h-3.5 ${shortlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}