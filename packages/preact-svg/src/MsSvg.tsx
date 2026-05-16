import type { JSX, Ref, ComponentChildren } from 'preact';

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface MsSvgBaseProps extends Omit<JSX.SVGAttributes<SVGSVGElement>, 'fill'> {
    size?: number | string;
    color?: string;
    fill?: boolean;
    variant?: MsSvgVariant;
    /** @deprecated Not applicable in SVG. */
    grad?: number;
    /** @deprecated Not applicable in SVG. */
    strokeWidth?: number;
    /** @deprecated Not applicable in SVG. */
    opticalSize?: number;
    children?: ComponentChildren;
}

export function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

export interface MsSvgInternalProps extends MsSvgBaseProps {
    /** @internal */ __iconName: string;
    /** @internal */ __iconClass: string;
    /** @internal */ __variant: 'outlined' | 'rounded' | 'sharp';
    /** @internal */ __path: string;
    /** @internal */ __pathFill: string;
}

export function renderMsSvg(props: MsSvgInternalProps, ref: Ref<SVGSVGElement>): JSX.Element {
    const {
        size = 24, color, fill, variant,
        className, class: classProp, style, children,
        grad: _g, strokeWidth: _s, opticalSize: _o,
        __iconName, __iconClass, __variant, __path, __pathFill,
        ...rest
    } = props as any;

    const effectiveVariant = (variant ?? __variant) as MsSvgVariant;
    const userClass = className ?? classProp;
    const classes = [variantClass(effectiveVariant), __iconClass, userClass].filter(Boolean).join(' ');

    const ariaHidden = rest['aria-label'] ? undefined : true;

    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width={size as any}
            height={size as any}
            fill={color ?? 'currentColor'}
            aria-hidden={ariaHidden}
            data-icon={__iconName}
            {...rest}
            class={classes}
            style={color !== undefined ? { color, ...(style as any) } : style}
        >
            {children}
            <path d={fill ? __pathFill : __path} />
        </svg>
    );
}
