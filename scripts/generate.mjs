// Generator komponen icon per-framework.
// Usage: node scripts/generate.mjs <framework>

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadIconList, toComponentName, toIconClass } from './lib/icons.mjs';
import { buildIconJSDoc } from './lib/jsdoc.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const generators = {
    react: () => generateReactLike('react', { ext: 'tsx' }),
    preact: () => generateReactLike('preact', { ext: 'tsx' }),
    solid: () => generateReactLike('solid', { ext: 'tsx' }),
    'react-native': () => generateReactLike('react-native', { ext: 'tsx' }),
    vue: () => generateVue(),
    svelte: () => generateSvelte(),
    astro: () => generateAstro(),
    'react-svg': () => generateReactSvg(),
    'preact-svg': () => generateJsxSvg('preact-svg', 'preact'),
    'solid-svg': () => generateSolidSvg(),
    'vue-svg': () => generateVueSvg(),
    'svelte-svg': () => generateSvelteSvg(),
    'astro-svg': () => generateAstroSvg(),
    'vanilla-svg': () => generateVanillaSvg(),
    'angular-svg': () => generateAngularSvg(),
};

const target = process.argv[2];
if (!target) {
    console.error('Usage: node scripts/generate.mjs <framework>');
    console.error('Available frameworks:', Object.keys(generators).join(', '));
    process.exit(1);
}

const fn = generators[target];
if (!fn) {
    console.error(`Framework "${target}" is not supported.`);
    process.exit(1);
}

console.log(`> Generating components for: ${target}`);
const start = Date.now();
const count = await fn();
console.log(`> Done. Generated ${count} icons in ${((Date.now() - start) / 1000).toFixed(1)}s`);

// ---------------------------------------------------------------------------
// Helper: load path SVG rounded untuk preview JSDoc font-based.
// ---------------------------------------------------------------------------

async function loadRoundedPaths(icons) {
    const svgRoot = path.join(ROOT, 'ms', 'svg', '400', 'rounded');
    const map = new Map();
    const CHUNK = 200;
    for (let i = 0; i < icons.length; i += CHUNK) {
        const slice = icons.slice(i, i + CHUNK);
        await Promise.all(slice.map(async (iconName) => {
            try {
                const svg = await readFile(path.join(svgRoot, `${iconName}.svg`), 'utf8');
                const m = svg.match(/<path\s+d="([^"]+)"/);
                if (m) map.set(iconName, m[1]);
            } catch { /* skip */ }
        }));
    }
    return map;
}

// ---------------------------------------------------------------------------
// React-like generator (React, Preact, Solid, RN — semua pakai JSX/TSX
// dan import named function `renderMs` dari Ms.tsx)
// ---------------------------------------------------------------------------

async function generateReactLike(pkgName, { ext }) {
    const icons = await loadIconList();
    const roundedPaths = await loadRoundedPaths(icons);
    const pkgDir = path.join(ROOT, 'packages', pkgName);
    const iconsDir = path.join(pkgDir, 'src', 'icons');

    await rm(iconsDir, { recursive: true, force: true });
    await mkdir(iconsDir, { recursive: true });

    const isRN = pkgName === 'react-native';
    const refType = isRN ? 'Text' : 'HTMLSpanElement';
    const importReact = pkgName === 'preact'
        ? `import { forwardRef } from 'preact/compat';`
        : `import { forwardRef } from 'react';`;

    if (pkgName === 'solid') {
        await generateSolid(icons, iconsDir, pkgDir, roundedPaths);
        return icons.length;
    }

    const tasks = icons.map(async (iconName) => {
        const compName = toComponentName(iconName);
        const iconClass = toIconClass(iconName);
        const file = path.join(iconsDir, `${compName}.${ext}`);
        const pathD = roundedPaths.get(iconName);
        const jsdoc = pathD
            ? buildIconJSDoc({ iconName, variant: 'rounded', pathD, framework: pkgName })
            : `/** Material Symbols: \`${iconName}\` */`;

        const internalProps = isRN
            ? `{ ...props, __iconName: ${JSON.stringify(iconName)} }`
            : `{ ...props, __iconName: ${JSON.stringify(iconName)}, __iconClass: ${JSON.stringify(iconClass)} }`;

        const refImport = isRN ? `import { Text } from 'react-native';\n` : '';
        const refTypeStr = isRN ? `InstanceType<typeof Text>` : refType;

        const source = `${importReact}
${refImport}import { renderMs, type MsBaseProps } from '../Ms.js';

${jsdoc}
export const ${compName} = forwardRef<${refTypeStr}, MsBaseProps>(function ${compName}(props, ref) {
    return renderMs(${internalProps}, ref);
});

export default ${compName};
`;
        await writeFile(file, source);
    });

    await Promise.all(tasks);

    const barrelLines = icons.map((iconName) => {
        const compName = toComponentName(iconName);
        return `export { ${compName} } from './icons/${compName}.js';`;
    });
    const barrel = `// Auto-generated. Do not edit manually.\n${barrelLines.join('\n')}\n`;
    await writeFile(path.join(pkgDir, 'src', 'icons.ts'), barrel);

    const indexSource = `// Auto-generated entry point.
export { Ms } from './Ms.js';
export type { MsProps, MsBaseProps, MsVariant } from './Ms.js';
${pkgName !== 'react-native' ? `export type { MsGrade } from './Ms.js';\n` : ''}export * from './icons.js';
`;
    await writeFile(path.join(pkgDir, 'src', 'index.ts'), indexSource);

    return icons.length;
}

