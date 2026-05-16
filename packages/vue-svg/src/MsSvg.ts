import { h, type PropType, type VNode } from 'vue';

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

export const sharedMsSvgProps = {
    size: { type: [Number, String] as PropType<number | string>, default: 24 },
    color: { type: String, default: undefined },
    fill: { type: Boolean, default: false },
    variant: { type: String as PropType<MsSvgVariant>, default: undefined },
    grad: { type: Number, default: undefined },
    strokeWidth: { type: Number, default: undefined },
    opticalSize: { type: Number, default: undefined },
};

export interface RenderArgs {
    __iconName: string;
    __iconClass: string;
    __variant: 'outlined' | 'rounded' | 'sharp';
    __path: string;
    __pathFill: string;
}

export function renderMsSvg(
    props: any,
    slots: { default?: () => VNode[] | undefined } | undefined,
    attrs: Record<string, unknown>,
    extra: RenderArgs,
): VNode {
    const effectiveVariant = (props.variant ?? extra.__variant) as MsSvgVariant;
    const userClass = (attrs as any).class;
    const classes = [variantClass(effectiveVariant), extra.__iconClass, userClass].filter(Boolean).join(' ');

    const styleAttr = (attrs as any).style;
    const baseStyle = props.color !== undefined
        ? { color: props.color, ...(typeof styleAttr === 'object' && styleAttr ? styleAttr : null) }
        : styleAttr;

    const ariaHidden = (attrs as any)['aria-label'] ? undefined : 'true';
    const { class: _c, style: _s, ...restAttrs } = attrs as any;

    const slotted = slots?.default?.();
    const dPath = props.fill ? extra.__pathFill : extra.__path;

    return h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 -960 960 960',
            width: props.size,
            height: props.size,
            fill: props.color ?? 'currentColor',
            'aria-hidden': ariaHidden,
            'data-icon': extra.__iconName,
            ...restAttrs,
            class: classes,
            style: baseStyle,
        },
        [...(slotted ?? []), h('path', { d: dPath })],
    );
}
