/**
 * Material Symbols — Web Component versi vanilla.
 *
 * Berbeda dari adapter framework (React/Vue/dst), versi ini hanya
 * mendaftarkan **satu** custom element `<ms-icon>` (bukan 3879). Konsumen
 * memilih icon lewat atribut `icon` atau `code`. Pendekatan ini lebih
 * realistis untuk vanilla — register ribuan custom element tidak ideal
 * untuk performa maupun bundle.
 *
 * Pemakaian:
 * ```html
 * <link rel="stylesheet" href="@material-symbols-framework/vanilla/style.css" />
 * <script type="module">
 *   import { defineMsIcon } from '@material-symbols-framework/vanilla';
 *   defineMsIcon();
 * </script>
 *
 * <ms-icon icon="home"></ms-icon>
 * <ms-icon icon="home" variant="outlined" size="32" color="red"></ms-icon>
 * <ms-icon code="e88a"></ms-icon>
 * <ms-icon icon="home" fill grad="-25"></ms-icon>
 * ```
 *
 * Atau, untuk auto-register saat di-import:
 * ```js
 * import '@material-symbols-framework/vanilla/auto-register';
 * ```
 */

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export function variantClass(variant: MsVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

export function codeToChar(code: string): string {
    const cp = parseInt(code, 16);
    if (Number.isNaN(cp)) return '';
    return String.fromCodePoint(cp);
}

export function buildFontVariationSettings(opts: {
    fill?: boolean;
    grad?: number;
    strokeWidth?: number;
    opticalSize?: number;
}): string | undefined {
    const parts: string[] = [];
    if (opts.fill) parts.push("'FILL' 1");
    if (opts.grad !== undefined && opts.grad !== 0) parts.push(`'GRAD' ${opts.grad}`);
    if (opts.strokeWidth !== undefined && opts.strokeWidth !== 400) parts.push(`'wght' ${opts.strokeWidth}`);
    if (opts.opticalSize !== undefined && opts.opticalSize !== 48) parts.push(`'opsz' ${opts.opticalSize}`);
    return parts.length ? parts.join(', ') : undefined;
}

function toIconClass(iconName: string): string {
    return 'ms-' + iconName.replaceAll('_', '-');
}

/**
 * Custom element `<ms-icon>`.
 *
 * Atribut yang didukung:
 * - `icon` — nama icon snake_case
 * - `code` — codepoint hex
 * - `variant` — outlined | rounded | sharp (default: rounded)
 * - `size` — px atau string CSS
 * - `color` — warna
 * - `fill` — boolean (cukup hadir/tidak)
 * - `grad`, `stroke-width`, `optical-size` — variable font axes
 */
export class MsIconElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['icon', 'code', 'variant', 'size', 'color', 'fill', 'grad', 'stroke-width', 'optical-size'];
    }

    connectedCallback() {
        if (!this.hasAttribute('aria-label')) {
            this.setAttribute('aria-hidden', 'true');
        }
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    private render() {
        const variant = (this.getAttribute('variant') as MsVariant) ?? 'rounded';
        const icon = this.getAttribute('icon') ?? undefined;
        const code = this.getAttribute('code') ?? undefined;
        const size = this.getAttribute('size') ?? undefined;
        const color = this.getAttribute('color') ?? undefined;
        const fill = this.hasAttribute('fill');
        const grad = numAttr(this, 'grad');
        const strokeWidth = numAttr(this, 'stroke-width');
        const opticalSize = numAttr(this, 'optical-size');

        const fvs = buildFontVariationSettings({ fill, grad, strokeWidth, opticalSize });

        const styleParts: string[] = [];
        if (size !== undefined) styleParts.push(`font-size: ${/^[0-9.]+$/.test(size) ? `${size}px` : size}`);
        if (color !== undefined) styleParts.push(`color: ${color}`);
        if (fvs) styleParts.push(`font-variation-settings: ${fvs}`);
        const styleStr = styleParts.join('; ');

        const classes = [variantClass(variant), icon ? toIconClass(icon) : null].filter(Boolean).join(' ');

        const body = code ? codeToChar(code) : (icon ?? '');

        // Kita render via class+textContent (tanpa Shadow DOM) supaya CSS
        // global Material Symbols berlaku, dan styling pengguna lewat class
        // bisa menembus seperti elemen biasa.
        this.className = classes;
        if (styleStr) {
            this.style.cssText = styleStr;
        }
        this.textContent = body;
    }
}

function numAttr(el: HTMLElement, name: string): number | undefined {
    const v = el.getAttribute(name);
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * Daftarkan custom element `<ms-icon>` (idempotent).
 */
export function defineMsIcon(tagName = 'ms-icon'): void {
    if (typeof window === 'undefined') return;
    if (!customElements.get(tagName)) {
        customElements.define(tagName, MsIconElement);
    }
}
