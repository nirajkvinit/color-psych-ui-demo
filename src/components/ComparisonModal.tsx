import { motion } from 'framer-motion';
import type { PaletteKey } from '../types';
import { palettes, paletteKeys } from '../data';
import { PalettePreview } from './PalettePreview';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface ComparisonModalProps {
  compareA: PaletteKey;
  compareB: PaletteKey;
  onCompareAChange: (key: PaletteKey) => void;
  onCompareBChange: (key: PaletteKey) => void;
  onApply: (key: PaletteKey) => void;
  onClose: () => void;
  paletteOptions?: PaletteKey[];
}

export function ComparisonModal({
  compareA,
  compareB,
  onCompareAChange,
  onCompareBChange,
  onApply,
  onClose,
  paletteOptions = paletteKeys,
}: ComparisonModalProps) {
  useEscapeKey(onClose);
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
        className="glass w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="font-semibold text-2xl tracking-tight">Side-by-Side Comparison</div>
            <p className="text-sm text-[var(--text-muted)]">
              Compare two palettes in light and dark mode before applying
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] text-2xl leading-none" aria-label="Close">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { label: 'Palette A', key: compareA, onChange: onCompareAChange, btnClass: 'btn-primary' },
            { label: 'Palette B', key: compareB, onChange: onCompareBChange, btnClass: 'btn-secondary' },
          ].map(({ label, key, onChange, btnClass }) => (
            <div key={label} className="space-y-3">
              <label className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">{label}</label>
              <select className="input text-sm" value={key} onChange={(e) => onChange(e.target.value as PaletteKey)}>
                {paletteOptions.map((k) => (
                  <option key={k} value={k}>
                    {palettes[k].name}
                  </option>
                ))}
              </select>
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Light</div>
                <PalettePreview paletteKey={key} mode="light" />
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Dark</div>
                <PalettePreview paletteKey={key} mode="dark" />
              </div>
              <button onClick={() => onApply(key)} className={`btn ${btnClass} w-full text-sm`}>
                Apply {palettes[key].name}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
          Curated benchmark scores • {palettes[compareA].researchNote.substring(0, 60)}...
        </div>
      </motion.div>
    </div>
  );
}