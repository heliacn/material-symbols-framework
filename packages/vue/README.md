<div align="center">
  <img alt="Vue" src="https://cdn.simpleicons.org/vuedotjs/4FC08D" width="120" height="120" />

# @material-symbols-framework/vue

Material Symbols icon components for **Vue 3** — tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/vue?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vue)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/vue?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vue)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/vue?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vue/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/vue
```

> Peer dependency: `vue >= 3.2`.

## Usage

### 1. Import the variant CSS (once, at app entry)

```ts
// main.ts
import '@material-symbols-framework/vue/rounded.css';
// or '/outlined.css', '/sharp.css', or '/style.css' for all three
```

### 2. Use icons in your components

```vue
<script setup lang="ts">
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/vue';
</script>

<template>
  <MsHome />
  <MsFavorite fill color="red" :size="32" />
  <MsAndroidCellDual5BarAlert variant="outlined" :stroke-width="300" />
</template>
```

**Naming convention:** snake_case → `Ms` + PascalCase.

| Material Symbols name           | Component name                |
| :------------------------------ | :---------------------------- |
| `home`                          | `MsHome`                      |
| `favorite`                      | `MsFavorite`                  |
| `android_cell_dual_5_bar_alert` | `MsAndroidCellDual5BarAlert`  |
| `3d_rotation`                   | `Ms3DRotation`                |

### Generic component (dynamic icon)

```vue
<script setup lang="ts">
import { Ms } from '@material-symbols-framework/vue';
</script>

<template>
  <Ms icon="home" />
  <Ms code="e88a" />
  <Ms :icon="iconName" fill />
</template>
```

## Props

| Prop          | Type                                          | Default        | Description                                  |
| :------------ | :-------------------------------------------- | :------------- | :------------------------------------------- |
| `variant`     | `'outlined' \| 'rounded' \| 'sharp'`          | `'rounded'`    | Style variant                                |
| `size`        | `number \| string`                            | `24`           | Icon size in `px` (or any CSS length)        |
| `color`       | `string`                                      | `currentColor` | Icon color                                   |
| `fill`        | `boolean`                                     | `false`        | Filled style                                 |
| `grad`        | `-25 \| 0 \| 200`                             | `0`            | Grade — visual emphasis                      |
| `stroke-width`| `100`–`700`                                   | `400`          | Stroke thickness                             |
| `optical-size`| `20 \| 24 \| 40 \| 48`                        | `48`           | Optical size                                 |
| `class`       | `string`                                      | —              | Extra classes                                |

Vue's kebab-case prop names (`stroke-width`, `optical-size`) are equivalent to camelCase in `<script>`.

## CSS classes (auto-applied)

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — variant marker
- `.ms-{kebab-icon-name}` — specific icon (e.g. `.ms-home`)

## Tailwind & CSS

Material Symbols is rendered with a glyph font. Size it with **font-size utilities**:

```vue
<MsHome class="text-2xl text-blue-500 hover:text-blue-700" />  <!-- ✅ -->
<MsHome class="size-8" />                                      <!-- ❌ -->
```

## Accessibility

Icons are decorative by default (`aria-hidden="true"`). Add `aria-label` to make them announced:

```vue
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (Nuxt, Vite SSR)

The package is fully SSR-safe — no global state, no `window` access at import time.

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../vue-svg#readme): inline SVG, no asset to load.

```bash
npm install @material-symbols-framework/vue-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vue/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
