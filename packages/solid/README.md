<div align="center">
  <img alt="SolidJS" src="https://cdn.simpleicons.org/solid/2C4F7C" width="120" height="120" />

# @material-symbols-framework/solid

Material Symbols icon components for **SolidJS** — tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/solid?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/solid)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/solid?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/solid)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/solid?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/solid/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/solid
```

> Peer dependency: `solid-js >= 1.7`.

## Usage

### 1. Import the variant CSS (once, at app entry)

```ts
// src/index.tsx
import '@material-symbols-framework/solid/rounded.css';
// or '/outlined.css', '/sharp.css', or '/style.css' for all three
```

### 2. Use icons in your components

```tsx
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/solid';

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

```tsx
import { Ms } from '@material-symbols-framework/solid';
import { createSignal } from 'solid-js';

const [iconName] = createSignal('home');

<Ms icon="home" />
<Ms code="e88a" />
<Ms icon={iconName()} fill />
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

Solid uses fine-grained reactivity — props are evaluated lazily, so passing reactive values just works.

## CSS classes (auto-applied)

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — variant marker
- `.ms-{kebab-icon-name}` — specific icon (e.g. `.ms-home`)

## Tailwind & CSS

Material Symbols is rendered with a glyph font. Size it with **font-size utilities**:

```tsx
<MsHome class="text-2xl text-blue-500 hover:text-blue-700" />  {/* ✅ */}
<MsHome class="size-8" />                                      {/* ❌ */}
```

## Accessibility

Icons are decorative by default (`aria-hidden="true"`). Add `aria-label` to make them announced:

```tsx
<MsHome aria-label="Home" />
<button aria-label="Go home"><MsHome /></button>
```

## SSR (SolidStart)

The package is fully SSR-safe — no global state, no `window` access at import time.

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../solid-svg#readme): inline SVG, no asset to load.

```bash
npm install @material-symbols-framework/solid-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/solid/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
