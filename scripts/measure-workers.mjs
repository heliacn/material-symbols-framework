// Ukur bundle size khusus skenario Cloudflare Workers / Edge Runtime.
// Workers limit:
//   - Free: 3 MB (compressed/gzipped JS+WASM)
//   - Paid: 10 MB
//
// Yang dihitung HANYA JS bundle yang di-eksekusi runtime, bukan static
// asset (woff2/CSS/image).

import { build } from 'esbuild';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(ROOT, '.workers-measure');

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

const scenarios = [
    {
        name: 'SSR Hono + 5 icon font-based',
        entry: `// Simulasi: route Workers yang render React SSR.
// Worker hanya tarik JS komponen — woff2 di-serve terpisah via assets.
import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { MsHome, MsFavorite, MsSearch, MsMenu, MsSettings } from '${pkgPath('react')}';

export default {
    async fetch() {
        const html = renderToString(h('div', null,
            h(MsHome), h(MsFavorite), h(MsSearch), h(MsMenu), h(MsSettings)
        ));
        return new Response(html, { headers: { 'content-type': 'text/html' } });
    }
};`,
    },
    {
        name: 'SSR + 50 icon font-based',
        entry: (() => {
            const fs = readFileSync(path.join(ROOT, 'packages', 'react', 'src', 'icons.ts'), 'utf8');
            const matches = [...fs.matchAll(/export \{ (Ms\w+) \} from/g)].map(m => m[1]).slice(0, 50);
            return `import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { ${matches.join(', ')} } from '${pkgPath('react')}';
export default {
    async fetch() {
        return new Response(renderToString(h('div', null, ${matches.map(n => `h(${n})`).join(', ')})));
    }
};`;
        })(),
    },
    {
        name: 'SSR + 5 icon SVG (rounded)',
        entry: `import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { MsHome, MsFavorite, MsSearch, MsMenu, MsSettings } from '${pkgPath('react-svg')}';
export default {
    async fetch() {
        return new Response(renderToString(h('div', null,
            h(MsHome), h(MsFavorite), h(MsSearch), h(MsMenu), h(MsSettings)
        )));
    }
};`,
    },
    {
        name: 'SSR + 50 icon SVG',
        entry: (() => {
            const fs = readFileSync(path.join(ROOT, 'packages', 'react-svg', 'src', 'rounded', 'icons.ts'), 'utf8');
            const matches = [...fs.matchAll(/export \{ (Ms\w+) \} from/g)].map(m => m[1]).slice(0, 50);
            return `import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { ${matches.join(', ')} } from '${pkgPath('react-svg')}';
export default {
    async fetch() {
        return new Response(renderToString(h('div', null, ${matches.map(n => `h(${n})`).join(', ')})));
    }
};`;
        })(),
    },
    {
        name: 'WORST CASE: import * font-based',
        entry: `import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import * as ms from '${pkgPath('react')}';
export default { async fetch() { return new Response(JSON.stringify(Object.keys(ms).slice(0, 5))); } };`,
    },
];

console.log('# Cloudflare Workers Bundle Size\n');
console.log('Workers limit: 3 MB (free) / 10 MB (paid). Yang dihitung JS bundle saja.\n');
console.log('| Scenario | Min | Min+Gzip | vs Free 3MB | vs Paid 10MB |');
console.log('|---|---|---|---|---|');

for (const s of scenarios) {
    const entryFile = path.join(TMP, `entry-${slug(s.name)}.tsx`);
    const outFile = path.join(TMP, `out-${slug(s.name)}.js`);
    await writeFile(entryFile, s.entry);

    await build({
        entryPoints: [entryFile],
        outfile: outFile,
        format: 'esm',
        bundle: true,
        minify: true,
        treeShaking: true,
        platform: 'browser',
        target: ['es2022'],
        jsx: 'automatic',
        // Workers tidak butuh react sebagai external — ter-bundle.
        absWorkingDir: ROOT,
        logLevel: 'silent',
    });

    const min = (await stat(outFile)).size;
    const buf = readFileSync(outFile);
    const gz = gzipSync(buf, { level: 9 }).length;
    const freeStatus = gz < 3 * 1024 * 1024 ? `✅ ${(gz / (3 * 1024 * 1024) * 100).toFixed(1)}%` : '❌ over';
    const paidStatus = gz < 10 * 1024 * 1024 ? `✅ ${(gz / (10 * 1024 * 1024) * 100).toFixed(1)}%` : '❌ over';

    console.log(`| ${s.name} | ${fmt(min)} | ${fmt(gz)} | ${freeStatus} | ${paidStatus} |`);
}

await rm(TMP, { recursive: true, force: true });

function pkgPath(pkg) {
    return path.join(ROOT, 'packages', pkg, 'dist', 'esm', pkg === 'react-svg' ? 'rounded/index.js' : 'index.js');
}

function fmt(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
