import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ZAxis,
  Cell,
} from 'recharts';
import type { PaletteKey } from '../types';
import { palettes, paletteKeys, TOP_RATED_PALETTES } from '../data';
import { PALETTE_SCORES } from '../data/scores';

interface BenchmarkChartProps {
  currentKey: PaletteKey;
  onSelectPalette: (key: PaletteKey) => void;
}

type ViewMode = 'scatter' | 'top8';

export function BenchmarkChart({ currentKey, onSelectPalette }: BenchmarkChartProps) {
  const [view, setView] = useState<ViewMode>('scatter');

  const scatterData = useMemo(
    () =>
      paletteKeys.map((key) => ({
        key,
        name: palettes[key].name,
        calmness: PALETTE_SCORES[key].calmness,
        premium: PALETTE_SCORES[key].premium,
        z: 80,
      })),
    [],
  );

  const top8 = useMemo(
    () => TOP_RATED_PALETTES.map((key) => ({
      key,
      name: palettes[key].name.split(' ')[0],
      calmness: PALETTE_SCORES[key].calmness,
      premium: PALETTE_SCORES[key].premium,
    })),
    [],
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="type-heading">Perceived Impact by Palette</h2>
          <p className="text-[var(--text-muted)] text-sm">
            Click a point or bar to preview that palette in the live theme.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('scatter')}
            className={`btn text-xs ${view === 'scatter' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Quadrant View
          </button>
          <button
            onClick={() => setView('top8')}
            className={`btn text-xs ${view === 'top8' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Top 8
          </button>
        </div>
      </div>

      <div className="card p-6">
        {view === 'scatter' ? (
          <ResponsiveContainer width="100%" height={420}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />
              {/* Quadrant guides: top-right = high calm + high premium ("ideal") */}
              <ReferenceArea
                x1={8}
                x2={10}
                y1={8}
                y2={10}
                fill="var(--accent)"
                fillOpacity={0.06}
                ifOverflow="hidden"
              />
              <ReferenceLine x={8} stroke="var(--border)" strokeDasharray="4 4" />
              <ReferenceLine
                y={8}
                stroke="var(--border)"
                strokeDasharray="4 4"
                label={{ value: 'Calm + Premium ↗', position: 'insideTopRight', fill: 'var(--text-muted)', fontSize: 10 }}
              />
              <XAxis
                type="number"
                dataKey="calmness"
                name="Calmness"
                domain={[6, 10]}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                label={{ value: 'Calmness →', position: 'bottom', fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="premium"
                name="Premium"
                domain={[6, 10]}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                label={{ value: 'Premium →', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                }}
                formatter={(value, name) => [Number(value).toFixed(1), name]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''}
              />
              <Scatter
                data={scatterData}
                onClick={(data) => {
                  const key = (data as { key?: PaletteKey }).key;
                  if (key) onSelectPalette(key);
                }}
                style={{ cursor: 'pointer' }}
              >
                {scatterData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={entry.key === currentKey ? 'var(--accent-light)' : 'var(--accent)'}
                    opacity={entry.key === currentKey ? 1 : 0.7}
                    // Always stroke so bright/low-contrast accents stay visible against the surface.
                    stroke={entry.key === currentKey ? 'var(--text)' : 'var(--border)'}
                    strokeWidth={entry.key === currentKey ? 2 : 1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="space-y-3">
            {top8.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelectPalette(item.key)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                  item.key === currentKey
                    ? 'border-[var(--accent)] bg-[var(--surface-2)]'
                    : 'border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <span className="font-medium w-28 shrink-0">{item.name}</span>
                <div className="flex-1 flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">Calmness</div>
                    <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <div className="h-full accent-bg" style={{ width: `${item.calmness * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">Premium</div>
                    <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.premium * 10}%`, backgroundColor: 'var(--accent-light)' }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">
                  {item.calmness}/{item.premium}
                </span>
              </button>
            ))}
          </div>
        )}
        <p className="text-center type-caption mt-4">
          Higher calmness and premium scores indicate stronger positive response in corporate contexts.
        </p>
      </div>
    </div>
  );
}