// ---------------------------------------------------------------------------
// Solid generator (slightly different: no forwardRef, function component)
// ---------------------------------------------------------------------------

async function generateSolid(icons, iconsDir, pkgDir, roundedPaths) {
    const tasks = icons.map(async (iconName) => {
        const compName = toComponentName(iconName);
        const iconClass = toIconClass(iconName);
        const file = path.join(iconsDir, `${compName}.tsx`);
        const pathD = roundedPaths.get(iconName);
        const jsdoc = pathD
            ? buildIconJSDoc({ iconName, variant: 'rounded', pathD, framework: 'solid' })
            : `/** Material Symbols: \`${iconName}\` */`;

        const source = `import { renderMs, type MsBaseProps } from '../Ms.js';
import type { Component } from 'solid-js';

${jsdoc}
export const ${compName}: Component<MsBaseProps> = (props) => {
    return renderMs({ ...props, __iconName: ${JSON.stringify(iconName)}, __iconClass: ${JSON.stringify(iconClass)} });
};

export default ${compName};
`;
        await writeFile(file, source);
    });
    await Promise.all(tasks);

    const barrelLines = icons.map((iconName) => {
        const compName = toComponentName(iconName);
        return `export { ${compName} } from './icons/${compName}.js';`;
    });
    const barrel = `// Auto-generated.\n${barrelLines.join('\n')}\n`;
    await writeFile(path.join(pkgDir, 'src', 'icons.ts'), barrel);

    const indexSource = `// Auto-generated entry point.
export { Ms } from './Ms.js';
export type { MsProps, MsBaseProps, MsVariant, MsGrade } from './Ms.js';
export * from './icons.js';
`;
    await writeFile(path.join(pkgDir, 'src', 'index.ts'), indexSource);
}

// ---------------------------------------------------------------------------
// Vue generator
// ---------------------------------------------------------------------------

async function generateVue() {
    const icons = await loadIconList();
    const roundedPaths = await loadRoundedPaths(icons);
    const pkgDir = path.join(ROOT, 'packages', 'vue');
    const iconsDir = path.join(pkgDir, 'src', 'icons');

    await rm(iconsDir, { recursive: true, force: true });
    await mkdir(iconsDir, { recursive: true });

    const CHUNK = 200;
    for (let i = 0; i < icons.length; i += CHUNK) {
        const slice = icons.slice(i, i + CHUNK);
        await Promise.all(slice.map(async (iconName) => {
            const compName = toComponentName(iconName);
            const iconClass = toIconClass(iconName);
            const file = path.join(iconsDir, `${compName}.ts`);
            const pathD = roundedPaths.get(iconName);
            const jsdoc = pathD
                ? buildIconJSDoc({ iconName, variant: 'rounded', pathD, framework: 'vue' })
                : `/** Material Symbols: \`${iconName}\` */`;

            const source = `import { defineComponent } from 'vue';
import { renderMs, sharedMsProps } from '../Ms.js';

${jsdoc}
export const ${compName} = defineComponent({
    name: ${JSON.stringify(compName)},
    inheritAttrs: true,
    props: sharedMsProps,
    setup(props, { slots, attrs }) {
        return () => renderMs(props, slots, attrs as any, {
            __iconName: ${JSON.stringify(iconName)},
            __iconClass: ${JSON.stringify(iconClass)},
        });
    },
});

export default ${compName};
`;
            await writeFile(file, source);
        }));
    }

    const barrelLines = icons.map((iconName) => {
        const compName = toComponentName(iconName);
        return `export { ${compName} } from './icons/${compName}.js';`;
    });
    await writeFile(path.join(pkgDir, 'src', 'icons.ts'), `// Auto-generated.\n${barrelLines.join('\n')}\n`);

    const indexSource = `// Auto-generated entry point.
export { Ms } from './Ms.js';
export type { MsVariant, MsGrade } from './Ms.js';
export * from './icons.js';
`;
    await writeFile(path.join(pkgDir, 'src', 'index.ts'), indexSource);

    return icons.length;
}

