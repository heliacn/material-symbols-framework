import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildJsxPackage } from '../../scripts/lib/build-jsx.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// React Native: tidak perlu CSS injection, tapi tetap copy font asset
// (woff2) supaya konsumen bisa pakai Font.loadAsync atau expo-font.
await buildJsxPackage({ pkgDir: __dirname, flavor: 'react-native', withAssets: true });
