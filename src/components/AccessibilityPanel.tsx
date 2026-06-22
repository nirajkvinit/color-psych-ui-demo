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
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 accent-text" />
        <h3 className="font-semibold text-lg tracking-tight">Accessibility Checker</h3>
        <span
          className={`type-caption px-2 py-0.5 rounded-full font-medium ${
            allPass ? 'status-pass-bg' : 'status-warn-bg'
          }`}
        >
          {isDark ? 'Dark' : 'Light'} mode
        </span>
      </div>

      {allPass ? (
        <div className="flex items-center gap-2 text-sm status-pass mb-4">
          <CheckCircle2 className="w-4 h-4" />
          All token pairs pass WCAG AA for {palettes[currentKey].name}.
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm status-warn mb-4">
          <AlertTriangle className="w-4 h-4" />
          {failures.length} pair(s) need attention.
        </div>
      )}

      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={`${r.pair}-${r.mode}`}
            className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border)] last:border-0"
          >
            <span className="text-[var(--text-muted)]">{r.pair}</span>
            <span className="flex items-center gap-2 font-mono">
              <span className={r.passesAA ? 'status-pass' : 'status-warn'}>
                {r.ratio.toFixed(2)}:1
              </span>
              {r.passesAA ? (
                <CheckCircle2 className="w-3.5 h-3.5 status-pass" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 status-warn" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}