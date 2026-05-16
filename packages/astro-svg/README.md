<div align="center">
  <img alt="Astro" src="https://cdn.simpleicons.org/astro/BC52EE" width="120" height="120" />

# @material-symbols-framework/astro-svg

Material Symbols icons for **Astro**, rendered as inline SVG. Tree-shakeable, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/astro-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/astro-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/astro-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/astro-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/astro-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/astro-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request
- **CSP-friendly** without a `font-src` directive
- **Edge & static-site-ready** — perfect for SSG and Cloudflare/Vercel edge

For apps with many icons, the [font-based sibling](../astro#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/astro-svg
```

> Peer dependency: `astro >= 4`. No CSS to import.

## Usage

Pick a variant via the sub-export — `rounded` is the default:

```astro
---
// Rounded
import { MsHome, MsFavorite } from '@material-symbols-framework/astro-svg';
// Outlined
import { MsHome, MsFavorite } from '@material-symbols-framework/astro-svg/outlined';
// Sharp
import { MsHome, MsFavorite } from '@material-symbols-framework/astro-svg/sharp';
---

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

## Tree-shaking

Importing one icon ships **only that icon's path data**. Bundle cost ~290 B gzip per icon.

## Accessibility

```astro
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## Looking for the font-based version?

Use the [font-based sibling package](../astro#readme): variable-font-driven, supports the full Material Symbols axes.

```bash
npm install @material-symbols-framework/astro
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/astro-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
