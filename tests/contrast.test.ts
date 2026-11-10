import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const token = (name: string) => css.match(new RegExp(`--${name}: (#[0-9a-f]{6})`))?.[1] as string;

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

describe('color contrast', () => {
  it.each([
    ['on-accent', 'accent'], ['accent-text', 'bg'], ['accent-text', 'soft1'], ['accent-text', 'soft2'],
    ['muted', 'bg'], ['muted', 'soft1'], ['muted', 'surface'], ['error', 'bg'], ['fg', 'soft1'], ['fg', 'soft2'], ['fg', 'bg'],
  ])('%s on %s is readable', (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
