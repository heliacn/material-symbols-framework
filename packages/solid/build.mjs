// Build untuk Solid.
//
// Catatan: Solid memerlukan transform JSX khusus (babel-preset-solid) supaya
// JSX di-compile menjadi `template(...)` yang reaktif. esbuild tidak punya
// transform native untuk itu. Untuk mempertahankan reaktivitas, **strategi
// yang paling kompatibel** adalah ship source file `.jsx` plain dan biarkan
// konsumen yang men-transform via vite-plugin-solid / babel.
//
// Build pipeline:
//   1. Copy semua .tsx → dist/source/*.jsx (rename ekstensi, tanpa transform)
//   2. Re-export entry sebagai dist/source/index.jsx
//   3. tsc → dist/types/ untuk declaration
//   4. CSS/font ke dist/
//
// Konsumen yang pakai Vite/SolidStart akan otomatis ke-resolve via
// `"solid": "./dist/source/index.jsx"` export condition.

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { copyFontAssets } from '../../scripts/lib/assets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> Strip TS → JSX (untuk Solid konsumen)...');
await stripTsToJsx(SRC, path.join(DIST, 'source'));

// Untuk konsumen non-Solid-aware (misal CJS/Node), kita TIDAK ship esm/cjs
// build karena tanpa solid transform mereka pun tidak akan bekerja.
// Solid users wajib pakai bundler dengan plugin solid.

console.log('> tsc (declarations)...');
execSync('pnpm exec tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });

console.log('> copy CSS + fonts...');
await copyFontAssets(DIST);

console.log('> Done.');

async function stripTsToJsx(src, dst) {
    await mkdir(dst, { recursive: true });
    const items = await readdir(src, { withFileTypes: true });
    for (const item of items) {
        const fullSrc = path.join(src, item.name);
        if (item.isDirectory()) {
            await stripTsToJsx(fullSrc, path.join(dst, item.name));
            continue;
        }
        const isTsx = item.name.endsWith('.tsx');
        const isTs = item.name.endsWith('.ts');
        if (!isTsx && !isTs) continue;

        const content = await readFile(fullSrc, 'utf8');
        // Strip TypeScript syntax minimal:
        //   - `: Type` annotations setelah identifier
        //   - generic params di JSX seperti <Foo<T>>
        //   - `as Type` casts
        // Untuk kebutuhan kita, esbuild bisa transform ts → js tanpa transform JSX.
        const transformed = await transformTsToJs(content);
        const newName = item.name.replace(/\.(tsx|ts)$/, isTsx ? '.jsx' : '.js');
        await writeFile(path.join(dst, newName), transformed);
    }
}

async function transformTsToJs(code) {
    // Pakai esbuild transform untuk strip TypeScript saja, JSX tetap raw.
    const { transform } = await import('esbuild');
    const result = await transform(code, {
        loader: 'tsx',
        jsx: 'preserve',
        target: 'es2020',
    });
    return result.code;
}
