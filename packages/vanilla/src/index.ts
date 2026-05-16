/**
 * Material Symbols — vanilla Web Component.
 *
 * Unlike framework adapters (React/Vue/etc.), this version registers a
 * **single** custom element `<ms-icon>` instead of 3879 of them. Consumers
 * pick the icon via the `icon` or `code` attribute. This approach is more
 * realistic for vanilla — registering thousands of custom elements isn't
 * ideal for performance or bundle size.
 *
 * Usage:
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
 * Or, to auto-register on import:
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
 * Supported attributes:
 * - `icon` — icon name in snake_case
 * - `code` — hex codepoint
 * - `variant` — outlined | rounded | sharp (default: rounded)
 * - `size` — px or any CSS length string
 * - `color` — color
 * - `fill` — boolean (presence is enough)
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

        // We render via class + textContent (no Shadow DOM) so the global
        // Material Symbols CSS still applies, and consumer styling via
        // classes can pierce through like on any normal element.
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
 * Register the `<ms-icon>` custom element (idempotent).
 */
export function defineMsIcon(tagName = 'ms-icon'): void {
    if (typeof window === 'undefined') return;
    if (!customElements.get(tagName)) {
        customElements.define(tagName, MsIconElement);
    }
}
