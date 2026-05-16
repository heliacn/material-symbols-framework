<div align="center">
  <img alt="SolidJS" src="https://cdn.simpleicons.org/solid/2C4F7C" width="120" height="120" />

# @material-symbols-framework/solid-svg

Material Symbols icons for **SolidJS**, rendered as inline SVG. Tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/solid-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/solid-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/solid-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/solid-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/solid-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/solid-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request
- **CSP-friendly** without a `font-src` directive
- **Edge & email-ready**

For apps with many icons, the [font-based sibling](../solid#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/solid-svg
```

> Peer dependency: `solid-js >= 1.7`. No CSS to import.

## Usage

Pick a variant via the sub-export — `rounded` is the default:

```tsx
// Rounded
import { MsHome, MsFavorite } from '@material-symbols-framework/solid-svg';
// Outlined
import { MsHome, MsFavorite } from '@material-symbols-framework/solid-svg/outlined';
// Sharp
import { MsHome, MsFavorite } from '@material-symbols-framework/solid-svg/sharp';
```

```tsx
export default function App() {
  return (
    <>
      <MsHome />
      <MsFavorite color="red" size={32} />
      <MsHome fill />
    </>
  );
}
```

**Naming convention:** snake_case → `Ms` + PascalCase.

## Props

| Prop      | Type                                          | Default        | Description                                  |
| :-------- | :-------------------------------------------- | :------------- | :------------------------------------------- |
| `size`    | `number \| string`                            | `24`           | Width & height                               |
| `color`   | `string`                                      | `currentColor` | SVG fill color                               |
| `fill`    | `boolean`                                     | `false`        | Filled style                                 |
| `class`   | `string`                                      | —              | Extra classes                                |
| `variant` | `'outlined' \| 'rounded' \| 'sharp'`          | from import    | Cosmetic class hint                          |

> Variable-axis props (`grad`, `strokeWidth`, `opticalSize`) are accepted and silently ignored.

## Tree-shaking

Importing one icon ships **only that icon's path data**. Bundle cost ~290 B gzip per icon.

## Accessibility

```tsx
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (SolidStart)

Fully SSR-safe — no global state, no `window` access at import time.

## Looking for the font-based version?

Use the [font-based sibling package](../solid#readme): variable-font-driven, supports the full Material Symbols axes.

```bash
npm install @material-symbols-framework/solid
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/solid-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
