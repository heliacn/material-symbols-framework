// Smoke test untuk semua framework font-based.
// Setiap framework di-test via subprocess dari directory package-nya
// sendiri agar Node module resolution tidak bocor ke node_modules di
// parent directories ($HOME, dst).

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import * as fsSync from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const tests = [
    { name: 'react', cwd: 'packages/react', script: 'react.smoke.mjs' },
    { name: 'preact', cwd: 'packages/preact', script: 'preact.smoke.mjs' },
    { name: 'vue', cwd: 'packages/vue', script: 'vue.smoke.mjs' },
    { name: 'vanilla', cwd: '.', script: 'vanilla.smoke.mjs' },
    { name: 'angular', cwd: 'packages/angular', script: 'angular.smoke.mjs' },
    { name: 'preact-svg', cwd: 'packages/preact-svg', script: 'preact-svg.smoke.mjs' },
    { name: 'vue-svg', cwd: 'packages/vue-svg', script: 'vue-svg.smoke.mjs' },
    { name: 'vanilla-svg', cwd: '.', script: 'vanilla-svg.smoke.mjs' },
    { name: 'angular-svg', cwd: 'packages/angular-svg', script: 'angular-svg.smoke.mjs' },
];

const fileChecks = [
    { name: 'svelte (icon file)', file: 'packages/svelte/dist/icons/MsHome.svelte' },
    { name: 'svelte (Ms.svelte base)', file: 'packages/svelte/dist/Ms.svelte' },
    { name: 'astro (icon file)', file: 'packages/astro/dist/icons/MsHome.astro' },
    { name: 'astro (Ms.astro base)', file: 'packages/astro/dist/Ms.astro' },
    { name: 'react-native (esm)', file: 'packages/react-native/dist/esm/icons/MsHome.js' },
    { name: 'solid (source jsx)', file: 'packages/solid/dist/source/icons/MsHome.jsx' },
    { name: 'react-svg (rounded)', file: 'packages/react-svg/dist/esm/rounded/icons/MsHome.js' },
    { name: 'react-svg (outlined)', file: 'packages/react-svg/dist/esm/outlined/icons/MsHome.js' },
    { name: 'react-svg (sharp)', file: 'packages/react-svg/dist/esm/sharp/icons/MsHome.js' },
    { name: 'svelte-svg (rounded icon)', file: 'packages/svelte-svg/dist/rounded/icons/MsHome.svelte' },
    { name: 'svelte-svg (outlined icon)', file: 'packages/svelte-svg/dist/outlined/icons/MsHome.svelte' },
    { name: 'svelte-svg (sharp icon)', file: 'packages/svelte-svg/dist/sharp/icons/MsHome.svelte' },
    { name: 'astro-svg (rounded icon)', file: 'packages/astro-svg/dist/rounded/icons/MsHome.astro' },
    { name: 'astro-svg (outlined icon)', file: 'packages/astro-svg/dist/outlined/icons/MsHome.astro' },
    { name: 'astro-svg (sharp icon)', file: 'packages/astro-svg/dist/sharp/icons/MsHome.astro' },
    { name: 'solid-svg (rounded source)', file: 'packages/solid-svg/dist/source/rounded/icons/MsHome.jsx' },
];

let pass = 0, fail = 0;

for (const t of tests) {
    const cwd = path.join(ROOT, t.cwd);
    const srcPath = path.join(__dirname, 'smoke', t.script);
    // Copy ke pkg dir agar `import 'preact'` dst di-resolve relatif ke pkg.
    const tmpName = `_smoke-${t.script}`;
    const tmpPath = path.join(cwd, tmpName);
    fsSync.copyFileSync(srcPath, tmpPath);
    let r;
    try {
        r = spawnSync('node', [tmpName], { cwd, encoding: 'utf8' });
    } finally {
        try { fsSync.unlinkSync(tmpPath); } catch { /* ignore */ }
    }
    if (r.status === 0) {
        pass++;
        console.log(`✅ ${t.name}`);
        if (r.stdout?.trim()) {
            for (const line of r.stdout.trim().split('\n')) console.log(`   ${line}`);
        }
    } else {
        fail++;
        console.log(`❌ ${t.name}`);
        console.log(`   stderr: ${(r.stderr ?? '').split('\n').slice(0, 5).join('\n   ')}`);
    }
}

for (const f of fileChecks) {
    const full = path.join(ROOT, f.file);
    if (existsSync(full)) {
        pass++;
        console.log(`✅ ${f.name}`);
    } else {
        fail++;
        console.log(`❌ ${f.name}: ${full} missing`);
    }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
