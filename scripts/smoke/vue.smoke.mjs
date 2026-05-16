import path from 'node:path';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';

const PKG = process.cwd();
const { MsHome } = await import(path.join(PKG, 'dist/esm/icons/MsHome.js'));

const app = createSSRApp({ render: () => h(MsHome, { variant: 'outlined', size: 32, fill: true, color: 'red' }) });
const html = await renderToString(app);
expect(html, /material-symbols-outlined/);
expect(html, /ms-home/);
expect(html, />home</);
expect(html, /font-size:32px/);
expect(html, /color:red/);
expect(html, /FILL.*1/);

console.log('OK');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
