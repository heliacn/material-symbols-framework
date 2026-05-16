// Ukur bundle size yang akan didapat konsumen dengan tree-shaking.
//
// Strategi: bikin file entry kecil yang import beberapa skenario,
// bundle dengan esbuild (production: minify + treeshake), bandingkan.

import { build } from 'esbuild';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(ROOT, '.bundle-measure');

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

const scenarios = [
    {
        name: '1 icon (MsHome)',
        entry: `import { MsHome } from '${pkgPath('react')}';
window.x = MsHome;`,
    },
    {
        name: '5 icon umum',
        entry: `import { MsHome, MsFace, MsSettings, MsSearch, MsMenu } from '${pkgPath('react')}';
window.x = [MsHome, MsFace, MsSettings, MsSearch, MsMenu];`,
    },
    {
        name: '20 icon',
        entry: (() => {
            const icons = ['Home', 'Face', 'Settings', 'Search', 'Menu', 'Close', 'Add', 'Delete',
                'Edit', 'Star', 'Favorite', 'Share', 'Download', 'Upload', 'Person',
                'Mail', 'Call', 'Lock', 'Visibility', 'Notifications'];
            return `import { ${icons.map(n => 'Ms' + n).join(', ')} } from '${pkgPath('react')}';
window.x = [${icons.map(n => 'Ms' + n).join(', ')}];`;
        })(),
    },
    {
        name: '100 icon (random)',
        entry: (() => {
            const icons = sample100();
            return `import { ${icons.join(', ')} } from '${pkgPath('react')}';
window.x = [${icons.join(', ')}];`;
        })(),
    },
    {
        name: 'SVG 1 icon (MsHome rounded)',
        entry: `import { MsHome } from '${pkgPath('react-svg')}';
window.x = MsHome;`,
    },
    {
        name: 'SVG 20 icon',
        entry: (() => {
            const icons = ['Home', 'Face', 'Settings', 'Search', 'Menu', 'Close', 'Add', 'Delete',
                'Edit', 'Star', 'Favorite', 'Share', 'Download', 'Upload', 'Person',
                'Mail', 'Call', 'Lock', 'Visibility', 'Notifications'];
            return `import { ${icons.map(n => 'Ms' + n).join(', ')} } from '${pkgPath('react-svg')}';
window.x = [${icons.map(n => 'Ms' + n).join(', ')}];`;
        })(),
    },
    {
        name: 'WORST CASE: import seluruh barrel font-based',
        entry: `import * as all from '${pkgPath('react')}';
window.x = all;`,
    },
];

console.log('# Bundle size measurement\n');
console.log('Konsumen di-simulasikan via esbuild bundle + minify + treeshake.\n');
console.log('| Scenario | Raw | Min | Min+Gzip | Min+Brotli |');
console.log('|---|---|---|---|---|');

for (const s of scenarios) {
    const entryFile = path.join(TMP, `entry-${slug(s.name)}.tsx`);
    const outFile = path.join(TMP, `out-${slug(s.name)}.js`);
    const outFileMin = path.join(TMP, `out-${slug(s.name)}.min.js`);
    await writeFile(entryFile, s.entry);

    // Build versi non-minified untuk lihat raw size
    await build({
        entryPoints: [entryFile],
        outfile: outFile,
        format: 'esm',
        bundle: true,
        minify: false,
        treeShaking: true,
        platform: 'browser',
        target: ['es2020'],
        jsx: 'automatic',
        external: ['react', 'react/jsx-runtime'],
        absWorkingDir: ROOT,
        logLevel: 'silent',
    });

    // Build versi production
    await build({
        entryPoints: [entryFile],
        outfile: outFileMin,
        format: 'esm',
        bundle: true,
        minify: true,
        treeShaking: true,
        platform: 'browser',
        target: ['es2020'],
        jsx: 'automatic',
        external: ['react', 'react/jsx-runtime'],
        absWorkingDir: ROOT,
        logLevel: 'silent',
    });

    const raw = (await stat(outFile)).size;
    const min = (await stat(outFileMin)).size;
    const minBuf = readFileSync(outFileMin);
    const gz = gzipSync(minBuf, { level: 9 }).length;
    const br = brotliCompressSync(minBuf).length;

    console.log(`| ${s.name} | ${fmt(raw)} | ${fmt(min)} | ${fmt(gz)} | ${fmt(br)} |`);
}

await rm(TMP, { recursive: true, force: true });

// ---------------------------------------------------------------------------

function pkgPath(pkg) {
    return path.join(ROOT, 'packages', pkg, 'dist', 'esm', pkg === 'react-svg' ? 'rounded/index.js' : 'index.js');
}

function fmt(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}

function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function sample100() {
    // Pilih 100 nama valid pertama dari barrel React, biar tidak error.
    const fs = readFileSync(path.join(ROOT, 'packages', 'react', 'src', 'icons.ts'), 'utf8');
    const matches = [...fs.matchAll(/export \{ (Ms\w+) \} from/g)].map(m => m[1]);
    // Skip 200 yang pertama (yang banyak prefix angka), ambil 100 berikutnya.
    return matches.slice(200, 300);
}
