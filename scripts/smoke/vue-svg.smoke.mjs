import path from 'node:path';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';

const PKG = process.cwd();
const { MsHome } = await import(path.join(PKG, 'dist/esm/rounded/icons/MsHome.js'));

const app = createSSRApp({ render: () => h(MsHome, { size: 32, color: 'red', fill: true }) });
const html = await renderToString(app);
expect(html, /viewBox="0 -960 960 960"/);
expect(html, /class="material-symbols-rounded ms-home"/);
expect(html, /<path d=/);
expect(html, /width="32"/);

console.log('OK');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
