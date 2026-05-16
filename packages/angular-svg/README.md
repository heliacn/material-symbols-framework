<div align="center">
  <img alt="Angular" src="https://cdn.simpleicons.org/angular/DD0031" width="120" height="120" />

# @material-symbols-framework/angular-svg

Material Symbols icons for **Angular**, rendered as inline SVG via a standalone component. Tree-shakeable through an explicit registry.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/angular-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/angular-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/angular-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/angular-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/angular-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/angular-svg/LICENSE)

</div>

## Why SVG?

- **Zero asset to load** — paths embedded in JS, no font request
- **CSP-friendly** without a `font-src` directive
- **Edge & email-ready**

For apps with many icons, the [font-based sibling](../angular#readme) is lighter per-icon.

## Installation

```bash
npm install @material-symbols-framework/angular-svg
```

> Peer dependencies: `@angular/core >= 16`, `@angular/common >= 16`. No CSS to import.

## Usage

Pattern: import `MsSvgIconComponent`, register the icons you use, then render `<ms-svg-icon>`. The registry pattern is how Angular keeps the bundle tree-shakeable.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { MsSvgIconComponent, registerIcon } from '@material-symbols-framework/angular-svg';
import home from '@material-symbols-framework/angular-svg/icons/rounded/home';
import favorite from '@material-symbols-framework/angular-svg/icons/rounded/favorite';

registerIcon(home, favorite);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MsSvgIconComponent],
  template: `
    <ms-svg-icon icon="home"></ms-svg-icon>
    <ms-svg-icon icon="favorite" color="red" [size]="32" fill></ms-svg-icon>
  `,
})
export class AppComponent {}
```

You can also import from `outlined` or `sharp` sub-paths:

```ts
import home from '@material-symbols-framework/angular-svg/icons/outlined/home';
import home from '@material-symbols-framework/angular-svg/icons/sharp/home';
```

Mix variants by registering each one and rendering with the matching `variant`:

```ts
import homeRounded from '@material-symbols-framework/angular-svg/icons/rounded/home';
import homeOutlined from '@material-symbols-framework/angular-svg/icons/outlined/home';
registerIcon(homeRounded, homeOutlined);
```
```html
<ms-svg-icon icon="home" variant="rounded"></ms-svg-icon>
<ms-svg-icon icon="home" variant="outlined"></ms-svg-icon>
```

## Inputs

| Input        | Type                                  | Default     | Description                                |
| :----------- | :------------------------------------ | :---------- | :----------------------------------------- |
| `icon`       | `string`                              | `''`        | Icon name (snake_case, e.g. `home`)        |
| `variant`    | `'outlined' \| 'rounded' \| 'sharp'`  | `'rounded'` | Style variant                              |
| `size`       | `number \| string`                    | `24`        | Width & height                             |
| `color`      | `string`                              | `currentColor` | SVG fill color                          |
| `fill`       | `boolean`                             | `false`     | Filled style                               |
| `ariaLabel`  | `string`                              | —           | a11y label (binds to `aria-label`)         |
| `class`      | `string`                              | —           | Extra classes                              |

## Tree-shaking

Only the icons you `registerIcon(...)` end up in the final bundle. The registry is a side-effectful Map, so Angular's optimizer keeps the tree clean.

## Accessibility

```html
<ms-svg-icon icon="home" ariaLabel="Home"></ms-svg-icon>
<button aria-label="Go home"><ms-svg-icon icon="home"></ms-svg-icon></button>
```

## Looking for the font-based version?

Use the [font-based sibling package](../angular#readme): variable-font-driven, supports the full Material Symbols axes.

```bash
npm install @material-symbols-framework/angular
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/angular-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
