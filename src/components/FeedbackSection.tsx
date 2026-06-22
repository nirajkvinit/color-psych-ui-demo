import { Star, Download } from 'lucide-react';
import type { PaletteDefinition } from '../types';

interface FeedbackSectionProps {
  palette: PaletteDefinition;
  avgCalm: number;
  avgPremium: number;
  paletteRatingCount: number;
  totalRatings: number;
  onOpenFeedback: () => void;
  onExportCsv: () => void;
}

export function FeedbackSection({
  palette,
  avgCalm,
  avgPremium,
  paletteRatingCount,
  totalRatings,
  onOpenFeedback,
  onExportCsv,
}: FeedbackSectionProps) {
  return (
    <div className="card p-8 h-full">
      <h3 className="font-semibold text-2xl tracking-tight mb-2">Your Testing Impact</h3>
      <p className="text-[var(--text-muted)] mb-6">
        Contribute real perception data. Your ratings are stored locally and can be exported as CSV.
      </p>

      {paletteRatingCount > 0 ? (
        <div className="space-y-4">
          <div className="flex gap-8">
            <div>
              <div className="text-4xl font-semibold tabular-nums tracking-tighter">{avgCalm.toFixed(1)}</div>
              <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                YOUR AVG CALMNESS • {palette.name}
              </div>
            </div>
            <div>
              <div className="text-4xl font-semibold tabular-nums tracking-tighter">{avgPremium.toFixed(1)}</div>
              <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                YOUR AVG PREMIUM • {palette.name}
              </div>
            </div>
          </div>
          <p className="text-xs">
            Total contributions across all palettes:{' '}
            <span className="font-mono">{totalRatings}</span>.
          </p>
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-2xl">
          <Star className="mx-auto w-8 h-8 mb-3 opacity-40" />
          <p className="font-medium">No ratings yet for this palette.</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Use &quot;Rate This Palette&quot; in the Color Lab to contribute your perception data.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onOpenFeedback} className="btn btn-primary px-10">
          Open Feedback Form
        </button>
        {totalRatings > 0 && (
          <button onClick={onExportCsv} className="btn btn-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>
    </div>
  );
}