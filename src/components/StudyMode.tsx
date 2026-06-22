import { useState, useCallback } from 'react';
import { FlaskConical, ChevronRight, Trophy } from 'lucide-react';
import type { PaletteKey } from '../types';
import { palettes, TOP_RATED_PALETTES } from '../data';
import { PalettePreview } from './PalettePreview';

interface StudyModeProps {
  shortlist: PaletteKey[];
  onApply: (key: PaletteKey) => void;
}

const APPEARANCES = 3; // each candidate is shown ~3 times for a meaningful ranking

/**
 * Build a balanced set of pairings: every candidate appears ~APPEARANCES times
 * against a different palette, so the final win-count is an actual ranking rather
 * than the artefact of a few unrelated random matchups.
 */
function buildRounds(pool: PaletteKey[]): Array<[PaletteKey, PaletteKey]> {
  if (pool.length < 2) return [];
  const bag: PaletteKey[] = [];
  for (let i = 0; i < APPEARANCES; i++) bag.push(...pool);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  const rounds: Array<[PaletteKey, PaletteKey]> = [];
  for (let i = 0; i + 1 < bag.length; i += 2) {
    let b = bag[i + 1];
    if (bag[i] === b) {
      for (let j = i + 2; j < bag.length; j++) {
        if (bag[j] !== bag[i]) {
          [bag[i + 1], bag[j]] = [bag[j], bag[i + 1]];
          b = bag[i + 1];
          break;
        }
      }
    }
    if (bag[i] !== b) rounds.push([bag[i], b]);
  }
  return rounds;
}

function poolFor(shortlist: PaletteKey[]): PaletteKey[] {
  return shortlist.length >= 2 ? shortlist : TOP_RATED_PALETTES.slice(0, 6);
}

export function StudyMode({ shortlist, onApply }: StudyModeProps) {
  const [rounds, setRounds] = useState<Array<[PaletteKey, PaletteKey]>>([]);
  const [index, setIndex] = useState(0);
  const [wins, setWins] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const active = rounds.length > 0 && !done;

  const startStudy = useCallback(() => {
    setRounds(buildRounds(poolFor(shortlist)));
    setIndex(0);
    setWins({});
    setDone(false);
  }, [shortlist]);

  const exitStudy = useCallback(() => {
    setRounds([]);
    setIndex(0);
    setWins({});
    setDone(false);
  }, []);

  const pickWinner = (winner: PaletteKey) => {
    setWins((prev) => ({ ...prev, [winner]: (prev[winner] ?? 0) + 1 }));
    if (index + 1 >= rounds.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  // Idle (not started)
  if (!active && !done) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 accent-text" />
          <h3 className="font-semibold text-lg">Structured Study Mode</h3>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          A balanced preference tournament{shortlist.length >= 2 ? ' across your shortlist' : ' across the top-rated palettes'}.
          Each palette is shown about {APPEARANCES} times against others, then ranked by your choices.
        </p>
        <button onClick={startStudy} className="btn btn-primary text-sm">
          Start Study Session
        </button>
      </div>
    );
  }

  // Results
  if (done) {
    const standings = (Object.entries(wins) as [PaletteKey, number][]).sort(([, a], [, b]) => b - a);
    const winner = standings[0]?.[0];

    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 accent-text" />
          <h3 className="font-semibold text-lg">Study Complete</h3>
        </div>
        {winner ? (
          <>
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Top pick: <strong className="text-[var(--text)]">{palettes[winner].name}</strong> — {standings[0][1]} of{' '}
              {rounds.length} rounds.
            </p>
            <div className="space-y-1.5 mb-4">
              {standings.map(([key, count], i) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-[var(--text-muted)] tabular-nums">{i + 1}.</span>
                  <span className="flex-1">{palettes[key].name}</span>
                  <span className="font-mono text-[var(--text-muted)]">
                    {count} win{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onApply(winner)} className="btn btn-primary text-sm">
                Apply Winner
              </button>
              <button onClick={startStudy} className="btn btn-secondary text-sm">
                Run Again
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            No choices recorded.{' '}
            <button onClick={startStudy} className="accent-text underline">
              Try again
            </button>
            .
          </p>
        )}
      </div>
    );
  }

  // In progress
  const [a, b] = rounds[index];
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          Round {index + 1} of {rounds.length}
        </h3>
        <button onClick={exitStudy} className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
          Exit study
        </button>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4">Which palette feels more calm and premium for your product?</p>
      <div className="grid md:grid-cols-2 gap-4">
        {[a, b].map((key, side) => (
          <button
            key={`${key}-${side}`}
            onClick={() => pickWinner(key)}
            className="text-left rounded-xl border border-[var(--border)] hover:border-[var(--accent)] p-3 transition-all group"
          >
            <PalettePreview paletteKey={key} mode="light" />
            <div className="mt-2 flex items-center gap-1 text-xs font-medium accent-text opacity-0 group-hover:opacity-100 transition-opacity">
              Choose {palettes[key].name.split(' ')[0]} <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
