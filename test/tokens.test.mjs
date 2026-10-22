// node --test. Guards the design system against regressions: contrast, parity with the live site, build output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { contrast } from '../src/oklch.mjs';

const t = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url), 'utf8'));
const AA = 4.5;
const AA_LARGE = 3;

// Pairs used for body text and controls must pass AA in both themes.
const required = {
  dark: [
    ['text-primary', 'bg'], ['text-secondary', 'bg'], ['text-secondary', 'surface'], ['text-primary', 'surface'],
    ['brand-coral', 'bg'], ['bg', 'brand-coral'], ['accent-block-text', 'accent-block'],
    ['success', 'success-bg'], ['warning', 'warning-bg'], ['danger', 'danger-bg'], ['info', 'info-bg'],
  ],
  light: [
    ['text-primary', 'bg'], ['text-secondary', 'bg'], ['text-tertiary', 'bg'], ['text-secondary', 'surface'],
    ['brand-warm', 'bg'], ['bg', 'brand-warm'], ['accent-block-text', 'accent-block'],
    ['success', 'success-bg'], ['warning', 'warning-bg'], ['danger', 'danger-bg'], ['info', 'info-bg'],
  ],
};

for (const theme of ['dark', 'light']) {
  for (const [fg, bg] of required[theme]) {
    test(`${theme}: ${fg} on ${bg} passes AA`, () => {
      const ratio = contrast(t.color[theme][fg], t.color[theme][bg]);
      assert.ok(ratio >= AA, `${ratio.toFixed(2)} < ${AA}`);
    });
  }
}

// Known exceptions inherited from the live site; documented in DESIGN.md. Fail if they get worse.
test('dark: text-tertiary is only for large text or metadata (>= 3:1)', () => {
  assert.ok(contrast(t.color.dark['text-tertiary'], t.color.dark.bg) >= AA_LARGE);
});

test('the two themes define the same color tokens', () => {
  assert.deepEqual(Object.keys(t.color.dark).sort(), Object.keys(t.color.light).sort());
});

test('parity: brand and background tokens match the live otomatelabs.com styles.css', () => {
  assert.equal(t.color.dark.bg, 'oklch(8% 0.015 300)');
  assert.equal(t.color.dark['brand-warm'], 'oklch(58% 0.14 25)');
  assert.equal(t.color.dark['brand-coral'], 'oklch(72% 0.18 30)');
  assert.equal(t.motion['ease-smooth'], 'cubic-bezier(0.25, 1, 0.5, 1)');
  assert.equal(t.layout['max-width'], '1080px');
});

test('no pure black or white anywhere', () => {
  const all = JSON.stringify(t.color);
  assert.doesNotMatch(all, /#000\b|#fff\b|oklch\(0% 0 0\)|oklch\(100% 0 0\)/i);
});

test('build emits every dist file and the semantic shadcn variables', () => {
  execFileSync(process.execPath, [new URL('../scripts/build.mjs', import.meta.url).pathname]);
  for (const f of ['tokens.css', 'legacy.css', 'theme.css', 'motion.js', 'motion.d.ts', 'tokens.json']) {
    assert.ok(existsSync(new URL(`../dist/${f}`, import.meta.url)), f);
  }
  const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
  for (const v of ['--background:', '--primary:', '--ring:', '--product-accent:', 'prefers-reduced-motion']) {
    assert.ok(css.includes(v), v);
  }
  const theme = readFileSync(new URL('../dist/theme.css', import.meta.url), 'utf8');
  assert.match(theme, /--color-primary: var\(--primary\)/);
  assert.doesNotMatch(theme, /--font-display: var\(--font-display\)/, 'self-referencing theme variable');
});

test('motion presets load and use the smooth easing', async () => {
  const m = await import('../dist/motion.js');
  assert.deepEqual(m.ease.smooth, [0.25, 1, 0.5, 1]);
  assert.equal(m.fadeUp.visible.transition.duration, 0.8);
  assert.equal(m.reduced(m.fadeUp, true).hidden.opacity, 1);
});
