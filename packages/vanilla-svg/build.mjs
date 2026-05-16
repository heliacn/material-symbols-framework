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

console.log('> esbuild ESM (per-file)...');
const esmEntries = await collectEntries(SRC, /\.ts$/);
await build({
    entryPoints: esmEntries,
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

console.log('> esbuild CJS (bundled, root)...');
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
