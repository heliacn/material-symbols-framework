// Svelte SVG: ship source .svelte + index.js + d.ts.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> Copy .svelte + .js + .d.ts...');
await copyTree(SRC, DIST, /\.(svelte|js|d\.ts)$/);

console.log('> Done.');

async function copyTree(src, dst, regex) {
    const items = await readdir(src, { withFileTypes: true });
    for (const item of items) {
        const fullSrc = path.join(src, item.name);
        const fullDst = path.join(dst, item.name);
        if (item.isDirectory()) {
            await mkdir(fullDst, { recursive: true });
            await copyTree(fullSrc, fullDst, regex);
        } else if (regex.test(item.name)) {
            await cp(fullSrc, fullDst);
        }
    }
}
