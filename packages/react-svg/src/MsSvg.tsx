import {
    forwardRef,
    type CSSProperties,
    type SVGAttributes,
    type ReactNode,
} from 'react';

/**
 * Variant gaya icon. Dipakai sebagai class CSS hint, bukan untuk
 * memilih path (path sudah ditentukan oleh entry point yang diimport).
 */
export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

/**
 * Props yang di-accept oleh komponen SVG per-icon.
 *
 * Catatan kompatibilitas dengan versi font-based:
 * - `size`, `color`, `fill`, `className` → didukung penuh
 * - `grad`, `strokeWidth`, `opticalSize` → diterima namun **diabaikan**
 *   karena tidak applicable pada SVG. Ditampilkan di tipe agar konsumen
 *   bisa swap antara `react` dan `react-svg` tanpa error type.
 */
export interface MsSvgBaseProps extends Omit<SVGAttributes<SVGSVGElement>, 'fill'> {
    /** Ukuran icon. Number → px, string → as-is (mis. `"1em"`, `"2rem"`). Default: `24`. */
    size?: number | string;
    /** Warna fill SVG. Default: `currentColor`. */
    color?: string;
    /** Aktifkan gaya fill. Default: `false`. */
    fill?: boolean;
    /** Variant override (tidak mengubah path, hanya class/identifier). */
    variant?: MsSvgVariant;

    /** @deprecated Tidak applicable di SVG (axis variable font). Diabaikan. */
    grad?: number;
    /** @deprecated Tidak applicable di SVG (axis variable font). Diabaikan. */
    strokeWidth?: number;
    /** @deprecated Tidak applicable di SVG (axis variable font). Diabaikan. */
    opticalSize?: number;

    /** Children opsional, mis. `<title>` untuk aksesibilitas. */
    children?: ReactNode;
}

/** Class CSS dari variant. */
export function variantClass(variant: MsSvgVariant): string {
    const v = variant === 'outline' ? 'outlined' : variant;
    return `material-symbols-${v}`;
}

/**
 * Props internal yang di-inject oleh komponen per-icon.
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
 * Render bersama untuk semua komponen SVG per-icon.
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
        // Sengaja ditarik dan dibuang agar tidak bocor ke DOM:
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

    const dim = typeof size === 'number' ? size : size;
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
            width={dim}
            height={dim}
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
