<div align="center">
  <img alt="Svelte" src="https://cdn.simpleicons.org/svelte/FF3E00" width="120" height="120" />

# @material-symbols-framework/svelte

Material Symbols icon components for **Svelte** — tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/svelte?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/svelte)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/svelte?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/svelte)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/svelte?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/svelte/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/svelte
```

> Peer dependency: `svelte >= 4` (works with Svelte 4 and Svelte 5).

## Usage

### 1. Import the variant CSS (once, at app entry)

```ts
// src/app.ts (or +layout.svelte <script>)
import '@material-symbols-framework/svelte/rounded.css';
// or '/outlined.css', '/sharp.css', or '/style.css' for all three
```

### 2. Use icons in your components

```svelte
<script>
  import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/svelte';
</script>

<MsHome />
<MsFavorite fill color="red" size={32} />
<MsAndroidCellDual5BarAlert variant="outlined" strokeWidth={300} />
```

**Naming convention:** snake_case → `Ms` + PascalCase.

| Material Symbols name           | Component name                |
| :------------------------------ | :---------------------------- |
| `home`                          | `MsHome`                      |
| `favorite`                      | `MsFavorite`                  |
| `android_cell_dual_5_bar_alert` | `MsAndroidCellDual5BarAlert`  |
| `3d_rotation`                   | `Ms3DRotation`                |

### Generic component (dynamic icon)

```svelte
<script>
  import { Ms } from '@material-symbols-framework/svelte';
  let iconName = 'home';
</script>

<Ms icon="home" />
<Ms code="e88a" />
<Ms icon={iconName} fill />
```

## Props

| Prop          | Type                                          | Default        | Description                                  |
| :------------ | :-------------------------------------------- | :------------- | :------------------------------------------- |
| `variant`     | `'outlined' \| 'rounded' \| 'sharp'`          | `'rounded'`    | Style variant                                |
| `size`        | `number \| string`                            | `24`           | Icon size in `px` (or any CSS length)        |
| `color`       | `string`                                      | `currentColor` | Icon color                                   |
| `fill`        | `boolean`                                     | `false`        | Filled style                                 |
| `grad`        | `-25 \| 0 \| 200`                             | `0`            | Grade — visual emphasis                      |
| `strokeWidth` | `100`–`700`                                   | `400`          | Stroke thickness                             |
| `opticalSize` | `20 \| 24 \| 40 \| 48`                        | `48`           | Optical size                                 |
| `class`       | `string`                                      | —              | Extra classes                                |

Any extra attribute (`onclick`, `data-*`, `id`, etc.) is forwarded to the underlying `<span>`.

## CSS classes (auto-applied)

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — variant marker
- `.ms-{kebab-icon-name}` — specific icon (e.g. `.ms-home`)

## Tailwind & CSS

Material Symbols is rendered with a glyph font. Size it with **font-size utilities**:

```svelte
<MsHome class="text-2xl text-blue-500 hover:text-blue-700" />  <!-- ✅ -->
<MsHome class="size-8" />                                      <!-- ❌ -->
```

## Accessibility

Icons are decorative by default (`aria-hidden="true"`). Add `aria-label` to make them announced:

```svelte
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (SvelteKit)

The package is fully SSR-safe — no global state, no `window` access at import time.

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../svelte-svg#readme): inline SVG, no asset to load.

```bash
npm install @material-symbols-framework/svelte-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/svelte/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
