<div align="center">
  <img alt="Web Components" src="https://cdn.simpleicons.org/webcomponentsdotorg/29ABE2" width="120" height="120" />

# @material-symbols-framework/vanilla-svg

Material Symbols as a **Web Component** rendering inline SVG — drop into any HTML, no framework, no font.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/vanilla-svg?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vanilla-svg)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/vanilla-svg?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vanilla-svg)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/vanilla-svg?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vanilla-svg/LICENSE)

</div>

## Pattern: one element, registered icons

A single custom element `<ms-svg-icon>` reads its `icon` attribute and looks the path data up in a registry you populate. Registering only the icons you use keeps the bundle tree-shakeable.

## Installation

```bash
npm install @material-symbols-framework/vanilla-svg
```

No CSS, no font.

## Usage

### Manual register

```html
<script type="module">
  import { defineMsSvgIcon, registerIcon } from '@material-symbols-framework/vanilla-svg';
  import home from '@material-symbols-framework/vanilla-svg/icons/rounded/home.js';
  import favorite from '@material-symbols-framework/vanilla-svg/icons/rounded/favorite.js';

  defineMsSvgIcon();
  registerIcon(home, favorite);
</script>

<ms-svg-icon icon="home"></ms-svg-icon>
<ms-svg-icon icon="favorite" color="red" size="32" fill></ms-svg-icon>
```

### Auto-register the element on import

```html
<script type="module">
  import '@material-symbols-framework/vanilla-svg/auto-register';
  import { registerIcon } from '@material-symbols-framework/vanilla-svg';
  import home from '@material-symbols-framework/vanilla-svg/icons/rounded/home.js';
  registerIcon(home);
</script>

<ms-svg-icon icon="home"></ms-svg-icon>
```

### Multiple variants

Import each variant of an icon by its sub-path and register them all:

```js
import homeRounded from '@material-symbols-framework/vanilla-svg/icons/rounded/home.js';
import homeOutlined from '@material-symbols-framework/vanilla-svg/icons/outlined/home.js';
registerIcon(homeRounded, homeOutlined);
```
```html
<ms-svg-icon icon="home" variant="rounded"></ms-svg-icon>
<ms-svg-icon icon="home" variant="outlined"></ms-svg-icon>
```

## Attributes

| Attribute  | Values                                  | Default     | Description                          |
| :--------- | :-------------------------------------- | :---------- | :----------------------------------- |
| `icon`     | snake_case name                         | —           | Icon to render (must be registered)  |
| `variant`  | `outlined` \| `rounded` \| `sharp`      | `rounded`   | Style variant                        |
| `size`     | px or any CSS length                    | `24`        | Width & height                       |
| `color`    | any CSS color                           | `currentColor` | SVG fill color                    |
| `fill`     | boolean (presence = on)                 | off         | Filled style                         |

## API

```ts
import {
  defineMsSvgIcon,    // registers <ms-svg-icon> (idempotent)
  registerIcon,       // registers icon path data
  MsSvgIconElement,   // the underlying HTMLElement subclass
  type IconData,
} from '@material-symbols-framework/vanilla-svg';
```

If `<ms-svg-icon>` clashes with another library, pass a custom tag name:

```ts
defineMsSvgIcon('material-svg-icon');
```

## Accessibility

The element is decorative by default (`aria-hidden="true"`). Add `aria-label` to announce it:

```html
<ms-svg-icon icon="home" aria-label="Home"></ms-svg-icon>
<button aria-label="Go home"><ms-svg-icon icon="home"></ms-svg-icon></button>
```

## Looking for the font-based version?

Use the [font-based sibling package](../vanilla#readme): a single `<ms-icon>` web component backed by Material Symbols variable fonts — no per-icon registration needed.

```bash
npm install @material-symbols-framework/vanilla
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vanilla-svg/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
