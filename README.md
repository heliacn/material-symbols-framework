# Material Symbols for Framework

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/heliacn/material-symbols-framework/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@material-symbols-framework/react.svg)](https://www.npmjs.com/package/@material-symbols-framework/react)

> Material Symbols icon library with first-class support for **9 popular frameworks** —
> tree-shakeable, type-safe, and bundled with hover preview in your IDE.

This repository ships **17 npm packages**, one per framework × flavor (font-based or
SVG-based). Pick the package that matches your stack and the rendering style you prefer.

---

## Why use Material Symbols for Framework?

If you've ever pasted Material Symbols into a modern app, you know the friction: copy a `<span class="material-symbols-rounded">` snippet, hand-write `font-variation-settings: 'FILL' 1, 'GRAD' 200`, hope the variable font loaded, and pray the screen reader doesn't announce "arrow forward ios" out loud. This library wraps all of that into typed, framework-native components, with sane defaults baked in.

### Type-safe components, not raw strings

```tsx
import { MsAndroidCellDual5BarAlert } from '@material-symbols-framework/react';

<MsAndroidCellDual5BarAlert />
```

`Ms` prefix avoids collisions with your own components. Naming follows the official Google convention: `android_cell_dual_5_bar_alert` becomes `MsAndroidCellDual5BarAlert` — no lookup table, your IDE auto-completes it.

Prefer dynamic icons? Use the generic `Ms` component with an `icon` or `code` prop:

```tsx
<Ms icon="home" />
<Ms code="ef0c" />
```

You can also keep the original Google snippet — `<span class="material-symbols-outlined">home</span>` still works alongside our components.

### Variable font axes as ergonomic props

The full Material Symbols variable axes (FILL, weight, GRAD, opsz) are exposed as plain props instead of CSS strings:

```tsx
<MsHome fill />                        {/* FILL 0 → 1 */}
<MsHome strokeWidth={300} />           {/* wght 100..700, default 400 */}
<MsHome grad={-25} />                  {/* GRAD: -25 (low-emphasis), 0, 200 */}
<MsHome opticalSize={24} />            {/* opsz 20..48 — auto-tunes stroke at small sizes */}
<MsHome variant="outlined" />          {/* outlined | rounded | sharp, default rounded */}
<MsHome size={32} color="#3e9392" />   {/* number → px, color follows currentColor by default */}
```

`size` defaults to `24`, `color` follows `currentColor` (so `<button style={{ color: '#3e9392' }}><MsHome /></button>` just works), and `variant` defaults to `rounded` — the most modern of the three styles.

> SVG-based packages accept the same props but silently ignore axes that are font-only (`grad`, `strokeWidth`, `opticalSize`). You can swap between font and SVG flavors without TypeScript errors.

### Flexible, never opinionated about styling

Pass any class, any style, any framework — components forward through:

```tsx
<MsHome className="size-8 text-black hover:text-blue-500" />
```

Each render also emits two stable class hooks you can target globally:

- `.material-symbols-rounded` (or `-outlined`, `-sharp`) — the variant marker
- `.ms-{kebab-icon-name}` — the specific icon (e.g. `.ms-home`)

```css
.material-symbols-outlined { color: blue; }   /* applies to all outlined icons */
.ms-home { color: red; }                       /* overrides just the home icon */
```

### Accessibility-correct by default

Without `aria-hidden`, screen readers will read the underscored icon name out loud — NVDA says "arrow forward ios", JAWS says "arrow underscore forward underscore ios". Neither is useful. Every icon component renders with `aria-hidden="true"` baked in. Adding a label automatically removes it:

```tsx
<MsHome aria-label="Home" />
<MsHome><title>Home</title></MsHome>
<button aria-label="Go home"><MsHome /></button>
```

### Hover-to-preview in your IDE — no extension required

Every icon ships a JSDoc with an inline base64-encoded preview. Hover `<MsHome />` and your editor renders the actual glyph in the tooltip. Works in VS Code, JetBrains, anywhere TypeScript hovers do.

### Tree-shakeable, tiny per-icon cost

Named imports drop unused icons at build time — esbuild, Vite, Rollup, webpack all handle it out of the box.

|                       | Font-based       | SVG-based         |
| :-------------------- | :--------------- | :---------------- |
| Cost per icon (gzip)  | ~15 B            | ~290 B            |
| Asset                 | 1 woff2 (~150 KB gzip, cached) | none |
| Variable axes         | FILL, wght, GRAD, opsz | FILL only   |
| CSP without `font-src`| no               | yes               |
| Best for              | many icons in one app | edge / email / SSG with few icons |

### One library, nine frameworks, two flavors each

Pick the package below that matches both your stack and how you'd like icons rendered. The component API stays the same — same prop names, same class hooks, same defaults — so reading a snippet from the React docs translates straight to Vue, Svelte, Solid, or Astro.

---

## Choose your framework

### Font-based packages

Lightweight, leverages Material Symbols variable fonts. Best for apps with many icons.

| Framework                                                                                                  | Package                                                                                     |
| :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="16" height="16" /> React                        | [`@material-symbols-framework/react`](packages/react#readme)                                |
| <img src="https://cdn.simpleicons.org/vuedotjs/4FC08D" width="16" height="16" /> Vue 3                     | [`@material-symbols-framework/vue`](packages/vue#readme)                                    |
| <img src="https://cdn.simpleicons.org/svelte/FF3E00" width="16" height="16" /> Svelte                      | [`@material-symbols-framework/svelte`](packages/svelte#readme)                              |
| <img src="https://cdn.simpleicons.org/solid/2C4F7C" width="16" height="16" /> Solid                        | [`@material-symbols-framework/solid`](packages/solid#readme)                                |
| <img src="https://cdn.simpleicons.org/angular/DD0031" width="16" height="16" /> Angular                    | [`@material-symbols-framework/angular`](packages/angular#readme)                            |
| <img src="https://cdn.simpleicons.org/preact/673AB8" width="16" height="16" /> Preact                      | [`@material-symbols-framework/preact`](packages/preact#readme)                              |
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="16" height="16" /> React Native                 | [`@material-symbols-framework/react-native`](packages/react-native#readme)                  |
| <img src="https://cdn.simpleicons.org/astro/BC52EE" width="16" height="16" /> Astro                        | [`@material-symbols-framework/astro`](packages/astro#readme)                                |
| <img src="https://cdn.simpleicons.org/webcomponentsdotorg/29ABE2" width="16" height="16" /> Vanilla / WC   | [`@material-symbols-framework/vanilla`](packages/vanilla#readme)                            |

### SVG-based packages

Inline SVG, no asset to load. Best for landing pages, email templates, and edge runtimes.

| Framework                                                                                                  | Package                                                                                     |
| :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="16" height="16" /> React                        | [`@material-symbols-framework/react-svg`](packages/react-svg#readme)                        |
| <img src="https://cdn.simpleicons.org/vuedotjs/4FC08D" width="16" height="16" /> Vue 3                     | [`@material-symbols-framework/vue-svg`](packages/vue-svg#readme)                            |
| <img src="https://cdn.simpleicons.org/svelte/FF3E00" width="16" height="16" /> Svelte                      | [`@material-symbols-framework/svelte-svg`](packages/svelte-svg#readme)                      |
| <img src="https://cdn.simpleicons.org/solid/2C4F7C" width="16" height="16" /> Solid                        | [`@material-symbols-framework/solid-svg`](packages/solid-svg#readme)                        |
| <img src="https://cdn.simpleicons.org/angular/DD0031" width="16" height="16" /> Angular                    | [`@material-symbols-framework/angular-svg`](packages/angular-svg#readme)                    |
| <img src="https://cdn.simpleicons.org/preact/673AB8" width="16" height="16" /> Preact                      | [`@material-symbols-framework/preact-svg`](packages/preact-svg#readme)                      |
| <img src="https://cdn.simpleicons.org/astro/BC52EE" width="16" height="16" /> Astro                        | [`@material-symbols-framework/astro-svg`](packages/astro-svg#readme)                        |
| <img src="https://cdn.simpleicons.org/webcomponentsdotorg/29ABE2" width="16" height="16" /> Vanilla / WC   | [`@material-symbols-framework/vanilla-svg`](packages/vanilla-svg#readme)                    |

---

## At a glance

```tsx
import '@material-symbols-framework/react/rounded.css';
import { MsHome, MsFavorite, MsAndroidCellDual5BarAlert } from '@material-symbols-framework/react';

<MsHome />
<MsFavorite fill color="red" size={32} />
<MsAndroidCellDual5BarAlert variant="outlined" strokeWidth={300} />
```

Naming convention: `snake_case` icon names map to `Ms` + `PascalCase`, so
`android_cell_dual_5_bar_alert` becomes `MsAndroidCellDual5BarAlert`. The `Ms` prefix
keeps icons from clashing with your project components.

For full props, install instructions, and framework-specific tips, jump to the per-package
README linked in the tables above.

---

## License

Released under the [Apache License 2.0](https://github.com/heliacn/material-symbols-framework/blob/main/LICENSE).

Material Symbols icon designs and font files are © Google, also distributed under
Apache 2.0. This project is an independent wrapper and is not affiliated with Google.
