<div align="center">
  <img alt="React" src="https://cdn.simpleicons.org/react/61DAFB" width="120" height="120" />

# @material-symbols-framework/react

Material Symbols icon components for **React** — tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/react?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/react?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/react?color=008660&style=flat-square)](https://github.com/material-symbols-framework/material-symbols-framework/blob/main/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/react
```

```bash
pnpm add @material-symbols-framework/react
```

```bash
yarn add @material-symbols-framework/react
```

> Peer dependency: `react >= 17`.

## Usage

### 1. Import the variant CSS (once, at app entry)

```tsx
// Pick a single variant — recommended, loads only 1 woff2
import '@material-symbols-framework/react/rounded.css';
// or '/outlined.css', '/sharp.css'

// Or load all 3 variants (3 woff2 files)
import '@material-symbols-framework/react/style.css';
```

### 2. Import icons by name

```tsx
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/react';

export default function App() {
  return (
    <>
      <MsHome />
      <MsFavorite fill color="red" size={32} />
      <MsAndroidCellDual5BarAlert variant="outlined" strokeWidth={300} />
    </>
  );
}
```

**Naming convention:** snake_case → `Ms` + PascalCase.

| Material Symbols name           | Component name                |
| :------------------------------ | :---------------------------- |
| `home`                          | `MsHome`                      |
| `favorite`                      | `MsFavorite`                  |
| `android_cell_dual_5_bar_alert` | `MsAndroidCellDual5BarAlert`  |
| `3d_rotation`                   | `Ms3DRotation`                |

### Generic component (dynamic icon)

When the icon is chosen at runtime:

```tsx
import { Ms } from '@material-symbols-framework/react';

<Ms icon="home" />
<Ms code="e88a" />        {/* by codepoint */}
<Ms icon={iconName} fill /> {/* dynamic */}
```

## Props

All icon components accept the following props. Any extra prop (`onClick`, `id`, `style`, `data-*`, etc.) is forwarded to the underlying `<span>`.

| Prop          | Type                                          | Default        | Description                                            |
| :------------ | :-------------------------------------------- | :------------- | :----------------------------------------------------- |
| `variant`     | `'outlined' \| 'rounded' \| 'sharp'`          | `'rounded'`    | Style variant                                          |
| `size`        | `number \| string`                            | `24`           | Icon size in `px` (or any CSS length)                  |
| `color`       | `string`                                      | `currentColor` | Icon color                                             |
| `fill`        | `boolean`                                     | `false`        | Filled style                                           |
| `grad`        | `-25 \| 0 \| 200`                             | `0`            | Grade — visual emphasis                                |
| `strokeWidth` | `100 \| 200 \| 300 \| 400 \| 500 \| 600 \| 700` | `400`        | Stroke thickness                                       |
| `opticalSize` | `20 \| 24 \| 40 \| 48`                        | `48`           | Optical size                                           |
| `className`   | `string`                                      | —              | Extra classes (Tailwind, CSS modules, etc.)            |
| `...rest`     | `HTMLAttributes<HTMLSpanElement>`             | —              | Forwarded to the rendered `<span>`                     |

## CSS classes (auto-applied)

Each icon renders a `<span>` with two stable class hooks you can target from your own CSS:

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — the variant marker
- `.ms-{kebab-icon-name}` — the specific icon (e.g. `.ms-home`, `.ms-android-cell-dual-5-bar-alert`)

```css
.ms-home {
  color: var(--color-primary);
}
```

## Tailwind & CSS frameworks

Material Symbols is rendered with a glyph font, so size it with **font-size utilities**, not width/height:

```tsx
<MsHome className="text-2xl text-blue-500 hover:text-blue-700" />  {/* ✅ */}
<MsHome className="size-8" />                                       {/* ❌ won't resize */}
```

If you prefer Tailwind sizing without overriding `size`, set `size="1em"` and let `text-*` drive the size:

```tsx
<MsHome size="1em" className="text-3xl" />
```

## Accessibility

Icons render as decorative by default (`aria-hidden="true"`). Add `aria-label` to make them announced by screen readers — that automatically removes `aria-hidden`:

```tsx
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## Bundle size

Tree-shaking ships only the icons you import (esbuild, Vite, Rollup, webpack):

| Imports     | Bundle (gzip) |
| :---------- | :------------ |
| 1 icon      | ~667 B        |
| 20 icons    | ~1.0 kB       |
| 100 icons   | ~2.5 kB       |

Plus one `woff2` per variant (~150 KB gzip) — cached by the browser across pages.

## TypeScript

Types ship with the package. Hovering an icon component in your IDE shows a rendered SVG preview, no extension required.

```tsx
import type { MsIconProps } from '@material-symbols-framework/react';
```

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../react-svg#readme): inline SVG, no asset to load, ideal for landing pages, email templates, and edge runtimes.

```bash
npm install @material-symbols-framework/react-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/react/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
