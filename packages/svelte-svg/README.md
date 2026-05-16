<div align="center">
  <img alt="Svelte" src="https://cdn.simpleicons.org/svelte/FF3E00" width="120" height="120" />

# @material-symbols-framework/svelte-svg

Material Symbols icons for **Svelte**, rendered as inline SVG. Tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/svelte-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/svelte-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/svelte-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/svelte-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/svelte-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/svelte-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request
- **CSP-friendly** without a `font-src` directive
- **Edge & email-ready**
- Best for apps with a small, well-known icon set

For apps with many icons, the [font-based sibling](../svelte#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/svelte-svg
```

> Peer dependency: `svelte >= 4` (works with Svelte 4 and Svelte 5). No CSS to import.

## Usage

Pick a variant via the sub-export — `rounded` is the default:

```ts
// Rounded
import { MsHome, MsFavorite } from '@material-symbols-framework/svelte-svg';
// Outlined
import { MsHome, MsFavorite } from '@material-symbols-framework/svelte-svg/outlined';
// Sharp
import { MsHome, MsFavorite } from '@material-symbols-framework/svelte-svg/sharp';
```

```svelte
<script>
  import { MsHome, MsFavorite } from '@material-symbols-framework/svelte-svg';
</script>

<MsHome />
<MsFavorite color="red" size={32} />
<MsHome fill />
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

Each icon renders an `<svg>` with `aria-hidden="true"` by default. Add `aria-label` to label it:

```svelte
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (SvelteKit)

Fully SSR-safe — no global state, no `window` access at import time.

## Looking for the font-based version?

Use the [font-based sibling package](../svelte#readme): variable-font-driven, supports the full Material Symbols axes.

```bash
npm install @material-symbols-framework/svelte
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/svelte-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
