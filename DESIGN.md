# Otomate Labs Design System

Source of truth: `tokens/tokens.json`, extracted from the live otomatelabs.com `styles.css` after the
October 2026 coral-led redesign. This document supersedes the earlier `DESIGN.md` in the site repo, which still
describes a magenta-led palette that is no longer in production.

Used by: otomatelabs.com, every MVP demo built by the LinkedIn pipeline, case-study media (video, carousel, screenshots).
Also used as the rubric for the automated anti-slop visual review.

## Principles (from PRODUCT.md)
1. Show the work: proof lives in data, images and case-study depth.
2. Precision is the personality: alignment, spacing and type are exact.
3. Trust through transparency: no vague claims; metrics, tools and scope stated clearly.
4. Structured but not rigid.
5. Entrepreneurial confidence: bold headings, decisive color, generous whitespace.

Anti-references: generic templates, stiff resume sites, gimmicky animation, SaaS hero-metric clichés with gradient
text, interfaces that feel generated rather than considered.

## Color
Dark is the default theme; light ("cream") via `data-theme="light"`. Neutrals are tinted (hue 300 dark, 85–90 light).

| Role | Dark | Light |
|---|---|---|
| Background | `oklch(8% 0.015 300)` | `oklch(97.5% 0.006 90)` |
| Surface | `oklch(17% 0.025 300)` | `oklch(95% 0.008 88)` |
| Text primary | `oklch(95% 0.005 60)` | `oklch(14% 0.02 85)` |
| Brand coral | `oklch(72% 0.18 30)` | `oklch(56% 0.18 30)` |
| Brand warm (`--color-brand` on the site) | `oklch(58% 0.14 25)` | `oklch(48% 0.15 25)` |
| Brand violet (secondary) | `oklch(48% 0.08 300)` | `oklch(38% 0.08 300)` |

Status colors (`success`, `warning`, `danger`, `info` + `*-bg`) are additions for MVP interfaces, tuned to pass AA
on their own backgrounds in both themes.

### Rules
- Never `#000` or `#fff`. No gradient text (`background-clip: text` is banned).
- **Primary action:** dark theme = coral background with dark text (7.7:1); light theme = brand-warm with light text (6.6:1).
  Do **not** put light text on brand-warm in the dark theme: 3.96:1 fails AA.
- `text-tertiary` (dark) is 4.27:1: use only for metadata or text ≥ 18.66px bold / 24px regular.
- `text-muted` (2.45:1 dark, 3.67:1 light) is decorative only: never for information.
- Coral for highlights and metrics, brand-warm for links and CTAs, violet for process steps and secondary data.
- Each MVP may set `--product-accent` (default coral) for its own identity. It must pass AA against `--background`.

`npm test` enforces the AA pairs and the documented exceptions.

## Typography
Sora (display, weights 200/300/400/600) + Work Sans (body, 300/400/500).

| Token | Desktop | ≤768px | Line height |
|---|---|---|---|
| display | 5.5rem | 3rem | 1.1 |
| h1 | 3.5rem | 2.25rem | 1.15 |
| h2 | 2.25rem | 1.625rem | 1.2 |
| h3 | 1.5rem | 1.375rem | 1.3 |
| h4 | 1.25rem | 1.1875rem | 1.4 |
| body / body-sm / caption | 1 / 0.875 / 0.75rem | — | 1.6 / 1.6 / 1.5 |

Hero headlines use thin Sora (200–300). Body copy caps at ~55–70ch. All-caps only for caption-size tags with
`letter-spacing: 0.05em`. No em dashes in copy.

## Spacing, radius, layout
4px base (`--ot-space-1` … `--ot-space-32`; Tailwind `p-4` = 1rem). Radius sm 4px, md 8px, lg 12px, card 16px, pill.
Max content width 1080px. Elevation comes from surface color and borders, not shadows; hover lifts may add a soft shadow.

## Motion
"Settling-in": elements fade up or scale in once when they enter the viewport.

| Token | Value |
|---|---|
| ease-smooth | `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart) |
| ease-counter | `cubic-bezier(0.34, 1.56, 0.64, 1)` (number count-up only) |
| durations | fast 200ms · base 400ms · reveal 800ms · counter 2000ms |
| stagger | 80ms between children |
| reveal distance | 40px (small variant 20px) |

- Animate only `transform` and `opacity`. No bounce or elastic easing outside number counters.
- `prefers-reduced-motion: reduce` sets every duration to 0 (CSS) and `reduced()` makes Motion variants instant.
- Each MVP has one defined "wow moment" (see the pipeline spec); motion serves that moment, not decoration.

## Usage
```css
/* Tailwind v4 + shadcn/ui (MVPs) */
@import "tailwindcss";
@import "@otomatelabs/design/theme.css";
```
```css
/* Plain CSS / current site names (--color-bg, --space-4, …) */
@import "@otomatelabs/design/legacy.css";
```
```ts
import { fadeUp, staggerContainer, viewport, reduced } from '@otomatelabs/design/motion';
```
