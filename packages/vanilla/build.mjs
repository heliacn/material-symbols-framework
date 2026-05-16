// Build untuk Vanilla / Web Component.
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

console.log('> esbuild ESM...');
await build({
    entryPoints: [
        path.join(SRC, 'index.ts'),
        path.join(SRC, 'auto-register.ts'),
    ],
    outdir: path.join(DIST, 'esm'),
    outbase: SRC,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    bundle: false,
    loader: { '.ts': 'ts' },
    outExtension: { '.js': '.js' },
    logLevel: 'info',
});

console.log('> esbuild CJS...');
await build({
    entryPoints: [path.join(SRC, 'index.ts')],
    outfile: path.join(DIST, 'cjs', 'index.cjs'),
    format: 'cjs',
    platform: 'neutral',
    target: ['es2020'],
    bundle: true,
    logLevel: 'info',
});

console.log('> tsc (declarations)...');
execSync('pnpm exec tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });

console.log('> copy CSS + fonts...');
await copyFontAssets(DIST);

console.log('> Done.');
