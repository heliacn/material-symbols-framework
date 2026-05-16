import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
export type MsGrade = -25 | 0 | 200 | number;

function variantClass(variant: MsVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

function codeToChar(code: string): string {
    const cp = parseInt(code, 16);
    if (Number.isNaN(cp)) return '';
    return String.fromCodePoint(cp);
}

function toIconClass(iconName: string): string {
    return 'ms-' + iconName.replaceAll('_', '-');
}

function buildFontVariationSettings(opts: {
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

/**
 * `<ms-icon>` Angular component.
 *
 * Usage:
 * ```html
 * <ms-icon icon="home"></ms-icon>
 * <ms-icon icon="home" variant="outlined" [size]="32" color="red"></ms-icon>
 * <ms-icon code="e88a"></ms-icon>
 * <ms-icon icon="home" fill [grad]="-25"></ms-icon>
 * ```
 *
 * Standalone — just import it from another component:
 * ```ts
 * import { MsIconComponent } from '@material-symbols-framework/angular';
 *
 * @Component({ imports: [MsIconComponent], ... })
 * ```
 */
@Component({
    selector: 'ms-icon',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: `<span [class]="classes" [style.font-size]="fontSize" [style.color]="color || null" [style.font-variation-settings]="fvs || null" [attr.aria-hidden]="ariaLabel ? null : 'true'" [attr.aria-label]="ariaLabel || null">{{ display }}</span>`,
})
export class MsIconComponent {
    @Input() icon?: string;
    @Input() code?: string;
    @Input() variant: MsVariant = 'rounded';
    @Input() size?: number | string;
    @Input() color?: string;
    @Input() fill = false;
    @Input() grad?: MsGrade;
    @Input() strokeWidth?: number;
    @Input() opticalSize?: number;
    @Input('aria-label') ariaLabel?: string;
    @Input() class?: string;

    get classes(): string {
        const iconClass = this.icon ? toIconClass(this.icon) : null;
        return [variantClass(this.variant), iconClass, this.class].filter(Boolean).join(' ');
    }

    get fontSize(): string | null {
        if (this.size === undefined) return null;
        return typeof this.size === 'number' ? `${this.size}px` : this.size;
    }

    get fvs(): string | null {
        return buildFontVariationSettings({
            fill: this.fill,
            grad: this.grad,
            strokeWidth: this.strokeWidth,
            opticalSize: this.opticalSize,
        }) ?? null;
    }

    get display(): string {
        if (this.code) return codeToChar(this.code);
        return this.icon ?? '';
    }
}
