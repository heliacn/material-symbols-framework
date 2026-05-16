import {
    type CSSProperties,
    type SVGAttributes,
    type ReactNode,
} from 'react';

/**
 * Icon style variant. Used as a CSS class hint, not for selecting the
 * actual path (the path is determined by the entry point you import).
 */
export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

/**
 * Props accepted by per-icon SVG components.
 *
 * Compatibility notes with the font-based version:
 * - `size`, `color`, `fill`, `className` → fully supported
 * - `grad`, `strokeWidth`, `opticalSize` → accepted but **ignored**
 *   since they are not applicable to SVG. They stay in the type so
 *   consumers can swap between `react` and `react-svg` without
 *   typing errors.
 */
export interface MsSvgBaseProps extends Omit<SVGAttributes<SVGSVGElement>, 'fill'> {
    /** Icon size. Number → px, string → as-is (e.g. `"1em"`, `"2rem"`). Defaults to `24`. */
    size?: number | string;
    /** SVG fill color. Defaults to `currentColor`. */
    color?: string;
    /** Enable the filled style. Defaults to `false`. */
    fill?: boolean;
    /** Variant override (does not change the path, only the class/identifier). */
    variant?: MsSvgVariant;

    /** @deprecated Not applicable in SVG (variable font axis). Ignored. */
    grad?: number;
    /** @deprecated Not applicable in SVG (variable font axis). Ignored. */
    strokeWidth?: number;
    /** @deprecated Not applicable in SVG (variable font axis). Ignored. */
    opticalSize?: number;

    /** Optional children, e.g. `<title>` for accessibility. */
    children?: ReactNode;
}

/** CSS class for a given variant. */
export function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

/**
 * Internal props injected by per-icon components.
 */
export interface MsSvgInternalProps extends MsSvgBaseProps {
    /** @internal */
    __iconName: string;
    /** @internal */
    __iconClass: string;
    /** @internal */
    __variant: 'outlined' | 'rounded' | 'sharp';
    /** @internal */
    __path: string;
    /** @internal */
    __pathFill: string;
}

/**
 * Shared render for all per-icon SVG components.
 */
export function renderMsSvg(
    props: MsSvgInternalProps,
    ref: React.ForwardedRef<SVGSVGElement>,
) {
    const {
        size = 24,
        color,
        fill,
        variant,
        className,
        style,
        children,
        // Intentionally pulled out and discarded so they never leak to the DOM:
        grad: _grad,
        strokeWidth: _strokeWidth,
        opticalSize: _opticalSize,
        __iconName,
        __iconClass,
        __variant,
        __path,
        __pathFill,
        ...rest
    } = props;

    const effectiveVariant = (variant ?? __variant) as MsSvgVariant;

    const mergedStyle: CSSProperties = {
        ...(color !== undefined ? { color } : null),
        ...style,
    };

    const classes = [variantClass(effectiveVariant), __iconClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width={size}
            height={size}
            fill={color ?? 'currentColor'}
            aria-hidden={rest['aria-label'] ? undefined : true}
            data-icon={__iconName}
            {...rest}
            className={classes}
            style={mergedStyle}
        >
            {children}
            <path d={fill ? __pathFill : __path} />
        </svg>
    );
}
