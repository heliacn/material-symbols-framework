<script lang="ts" context="module">
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
</script>

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    type $$Props = HTMLAttributes<HTMLSpanElement> & {
        icon?: string;
        code?: string;
        variant?: MsVariant;
        size?: number | string;
        color?: string;
        fill?: boolean;
        grad?: MsGrade;
        strokeWidth?: number;
        opticalSize?: number;
        /** @internal */ __iconName?: string;
        /** @internal */ __iconClass?: string;
    };

    export let icon: string | undefined = undefined;
    export let code: string | undefined = undefined;
    export let variant: MsVariant = 'rounded';
    export let size: number | string | undefined = undefined;
    export let color: string | undefined = undefined;
    export let fill = false;
    export let grad: MsGrade | undefined = undefined;
    export let strokeWidth: number | undefined = undefined;
    export let opticalSize: number | undefined = undefined;
    /** @internal */ export let __iconName: string | undefined = undefined;
    /** @internal */ export let __iconClass: string | undefined = undefined;

    $: fvs = buildFontVariationSettings({ fill, grad, strokeWidth, opticalSize });
    $: classes = [variantClass(variant), __iconClass, $$restProps.class].filter(Boolean).join(' ');
    $: styleStr = [
        size !== undefined ? `font-size: ${typeof size === 'number' ? `${size}px` : size}` : null,
        color !== undefined ? `color: ${color}` : null,
        fvs ? `font-variation-settings: ${fvs}` : null,
        $$restProps.style ?? null,
    ].filter(Boolean).join('; ');

    $: resolvedIcon = __iconName ?? icon;
    $: ariaHidden = $$restProps['aria-label'] ? undefined : 'true';
</script>

<span
    {...$$restProps}
    class={classes}
    style={styleStr}
    aria-hidden={ariaHidden}
>
    {#if $$slots.default}<slot />{:else if code}{codeToChar(code)}{:else if resolvedIcon}{resolvedIcon}{/if}
</span>
