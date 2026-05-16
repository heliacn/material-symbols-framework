import {
    forwardRef,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

/**
 * Variant gaya icon. Default: "rounded" (sering disebut paling modern).
 *
 * `"outline"` adalah alias dari `"outlined"` — keduanya menghasilkan
 * class `material-symbols-outlined` agar tetap kompatibel dengan
 * konvensi Google.
 */
export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

/**
 * Nilai gradasi yang umum dipakai.
 * - `-25`: cocok untuk box / latar gelap (mengurangi silau)
 * - `0`: kondisi normal (default)
 * - `200`: penekanan tinggi, misal di tombol berwarna terang
 *
 * Tipe ini dibiarkan longgar (`number`) supaya konsumen tetap bebas
 * memberi nilai lain bila Material Symbols mendukungnya di masa depan.
 */
export type MsGrade = -25 | 0 | 200 | number;

export interface MsBaseProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Nama icon dalam snake_case (misal `"home"`, `"android_cell_dual_5_bar_alert"`).
     * Digunakan saat memakai komponen umum `<Ms />`. Pada komponen per-icon
     * (`<MsHome />`), prop ini sudah ter-set otomatis.
     */
    icon?: string;
    /**
     * Codepoint hex untuk icon (misal `"e88a"` untuk home).
     * Akan di-render sebagai entity unicode. Berguna jika konsumen lebih
     * suka memetakan icon via codepoint daripada nama.
     */
    code?: string;
    /** Variant gaya. Default: `"rounded"`. */
    variant?: MsVariant;
    /** Ukuran icon dalam px. Default: `24`. */
    size?: number | string;
    /**
     * Warna icon. Default: mengikuti `currentColor` (tema/sistem konsumen),
     * jadi bisa dikontrol dari class atau parent style.
     */
    color?: string;
    /** Aktifkan gaya fill. Default: `false` (non-fill). */
    fill?: boolean;
    /**
     * Nilai grade. Default: `0`. Range yang umum: `-25`, `0`, `200`.
     */
    grad?: MsGrade;
    /**
     * Ketebalan stroke (axis `wght` pada variable font).
     * Default: `400`. Range: `100` (tipis) – `700` (tebal).
     */
    strokeWidth?: number;
    /**
     * Ukuran optik (axis `opsz`). Default: `48`. Range: `20` – `48`.
     * Ukuran optik secara otomatis menyesuaikan ketebalan stroke saat
     * icon membesar/mengecil — cocok untuk animasi resize.
     */
    opticalSize?: number;
    /** Children opsional, misal `<title>` untuk aksesibilitas. */
    children?: ReactNode;
}

/** Props untuk komponen umum `<Ms />` — `icon` atau `code` wajib diisi. */
export type MsProps = MsBaseProps;

/** Class CSS dari variant. */
export function variantClass(variant: MsVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

/** Konversi codepoint hex → string char yang dirender. */
export function codeToChar(code: string): string {
    const cp = parseInt(code, 16);
    if (Number.isNaN(cp)) return '';
    return String.fromCodePoint(cp);
}

/**
 * Bentuk `font-variation-settings` dari kombinasi axis.
 * Hanya emit axis yang berbeda dari default agar string tetap minimal.
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
 * Props internal yang dipakai oleh komponen per-icon untuk inject
 * `icon` + class spesifik tanpa mengekspos ke konsumen lewat tipe.
 */
export interface MsInternalProps extends MsBaseProps {
    /** @internal */
    __iconName: string;
    /** @internal */
    __iconClass: string;
}

/**
 * Komponen umum `<Ms />`. Untuk komponen per-icon (`<MsHome />`),
 * gunakan import spesifik supaya tree-shakeable.
 */
export const Ms = forwardRef<HTMLSpanElement, MsProps>(function Ms(props, ref) {
    return renderMs(props, ref);
});

/**
 * Implementasi render bersama. Diekspos agar komponen per-icon bisa
 * memakai logika yang sama tanpa nest forwardRef.
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

    // Body: prioritaskan children jika diberi (untuk <title>),
    // lalu code (codepoint), terakhir nama icon (ligature).
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
