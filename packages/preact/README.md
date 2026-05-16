<div align="center">
  <img alt="Preact" src="https://cdn.simpleicons.org/preact/673AB8" width="120" height="120" />

# @material-symbols-framework/preact

Material Symbols icon components for **Preact** — tree-shakeable, type-safe, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/preact?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/preact)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/preact?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/preact)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/preact?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/preact/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/preact
```

> Peer dependency: `preact >= 10`.

## Usage

### 1. Import the variant CSS (once, at app entry)

```ts
import '@material-symbols-framework/preact/rounded.css';
// or '/outlined.css', '/sharp.css', or '/style.css' for all three
```

### 2. Use icons in your components

```tsx
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/preact';

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
import { Ms } from '@material-symbols-framework/preact';

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
| `grad`        | `-25 \| 0 \| 200`                             | `0`            | Grade                                        |
| `strokeWidth` | `100`–`700`                                   | `400`          | Stroke thickness                             |
| `opticalSize` | `20 \| 24 \| 40 \| 48`                        | `48`           | Optical size                                 |
| `class`       | `string`                                      | —              | Extra classes                                |
| `...rest`     | `JSX.HTMLAttributes<HTMLSpanElement>`         | —              | Forwarded to the rendered `<span>`           |

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

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../preact-svg#readme): inline SVG, no asset to load.

```bash
npm install @material-symbols-framework/preact-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/preact/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
