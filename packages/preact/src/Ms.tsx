import { forwardRef } from 'preact/compat';
import type { JSX, Ref, ComponentChildren } from 'preact';

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
    children?: ComponentChildren;
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
    /** @internal */ __iconName: string;
    /** @internal */ __iconClass: string;
}

export const Ms = forwardRef<HTMLSpanElement, MsProps>(function Ms(props, ref) {
    return renderMs(props, ref);
});

export function renderMs(
    props: MsBaseProps & { __iconName?: string; __iconClass?: string },
    ref: Ref<HTMLSpanElement>,
): JSX.Element {
    const {
        icon, code, variant = 'rounded',
        size, color, fill, grad, strokeWidth, opticalSize,
        className, class: classProp, style,
        children,
        __iconName, __iconClass,
        ...rest
    } = props as any;

    const resolvedIcon = __iconName ?? icon;
    const fvs = buildFontVariationSettings({ fill, grad, strokeWidth, opticalSize });

    const styleObj: JSX.CSSProperties = {
        ...(size !== undefined ? { fontSize: typeof size === 'number' ? `${size}px` : size } : null),
        ...(color !== undefined ? { color } : null),
        ...(fvs ? { fontVariationSettings: fvs } : null),
        ...(typeof style === 'object' && style ? style : null),
    };

    const userClass = className ?? classProp;
    const classes = [variantClass(variant), __iconClass, userClass].filter(Boolean).join(' ');

    let body: ComponentChildren;
    if (children !== undefined && children !== null) body = children;
    else if (code) body = codeToChar(code);
    else if (resolvedIcon) body = resolvedIcon;
    else body = null;

    const ariaHidden = rest['aria-label'] ? undefined : true;

    return (
        <span
            ref={ref}
            aria-hidden={ariaHidden}
            {...rest}
            class={classes}
            style={styleObj}
        >
            {body}
        </span>
    );
}
