<div align="center">
  <img alt="Vue" src="https://cdn.simpleicons.org/vuedotjs/4FC08D" width="120" height="120" />

# @material-symbols-framework/vue-svg

Material Symbols icons for **Vue 3**, rendered as inline SVG. Tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/vue-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vue-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/vue-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vue-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/vue-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vue-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request
- **CSP-friendly** without a `font-src` directive
- **Edge & email-ready**
- Best for apps with a small, well-known icon set

For apps with many icons, the [font-based sibling](../vue#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/vue-svg
```

> Peer dependency: `vue >= 3.2`. No CSS to import.

## Usage

Pick a variant via the sub-export — `rounded` is the default:

```ts
// Rounded
import { MsHome, MsFavorite } from '@material-symbols-framework/vue-svg';
// Outlined
import { MsHome, MsFavorite } from '@material-symbols-framework/vue-svg/outlined';
// Sharp
import { MsHome, MsFavorite } from '@material-symbols-framework/vue-svg/sharp';
```

```vue
<script setup lang="ts">
import { MsHome, MsFavorite } from '@material-symbols-framework/vue-svg';
</script>

<template>
  <MsHome />
  <MsFavorite color="red" :size="32" />
  <MsHome fill />
</template>
```

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
| `fill`    | `boolean`                                     | `false`        | Filled style                                 |
| `class`   | `string`                                      | —              | Extra classes                                |
| `variant` | `'outlined' \| 'rounded' \| 'sharp'`          | from import    | Cosmetic class hint                          |

> Variable-axis props (`grad`, `strokeWidth`, `opticalSize`) are accepted and silently ignored — they're font-only.

## Tree-shaking

Importing one icon ships **only that icon's path data**. Bundle cost ~290 B gzip per icon.

## Accessibility

Each icon renders an `<svg>` with `aria-hidden="true"` by default. Add `aria-label` to label it:

```vue
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (Nuxt, Vite SSR)

Fully SSR-safe — no global state, no `window` access at import time.

## Looking for the font-based version?

Use the [font-based sibling package](../vue#readme): variable-font-driven, supports the full Material Symbols axes.

```bash
npm install @material-symbols-framework/vue
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vue-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
