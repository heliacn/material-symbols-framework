<div align="center">
  <img alt="Angular" src="https://cdn.simpleicons.org/angular/DD0031" width="120" height="120" />

# @material-symbols-framework/angular

Material Symbols icon component for **Angular** — standalone component, with hover preview in your IDE.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/angular?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/angular)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/angular?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/angular)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/angular?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/angular/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/angular
```

> Peer dependencies: `@angular/core >= 16`, `@angular/common >= 16`.

## Usage

### 1. Import the icon font CSS

In your global styles (`src/styles.css` or `angular.json` `styles` array):

```css
@import '@material-symbols-framework/angular/style.css';
```

### 2. Use the standalone component

```ts
// app.component.ts
import { Component } from '@angular/core';
import { MsIconComponent } from '@material-symbols-framework/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MsIconComponent],
  template: `
    <ms-icon icon="home"></ms-icon>
    <ms-icon icon="favorite" fill color="red" [size]="32"></ms-icon>
    <ms-icon icon="android_cell_dual_5_bar_alert" variant="outlined" [strokeWidth]="300"></ms-icon>
    <ms-icon code="e88a"></ms-icon>
  `,
})
export class AppComponent {}
```

The component is **standalone** — no NgModule needed. Just add it to `imports`.

## Inputs

| Input          | Type                                  | Default        | Description                          |
| :------------- | :------------------------------------ | :------------- | :----------------------------------- |
| `icon`         | `string`                              | —              | Icon name (snake_case, e.g. `home`)  |
| `code`         | `string`                              | —              | Hex codepoint (e.g. `e88a`)          |
| `variant`      | `'outlined' \| 'rounded' \| 'sharp'`  | `'rounded'`    | Style variant                        |
| `size`         | `number \| string`                    | `24`           | Icon size                            |
| `color`        | `string`                              | `currentColor` | Icon color                           |
| `fill`         | `boolean`                             | `false`        | Filled style                         |
| `grad`         | `-25 \| 0 \| 200`                     | `0`            | Grade                                |
| `strokeWidth`  | `100`–`700`                           | `400`          | Stroke thickness                     |
| `opticalSize`  | `20 \| 24 \| 40 \| 48`                | `48`           | Optical size                         |
| `ariaLabel`    | `string`                              | —              | a11y label (binds to `aria-label`)   |
| `class`        | `string`                              | —              | Extra classes                        |

## CSS classes (auto-applied)

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — variant marker
- `.ms-{kebab-icon-name}` — specific icon (e.g. `.ms-home`)

## Tailwind & CSS

Material Symbols is rendered with a glyph font. Size it with **font-size utilities**:

```html
<ms-icon icon="home" class="text-2xl text-blue-500"></ms-icon>  <!-- ✅ -->
```

## Accessibility

Icons are decorative by default (`aria-hidden="true"`). Pass `ariaLabel` to make them announced:

```html
<ms-icon icon="home" ariaLabel="Home"></ms-icon>
<button aria-label="Go home"><ms-icon icon="home"></ms-icon></button>
```

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../angular-svg#readme): inline SVG, no asset to load.

```bash
npm install @material-symbols-framework/angular-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/angular/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
