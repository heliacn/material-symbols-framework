import {
    forwardRef,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

/**
 * Icon style variant. Defaults to `"rounded"` (often considered the most modern).
 *
 * `"outline"` is an alias of `"outlined"` — both emit the
 * `material-symbols-outlined` class to stay compatible with
 * Google's naming convention.
 */
export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

/**
 * Common grade values.
 * - `-25`: low emphasis, ideal for light icons on dark backgrounds (reduces glare)
 * - `0`: normal (default)
 * - `200`: high emphasis, e.g. on a light-colored button
 *
 * The type is intentionally widened to `number` so consumers stay free
 * to pass other values if Material Symbols supports them in the future.
 */
export type MsGrade = -25 | 0 | 200 | number;

export interface MsBaseProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Icon name in snake_case (e.g. `"home"`, `"android_cell_dual_5_bar_alert"`).
     * Used with the generic `<Ms />` component. On per-icon components
     * (e.g. `<MsHome />`) this prop is already set internally.
     */
    icon?: string;
    /**
     * Hex codepoint of the icon (e.g. `"e88a"` for home).
     * Rendered as a unicode entity. Useful when mapping icons by
     * codepoint rather than name.
     */
    code?: string;
    /** Style variant. Defaults to `"rounded"`. */
    variant?: MsVariant;
    /** Icon size in px. Defaults to `24`. */
    size?: number | string;
    /**
     * Icon color. Defaults to `currentColor`, so it inherits from the
     * parent's color and can be driven by a class or surrounding style.
     */
    color?: string;
    /** Enable the filled style. Defaults to `false` (non-fill). */
    fill?: boolean;
    /**
     * Grade value. Defaults to `0`. Common values: `-25`, `0`, `200`.
     */
    grad?: MsGrade;
    /**
     * Stroke thickness (the `wght` axis of the variable font).
     * Defaults to `400`. Range: `100` (thin) – `700` (bold).
     */
    strokeWidth?: number;
    /**
     * Optical size (the `opsz` axis). Defaults to `48`. Range: `20` – `48`.
     * Automatically tunes stroke thickness as the icon scales up or down —
     * great for resize animations.
     */
    opticalSize?: number;
    /** Optional children, e.g. `<title>` for accessibility. */
    children?: ReactNode;
}

/** Props for the generic `<Ms />` component — `icon` or `code` is required. */
export type MsProps = MsBaseProps;

/** CSS class for a given variant. */
export function variantClass(variant: MsVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

/** Convert a hex codepoint into the rendered character. */
export function codeToChar(code: string): string {
    const cp = parseInt(code, 16);
    if (Number.isNaN(cp)) return '';
    return String.fromCodePoint(cp);
}

/**
 * Build `font-variation-settings` from the combination of axes.
 * Only emits axes that differ from the defaults so the resulting
 * string stays minimal.
 */
export function buildFontVariationSettings(opts: {
    fill?: boolean;
    grad?: number;
    strokeWidth?: number;
    opticalSize?: number;
}): string | undefined {
    const parts: string[] = [];
    if (opts.fill) parts.push("'FILL' 1");
    if (opts.grad !== undefined && opts.grad !== 0) parts.push(`'GRAD' ${opts.grad}`);
    if (opts.strokeWidth !== undefined && opts.strokeWidth !== 400) {
        parts.push(`'wght' ${opts.strokeWidth}`);
    }
    if (opts.opticalSize !== undefined && opts.opticalSize !== 48) {
        parts.push(`'opsz' ${opts.opticalSize}`);
    }
    return parts.length ? parts.join(', ') : undefined;
}

/**
 * Internal props used by per-icon components to inject `icon` + class
 * without exposing them in the public type surface.
 */
export interface MsInternalProps extends MsBaseProps {
    /** @internal */
    __iconName: string;
    /** @internal */
    __iconClass: string;
}

/**
 * Generic `<Ms />` component. For per-icon components (e.g. `<MsHome />`),
 * use named imports so they stay tree-shakeable.
 */
export const Ms = forwardRef<HTMLSpanElement, MsProps>(function Ms(props, ref) {
    return renderMs(props, ref);
});

/**
 * Shared render implementation. Exposed so per-icon components can reuse
 * the same logic without nesting forwardRef calls.
 */
export function renderMs(
    props: MsBaseProps & { __iconName?: string; __iconClass?: string },
    ref: React.ForwardedRef<HTMLSpanElement>,
) {
    const {
        icon,
        code,
        variant = 'rounded',
        size,
        color,
        fill,
        grad,
        strokeWidth,
        opticalSize,
        className,
        style,
        children,
        __iconName,
        __iconClass,
        ...rest
    } = props as MsBaseProps & { __iconName?: string; __iconClass?: string };

    const resolvedIcon = __iconName ?? icon;
    const fvs = buildFontVariationSettings({ fill, grad, strokeWidth, opticalSize });

    const mergedStyle: CSSProperties = {
        ...(size !== undefined ? { fontSize: typeof size === 'number' ? `${size}px` : size } : null),
        ...(color !== undefined ? { color } : null),
        ...(fvs ? { fontVariationSettings: fvs } : null),
        ...style,
    };

    const classes = [variantClass(variant), __iconClass, className].filter(Boolean).join(' ');

    // Body priority: children when provided (for <title>),
    // then code (codepoint), then icon name (ligature).
    let body: ReactNode;
    if (children !== undefined && children !== null) {
        body = children;
    } else if (code) {
        body = codeToChar(code);
    } else if (resolvedIcon) {
        body = resolvedIcon;
    } else {
        body = null;
    }

    return (
        <span
            ref={ref}
            aria-hidden={rest['aria-label'] ? undefined : true}
            {...rest}
            className={classes}
            style={mergedStyle}
        >
            {body}
        </span>
    );
}
