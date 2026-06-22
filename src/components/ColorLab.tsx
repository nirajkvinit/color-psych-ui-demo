import { Star } from 'lucide-react';
import type { ContextPreset } from '../types';
import { CONTEXT_PRESETS } from '../data/contextPresets';
import { CALM_PALETTES } from '../data';
import type { PaletteKey } from '../types';

interface ColorLabProps {
  currentPaletteKey: PaletteKey;
  contextPreset: ContextPreset;
  onContextChange: (preset: ContextPreset) => void;
  onOpenFeedback: () => void;
}

export function ColorLab({
  currentPaletteKey,
  contextPreset,
  onContextChange,
  onOpenFeedback,
}: ColorLabProps) {
  const preset = CONTEXT_PRESETS[contextPreset];
  const calmPercent = CALM_PALETTES.includes(currentPaletteKey) ? preset.calmIndex : preset.calmIndex - 14;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold accent-text">Live Color Psychology Lab</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Interact with components using the current accent. Test emotional impact in real-time.
          </p>
        </div>
        <button onClick={onOpenFeedback} className="btn btn-secondary flex items-center gap-2 text-sm shrink-0">
          <Star className="w-4 h-4" /> Rate This Palette
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(CONTEXT_PRESETS) as ContextPreset[]).map((id) => (
          <button
            key={id}
            onClick={() => onContextChange(id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              contextPreset === id
                ? 'accent-bg text-[var(--accent-foreground)]'
                : 'border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {CONTEXT_PRESETS[id].label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] -mt-2">{preset.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5">PRIMARY ACTION</div>
            <p className="font-medium mb-4">{preset.primaryAction}</p>
          </div>
          <button className="btn btn-primary w-full">{preset.primaryCta}</button>
        </div>

        <div className="card p-5 space-y-3">
          <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] mb-1">SECONDARY & GHOST</div>
          <button className="btn btn-secondary w-full">{preset.secondaryAction}</button>
          <button className="btn btn-ghost w-full">Learn about our methodology</button>
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] block mb-1.5">PROJECT NAME</label>
            <input type="text" className="input" defaultValue={preset.projectName} />
          </div>
          <div className="flex flex-wrap gap-2">
            {preset.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tag.includes('WCAG') || tag.includes('AA')
                    ? 'border border-[var(--border)]'
                    : tag === preset.tags[0]
                      ? 'accent-bg'
                      : 'bg-[var(--surface-2)]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Calm Perception Index</span>
            <span className="accent-text font-semibold">{calmPercent}%</span>
          </div>
          <div className="h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div className="h-full accent-bg transition-all duration-700" style={{ width: `${calmPercent}%` }} />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
            Curated benchmark score for this context preset
          </p>
        </div>
      </div>

      <p className="text-[10px] text-center text-[var(--text-muted)] italic">
        Components adapt to the selected palette and mode. Contrast validated via automated WCAG AA audit.
      </p>
    </div>
  );
}