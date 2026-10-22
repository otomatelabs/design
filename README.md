# @otomatelabs/design

Design tokens for [Otomate Labs](https://otomatelabs.com): CSS variables, a Tailwind v4 + shadcn/ui theme and
Motion presets. Zero runtime dependencies. The rules live in [DESIGN.md](./DESIGN.md).

## Install
```bash
# from GitHub (works without npm credentials)
npm i github:otomatelabs/design#v0.1.0
```
The package name is `@otomatelabs/design` either way; imports do not change once it is on npm.

## Use
```css
@import "tailwindcss";
@import "@otomatelabs/design/theme.css";   /* bg-primary, text-display, rounded-card, ease-smooth, bg-ot-success-bg… */
```
```html
<html data-theme="dark">  <!-- or "light" -->
```
```ts
import { fadeUp, staggerContainer, viewport } from '@otomatelabs/design/motion';
<motion.ul variants={staggerContainer()} initial="hidden" whileInView="visible" viewport={viewport}>
  <motion.li variants={fadeUp} />
</motion.ul>
```

| Export | Contents |
|---|---|
| `tokens.css` | `--ot-*` raw tokens, dark default, `[data-theme="light"]`, mobile type scale, reduced motion, shadcn semantic vars |
| `theme.css` | Tailwind v4 `@theme` mapping + base layer (imports `tokens.css`) |
| `legacy.css` | Aliases with the names used by the original otomatelabs.com stylesheet |
| `motion` | Easing, durations and variants for Motion |
| `tokens.json` | Raw tokens for scripts (video and carousel rendering) |

## Develop
```bash
npm run build   # tokens/tokens.json -> dist/
npm test        # WCAG contrast, parity with the live site, build output
npm run preview # reference page at http://localhost:4400/preview/
```
`dist/` is committed so GitHub installs need no build step. Edit `tokens/tokens.json`, never `dist/`.