// ---------------------------------------------------------------------------
// Svelte generator — ship .svelte files langsung
// ---------------------------------------------------------------------------

async function generateSvelte() {
    const icons = await loadIconList();
    const roundedPaths = await loadRoundedPaths(icons);
    const pkgDir = path.join(ROOT, 'packages', 'svelte');
    const iconsDir = path.join(pkgDir, 'src', 'icons');

    await rm(iconsDir, { recursive: true, force: true });
    await mkdir(iconsDir, { recursive: true });

    const CHUNK = 200;
    for (let i = 0; i < icons.length; i += CHUNK) {
        const slice = icons.slice(i, i + CHUNK);
        await Promise.all(slice.map(async (iconName) => {
            const compName = toComponentName(iconName);
            const iconClass = toIconClass(iconName);
            const file = path.join(iconsDir, `${compName}.svelte`);
            const pathD = roundedPaths.get(iconName);
            const jsdoc = pathD
                ? buildIconJSDoc({ iconName, variant: 'rounded', pathD, framework: 'svelte' })
                : `/** Material Symbols: \`${iconName}\` */`;

            // Wrapper Svelte component: forward semua props ke <Ms> base.
            const source = `<script lang="ts">
    import Ms from '../Ms.svelte';

${jsdoc.split('\n').map(l => '    ' + l).join('\n')}
    export let icon: string | undefined = undefined;
    export let code: string | undefined = undefined;
    export let variant: 'outlined' | 'outline' | 'rounded' | 'sharp' = 'rounded';
    export let size: number | string | undefined = undefined;
    export let color: string | undefined = undefined;
    export let fill = false;
    export let grad: number | undefined = undefined;
    export let strokeWidth: number | undefined = undefined;
    export let opticalSize: number | undefined = undefined;
</script>

<Ms
    __iconName={${JSON.stringify(iconName)}}
    __iconClass={${JSON.stringify(iconClass)}}
    {icon}
    {code}
    {variant}
    {size}
    {color}
    {fill}
    {grad}
    {strokeWidth}
    {opticalSize}
    {...$$restProps}
>
    <slot />
</Ms>
`;
            await writeFile(file, source);
        }));
    }

    // Index sebagai .js (Svelte tooling biasanya membaca path js → svelte).
    const barrelLines = icons.map((iconName) => {
        const compName = toComponentName(iconName);
        return `export { default as ${compName} } from './icons/${compName}.svelte';`;
    });
    await writeFile(
        path.join(pkgDir, 'src', 'index.js'),
        `// Auto-generated. Re-exports all Svelte components.\nexport { default as Ms } from './Ms.svelte';\n${barrelLines.join('\n')}\n`,
    );

    return icons.length;
}

// ---------------------------------------------------------------------------
// Astro generator — ship .astro files
// ---------------------------------------------------------------------------

