// Angular SVG: bundle component (FESM2022) + per-file ESM untuk icons.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> esbuild FESM2022 (Angular component)...');
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

console.log('> esbuild per-file (icon data)...');
const iconsSrc = path.join(SRC, 'icons');
const iconEntries = await collectEntries(iconsSrc, /\.ts$/);
await build({
    entryPoints: iconEntries,
    outdir: path.join(DIST, 'icons'),
    outbase: iconsSrc,
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    bundle: false,
    loader: { '.ts': 'ts' },
    outExtension: { '.js': '.mjs' },
    logLevel: 'silent',
});

console.log('> tsc (declarations)...');
execSync('pnpm exec tsc -p tsconfig.json --outDir dist', { cwd: __dirname, stdio: 'inherit' });

console.log('> Done.');

async function collectEntries(dir, regex) {
    const entries = [];
    async function walk(d) {
        const items = await readdir(d, { withFileTypes: true });
        for (const item of items) {
            const full = path.join(d, item.name);
            if (item.isDirectory()) await walk(full);
            else if (regex.test(item.name)) entries.push(full);
        }
    }
    await walk(dir);
    return entries;
}
