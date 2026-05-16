import path from 'node:path';
import { render } from 'preact-render-to-string';
import { h } from 'preact';

const PKG = process.cwd();
const { MsHome } = await import(path.join(PKG, 'dist/esm/icons/MsHome.js'));

const html = render(h(MsHome, { variant: 'outlined', size: 32, fill: true, color: 'red' }));
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
