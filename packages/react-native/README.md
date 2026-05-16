<div align="center">
  <img alt="React Native" src="https://cdn.simpleicons.org/react/61DAFB" width="120" height="120" />

# @material-symbols-framework/react-native

Material Symbols icon components for **React Native** — backed by Material Symbols variable fonts loaded via `expo-font` or `Font.loadAsync`.

[![npm](https://img.shields.io/npm/v/@material-symbols-framework/react-native?color=CB061D&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react-native)
[![downloads](https://img.shields.io/npm/dw/@material-symbols-framework/react-native?color=087BB4&style=flat-square)](https://www.npmjs.com/package/@material-symbols-framework/react-native)
[![license](https://img.shields.io/npm/l/@material-symbols-framework/react-native?color=008660&style=flat-square)](https://github.com/heliacn/material-symbols-framework/blob/main/packages/react-native/LICENSE)

</div>

## Installation

```bash
npm install @material-symbols-framework/react-native
```

> Peer dependencies: `react >= 17`, `react-native >= 0.70`.

## Usage

### 1. Load the font(s) at app start

The package ships the Material Symbols variable font files (`.woff2`) under `./fonts/*`. The font family keys you need to register are:

- `MaterialSymbolsRounded`
- `MaterialSymbolsOutlined`
- `MaterialSymbolsSharp`

> **Note:** some React Native runtimes (notably bare RN on Android < 8) don't accept `.woff2` directly. If your platform doesn't load the bundled `.woff2`, convert it to `.ttf` once and ship the `.ttf` with your app — the font family name stays the same.

#### Expo

```tsx
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  MaterialSymbolsRounded: require('@material-symbols-framework/react-native/fonts/material-symbols-rounded.woff2'),
  // optional: register the other variants
  // MaterialSymbolsOutlined: require('@material-symbols-framework/react-native/fonts/material-symbols-outlined.woff2'),
  // MaterialSymbolsSharp: require('@material-symbols-framework/react-native/fonts/material-symbols-sharp.woff2'),
});

if (!loaded) return null;
```

#### Bare React Native

Drop the font files into `assets/fonts/` and link with `react-native-asset` or your preferred font setup. Use the same family names listed above.

### 2. Use icons in your components

```tsx
import { MsHome, MsFavorite, Ms } from '@material-symbols-framework/react-native';

export default function App() {
  return (
    <>
      <MsHome />
      <MsFavorite color="red" size={32} />
      <Ms icon="home" variant="outlined" />
    </>
  );
}
```

**Naming convention:** snake_case → `Ms` + PascalCase, same as the web package.

## Props

| Prop      | Type                                          | Default        | Description                                  |
| :-------- | :-------------------------------------------- | :------------- | :------------------------------------------- |
| `variant` | `'outlined' \| 'rounded' \| 'sharp'`          | `'rounded'`    | Picks the font family                        |
| `size`    | `number`                                      | `24`           | Icon size in points                          |
| `color`   | `string`                                      | `currentColor` | Icon color                                   |
| `style`   | `StyleProp<TextStyle>`                        | —              | Extra `<Text>` style                         |
| `...rest` | `TextProps`                                   | —              | Forwarded to the underlying `<Text>`         |

> Notes on RN limitations: variable-axis props (`fill`, `grad`, `strokeWidth`, `opticalSize`) are not honored by every RN engine because `font-variation-settings` isn't universally supported. If you need the filled style, register the **filled** Material Symbols font and pass `variant="…"` accordingly. The matching CSS-based axes are available on the web package.

## Accessibility

Use the regular `accessibilityLabel`:

```tsx
<MsHome accessibilityLabel="Home" />
```

## Looking for the SVG-based version?

A `react-native-svg`-based variant isn't published yet. Open an issue on the repo if you'd like it prioritized.

## License

Apache 2.0 — see [LICENSE](https://github.com/heliacn/material-symbols-framework/blob/main/packages/react-native/LICENSE).

Material Symbols icon designs are © Google, also distributed under Apache 2.0. This package is an independent wrapper and is not affiliated with Google.