async function generateAstro() {
    const icons = await loadIconList();
    const roundedPaths = await loadRoundedPaths(icons);
    const pkgDir = path.join(ROOT, 'packages', 'astro');
    const iconsDir = path.join(pkgDir, 'src', 'icons');

    await rm(iconsDir, { recursive: true, force: true });
    await mkdir(iconsDir, { recursive: true });

    const CHUNK = 200;
    for (let i = 0; i < icons.length; i += CHUNK) {
        const slice = icons.slice(i, i + CHUNK);
        await Promise.all(slice.map(async (iconName) => {
            const compName = toComponentName(iconName);
            const iconClass = toIconClass(iconName);
            const file = path.join(iconsDir, `${compName}.astro`);
            const pathD = roundedPaths.get(iconName);
            const jsdoc = pathD
                ? buildIconJSDoc({ iconName, variant: 'rounded', pathD, framework: 'astro' })
                : `/** Material Symbols: \`${iconName}\` */`;

            const source = `---
${jsdoc}
import Ms from '../Ms.astro';
const props = Astro.props;
---
<Ms
    __iconName={${JSON.stringify(iconName)}}
    __iconClass={${JSON.stringify(iconClass)}}
    {...props}
>
    <slot />
</Ms>
`;
            await writeFile(file, source);
        }));
    }

    const barrelLines = icons.map((iconName) => {
        const compName = toComponentName(iconName);
        return `export { default as ${compName} } from './icons/${compName}.astro';`;
    });
    await writeFile(
        path.join(pkgDir, 'src', 'index.js'),
        `// Auto-generated.\nexport { default as Ms } from './Ms.astro';\n${barrelLines.join('\n')}\n`,
    );

    return icons.length;
}

// ---------------------------------------------------------------------------
// React-SVG generator (font-based, multi-variant SVG)
// ---------------------------------------------------------------------------

async function generateReactSvg() {
    const icons = await loadIconList();
    const pkgDir = path.join(ROOT, 'packages', 'react-svg');
    const variants = ['outlined', 'rounded', 'sharp'];

    let total = 0;
    for (const variant of variants) {
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');

        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const svgRoot = path.join(ROOT, 'ms', 'svg', '400', variant);

        const generated = [];
        const CHUNK = 200;
        for (let i = 0; i < icons.length; i += CHUNK) {
            const slice = icons.slice(i, i + CHUNK);
            const results = await Promise.all(
                slice.map(async (iconName) => {
                    const compName = toComponentName(iconName);
                    const iconClass = toIconClass(iconName);

                    const noFillFile = path.join(svgRoot, `${iconName}.svg`);
                    const fillFile = path.join(svgRoot, `${iconName}-fill.svg`);
                    let pathD, pathFillD;
                    try {
                        pathD = extractPathD(await readFile(noFillFile, 'utf8'));
                        pathFillD = extractPathD(await readFile(fillFile, 'utf8'));
                    } catch {
                        return null;
                    }
                    if (!pathD || !pathFillD) return null;

                    const file = path.join(iconsDir, `${compName}.tsx`);
                    const jsdoc = buildIconJSDoc({ iconName, variant, pathD, framework: 'react-svg' });
                    const source = `import { forwardRef } from 'react';
import { renderMsSvg, type MsSvgBaseProps } from '../../MsSvg.js';

const P = ${JSON.stringify(pathD)};
const PF = ${JSON.stringify(pathFillD)};

${jsdoc}
export const ${compName} = forwardRef<SVGSVGElement, MsSvgBaseProps>(function ${compName}(props, ref) {
    return renderMsSvg(
        {
            ...props,
            __iconName: ${JSON.stringify(iconName)},
            __iconClass: ${JSON.stringify(iconClass)},
            __variant: ${JSON.stringify(variant)},
            __path: P,
            __pathFill: PF,
        },
        ref,
    );
});

export default ${compName};
`;
                    await writeFile(file, source);
                    return { iconName, compName };
                }),
            );
            generated.push(...results.filter(Boolean));
        }

        const barrel = generated
            .map(({ compName }) => `export { ${compName} } from './icons/${compName}.js';`)
            .join('\n');
        await writeFile(path.join(variantDir, 'icons.ts'), `// Auto-generated.\n${barrel}\n`);

        const indexSource = `// Auto-generated entry point for variant: ${variant}
export type { MsSvgBaseProps, MsSvgVariant } from '../MsSvg.js';
export * from './icons.js';
`;
        await writeFile(path.join(variantDir, 'index.ts'), indexSource);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }

    return total;
}

function extractPathD(svg) {
    const m = svg.match(/<path\s+d="([^"]+)"/);
    return m ? m[1] : null;
}

// ===========================================================================
// SVG Generators (Preact, Solid, Vue, Svelte, Astro, Vanilla, Angular)
// ===========================================================================

/**
 * Helper: load semua path data per variant + per icon dari ms.
 * Return: Map<variant, Map<iconName, { path, pathFill }>>
 */
