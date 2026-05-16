import { splitProps, type JSX } from 'solid-js';

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface MsSvgBaseProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'fill'> {
    size?: number | string;
    color?: string;
    fill?: boolean;
    variant?: MsSvgVariant;
    /** @deprecated Not applicable in SVG. */ grad?: number;
    /** @deprecated Not applicable in SVG. */ strokeWidth?: number;
    /** @deprecated Not applicable in SVG. */ opticalSize?: number;
}

export interface MsSvgInternalProps extends MsSvgBaseProps {
    /** @internal */ __iconName: string;
    /** @internal */ __iconClass: string;
    /** @internal */ __variant: 'outlined' | 'rounded' | 'sharp';
    /** @internal */ __path: string;
    /** @internal */ __pathFill: string;
}

export function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

export function renderMsSvg(rawProps: MsSvgInternalProps): JSX.Element {
    const [local, rest] = splitProps(rawProps as any, [
        'size', 'color', 'fill', 'variant', 'class', 'classList', 'style',
        'children', 'grad', 'strokeWidth', 'opticalSize',
        '__iconName', '__iconClass', '__variant', '__path', '__pathFill',
        'aria-label',
    ]);

    const sz = () => local.size ?? 24;
    const eff = () => (local.variant ?? local.__variant) as MsSvgVariant;
    const cls = () => [variantClass(eff()), local.__iconClass, local.class].filter(Boolean).join(' ');
    const fillColor = () => local.color ?? 'currentColor';
    const ariaHidden = () => (local['aria-label'] ? undefined : true);
    const dPath = () => (local.fill ? local.__pathFill : local.__path);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width={sz()}
            height={sz()}
            fill={fillColor()}
            aria-hidden={ariaHidden()}
            aria-label={local['aria-label']}
            data-icon={local.__iconName}
            {...rest}
            class={cls()}
            style={local.color !== undefined ? { color: local.color, ...(typeof local.style === 'object' ? local.style : null) } : local.style}
        >
            {local.children}
            <path d={dPath()} />
        </svg>
    );
}
