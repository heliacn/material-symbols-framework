// Build script untuk @material-symbols-framework/react-svg.
// Sama seperti react (font-based) tapi:
//   - Tidak ada CSS / font asset
//   - 3 entry point per variant: outlined, rounded, sharp
//   - Per-file ESM untuk tree-shaking sempurna

import { build } from 'esbuild';
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = __dirname;
const SRC = path.join(PKG, 'src');
const DIST = path.join(PKG, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// ---------------------------------------------------------------------------
// 1. ESM build — per-file output, semua variant sekaligus (outbase = src/).
// ---------------------------------------------------------------------------
console.log('> esbuild ESM (per-file, all variants)...');
const esmEntries = await collectEsmEntries(SRC);
await build({
    entryPoints: esmEntries,
    outdir: path.join(DIST, 'esm'),
    outbase: SRC,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    bundle: false,
    jsx: 'automatic',
    loader: { '.tsx': 'tsx', '.ts': 'ts' },
    outExtension: { '.js': '.js' },
    logLevel: 'info',
});

// ---------------------------------------------------------------------------
// 2. CJS build — single bundle dari rounded (default entry).
// ---------------------------------------------------------------------------
console.log('> esbuild CJS (bundled, rounded)...');
await build({
    entryPoints: [path.join(SRC, 'rounded', 'index.ts')],
    outfile: path.join(DIST, 'cjs', 'index.cjs'),
    format: 'cjs',
    platform: 'neutral',
    target: ['es2020'],
    bundle: true,
    jsx: 'automatic',
    external: ['react', 'react/jsx-runtime'],
    logLevel: 'info',
});

// ---------------------------------------------------------------------------
// 3. Type declarations.
// ---------------------------------------------------------------------------
console.log('> tsc (declarations)...');
execSync('pnpm exec tsc -p tsconfig.json', { cwd: PKG, stdio: 'inherit' });

console.log('> Done.');

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

async function collectEsmEntries(dir) {
    const entries = [];
    async function walk(d) {
        const items = await readdir(d, { withFileTypes: true });
        for (const item of items) {
            const full = path.join(d, item.name);
            if (item.isDirectory()) {
                await walk(full);
            } else if (/\.(ts|tsx)$/.test(item.name)) {
                entries.push(full);
            }
        }
    }
    await walk(dir);
    return entries;
}
