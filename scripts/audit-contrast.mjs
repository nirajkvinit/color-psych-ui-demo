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

// ── Semantic feedback tokens (global, defined in src/index.css) ──────────────
// Invariant: semantic tone *text* (alert icon/action, badge label, inline
// validation) is ALWAYS rendered on the tone's own muted ground — never on the
// ambient palette surface — because a single global colour can't clear 4.5:1 on
// 34 arbitrary surfaces. So we audit exactly that contract: each tone's solid
// (>= 4.5:1, used as text) and the palette --text (alert title/body) on the
// tone's muted fill, for every palette × mode. Muted grounds are palette-
// independent hex, so tone-on-muted is constant; --text-on-muted varies per
// palette and is the one that must be checked per palette.
const css = readFileSync(join(root, 'src/index.css'), 'utf8');

function cssBlock(sel) {
  const m = css.match(new RegExp('(?:^|\\n)' + sel + '\\s*\\{([\\s\\S]*?)\\}'));
  return m ? m[1] : '';
}
function cssVar(blockStr, name) {
  const m = blockStr.match(new RegExp('--' + name + '\\s*:\\s*([^;]+);'));
  return m ? m[1].trim() : null;
}
function toRgb(value, baseHex) {
  // hex → rgb; rgba/rgb → rgb composited over baseHex when translucent.
  if (value.startsWith('#')) return hexToRgb(value);
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(',').map((s) => parseFloat(s.trim()));
  const base = hexToRgb(baseHex);
  return [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)];
}
function lumRgb([r, g, b]) {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratioRgb(fg, bg) {
  const l1 = lumRgb(fg);
  const l2 = lumRgb(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const SEMANTIC_TONES = ['info', 'success', 'warning', 'danger'];
const cssByMode = { light: cssBlock(':root'), dark: cssBlock('\\.dark') };
let semanticChecks = 0;

for (const [key, palette] of Object.entries(palettes)) {
  for (const mode of ['light', 'dark']) {
    const vars = palette[mode];
    const blk = cssByMode[mode];
    for (const tone of SEMANTIC_TONES) {
      const solidHex = cssVar(blk, tone);
      const mutedRaw = cssVar(blk, `${tone}-muted`);
      if (!solidHex || !mutedRaw) continue;
      const solid = hexToRgb(solidHex);
      const muted = toRgb(mutedRaw, vars['--surface']);
      if (muted) {
        semanticChecks++;
        const rSolid = ratioRgb(solid, muted);
        if (rSolid < 4.5) failures.push({ key, mode, pair: `${tone} on ${tone}-muted`, foreground: solidHex, background: mutedRaw, ratio: rSolid.toFixed(2), minRatio: 4.5 });
        if (vars['--text']) {
          semanticChecks++;
          const rText = ratioRgb(hexToRgb(vars['--text']), muted);
          if (rText < 4.5) failures.push({ key, mode, pair: `text on ${tone}-muted`, foreground: vars['--text'], background: mutedRaw, ratio: rText.toFixed(2), minRatio: 4.5 });
        }
      }
    }
  }
}

if (failures.length === 0) {
  const total = Object.keys(palettes).length * 2 * TOKEN_PAIRS.length;
  console.log(
    `✓ All ${Object.keys(palettes).length} palettes pass WCAG AA (${total} palette + ${semanticChecks} semantic-token checks)`,
  );
  process.exit(0);
}

console.error(`✗ ${failures.length} contrast failure(s):\n`);
for (const f of failures) {
  console.error(
    `  ${f.key} [${f.mode}] ${f.pair}: ${f.foreground} on ${f.background} = ${f.ratio}:1 (need ${f.minRatio}:1)`,
  );
}
process.exit(1);