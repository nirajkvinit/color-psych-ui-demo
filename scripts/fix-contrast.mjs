#!/usr/bin/env node
/**
 * Accessibility token generator for src/data/palettes.ts.
 *
 * Principles:
 *  - NEVER mutate brand identity tokens (--accent, --bg, --surface). The whole
 *    point of this demo is showing accurate, research/era-accurate colors.
 *  - Derive a separate --accent-text token: a hue-preserving, lightness-adjusted
 *    version of --accent that is legible (>= 4.5:1) as TEXT on both --bg and
 *    --surface. UI uses --accent for fills/buttons and --accent-text for text.
 *  - Repair --text-muted and --accent-foreground to pass AA, adjusting only
 *    lightness in HSL so hue/character is preserved (no muddy uniform-RGB shift).
 *
 * Idempotent: safe to re-run. Usage: pnpm fix:contrast
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const palettesPath = join(__dirname, '../src/data/palettes.ts');

const TARGET = 4.55; // small margin above 4.5 so hex rounding can't drop us under

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');
}
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb([h, s, l]) {
  if (s === 0) { const v = l * 255; return [v, v, v]; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)].map((c) => c * 255);
}

/** Adjust only lightness (hue/sat preserved) until `color` clears TARGET on every bg. */
function adjustLightnessForContrast(color, bgs) {
  const passes = (hex) => bgs.every((bg) => contrastRatio(hex, bg) >= TARGET);
  if (passes(color)) return color;

  const [h, s] = rgbToHsl(hexToRgb(color));
  // Backgrounds are same-side within a mode; darken on light bgs, lighten on dark bgs.
  const avgBgLum = bgs.reduce((sum, bg) => sum + relativeLuminance(bg), 0) / bgs.length;
  const darken = avgBgLum > 0.4;

  let best = color;
  const startL = rgbToHsl(hexToRgb(color))[2];
  for (let i = 1; i <= 100; i++) {
    const l = darken ? Math.max(0, startL - i / 100) : Math.min(1, startL + i / 100);
    const hex = rgbToHex(hslToRgb([h, s, l]));
    best = hex;
    if (passes(hex)) return hex;
    if (l === 0 || l === 1) break;
  }
  return best; // best effort (audit will flag if even black/white can't reach it)
}

/** Pick legible text color for an accent button background. */
function fixAccentForeground(current, accent) {
  if (contrastRatio(current, accent) >= TARGET) return current;
  const candidates = ['#0f172a', '#ffffff', '#000000'];
  let best = candidates[0];
  let bestRatio = 0;
  for (const c of candidates) {
    const r = contrastRatio(c, accent);
    if (r >= TARGET) return c;
    if (r > bestRatio) { bestRatio = r; best = c; }
  }
  return best;
}

const src = readFileSync(palettesPath, 'utf8');
const match = src.match(/export const palettes[^=]*=\s*(\{[\s\S]*\});?\s*$/);
if (!match) { console.error('Could not parse palettes'); process.exit(2); }
const palettes = Function(`"use strict"; return (${match[1]});`)();

let mutedFixes = 0, fgFixes = 0, accentTextAdded = 0;

for (const palette of Object.values(palettes)) {
  for (const mode of ['light', 'dark']) {
    const v = palette[mode];
    const bg = v['--bg'];
    const surface = v['--surface'];
    const surface2 = v['--surface-2'];
    const accent = v['--accent'];
    // All three surfaces text can actually sit on (cards, chips, active pills, hovers).
    const textBgs = [bg, surface, surface2].filter(Boolean);

    // --text-muted: keep legible on every surface it renders on, hue preserved.
    if (v['--text-muted']) {
      const fixed = adjustLightnessForContrast(v['--text-muted'], textBgs);
      if (fixed !== v['--text-muted']) { v['--text-muted'] = fixed; mutedFixes++; }
    }

    // --accent-text: derived legible variant of the brand accent for accent-colored text.
    const accentText = adjustLightnessForContrast(accent, textBgs);
    if (v['--accent-text'] !== accentText) { v['--accent-text'] = accentText; accentTextAdded++; }

    // --accent-foreground: legible text ON the accent button.
    if (v['--accent-foreground']) {
      const fixed = fixAccentForeground(v['--accent-foreground'], accent);
      if (fixed !== v['--accent-foreground']) { v['--accent-foreground'] = fixed; fgFixes++; }
    }
  }
}

function quoteKey(k) { return k.startsWith('--') ? `'${k}'` : k; }
function toTs(obj, indent = 1) {
  const pad = '  '.repeat(indent);
  const entries = Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        return `${pad}${quoteKey(k)}: ${toTs(v, indent + 1)}`;
      }
      return `${pad}${quoteKey(k)}: ${JSON.stringify(v)}`;
    })
    .join(',\n');
  return `{\n${entries}\n${'  '.repeat(indent - 1)}}`;
}

writeFileSync(
  palettesPath,
  `import type { PaletteDefinition, PaletteKey } from '../types';

export const palettes: Record<PaletteKey, PaletteDefinition> = ${toTs(palettes)};
`,
);

console.log(
  `Done. accent-text set: ${accentTextAdded}, text-muted repaired: ${mutedFixes}, accent-foreground repaired: ${fgFixes}.`,
);
