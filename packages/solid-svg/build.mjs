// Solid SVG: ship source (TS-stripped) + tsc declarations.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

console.log('> Strip TS → JSX...');
await stripTsToJsx(SRC, path.join(DIST, 'source'));

console.log('> tsc (declarations)...');
execSync('pnpm exec tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });

console.log('> Done.');

async function stripTsToJsx(src, dst) {
    await mkdir(dst, { recursive: true });
    const items = await readdir(src, { withFileTypes: true });
    for (const item of items) {
        const fullSrc = path.join(src, item.name);
        if (item.isDirectory()) {
            await stripTsToJsx(fullSrc, path.join(dst, item.name));
            continue;
        }
        const isTsx = item.name.endsWith('.tsx');
        const isTs = item.name.endsWith('.ts');
        if (!isTsx && !isTs) continue;
        const content = await readFile(fullSrc, 'utf8');
        const transformed = await transformTsToJs(content);
        const newName = item.name.replace(/\.(tsx|ts)$/, isTsx ? '.jsx' : '.js');
        await writeFile(path.join(dst, newName), transformed);
    }
}

async function transformTsToJs(code) {
    const { transform } = await import('esbuild');
    const result = await transform(code, {
        loader: 'tsx',
        jsx: 'preserve',
        target: 'es2020',
    });
    return result.code;
}
