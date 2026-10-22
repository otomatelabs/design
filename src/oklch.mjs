// OKLCH -> sRGB -> WCAG contrast. Zero dependencies.
// Math: Björn Ottosson's OKLab, CSS Color 4 sRGB transfer, WCAG 2.x relative luminance.

export function parseOklch(str) {
  const m = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+%?)?\s*\)$/.exec(str.trim());
  if (!m) throw new Error(`Not an oklch() color: ${str}`);
  return { l: Number(m[1]) / 100, c: Number(m[2]), h: Number(m[3]) };
}

function oklchToLinearSrgb({ l, c, h }) {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v))); // clip to sRGB gamut
}

export function luminance(color) {
  const [r, g, b] = oklchToLinearSrgb(parseOklch(color));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
