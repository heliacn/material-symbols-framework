// Build untuk Angular.
//
// Pendekatan: ship pre-compiled FESM2022 + .d.ts. Karena komponen kita
// adalah standalone Angular component dengan inline template (string),
// tidak butuh ng-packagr penuh — esbuild dengan target ES2022 dan
// `experimentalDecorators` bisa mengeluarkan kode yang Angular-friendly.
//
// Konsumen perlu Angular >= 16 (ivy + standalone). AOT compile dilakukan
// di project konsumen, jadi metadata decorator di output kita tidak
// di-strip oleh esbuild (kita pakai decorator legacy mode).

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import { mkdir, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { copyFontAssets } from '../../scripts/lib/assets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> esbuild FESM2022 (Angular)...');
await build({
    entryPoints: [path.join(SRC, 'index.ts')],
    outfile: path.join(DIST, 'fesm2022', 'index.mjs'),
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    bundle: true,
    external: ['@angular/core', '@angular/common', 'rxjs', 'tslib'],
    tsconfig: path.join(__dirname, 'tsconfig.json'),
    logLevel: 'info',
    keepNames: true,
});

console.log('> tsc (declarations)...');
// Angular butuh declaration di root dist/ (sesuai exports)
execSync('pnpm exec tsc -p tsconfig.json --outDir dist', { cwd: __dirname, stdio: 'inherit' });

console.log('> copy CSS + fonts...');
await copyFontAssets(DIST);

console.log('> Done.');
