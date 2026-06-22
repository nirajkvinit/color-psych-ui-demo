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

  const curatedStats = [
    {
      label: 'Calmness Score',
      value: benchmark.calmness.toFixed(1),
      unit: '/10',
      icon: Heart,
      note: 'Curated benchmark for this palette',
    },
    {
      label: 'Premium Score',
      value: benchmark.premium.toFixed(1),
      unit: '/10',
      icon: Award,
      note: 'Curated benchmark for this palette',
    },
  ];

  const categoryStats = [
    {
      label: 'Trust Indicator',
      value: isCalm ? '94' : '81',
      unit: '%',
      icon: ShieldCheck,
      note: 'Illustrative category context',
    },
    {
      label: 'Engagement Indicator',
      value: isCalm ? '92' : '87',
      unit: '%',
      icon: TrendingUp,
      note: 'Illustrative category context',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="type-heading mb-1">Benchmark Scores</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Curated reference scores for the active palette. Rate palettes in the Color Lab to build your own dataset.
        </p>
      </div>

      {userRatingCount > 0 && (
        <div className="mb-8">
          <h3 className="type-label mb-3">Your ratings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Your calmness avg', value: userCalmAvg.toFixed(1), unit: '/10' },
              { label: 'Your premium avg', value: userPremiumAvg.toFixed(1), unit: '/10' },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 border-[var(--accent)]/30">
                <div className="type-label mb-2">{stat.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tabular-nums tracking-tight">{stat.value}</span>
                  <span className="text-lg text-[var(--text-muted)]">{stat.unit}</span>
                </div>
                <p className="type-caption mt-2">{userRatingCount} rating{userRatingCount !== 1 ? 's' : ''} for this palette</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="type-label mb-3">Curated benchmarks</h3>
      <div className="bento-grid mb-6">
        {curatedStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} whileHover={{ y: -4 }} className="bento-card card card-interactive group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="type-label">{stat.label}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tabular-nums tracking-[-1.5px]">{stat.value}</span>
                    <span className="text-xl text-[var(--text-muted)]">{stat.unit}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--surface-2)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 type-caption">{stat.note}</div>
            </motion.div>
          );
        })}
      </div>

      <h3 className="type-label mb-3">Category context</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card p-5 bg-[var(--surface-2)]/50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="type-caption font-medium uppercase tracking-wider">{stat.label}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums">{stat.value}</span>
                    <span className="text-base text-[var(--text-muted)]">{stat.unit}</span>
                  </div>
                </div>
                <Icon className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div className="mt-2 type-caption">{stat.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}