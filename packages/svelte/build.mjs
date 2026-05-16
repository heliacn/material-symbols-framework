// Build untuk Svelte.
//
// Strategi: Svelte components di-compile di project konsumen (tooling
// mereka — SvelteKit/Vite — yang menjalankan svelte preprocessor).
// Jadi build kita cukup:
//   1. Salin semua *.svelte ke dist/ (preserve struktur)
//   2. Salin index.js + d.ts (sebagai pointer)
//   3. Copy CSS + woff2

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { copyFontAssets } from '../../scripts/lib/assets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> Copy *.svelte ke dist...');
await copyTree(SRC, DIST, /\.(svelte|js)$/);

// Buat declaration sederhana — Svelte Language Tools akan baca via svelte2tsx
// di project konsumen. Untuk konsumsi TS, kita beri pointer minimal.
console.log('> Generate index.d.ts...');
await writeFile(path.join(DIST, 'index.d.ts'), buildDeclarations());

console.log('> copy CSS + fonts...');
await copyFontAssets(DIST);

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

function buildDeclarations() {
    return `// Auto-generated declaration pointer.
// Svelte Language Tools akan menginferensi prop dari .svelte source.
import type { SvelteComponent } from 'svelte';

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
export type MsGrade = -25 | 0 | 200 | number;

export interface MsProps {
    icon?: string;
    code?: string;
    variant?: MsVariant;
    size?: number | string;
    color?: string;
    fill?: boolean;
    grad?: MsGrade;
    strokeWidth?: number;
    opticalSize?: number;
    [key: string]: unknown;
}

export class Ms extends SvelteComponent<MsProps> {}
`;
}
