import { ShieldCheck, Leaf, Zap, Award } from 'lucide-react';

export function ResearchPanel() {
  return (
    <div className="card h-full p-7 psych-panel">
      <div className="uppercase tracking-[2px] text-xs mb-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> GROUNDED RESEARCH
      </div>
      <h3 className="font-semibold text-2xl tracking-tight mb-6">Why These Colors Work</h3>

      <div className="space-y-6 text-sm">
        <div>
          <div className="font-medium mb-1 flex items-center gap-2">
            <Leaf className="w-4 h-4 accent-text" /> Cool Tones (Teal/Blue/Green)
          </div>
          <p className="text-[var(--text-muted)]">
            Build trust & reduce anxiety. Blue is the most trusted brand color globally. Ideal for corporate decision interfaces.
          </p>
        </div>
        <div>
          <div className="font-medium mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 accent-text" /> Warm Accents
          </div>
          <p className="text-[var(--text-muted)]">
            Drive action and human warmth. Best used strategically for CTAs rather than primary UI to maintain overall calm.
          </p>
        </div>
        <div>
          <div className="font-medium mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 accent-text" /> 2026 Trends
          </div>
          <p className="text-[var(--text-muted)]">
            Verdant greens & Digital Lavender rising for premium wellness/tech. Glassmorphism + minimalism for sophisticated depth.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
        Sources: Smashing Magazine Color Psych 2025 • WithLoveInternet UX Guide 2026 • Adobe Brand Color Report.
      </div>
    </div>
  );
}