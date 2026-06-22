import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { PaletteDefinition } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface FeedbackModalProps {
  palette: PaletteDefinition;
  calmnessRating: number;
  premiumRating: number;
  onCalmnessChange: (v: number) => void;
  onPremiumChange: (v: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function FeedbackModal({
  palette,
  calmnessRating,
  premiumRating,
  onCalmnessChange,
  onPremiumChange,
  onSubmit,
  onClose,
}: FeedbackModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose);
  useFocusTrap(panelRef);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div id="feedback-title" className="font-semibold text-2xl tracking-tight">
              Rate {palette.name}
            </div>
            <p className="text-sm text-[var(--text-muted)]">Help us understand the emotional impact</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost p-2 rounded-xl text-xl leading-none min-w-[2.5rem]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">How calm & trustworthy does this feel?</span>
              <span className="font-mono tabular-nums accent-text">{calmnessRating}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={calmnessRating}
              onChange={(e) => onCalmnessChange(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <div className="flex justify-between type-caption mt-1">
              <div>Low Trust / Anxious</div>
              <div>Deeply Calm & Reliable</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">How premium & studio-quality is the experience?</span>
              <span className="font-mono tabular-nums accent-text">{premiumRating}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={premiumRating}
              onChange={(e) => onPremiumChange(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <div className="flex justify-between type-caption mt-1">
              <div>Basic / Generic</div>
              <div>Luxurious Studio Craft</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onSubmit} className="btn btn-primary flex-1">
            Submit My Ratings
          </button>
        </div>
        <p className="text-center type-caption mt-4">
          Stored locally in your browser. Export via the Contribute section.
        </p>
      </motion.div>
    </div>
  );
}