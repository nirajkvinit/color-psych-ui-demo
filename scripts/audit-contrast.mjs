#!/usr/bin/env node
/**
 * CI contrast audit — validates WCAG AA token pairs for every palette × mode.
 * Run: node scripts/audit-contrast.mjs
 * Exit code 1 if any pair fails AA requirements.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
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

const TOKEN_PAIRS = [
  { pair: 'text on bg', fg: '--text', bg: '--bg', minRatio: 4.5 },
  { pair: 'text-muted on bg', fg: '--text-muted', bg: '--bg', minRatio: 4.5 },
  { pair: 'text on surface', fg: '--text', bg: '--surface', minRatio: 4.5 },
  { pair: 'text-muted on surface', fg: '--text-muted', bg: '--surface', minRatio: 4.5 },
  { pair: 'text-muted on surface-2', fg: '--text-muted', bg: '--surface-2', minRatio: 4.5 },
  // Accent is a brand/fill color; legible accent *text* uses the derived --accent-text token.
  { pair: 'accent-text on bg', fg: '--accent-text', bg: '--bg', minRatio: 4.5 },
  { pair: 'accent-text on surface', fg: '--accent-text', bg: '--surface', minRatio: 4.5 },
  { pair: 'accent-text on surface-2', fg: '--accent-text', bg: '--surface-2', minRatio: 4.5 },
  { pair: 'accent-foreground on accent', fg: '--accent-foreground', bg: '--accent', minRatio: 4.5 },
];

// Parse palettes from generated TS (eval the object literal)
const palettesSrc = readFileSync(join(root, 'src/data/palettes.ts'), 'utf8');
const match = palettesSrc.match(/export const palettes[^=]*=\s*(\{[\s\S]*\});?\s*$/);
if (!match) {
  console.error('Could not parse palettes from src/data/palettes.ts');
  process.exit(2);
}

const palettes = Function(`"use strict"; return (${match[1]});`)();

const failures = [];

for (const [key, palette] of Object.entries(palettes)) {
  for (const mode of ['light', 'dark']) {
    const vars = palette[mode];
    for (const { pair, fg, bg, minRatio } of TOKEN_PAIRS) {
      const foreground = vars[fg];
      const background = vars[bg];
      if (!foreground || !background) continue;
      const ratio = contrastRatio(foreground, background);
      if (ratio < minRatio) {
        failures.push({ key, mode, pair, foreground, background, ratio: ratio.toFixed(2), minRatio });
      }
    }
  }
}

if (failures.length === 0) {
  const total = Object.keys(palettes).length * 2 * TOKEN_PAIRS.length;
  console.log(`✓ All ${Object.keys(palettes).length} palettes pass WCAG AA (${total} checks)`);
  process.exit(0);
}

console.error(`✗ ${failures.length} contrast failure(s):\n`);
for (const f of failures) {
  console.error(
    `  ${f.key} [${f.mode}] ${f.pair}: ${f.foreground} on ${f.background} = ${f.ratio}:1 (need ${f.minRatio}:1)`,
  );
}
process.exit(1);