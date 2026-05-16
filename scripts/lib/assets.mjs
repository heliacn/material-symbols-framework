// Shared helper: copy CSS + woff2 font ke dist/ untuk package font-based.
//
// Output dist:
//   dist/style.css         → semua 3 variant (kompat dengan import lama)
//   dist/rounded.css       → hanya Rounded
//   dist/outlined.css      → hanya Outlined
//   dist/sharp.css         → hanya Sharp
//   dist/fonts/*.woff2     → 3 file woff2
//
// Konsumen yang hanya pakai 1 variant cukup `import '@.../react/rounded.css'`
// → bundle CSS jauh kecil + cuma 1 woff2 yang di-load browser.

import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const VARIANTS = ['outlined', 'rounded', 'sharp'];

export async function copyFontAssets(distDir) {
    const fontsSrc = path.join(ROOT, 'ms', 'material-symbols');
    const fontsDist = path.join(distDir, 'fonts');
    await mkdir(fontsDist, { recursive: true });

    // Copy semua woff2.
    for (const v of VARIANTS) {
        await cp(
            path.join(fontsSrc, `material-symbols-${v}.woff2`),
            path.join(fontsDist, `material-symbols-${v}.woff2`),
        );
    }

    // Per-variant CSS (path remap → ./fonts/).
    for (const v of VARIANTS) {
        const css = await readFile(path.join(fontsSrc, `${v}.css`), 'utf8');
        const remapped = css.replaceAll('./material-symbols-', './fonts/material-symbols-');
        await writeFile(path.join(distDir, `${v}.css`), remapped);
    }

    // Combined `style.css` — kompat dengan pemakaian sebelumnya.
    const combined = await readFile(path.join(fontsSrc, 'index.css'), 'utf8');
    const remapped = combined.replaceAll('./material-symbols-', './fonts/material-symbols-');
    await writeFile(path.join(distDir, 'style.css'), remapped);
}
