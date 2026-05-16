import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface IconData {
    name: string;
    variant: 'outlined' | 'rounded' | 'sharp';
    path: string;
    pathFill: string;
}

const REGISTRY = new Map<string, IconData>();

export function registerIcon(...icons: IconData[]): void {
    for (const icon of icons) {
        REGISTRY.set(`${icon.variant}:${icon.name}`, icon);
    }
}

function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

function toIconClass(iconName: string): string {
    return 'ms-' + iconName.replaceAll('_', '-');
}

/**
 * `<ms-svg-icon>` Angular component.
 *
 * Usage:
 * ```ts
 * import { MsSvgIconComponent, registerIcon } from '@material-symbols-framework/angular-svg';
 * import home from '@material-symbols-framework/angular-svg/icons/rounded/home';
 *
 * registerIcon(home);
 *
 * @Component({ imports: [MsSvgIconComponent], ... })
 * ```
 *
 * ```html
 * <ms-svg-icon icon="home" variant="rounded" [size]="32" color="red" fill></ms-svg-icon>
 * ```
 */
@Component({
    selector: 'ms-svg-icon',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        [attr.width]="size"
        [attr.height]="size"
        [attr.fill]="color || 'currentColor'"
        [attr.aria-hidden]="ariaLabel ? null : 'true'"
        [attr.aria-label]="ariaLabel || null"
        [attr.data-icon]="icon"
        [class]="classes"
    ><path [attr.d]="dPath" /></svg>`,
})
export class MsSvgIconComponent {
    @Input() icon = '';
    @Input() variant: MsSvgVariant = 'rounded';
    @Input() size: number | string = 24;
    @Input() color?: string;
    @Input() fill = false;
    @Input('aria-label') ariaLabel?: string;
    @Input() class?: string;

    private get effVariant(): 'outlined' | 'rounded' | 'sharp' {
        return (this.variant === 'outline' ? 'outlined' : this.variant) as 'outlined' | 'rounded' | 'sharp';
    }

    get classes(): string {
        return [variantClass(this.variant), this.icon ? toIconClass(this.icon) : null, this.class]
            .filter(Boolean)
            .join(' ');
    }

    get dPath(): string {
        if (!this.icon) return '';
        const data = REGISTRY.get(`${this.effVariant}:${this.icon}`);
        if (!data) {
            console.warn(`[ms-svg-icon] Icon "${this.icon}" (${this.effVariant}) is not registered.`);
            return '';
        }
        return this.fill ? data.pathFill : data.path;
    }
}
