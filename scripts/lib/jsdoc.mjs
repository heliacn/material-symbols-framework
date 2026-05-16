// Builder JSDoc untuk komponen icon. Format-nya konsisten antar framework
// supaya hover IDE menampilkan: preview kecil + nama + variant + link.

import { makePreviewDataUrl } from './preview.mjs';

/**
 * @param {Object} args
 * @param {string} args.iconName - snake_case name
 * @param {'outlined'|'rounded'|'sharp'} [args.variant='rounded']
 * @param {string} args.pathD - SVG path data untuk preview
 * @param {string} [args.framework] - label framework (opsional, untuk konteks)
 * @returns {string} JSDoc lengkap (multi-line, sudah termasuk /** ... *\/)
 */
export function buildIconJSDoc({ iconName, variant = 'rounded', pathD, framework }) {
    const dataUrl = makePreviewDataUrl(pathD);
    const variantCap = variant.charAt(0).toUpperCase() + variant.slice(1);
    const googleLink = `https://fonts.google.com/icons?selected=Material+Symbols+${variantCap}:${iconName}`;
    const fwSuffix = framework ? ` (${framework}${variant !== 'rounded' ? `, ${variant}` : ''})` : '';

    return [
        '/**',
        ` * ![${iconName}](${dataUrl})`,
        ' *',
        ` * Material Symbols${fwSuffix}: \`${iconName}\``,
        ' *',
        ` * @see ${googleLink} — preview semua variant di Google Fonts`,
        ' */',
    ].join('\n');
}
