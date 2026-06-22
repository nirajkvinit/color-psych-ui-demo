import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { auditPaletteContrast } from '../utils/contrast';

interface AccessibilityPanelProps {
  currentKey: PaletteKey;
  isDark: boolean;
}

export function AccessibilityPanel({ currentKey, isDark }: AccessibilityPanelProps) {
  const results = auditPaletteContrast(currentKey, palettes[currentKey]).filter(
    (r) => r.mode === (isDark ? 'dark' : 'light'),
  );
  const failures = results.filter((r) => !r.passesAA);
  const allPass = failures.length === 0;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 accent-text" />
        <h3 className="font-semibold text-lg tracking-tight">Accessibility Checker</h3>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            allPass ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
          }`}
        >
          {isDark ? 'Dark' : 'Light'} mode
        </span>
      </div>

      {allPass ? (
        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="w-4 h-4" />
          All token pairs pass WCAG AA for {palettes[currentKey].name}.
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 mb-4">
          <AlertTriangle className="w-4 h-4" />
          {failures.length} pair(s) need attention.
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {results.map((r) => (
          <div
            key={`${r.pair}-${r.mode}`}
            className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border)] last:border-0"
          >
            <span className="text-[var(--text-muted)]">{r.pair}</span>
            <span className="flex items-center gap-2 font-mono">
              <span className={r.passesAA ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                {r.ratio.toFixed(2)}:1
              </span>
              {r.passesAA ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}