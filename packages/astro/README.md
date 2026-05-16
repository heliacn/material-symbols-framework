<div align="center">
  <img alt="Astro" src="https://cdn.simpleicons.org/astro/BC52EE" width="120" height="120" />

# @material-symbols-framework/astro

Material Symbols icon components for **Astro** — `.astro` components, tree-shakeable, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/astro?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/astro)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/astro?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/astro)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/astro?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/astro/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/astro
```

> Peer dependency: `astro >= 4`.

## Usage

### 1. Import the variant CSS (once, in a layout)

```astro
---
import '@material-symbols-framework/astro/rounded.css';
// or '/outlined.css', '/sharp.css', or '/style.css' for all three
---
```

### 2. Use icons in your `.astro` files

```astro
---
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/astro';
---

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

```astro
---
import { Ms } from '@material-symbols-framework/astro';
const iconName = 'home';
---

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

## CSS classes (auto-applied)

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — variant marker
- `.ms-{kebab-icon-name}` — specific icon (e.g. `.ms-home`)

## Tailwind & CSS

Material Symbols is rendered with a glyph font. Size it with **font-size utilities**:

```astro
<MsHome class="text-2xl text-blue-500 hover:text-blue-700" />  <!-- ✅ -->
<MsHome class="size-8" />                                      <!-- ❌ -->
```

## Accessibility

Icons are decorative by default (`aria-hidden="true"`). Add `aria-label` to make them announced:

```astro
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../astro-svg#readme): inline SVG, no asset to load — great for static sites and edge runtimes.

```bash
npm install @material-symbols-framework/astro-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/astro/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
