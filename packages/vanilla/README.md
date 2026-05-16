<div align="center">
  <img alt="Web Components" src="https://cdn.simpleicons.org/webcomponentsdotorg/29ABE2" width="120" height="120" />

# @material-symbols-framework/vanilla

Material Symbols as a single **Web Component** — no framework, just `<ms-icon>` you can drop into any HTML.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/vanilla?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vanilla)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/vanilla?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/vanilla)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/vanilla?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vanilla/LICENSE)

</div>

## Why a single custom element?

Registering 3879 individual custom elements would be wasteful. This package ships **one** custom element, `<ms-icon>`, that picks the icon by attribute — same pattern as `<iron-icon>` / `<sl-icon>`.

## Installation

```bash
npm install @material-symbols-framework/vanilla
```

## Usage

### Option A — Manual register

```html
<link rel="stylesheet" href="/node_modules/@material-symbols-framework/vanilla/dist/rounded.css" />
<script type="module">
  import { defineMsIcon } from '@material-symbols-framework/vanilla';
  defineMsIcon();
</script>

<ms-icon icon="home"></ms-icon>
<ms-icon icon="favorite" fill color="red" size="32"></ms-icon>
<ms-icon code="e88a"></ms-icon>
```

### Option B — Auto-register on import

```html
<link rel="stylesheet" href="/node_modules/@material-symbols-framework/vanilla/dist/rounded.css" />
<script type="module">
  import '@material-symbols-framework/vanilla/auto-register';
</script>

<ms-icon icon="home"></ms-icon>
```

> Bundler users: just `import '@material-symbols-framework/vanilla/rounded.css'` (or `outlined.css`, `sharp.css`, `style.css`) at app entry.

## Attributes

| Attribute       | Values                                  | Default     | Description                          |
| :-------------- | :-------------------------------------- | :---------- | :----------------------------------- |
| `icon`          | snake_case name (e.g. `home`)           | —           | Icon to render                       |
| `code`          | hex codepoint (e.g. `e88a`)             | —           | Alternative to `icon`                |
| `variant`       | `outlined` \| `rounded` \| `sharp`      | `rounded`   | Style variant                        |
| `size`          | px or any CSS length (e.g. `24`, `2em`) | `24`        | Icon size                            |
| `color`         | any CSS color                           | `currentColor` | Icon color                        |
| `fill`          | boolean (presence = on)                 | off         | Filled style                         |
| `grad`          | `-25` \| `0` \| `200`                   | `0`         | Grade                                |
| `stroke-width`  | `100`–`700`                             | `400`       | Stroke thickness                     |
| `optical-size`  | `20` \| `24` \| `40` \| `48`            | `48`        | Optical size                         |

`<ms-icon>` is observable — flipping any attribute re-renders.

## Custom tag name

If `<ms-icon>` clashes with another library, pass a custom tag:

```ts
import { defineMsIcon } from '@material-symbols-framework/vanilla';
defineMsIcon('material-symbol');
```
```html
<material-symbol icon="home"></material-symbol>
```

## API

```ts
import {
  defineMsIcon,         // registers <ms-icon> (idempotent)
  MsIconElement,        // the underlying HTMLElement subclass
  variantClass,         // helper: variant → class name
  codeToChar,           // helper: codepoint → glyph char
} from '@material-symbols-framework/vanilla';
```

## Accessibility

The element is decorative by default (`aria-hidden="true"`). Add `aria-label` to announce it:

```html
<ms-icon icon="home" aria-label="Home"></ms-icon>
<button aria-label="Go home"><ms-icon icon="home"></ms-icon></button>
```

## Looking for SVG output instead of font?

Use the [SVG-based sibling package](../vanilla-svg#readme): inline SVG, no asset to load — perfect for email templates and static sites.

```bash
npm install @material-symbols-framework/vanilla-svg
```

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/vanilla/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