async function loadAllPaths() {
    const icons = await loadIconList();
    const variants = ['outlined', 'rounded', 'sharp'];
    const result = {};

    for (const variant of variants) {
        const map = new Map();
        const svgRoot = path.join(ROOT, 'ms', 'svg', '400', variant);

        const CHUNK = 200;
        for (let i = 0; i < icons.length; i += CHUNK) {
            const slice = icons.slice(i, i + CHUNK);
            const results = await Promise.all(slice.map(async (iconName) => {
                try {
                    const noFill = await readFile(path.join(svgRoot, `${iconName}.svg`), 'utf8');
                    const fill = await readFile(path.join(svgRoot, `${iconName}-fill.svg`), 'utf8');
                    const p = extractPathD(noFill);
                    const pf = extractPathD(fill);
                    if (!p || !pf) return null;
                    return { iconName, path: p, pathFill: pf };
                } catch {
                    return null;
                }
            }));
            for (const r of results) if (r) map.set(r.iconName, { path: r.path, pathFill: r.pathFill });
        }

        result[variant] = map;
    }
    return { icons, variants, paths: result };
}

// ---------------------------------------------------------------------------
// Generic JSX-based SVG generator (Preact)
// ---------------------------------------------------------------------------
async function generateJsxSvg(pkgName, flavor) {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', pkgName);
    const importLine = flavor === 'preact'
        ? `import { forwardRef } from 'preact/compat';`
        : `import { forwardRef } from 'react';`;
    const refType = 'SVGSVGElement';

    let total = 0;
    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');
        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const generated = [];
        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const compName = toComponentName(iconName);
                const iconClass = toIconClass(iconName);
                const file = path.join(iconsDir, `${compName}.tsx`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: pkgName });
                const source = `${importLine}
import { renderMsSvg, type MsSvgBaseProps } from '../../MsSvg.js';

const P = ${JSON.stringify(data.path)};
const PF = ${JSON.stringify(data.pathFill)};

${jsdoc}
export const ${compName} = forwardRef<${refType}, MsSvgBaseProps>(function ${compName}(props, ref) {
    return renderMsSvg(
        {
            ...props,
            __iconName: ${JSON.stringify(iconName)},
            __iconClass: ${JSON.stringify(iconClass)},
            __variant: ${JSON.stringify(variant)},
            __path: P,
            __pathFill: PF,
        },
        ref,
    );
});

export default ${compName};
`;
                await writeFile(file, source);
                generated.push({ iconName, compName });
            }));
        }

        const barrel = generated.map(({ compName }) => `export { ${compName} } from './icons/${compName}.js';`).join('\n');
        await writeFile(path.join(variantDir, 'icons.ts'), `// Auto-generated.\n${barrel}\n`);

        const indexSource = `// Auto-generated entry point for variant: ${variant}
export type { MsSvgBaseProps, MsSvgVariant } from '../MsSvg.js';
export * from './icons.js';
`;
        await writeFile(path.join(variantDir, 'index.ts'), indexSource);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }
    return total;
}

// ---------------------------------------------------------------------------
// Solid SVG
// ---------------------------------------------------------------------------
async function generateSolidSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'solid-svg');

    let total = 0;
    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');
        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const generated = [];
        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const compName = toComponentName(iconName);
                const iconClass = toIconClass(iconName);
                const file = path.join(iconsDir, `${compName}.tsx`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'solid-svg' });
                const source = `import { renderMsSvg, type MsSvgBaseProps } from '../../MsSvg.js';
import type { Component } from 'solid-js';

const P = ${JSON.stringify(data.path)};
const PF = ${JSON.stringify(data.pathFill)};

${jsdoc}
export const ${compName}: Component<MsSvgBaseProps> = (props) => {
    return renderMsSvg({
        ...props,
        __iconName: ${JSON.stringify(iconName)},
        __iconClass: ${JSON.stringify(iconClass)},
        __variant: ${JSON.stringify(variant)},
        __path: P,
        __pathFill: PF,
    });
};

export default ${compName};
`;
                await writeFile(file, source);
                generated.push({ iconName, compName });
            }));
        }

        const barrel = generated.map(({ compName }) => `export { ${compName} } from './icons/${compName}.js';`).join('\n');
        await writeFile(path.join(variantDir, 'icons.ts'), `// Auto-generated.\n${barrel}\n`);

        const indexSource = `// Auto-generated entry point for variant: ${variant}
export type { MsSvgBaseProps, MsSvgVariant } from '../MsSvg.js';
export * from './icons.js';
`;
        await writeFile(path.join(variantDir, 'index.ts'), indexSource);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }
    return total;
}

