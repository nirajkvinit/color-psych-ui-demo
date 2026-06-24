import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Shuffle, Columns2, RefreshCw, History, Heart, ShieldCheck } from 'lucide-react';

import type { ContextPreset, PaletteCategory, PaletteKey } from './types';
import {
  palettes,
  paletteKeys,
  TOP_RATED_PALETTES,
  MODERN_CALM_PALETTES,
  HISTORICAL_CALM_PALETTES,
  MODERN_WARM_PALETTES,
  HISTORICAL_WARM_PALETTES,
  CATEGORY_LABELS,
} from './data';
import { useTheme } from './hooks/useTheme';
import { useLiquidGlass } from './hooks/useLiquidGlass';
import { useShortlist } from './hooks/useShortlist';
import { useUserRatings } from './hooks/useUserRatings';
import { useKeyboardPaletteNav } from './hooks/useKeyboardPaletteNav';
import { usePaletteFilter } from './hooks/usePaletteFilter';
import { exportTheme } from './utils/exportTheme';

import { AppChrome } from './components/AppChrome';
import { Header } from './components/Header';
import { SectionNav } from './components/SectionNav';
import { PaletteNavigator } from './components/PaletteNavigator';
import { PaletteGrid } from './components/PaletteGrid';
import { ColorLab } from './components/ColorLab';
import { ComponentGallery } from './components/ComponentGallery';
import { BenchmarkMetrics } from './components/BenchmarkMetrics';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { ResearchPanel } from './components/ResearchPanel';
import { FeedbackSection } from './components/FeedbackSection';
import { StudyMode } from './components/StudyMode';
import { FeedbackModal } from './components/FeedbackModal';
import { ComparisonModal } from './components/ComparisonModal';
import { FloatingRadialMenu } from './components/FloatingRadialMenu';
import { FloatingShortlistStack } from './components/FloatingShortlistStack';

const BenchmarkChart = lazy(() =>
  import('./components/BenchmarkChart').then((m) => ({ default: m.BenchmarkChart })),
);

const CATEGORY_GROUPS: Array<{
  category: PaletteCategory;
  badge: string;
  icon: React.ReactNode;
}> = [
  { category: 'modern-calm', badge: '2020s–2026 Research', icon: <ShieldCheck className="w-4 h-4 accent-text" /> },
  { category: 'historical-calm', badge: '1950s–1990s Era Classics', icon: <History className="w-4 h-4 accent-text" /> },
  { category: 'modern-warm', badge: '2020s–2026 Research', icon: <Heart className="w-4 h-4 accent-text" /> },
  { category: 'historical-warm', badge: '1940s–1980s Era Classics', icon: <History className="w-4 h-4 accent-text" /> },
];

