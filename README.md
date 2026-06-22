# Aether Lab • Color Psychology UI Demo

**Interactive React demo for corporate color psychology testing**

A premium studio-quality demo exploring 34 calm & warm corporate palettes, dark/light modes, glassmorphism, context presets, and local user feedback on emotional impact.

## Features

- **34 palettes** — modern + historical corporate calm & warmth collections
- **Search, filter & sort** — find palettes by name, category, or benchmark score
- **Shortlist (max 5)** — star finalists and compare your shortlist
- **Side-by-side comparison** — light + dark previews with curated scores
- **Context presets** — Fintech, AI Tool, Indian SMB, and General UI chrome
- **Structured study mode** — balanced preference tournament (each candidate shown ~3×, then ranked)
- **Accessibility panel** — live WCAG AA contrast checker per palette/mode
- **Brand-safe accent tokens** — `--accent` keeps the true brand color; a derived `--accent-text` guarantees ≥4.5:1 for accent-colored text
- **Export** — CSS variables, JSON tokens, or Tailwind theme (clipboard)
- **Benchmark scatter chart** — calmness × premium quadrant (lazy-loaded)
- **Local ratings + CSV export** — contribute perception data stored in browser
- **Keyboard navigation** — `←` `→` to cycle palettes (vertical scroll preserved)
- **Automated contrast CI** — `pnpm audit:contrast` validates 476 token pairs (incl. accent text)

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build
pnpm audit:contrast  # WCAG AA validation
```

## Architecture

```
src/
  data/          # palettes, scores, groups, context presets
  hooks/         # theme, shortlist, ratings, filters, keyboard nav
  components/    # UI modules (grid, lab, chart, modals, a11y)
  utils/         # contrast audit, theme export
scripts/
  audit-contrast.mjs   # CI contrast validation (pnpm audit:contrast)
  fix-contrast.mjs     # derives --accent-text + repairs muted/foreground; never
                       # mutates brand --accent/--bg (pnpm fix:contrast)
```

## Data Honesty

- **Benchmark scores** (calmness/premium metrics, trust %, chart) are curated illustrative data grounded in 2025–2026 research — not live analytics.
- **Your ratings** are real local contributions stored in `localStorage` and exportable as CSV.

## Recommended Starting Palettes

For Indian SMB SaaS in 2026:
- **Base:** Navy Authority or Aether Calm
- **Accent:** Forest & Brass or Honey & Teal

See `RESEARCH_AND_STRATEGY.md` for the full research guide.