// ---------------------------------------------------------------------------
// Vue SVG
// ---------------------------------------------------------------------------
async function generateVueSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'vue-svg');

    let total = 0;
    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');
        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const generated = [];
        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const compName = toComponentName(iconName);
                const iconClass = toIconClass(iconName);
                const file = path.join(iconsDir, `${compName}.ts`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'vue-svg' });
                const source = `import { defineComponent } from 'vue';
import { renderMsSvg, sharedMsSvgProps } from '../../MsSvg.js';

const P = ${JSON.stringify(data.path)};
const PF = ${JSON.stringify(data.pathFill)};

${jsdoc}
export const ${compName} = defineComponent({
    name: ${JSON.stringify(compName)},
    inheritAttrs: true,
    props: sharedMsSvgProps,
    setup(props, { slots, attrs }) {
        return () => renderMsSvg(props, slots, attrs as any, {
            __iconName: ${JSON.stringify(iconName)},
            __iconClass: ${JSON.stringify(iconClass)},
            __variant: ${JSON.stringify(variant)},
            __path: P,
            __pathFill: PF,
        });
    },
});

export default ${compName};
`;
                await writeFile(file, source);
                generated.push({ iconName, compName });
            }));
        }

        const barrel = generated.map(({ compName }) => `export { ${compName} } from './icons/${compName}.js';`).join('\n');
        await writeFile(path.join(variantDir, 'icons.ts'), `// Auto-generated.\n${barrel}\n`);

        const indexSource = `// Auto-generated entry point for variant: ${variant}
export type { MsSvgVariant } from '../MsSvg.js';
export * from './icons.js';
`;
        await writeFile(path.join(variantDir, 'index.ts'), indexSource);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }
    return total;
}

// ---------------------------------------------------------------------------
// Svelte SVG — per-icon .svelte standalone (path embedded)
// ---------------------------------------------------------------------------
async function generateSvelteSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'svelte-svg');

    let total = 0;
    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');
        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const generated = [];
        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const compName = toComponentName(iconName);
                const iconClass = toIconClass(iconName);
                const file = path.join(iconsDir, `${compName}.svelte`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'svelte-svg' });
                const indentedJsdoc = jsdoc.split('\n').map(l => '    ' + l).join('\n');
                const source = `<script lang="ts">
${indentedJsdoc}
    type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';
    export let size: number | string = 24;
    export let color: string | undefined = undefined;
    export let fill = false;
    export let variant: MsSvgVariant = ${JSON.stringify(variant)};

    const P = ${JSON.stringify(data.path)};
    const PF = ${JSON.stringify(data.pathFill)};

    $: effVariant = variant === 'outline' ? 'outlined' : variant;
    $: classes = ['material-symbols-' + effVariant, ${JSON.stringify(iconClass)}, $$restProps.class].filter(Boolean).join(' ');
    $: dPath = fill ? PF : P;
    $: ariaHidden = $$restProps['aria-label'] ? undefined : 'true';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={size}
    height={size}
    fill={color ?? 'currentColor'}
    aria-hidden={ariaHidden}
    data-icon={${JSON.stringify(iconName)}}
    {...$$restProps}
    class={classes}
><slot /><path d={dPath} /></svg>
`;
                await writeFile(file, source);
                generated.push({ iconName, compName });
            }));
        }

        const barrel = generated.map(({ compName }) => `export { default as ${compName} } from './icons/${compName}.svelte';`).join('\n');
        await writeFile(path.join(variantDir, 'index.js'), `// Auto-generated.\n${barrel}\n`);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }

    // Combined index.d.ts
    const dts = `// Auto-generated.
import type { SvelteComponent } from 'svelte';

export type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface MsSvgIconProps {
    size?: number | string;
    color?: string;
    fill?: boolean;
    variant?: MsSvgVariant;
    [key: string]: unknown;
}
`;
    await writeFile(path.join(pkgDir, 'src', 'index.d.ts'), dts);

    return total;
}

