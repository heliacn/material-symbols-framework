import { splitProps, mergeProps, type JSX, type Component } from 'solid-js';

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
export type MsGrade = -25 | 0 | 200 | number;

export interface MsBaseProps extends JSX.HTMLAttributes<HTMLSpanElement> {
    icon?: string;
    code?: string;
    variant?: MsVariant;
    size?: number | string;
    color?: string;
    fill?: boolean;
    grad?: MsGrade;
    strokeWidth?: number;
    opticalSize?: number;
}

export type MsProps = MsBaseProps;

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

export interface MsInternalProps extends MsBaseProps {
    /** @internal */ __iconName?: string;
    /** @internal */ __iconClass?: string;
}

/**
 * Generic component.
 */
export const Ms: Component<MsProps> = (rawProps) => {
    return renderMs(rawProps);
};

export function renderMs(rawProps: MsInternalProps): JSX.Element {
    const merged = mergeProps({ variant: 'rounded' as MsVariant }, rawProps);
    const [local, rest] = splitProps(merged as any, [
        'icon', 'code', 'variant', 'size', 'color', 'fill', 'grad',
        'strokeWidth', 'opticalSize', 'class', 'classList', 'style',
        'children', '__iconName', '__iconClass', 'aria-label',
    ]);

    // Solid components are reactive; we keep accessors via getters so
    // updates propagate without manual signal usage.
    const styleAccessor = () => {
        const fvs = buildFontVariationSettings({
            fill: local.fill,
            grad: local.grad,
            strokeWidth: local.strokeWidth,
            opticalSize: local.opticalSize,
        });
        const baseStyle = typeof local.style === 'object' && local.style ? local.style : {};
        return {
            ...(local.size !== undefined ? { 'font-size': typeof local.size === 'number' ? `${local.size}px` : local.size } : null),
            ...(local.color !== undefined ? { color: local.color } : null),
            ...(fvs ? { 'font-variation-settings': fvs } : null),
            ...baseStyle,
        };
    };

    const classAccessor = () =>
        [variantClass(local.variant!), local.__iconClass, local.class].filter(Boolean).join(' ');

    const bodyAccessor = (): JSX.Element => {
        if (local.children !== undefined && local.children !== null) return local.children as JSX.Element;
        if (local.code) return codeToChar(local.code);
        const resolved = local.__iconName ?? local.icon;
        return resolved ?? null;
    };

    const ariaHidden = () => (local['aria-label'] ? undefined : true);

    return (
        <span
            aria-hidden={ariaHidden()}
            aria-label={local['aria-label']}
            {...rest}
            class={classAccessor()}
            style={styleAccessor()}
        >
            {bodyAccessor()}
        </span>
    );
}
