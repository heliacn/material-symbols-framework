// Build helper untuk package JSX/TSX-based (React, Preact, Solid, Vue, RN).
// Output:
//   - dist/esm/   (per-file ESM, untuk tree-shaking)
//   - dist/cjs/   (single bundle, opsional)
//   - dist/types/ (declarations via tsc)
//   - dist/style.css + dist/fonts/ (jika withAssets=true)

import { build } from 'esbuild';
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { copyFontAssets } from './assets.mjs';

/**
 * @param {Object} opts
 * @param {string} opts.pkgDir - Absolute path package
 * @param {'react'|'preact'|'solid'|'vue'|'react-native'} opts.flavor
 * @param {boolean} [opts.withAssets=true] - Copy CSS+font ke dist
 * @param {boolean} [opts.cjs=true] - Build CJS bundle
 * @param {string[]} [opts.external] - Tambahan external untuk CJS bundle
 */
export async function buildJsxPackage({
    pkgDir,
    flavor,
    withAssets = true,
    cjs = true,
    external = [],
}) {
    const SRC = path.join(pkgDir, 'src');
    const DIST = path.join(pkgDir, 'dist');

    await rm(DIST, { recursive: true, force: true });
    await mkdir(DIST, { recursive: true });

    // --- esbuild common config ---
    const jsx = flavor === 'solid' ? 'preserve' : 'automatic';
    const jsxImportSource =
        flavor === 'preact' ? 'preact' :
            flavor === 'solid' ? 'solid-js' :
                undefined;

    const baseExternal = (() => {
        switch (flavor) {
            case 'react': return ['react', 'react/jsx-runtime'];
            case 'preact': return ['preact', 'preact/compat', 'preact/jsx-runtime'];
            case 'solid': return ['solid-js', 'solid-js/web', 'solid-js/h'];
            case 'vue': return ['vue'];
            case 'react-native': return ['react', 'react/jsx-runtime', 'react-native'];
        }
        return [];
    })();

    // --- ESM build (per-file) ---
    console.log('> esbuild ESM (per-file)...');
    const esmEntries = await collectEntries(SRC, /\.(ts|tsx)$/);
    if (esmEntries.length === 0) {
        throw new Error(`Tidak ada source di ${SRC}`);
    }

    await build({
        entryPoints: esmEntries,
        outdir: path.join(DIST, 'esm'),
        outbase: SRC,
        format: 'esm',
        platform: 'browser',
        target: ['es2020'],
        bundle: false,
        jsx,
        jsxImportSource,
        loader: { '.tsx': 'tsx', '.ts': 'ts' },
        outExtension: { '.js': '.js' },
        logLevel: 'info',
    });

    // --- CJS build (single bundle dari index.ts) ---
    if (cjs) {
        console.log('> esbuild CJS (bundled)...');
        const indexFile = path.join(SRC, 'index.ts');
        await build({
            entryPoints: [indexFile],
            outfile: path.join(DIST, 'cjs', 'index.cjs'),
            format: 'cjs',
            platform: 'neutral',
            target: ['es2020'],
            bundle: true,
            jsx,
            jsxImportSource,
            external: [...baseExternal, ...external],
            logLevel: 'info',
        });
    }

    // --- Type declarations ---
    console.log('> tsc (declarations)...');
    execSync('pnpm exec tsc -p tsconfig.json', { cwd: pkgDir, stdio: 'inherit' });

    // --- CSS + font assets ---
    if (withAssets) {
        console.log('> copy CSS + fonts...');
        await copyFontAssets(DIST);
    }

    console.log('> Done.');
}

async function collectEntries(dir, regex) {
    const entries = [];
    async function walk(d) {
        const items = await readdir(d, { withFileTypes: true });
        for (const item of items) {
            const full = path.join(d, item.name);
            if (item.isDirectory()) {
                await walk(full);
            } else if (regex.test(item.name)) {
                entries.push(full);
            }
        }
    }
    await walk(dir);
    return entries;
}
