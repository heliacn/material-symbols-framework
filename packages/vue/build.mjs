import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildJsxPackage } from '../../scripts/lib/build-jsx.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await buildJsxPackage({ pkgDir: __dirname, flavor: 'vue' });