const App: React.FC = () => {
  const { isDark, setIsDark, toggleTheme, currentPaletteKey, setCurrentPaletteKey, currentPalette } = useTheme();
  const { isLiquidGlass, toggleLiquidGlass } = useLiquidGlass();
  const { shortlist, toggleShortlist, clearShortlist, isShortlisted } = useShortlist();
  const { userRatings, submitRating, getAverages, exportCsv } = useUserRatings();
  const filter = usePaletteFilter(paletteKeys);

  const [contextPreset, setContextPreset] = useState<ContextPreset>('general');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [compareA, setCompareA] = useState<PaletteKey>('calm');
  const [compareB, setCompareB] = useState<PaletteKey>('navy');
  const [calmnessRating, setCalmnessRating] = useState(7);
  const [premiumRating, setPremiumRating] = useState(8);

  const switchPalette = useCallback(
    (key: PaletteKey) => {
      if (key === currentPaletteKey) return;
      setCurrentPaletteKey(key);
    },
    [currentPaletteKey, setCurrentPaletteKey],
  );

  useKeyboardPaletteNav(currentPaletteKey, switchPalette);

  const quickNavKeys = useMemo(
    () => (shortlist.length > 0 ? shortlist : TOP_RATED_PALETTES.slice(0, 6)),
    [shortlist],
  );

  const comparisonOptions = useMemo(
    () => (shortlist.length >= 2 ? shortlist : paletteKeys),
    [shortlist],
  );

  const userAvg = getAverages(currentPaletteKey);

  const handleToggleTheme = () => {
    toggleTheme();
    toast.success(isDark ? 'Light mode activated' : 'Dark mode activated', {
      description: 'Theme preference saved.',
    });
  };

  const handleToggleLiquidGlass = () => {
    toggleLiquidGlass();
    toast.success(isLiquidGlass ? 'Liquid Glass off' : 'Liquid Glass on', {
      description: isLiquidGlass
        ? 'Solid surfaces restored for comparison.'
        : 'macOS-style translucency, refraction, and specular highlights.',
    });
  };

  const randomPalette = () => {
    const keys = paletteKeys.filter((k) => k !== currentPaletteKey);
    const randomKey = keys[Math.floor(Math.random() * keys.length)] ?? 'calm';
    setCurrentPaletteKey(randomKey);
    toast.success(`Random palette: ${palettes[randomKey].name}`);
  };

  const surpriseMe = () => {
    const keys = paletteKeys.filter((k) => k !== currentPaletteKey);
    const randomKey = keys[Math.floor(Math.random() * keys.length)] ?? 'calm';
    const nextDark = Math.random() > 0.5;
    setCurrentPaletteKey(randomKey);
    setIsDark(nextDark);
    toast.success(`Surprise: ${palettes[randomKey].name}`, {
      description: nextDark ? 'Dark mode' : 'Light mode',
    });
  };

  const openComparison = () => {
    setCompareA(currentPaletteKey);
    setCompareB(comparisonOptions.find((k) => k !== currentPaletteKey) ?? 'navy');
    setShowComparisonModal(true);
  };

  const handleExport = async (format: 'css' | 'json' | 'tailwind') => {
    const content = exportTheme(currentPalette, currentPaletteKey, isDark, format);
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`Exported as ${format.toUpperCase()}`, { description: 'Copied to clipboard.' });
    } catch {
      toast.error('Could not copy to clipboard', {
        description: 'Clipboard access needs a secure (https) context.',
      });
    }
  };

  const handleSubmitFeedback = () => {
    submitRating(currentPaletteKey, calmnessRating, premiumRating);
    setShowFeedbackModal(false);
    setCalmnessRating(7);
    setPremiumRating(8);
    toast.success('Rating saved locally', { description: `Thanks for rating ${currentPalette.name}.` });
  };

  const handleExportCsv = () => {
    const csv = exportCsv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aether-lab-ratings.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Ratings exported as CSV');
  };

  const filteredByGroup = useCallback(
    (category: PaletteCategory) =>
      filter.filteredKeys.filter((k) => {
        const groups: Record<PaletteCategory, PaletteKey[]> = {
          'modern-calm': MODERN_CALM_PALETTES,
          'historical-calm': HISTORICAL_CALM_PALETTES,
          'modern-warm': MODERN_WARM_PALETTES,
          'historical-warm': HISTORICAL_WARM_PALETTES,
        };
        return groups[category].includes(k);
      }),
    [filter.filteredKeys],
  );

  const showGrouped = filter.category === 'all' && !filter.search && !filter.topRatedOnly;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)]">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <AppChrome>
        <Header
          currentKey={currentPaletteKey}
          onSelectPalette={switchPalette}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isLiquidGlass={isLiquidGlass}
          onToggleLiquidGlass={handleToggleLiquidGlass}
          onExport={handleExport}
          quickNavKeys={quickNavKeys}
          allPaletteKeys={paletteKeys}
        />
        <SectionNav palette={currentPalette} isDark={isDark} />
      </AppChrome>

      <main id="main" className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="max-w-3xl mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="type-eyebrow px-4 py-1 rounded-full bg-[var(--surface-2)]">
              Premium studio • Research-backed
            </div>
            <span className="demo-badge">Demo data — curated benchmarks</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight lg:tracking-[-3.5px] leading-[0.95] mb-6">
            Test Color Psychology.<br />Craft Premium Calm.
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-lg">
            A live React demo exploring 34 modern & historical corporate calm & warmth palettes, dark/light modes, and
            studio-quality micro-interactions. Built to validate emotional impact through real interaction.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary px-8 py-3.5 text-base"
            >
              Enter the Color Lab
            </button>
            <button
              onClick={() => document.getElementById('palettes')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary px-8 py-3.5 text-base"
            >
              Browse All Palettes
            </button>
          </div>
          <p className="type-caption mt-4">
            Synthesized from 2025–2026 studies on color psych, UX trends, and visual ergonomics.
          </p>
        </div>

        <div id="lab" className="mb-16 scroll-mt-sticky">
          <div className="card glass p-8 md:p-10">
            <ColorLab
              currentPaletteKey={currentPaletteKey}
              contextPreset={contextPreset}
              onContextChange={setContextPreset}
              onOpenFeedback={() => setShowFeedbackModal(true)}
            />
            <div className="mt-10">
              <ComponentGallery />
            </div>
          </div>
        </div>

        <div className="mb-12 space-y-6 scroll-mt-sticky" id="palettes">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="type-eyebrow">Choose your accent</div>
              <h2 className="type-heading">Corporate Color Palettes</h2>
              <p className="type-caption mt-1">
                {paletteKeys.length} palettes — {MODERN_CALM_PALETTES.length + MODERN_WARM_PALETTES.length} modern +{' '}
                {HISTORICAL_CALM_PALETTES.length + HISTORICAL_WARM_PALETTES.length} historical
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={randomPalette} className="btn btn-secondary text-xs flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5" /> Random palette
              </button>
              <button onClick={surpriseMe} className="btn btn-secondary text-xs flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5" /> Surprise me
              </button>
              <button onClick={openComparison} className="btn btn-secondary text-xs flex items-center gap-1.5">
                <Columns2 className="w-3.5 h-3.5" /> Compare
              </button>
              {shortlist.length >= 2 && (
                <button
                  onClick={() => {
                    setCompareA(shortlist[0]);
                    setCompareB(shortlist[1]);
                    setShowComparisonModal(true);
                  }}
                  className="btn btn-secondary text-xs"
                >
                  Compare Shortlist
                </button>
              )}
            </div>
          </div>

          <PaletteNavigator
            search={filter.search}
            onSearchChange={filter.setSearch}
            category={filter.category}
            onCategoryChange={filter.setCategory}
            sort={filter.sort}
            onSortChange={filter.setSort}
            topRatedOnly={filter.topRatedOnly}
            onTopRatedChange={filter.setTopRatedOnly}
            resultCount={filter.filteredKeys.length}
            shortlistCount={shortlist.length}
          />

          <div className="space-y-10">
            {showGrouped ? (
              CATEGORY_GROUPS.map(({ category, badge }) => {
                const keys = filteredByGroup(category);
                if (keys.length === 0) return null;
                return (
                  <PaletteGrid
                    key={category}
                    keys={keys}
                    currentKey={currentPaletteKey}
                    onSelect={switchPalette}
                    isShortlisted={isShortlisted}
                    onToggleShortlist={toggleShortlist}
                    groupTitle={CATEGORY_LABELS[category]}
                    groupBadge={badge}
                  />
                );
              })
            ) : (
              <PaletteGrid
                keys={filter.filteredKeys}
                currentKey={currentPaletteKey}
                onSelect={switchPalette}
                isShortlisted={isShortlisted}
                onToggleShortlist={toggleShortlist}
              />
            )}
            {filter.filteredKeys.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-12">No palettes match your filters.</p>
            )}
          </div>
        </div>

        <div id="insights" className="mb-16 scroll-mt-sticky">
          <BenchmarkMetrics
            currentKey={currentPaletteKey}
            userCalmAvg={userAvg.calmness}
            userPremiumAvg={userAvg.premium}
            userRatingCount={userAvg.count}
          />
        </div>

        <div id="chart" className="mb-16 scroll-mt-sticky">
          <Suspense
            fallback={
              <div className="card p-12 text-center text-[var(--text-muted)]">Loading chart…</div>
            }
          >
            <BenchmarkChart currentKey={currentPaletteKey} onSelectPalette={switchPalette} />
          </Suspense>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => switchPalette('calm')}
              className="btn btn-ghost text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Calm Baseline
            </button>
          </div>
        </div>

        <div id="accessibility" className="mb-16 scroll-mt-sticky max-w-3xl">
          <AccessibilityPanel currentKey={currentPaletteKey} isDark={isDark} />
        </div>

        <div id="contribute" className="space-y-6 mb-16 scroll-mt-sticky">
          <div>
            <h2 className="type-heading mb-1">Contribute & learn</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Rate palettes, run preference studies, and explore the research behind each color choice.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <FeedbackSection
              palette={currentPalette}
              avgCalm={userAvg.calmness}
              avgPremium={userAvg.premium}
              paletteRatingCount={userAvg.count}
              totalRatings={userRatings.length}
              onOpenFeedback={() => setShowFeedbackModal(true)}
              onExportCsv={handleExportCsv}
            />
            <StudyMode shortlist={shortlist} onApply={switchPalette} />
          </div>
          <ResearchPanel />
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg)] py-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-y-3 items-center">
            <div>© Aether Lab 2026 — Research-grade demo for corporate color psychology testing.</div>
            <div className="flex flex-wrap gap-5 justify-center">
              <span>WCAG AA audited palettes</span>
              <span>34 palettes • 4 context presets</span>
              <span>React 19 + Tailwind + Framer Motion</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start border-t border-[var(--border)] pt-4">
            <a
              href="#accessibility"
              className="hover:text-[var(--text)] transition-colors underline-offset-2 hover:underline"
            >
              Contrast audit
            </a>
            {userRatings.length > 0 ? (
              <button
                type="button"
                onClick={handleExportCsv}
                className="hover:text-[var(--text)] transition-colors underline-offset-2 hover:underline"
              >
                Export ratings CSV
              </button>
            ) : (
              <a
                href="#contribute"
                className="hover:text-[var(--text)] transition-colors underline-offset-2 hover:underline"
              >
                Contribute ratings
              </a>
            )}
            <a
              href="https://github.com/Aman-CERP/color-psych-ui-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text)] transition-colors underline-offset-2 hover:underline"
            >
              View source
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showFeedbackModal && (
          <FeedbackModal
            palette={currentPalette}
            calmnessRating={calmnessRating}
            premiumRating={premiumRating}
            onCalmnessChange={setCalmnessRating}
            onPremiumChange={setPremiumRating}
            onSubmit={handleSubmitFeedback}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}
      </AnimatePresence>

      <FloatingShortlistStack
        shortlist={shortlist}
        currentKey={currentPaletteKey}
        palette={currentPalette}
        isDark={isDark}
        onSelectPalette={switchPalette}
        onToggleShortlist={toggleShortlist}
        onCompare={() => {
          setCompareA(shortlist[0]);
          setCompareB(shortlist[1]);
          setShowComparisonModal(true);
        }}
        onClear={clearShortlist}
      />

      <FloatingRadialMenu
        currentKey={currentPaletteKey}
        palette={currentPalette}
        isDark={isDark}
        isLiquidGlass={isLiquidGlass}
        quickPaletteKeys={quickNavKeys}
        onSelectPalette={switchPalette}
        onToggleTheme={handleToggleTheme}
        onToggleLiquidGlass={handleToggleLiquidGlass}
      />

      <AnimatePresence>
        {showComparisonModal && (
          <ComparisonModal
            compareA={compareA}
            compareB={compareB}
            onCompareAChange={setCompareA}
            onCompareBChange={setCompareB}
            onApply={(key) => {
              switchPalette(key);
              setShowComparisonModal(false);
            }}
            onClose={() => setShowComparisonModal(false)}
            paletteOptions={comparisonOptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;