// Generate icon preview untuk JSDoc IDE hover.
//
// Konvensi (dari pengalaman): preview tidak boleh kebesaran. Ukuran
// 32×32 total: icon 24×24 + padding 4px + background tipis. Dengan begini
// icon kelihatan rapi di hover IDE, di tengah box, tidak overflow.
//
// Output: data URL base64 SVG yang di-embed di markdown image (`![](url)`).
// VS Code dan editor modern menjalankan markdown di JSDoc hover.

const PREVIEW_SIZE = 32;
const PADDING = 4;
const ICON_SIZE = PREVIEW_SIZE - PADDING * 2; // 24
const RX = 4; // radius background, biar friendly

// Warna dipilih netral agar terbaca di dark & light theme:
// - bg light gray (terlihat di dark theme)
// - fg dark gray (terlihat di light theme)
const BG_COLOR = '#f4f4f5'; // zinc-100
const FG_COLOR = '#27272a'; // zinc-800

/**
 * Bangun SVG preview 32×32 dengan background dan padding.
 * @param {string} pathD - data path icon (dari ms)
 * @returns {string} SVG markup minimal (single line)
 */
export function buildPreviewSvg(pathD) {
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_SIZE}" height="${PREVIEW_SIZE}" viewBox="0 0 ${PREVIEW_SIZE} ${PREVIEW_SIZE}">` +
        `<rect width="${PREVIEW_SIZE}" height="${PREVIEW_SIZE}" rx="${RX}" fill="${BG_COLOR}"/>` +
        `<svg x="${PADDING}" y="${PADDING}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 -960 960 960">` +
        `<path d="${pathD}" fill="${FG_COLOR}"/>` +
        `</svg>` +
        `</svg>`
    );
}

/**
 * Encode SVG ke data URL base64.
 */
export function toDataUrl(svg) {
    const base64 = Buffer.from(svg, 'utf8').toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Helper utama: dari path data → data URL siap pakai di JSDoc.
 */
export function makePreviewDataUrl(pathD) {
    return toDataUrl(buildPreviewSvg(pathD));
}
