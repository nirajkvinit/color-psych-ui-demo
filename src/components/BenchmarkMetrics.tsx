import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Award, TrendingUp } from 'lucide-react';
import type { PaletteKey } from '../types';
import { CALM_PALETTES } from '../data';
import { PALETTE_SCORES } from '../data/scores';

interface BenchmarkMetricsProps {
  currentKey: PaletteKey;
  userCalmAvg: number;
  userPremiumAvg: number;
  userRatingCount: number;
}

export function BenchmarkMetrics({
  currentKey,
  userCalmAvg,
  userPremiumAvg,
  userRatingCount,
}: BenchmarkMetricsProps) {
  const benchmark = PALETTE_SCORES[currentKey];
  const isCalm = CALM_PALETTES.includes(currentKey);

  const stats = [
    {
      label: 'Trust Benchmark',
      value: isCalm ? '94' : '81',
      unit: '%',
      icon: ShieldCheck,
      note: 'Curated category score',
    },
    {
      label: 'Calmness Score',
      value: userRatingCount > 0 ? userCalmAvg.toFixed(1) : benchmark.calmness.toFixed(1),
      unit: '/10',
      icon: Heart,
      note: userRatingCount > 0 ? `Your avg (${userRatingCount} ratings)` : 'Curated benchmark',
    },
    {
      label: 'Premium Score',
      value: userRatingCount > 0 ? userPremiumAvg.toFixed(1) : benchmark.premium.toFixed(1),
      unit: '/10',
      icon: Award,
      note: userRatingCount > 0 ? `Your avg (${userRatingCount} ratings)` : 'Curated benchmark',
    },
    {
      label: 'Engagement Benchmark',
      value: isCalm ? '92' : '87',
      unit: '%',
      icon: TrendingUp,
      note: 'Illustrative category score',
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-3xl font-semibold tracking-tight">Benchmark Scores</h2>
        <div className="text-xs px-3 py-1 rounded bg-[var(--surface-2)] text-[var(--text-muted)]">
          Curated illustrative data — not live analytics
        </div>
      </div>

      <div className="bento-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} whileHover={{ y: -4 }} className="bento-card card group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">{stat.label}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tabular-nums tracking-[-1.5px]">{stat.value}</span>
                    <span className="text-xl text-[var(--text-muted)]">{stat.unit}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--surface-2)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 text-xs text-[var(--text-muted)]">{stat.note}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}