// Utility: parse icon list dari ms/material-symbols/index.d.ts
// File ini dihasilkan oleh marella dan berisi semua nama icon valid.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

/**
 * Capitalize huruf pertama dalam segmen. Jika segmen diawali angka
 * (misal "3d", "10k"), capitalize huruf pertama setelah angka.
 * Segmen yang seluruhnya angka dibiarkan apa adanya.
 */
function capSegment(seg) {
    const idx = seg.search(/[a-zA-Z]/);
    if (idx < 0) return seg;
    return seg.slice(0, idx) + seg[idx].toUpperCase() + seg.slice(idx + 1);
}

/**
 * Konversi snake_case → PascalCase, dengan handling untuk nama yang
 * diawali angka (misal "10k" → "10K", "3d_rotation" → "3DRotation").
 *
 * Karena identifier JS tidak boleh diawali angka, kita prefix "Ms"
 * di pemanggil — fungsi ini hanya menghasilkan bagian setelah "Ms".
 */
export function toPascalCase(snake) {
    return snake.split('_').map(capSegment).join('');
}

/**
 * Nama komponen final, misal "android_cell_dual_5_bar_alert" → "MsAndroidCellDual5BarAlert"
 */
export function toComponentName(iconName) {
    return 'Ms' + toPascalCase(iconName);
}

/**
 * Class CSS spesifik per-icon, misal "android_cell_dual_5_bar_alert" → "ms-android-cell-dual-5-bar-alert"
 */
export function toIconClass(iconName) {
    return 'ms-' + iconName.replaceAll('_', '-');
}

/**
 * Baca daftar icon dari index.d.ts marella.
 * Return: string[] berisi nama icon dalam snake_case.
 */
export async function loadIconList() {
    const dtsPath = path.join(ROOT, 'ms', 'material-symbols', 'index.d.ts');
    const content = await readFile(dtsPath, 'utf8');

    // Format file: type MaterialSymbols = [ "icon1", "icon2", ... ];
    const matches = content.match(/"([^"]+)"/g);
    if (!matches) {
        throw new Error('Gagal parse index.d.ts marella');
    }
    return matches.map((m) => m.slice(1, -1));
}
