/**
 * Material Symbols — SVG Web Component.
 *
 * Like the font-based vanilla version, this exposes a **single** custom
 * element `<ms-svg-icon>`. The difference: SVG needs per-icon path data,
 * so consumers register the icons they actually use to keep tree-shaking
 * working.
 *
 * Usage:
 * ```html
 * <script type="module">
 *   import { defineMsSvgIcon, registerIcon } from '@material-symbols-framework/vanilla-svg';
 *   import home from '@material-symbols-framework/vanilla-svg/icons/rounded/home.js';
 *
 *   defineMsSvgIcon();
 *   registerIcon(home);
 * </script>
 *
 * <ms-svg-icon icon="home"></ms-svg-icon>
 * <ms-svg-icon icon="home" variant="rounded" fill size="32" color="red"></ms-svg-icon>
 * ```
 */

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface IconData {
    name: string;
    variant: 'outlined' | 'rounded' | 'sharp';
    path: string;
    pathFill: string;
}

const REGISTRY: Map<string, IconData> = new Map();

function key(name: string, variant: 'outlined' | 'rounded' | 'sharp'): string {
    return `${variant}:${name}`;
}

/** Register one or more icons in the registry. */
export function registerIcon(...icons: IconData[]): void {
    for (const icon of icons) {
        REGISTRY.set(key(icon.name, icon.variant), icon);
    }
}

function lookup(name: string, variant: 'outlined' | 'rounded' | 'sharp'): IconData | undefined {
    return REGISTRY.get(key(name, variant));
}

function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

function toIconClass(iconName: string): string {
    return 'ms-' + iconName.replaceAll('_', '-');
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export class MsSvgIconElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['icon', 'variant', 'size', 'color', 'fill'];
    }

    connectedCallback() {
        if (!this.hasAttribute('aria-label')) {
            this.setAttribute('aria-hidden', 'true');
        }
        this.render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.render();
    }

    private render() {
        const iconName = this.getAttribute('icon');
        if (!iconName) {
            this.replaceChildren();
            return;
        }
        const variantAttr = (this.getAttribute('variant') as MsSvgVariant | null) ?? 'rounded';
        const v = (variantAttr === 'outline' ? 'outlined' : variantAttr) as 'outlined' | 'rounded' | 'sharp';

        const icon = lookup(iconName, v);
        if (!icon) {
            console.warn(`[ms-svg-icon] Icon "${iconName}" (${v}) is not registered. Call registerIcon() first.`);
            this.replaceChildren();
            return;
        }

        const fill = this.hasAttribute('fill');
        const size = this.getAttribute('size') ?? '24';
        const color = this.getAttribute('color') ?? 'currentColor';

        // Clean up & rebuild via DOM (safer than innerHTML for SVG namespaces).
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('viewBox', '0 -960 960 960');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('fill', color);
        svg.setAttribute('data-icon', iconName);
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', fill ? icon.pathFill : icon.path);
        svg.appendChild(path);

        this.className = [variantClass(v), toIconClass(iconName)].filter(Boolean).join(' ');
        this.replaceChildren(svg);
    }
}

export function defineMsSvgIcon(tagName = 'ms-svg-icon'): void {
    if (typeof window === 'undefined') return;
    if (!customElements.get(tagName)) {
        customElements.define(tagName, MsSvgIconElement);
    }
}
