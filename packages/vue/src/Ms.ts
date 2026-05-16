import { defineComponent, h, type PropType, type CSSProperties, type VNode } from 'vue';

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
export type MsGrade = -25 | 0 | 200 | number;

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

const sharedProps = {
    icon: { type: String, default: undefined },
    code: { type: String, default: undefined },
    variant: { type: String as PropType<MsVariant>, default: 'rounded' },
    size: { type: [Number, String] as PropType<number | string>, default: undefined },
    color: { type: String, default: undefined },
    fill: { type: Boolean, default: false },
    grad: { type: Number as PropType<MsGrade>, default: undefined },
    strokeWidth: { type: Number, default: undefined },
    opticalSize: { type: Number, default: undefined },
};

export const sharedMsProps = sharedProps;

/** Komponen umum `<Ms />`. */
export const Ms = defineComponent({
    name: 'Ms',
    inheritAttrs: true,
    props: sharedProps,
    setup(props, { slots, attrs }) {
        return () => renderMs(props as any, slots, attrs as any);
    },
});

export interface RenderArgs {
    __iconName?: string;
    __iconClass?: string;
}

/**
 * Render bersama. Dipanggil oleh komponen umum dan komponen per-icon.
 */
export function renderMs(
    props: any,
    slots: { default?: () => VNode[] | undefined } | undefined,
    attrs: Record<string, unknown>,
    extra: RenderArgs = {},
): VNode {
    const fvs = buildFontVariationSettings({
        fill: props.fill,
        grad: props.grad,
        strokeWidth: props.strokeWidth,
        opticalSize: props.opticalSize,
    });

    const styleAttr = (attrs as any).style;
    const baseStyle: CSSProperties = {
        ...(props.size !== undefined ? { fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size } : null),
        ...(props.color !== undefined ? { color: props.color } : null),
        ...(fvs ? { fontVariationSettings: fvs } : null),
        ...(typeof styleAttr === 'object' && styleAttr ? styleAttr : null),
    };

    const userClass = (attrs as any).class;
    const classes = [variantClass(props.variant ?? 'rounded'), extra.__iconClass, userClass].filter(Boolean).join(' ');

    let body: unknown;
    const slotted = slots?.default?.();
    if (slotted && slotted.length) {
        body = slotted;
    } else if (props.code) {
        body = codeToChar(props.code);
    } else {
        body = extra.__iconName ?? props.icon ?? null;
    }

    const ariaHidden = (attrs as any)['aria-label'] ? undefined : 'true';

    // Buang class & style dari attrs supaya tidak duplikat (kita merge manual di atas).
    const { class: _c, style: _s, ...restAttrs } = attrs as any;

    return h('span', {
        'aria-hidden': ariaHidden,
        ...restAttrs,
        class: classes,
        style: baseStyle,
    }, body as any);
}
