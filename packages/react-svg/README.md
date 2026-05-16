<div align="center">
  <img alt="React" src="https://cdn.simpleicons.org/react/61DAFB" width="120" height="120" />

# @material-symbols-framework/react-svg

Material Symbols icons for **React**, rendered as inline SVG. Tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/react-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/react-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/react-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/react-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request, no FOIT
- **CSP-friendly** without a `font-src` directive
- **Edge & email-ready** — works in environments where fonts can't reach
- Best for apps with a small, well-known icon set

For apps with many icons, the [font-based sibling](../react#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/react-svg
```

> Peer dependency: `react >= 17`. No CSS to import.

## Usage

Pick a variant via the sub-export — `rounded` is the default if you import the root:

```tsx
// Rounded (default)
import { MsHome, MsFavorite } from '@material-symbols-framework/react-svg';

// Outlined
import { MsHome, MsFavorite } from '@material-symbols-framework/react-svg/outlined';

// Sharp
import { MsHome, MsFavorite } from '@material-symbols-framework/react-svg/sharp';
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

You can mix variants in the same file by importing each from its sub-path.

**Naming convention:** snake_case → `Ms` + PascalCase.

| Material Symbols name           | Component name                |
| :------------------------------ | :---------------------------- |
| `home`                          | `MsHome`                      |
| `favorite`                      | `MsFavorite`                  |
| `android_cell_dual_5_bar_alert` | `MsAndroidCellDual5BarAlert`  |
| `3d_rotation`                   | `Ms3DRotation`                |

## Props

| Prop      | Type                                          | Default        | Description                                  |
| :-------- | :-------------------------------------------- | :------------- | :------------------------------------------- |
| `size`    | `number \| string`                            | `24`           | Width & height                               |
| `color`   | `string`                                      | `currentColor` | SVG fill color                               |
| `fill`    | `boolean`                                     | `false`        | Filled style (uses the alternate path data)  |
| `className` | `string`                                    | —              | Extra classes                                |
| `variant` | `'outlined' \| 'rounded' \| 'sharp'`          | from import    | Cosmetic class hint (does not change path)   |
| `...rest` | `SVGAttributes<SVGSVGElement>`                | —              | Forwarded to the rendered `<svg>`            |

> Variable-axis props (`grad`, `strokeWidth`, `opticalSize`) are accepted and silently ignored — they're font-only. Keeping them in the type lets you swap between `react` and `react-svg` without TypeScript errors.

## Tree-shaking

Importing one icon ships **only that icon's path data**. With esbuild/Vite/Rollup/webpack, bundle cost is roughly:

| Imports     | Bundle (gzip) |
| :---------- | :------------ |
| 1 icon      | ~290 B        |
| 20 icons    | ~5 kB         |
| 100 icons   | ~25 kB        |

There is no shared font asset, so everything you ship is exactly what you import.

## Accessibility

Each icon renders an `<svg>` with `aria-hidden="true"` by default. To label it, pass a `<title>` child or `aria-label`:

```tsx
<MsHome aria-label="Home" />
<MsHome><title>Home</title></MsHome>
<button aria-label="Go home"><MsHome /></button>
```

## Looking for the font-based version?

Use the [font-based sibling package](../react#readme): variable-font-driven, supports the full Material Symbols axes (FILL, wght, GRAD, opsz).

```bash
npm install @material-symbols-framework/react
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/react-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