// ---------------------------------------------------------------------------
// Astro SVG — per-icon .astro standalone
// ---------------------------------------------------------------------------
async function generateAstroSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'astro-svg');

    let total = 0;
    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(pkgDir, 'src', variant);
        const iconsDir = path.join(variantDir, 'icons');
        await rm(variantDir, { recursive: true, force: true });
        await mkdir(iconsDir, { recursive: true });

        const generated = [];
        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const compName = toComponentName(iconName);
                const iconClass = toIconClass(iconName);
                const file = path.join(iconsDir, `${compName}.astro`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'astro-svg' });
                const source = `---
${jsdoc}
type MsSvgVariant = 'outlined' | 'outline' | 'rounded' | 'sharp';

export interface Props {
    size?: number | string;
    color?: string;
    fill?: boolean;
    variant?: MsSvgVariant;
    class?: string;
    [key: string]: unknown;
}

const P = ${JSON.stringify(data.path)};
const PF = ${JSON.stringify(data.pathFill)};

const {
    size = 24,
    color,
    fill = false,
    variant = ${JSON.stringify(variant)},
    class: userClass,
    ...rest
} = Astro.props as Props;

const effVariant = variant === 'outline' ? 'outlined' : variant;
const classes = [\`material-symbols-\${effVariant}\`, ${JSON.stringify(iconClass)}, userClass].filter(Boolean).join(' ');
const dPath = fill ? PF : P;
const ariaHidden = (rest as any)['aria-label'] ? undefined : 'true';
---

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={size}
    height={size}
    fill={color ?? 'currentColor'}
    aria-hidden={ariaHidden}
    data-icon={${JSON.stringify(iconName)}}
    {...rest}
    class={classes}
>
    <slot />
    <path d={dPath} />
</svg>
`;
                await writeFile(file, source);
                generated.push({ iconName, compName });
            }));
        }

        const barrel = generated.map(({ compName }) => `export { default as ${compName} } from './icons/${compName}.astro';`).join('\n');
        await writeFile(path.join(variantDir, 'index.js'), `// Auto-generated.\n${barrel}\n`);

        console.log(`  - ${variant}: ${generated.length} icon`);
        total += generated.length;
    }
    return total;
}

// ---------------------------------------------------------------------------
// Vanilla SVG — per-icon icon data file (untuk registerIcon)
// ---------------------------------------------------------------------------
async function generateVanillaSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'vanilla-svg');

    let total = 0;
    const iconsRoot = path.join(pkgDir, 'src', 'icons');
    await rm(iconsRoot, { recursive: true, force: true });

    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(iconsRoot, variant);
        await mkdir(variantDir, { recursive: true });

        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const file = path.join(variantDir, `${iconName}.ts`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'vanilla-svg' });
                const source = `import type { IconData } from '../../index.js';

${jsdoc}
const data: IconData = {
    name: ${JSON.stringify(iconName)},
    variant: ${JSON.stringify(variant)},
    path: ${JSON.stringify(data.path)},
    pathFill: ${JSON.stringify(data.pathFill)},
};
export default data;
`;
                await writeFile(file, source);
                total++;
            }));
        }

        console.log(`  - ${variant}: ${map.size} icon`);
    }
    return total;
}

// ---------------------------------------------------------------------------
// Angular SVG — per-icon icon data file
// ---------------------------------------------------------------------------
async function generateAngularSvg() {
    const { variants, paths } = await loadAllPaths();
    const pkgDir = path.join(ROOT, 'packages', 'angular-svg');

    let total = 0;
    const iconsRoot = path.join(pkgDir, 'src', 'icons');
    await rm(iconsRoot, { recursive: true, force: true });

    for (const variant of variants) {
        const map = paths[variant];
        const variantDir = path.join(iconsRoot, variant);
        await mkdir(variantDir, { recursive: true });

        const CHUNK = 200;
        const entries = [...map.entries()];
        for (let i = 0; i < entries.length; i += CHUNK) {
            const slice = entries.slice(i, i + CHUNK);
            await Promise.all(slice.map(async ([iconName, data]) => {
                const file = path.join(variantDir, `${iconName}.ts`);
                const jsdoc = buildIconJSDoc({ iconName, variant, pathD: data.path, framework: 'angular-svg' });
                const source = `import type { IconData } from '../../ms-svg-icon.component.js';

${jsdoc}
const data: IconData = {
    name: ${JSON.stringify(iconName)},
    variant: ${JSON.stringify(variant)},
    path: ${JSON.stringify(data.path)},
    pathFill: ${JSON.stringify(data.pathFill)},
};
export default data;
`;
                await writeFile(file, source);
                total++;
            }));
        }

        console.log(`  - ${variant}: ${map.size} icon`);
    }
    return total;
}
