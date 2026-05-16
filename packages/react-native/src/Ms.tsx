import { forwardRef, type ReactNode } from 'react';
import { Text, type TextProps, type TextStyle, type StyleProp } from 'react-native';

export type MsVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
export type MsGrade = -25 | 0 | 200 | number;

/**
 * Mapping variant → font family.
 * Konsumen wajib me-load font via expo-font atau Font.loadAsync()
 * dengan key family `MaterialSymbolsOutlined`, `MaterialSymbolsRounded`,
 * `MaterialSymbolsSharp`. Lihat README package.
 */
export const FONT_FAMILY: Record<'outlined' | 'rounded' | 'sharp', string> = {
    outlined: 'MaterialSymbolsOutlined',
    rounded: 'MaterialSymbolsRounded',
    sharp: 'MaterialSymbolsSharp',
};

export interface MsBaseProps extends Omit<TextProps, 'style'> {
    icon?: string;
    code?: string;
    variant?: MsVariant;
    size?: number;
    color?: string;
    /**
     * Catatan: di React Native, `font-variation-settings` tidak didukung
     * di semua engine. Prop `fill` saat ini diabaikan kecuali konsumen
     * me-load font khusus weight/fill yang diinginkan.
     */
    fill?: boolean;
    /** @deprecated Tidak applicable di RN. */
    grad?: MsGrade;
    /** @deprecated Tidak applicable di RN. */
    strokeWidth?: number;
    /** @deprecated Tidak applicable di RN. */
    opticalSize?: number;
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
}

export type MsProps = MsBaseProps;

export interface MsInternalProps extends MsBaseProps {
    /** @internal */ __iconName?: string;
}

function normalizeVariant(v: MsVariant | undefined): 'outlined' | 'rounded' | 'sharp' {
    if (!v || v === 'rounded') return 'rounded';
    if (v === 'outline' || v === 'outlined') return 'outlined';
    return 'sharp';
}

export function codeToChar(code: string): string {
    const cp = parseInt(code, 16);
    if (Number.isNaN(cp)) return '';
    return String.fromCodePoint(cp);
}

export const Ms = forwardRef<InstanceType<typeof Text>, MsProps>(function Ms(props, ref) {
    return renderMs(props, ref);
});

export function renderMs(
    props: MsInternalProps,
    ref: React.ForwardedRef<InstanceType<typeof Text>>,
) {
    const {
        icon, code, variant, size, color,
        fill: _fill, grad: _grad, strokeWidth: _strokeWidth, opticalSize: _opticalSize,
        style, children,
        __iconName,
        ...rest
    } = props;

    const v = normalizeVariant(variant);
    const fontFamily = FONT_FAMILY[v];

    const baseStyle: TextStyle = {
        fontFamily,
        ...(size !== undefined ? { fontSize: size } : null),
        ...(color !== undefined ? { color } : null),
    };

    const finalStyle: StyleProp<TextStyle> = style ? [baseStyle, style] : baseStyle;

    let body: ReactNode;
    if (children !== undefined && children !== null) body = children;
    else if (code) body = codeToChar(code);
    else body = __iconName ?? icon ?? null;

    return (
        <Text ref={ref} accessibilityElementsHidden {...rest} style={finalStyle}>
            {body}
        </Text>
    );
}
