import path from 'node:path';
import { render } from 'preact-render-to-string';
import { h } from 'preact';

const PKG = process.cwd();
const { MsHome } = await import(path.join(PKG, 'dist/esm/rounded/icons/MsHome.js'));
const { MsHome: MsHomeOutlined } = await import(path.join(PKG, 'dist/esm/outlined/icons/MsHome.js'));

const html = render(h(MsHome, { size: 32, color: 'red', fill: true }));
expect(html, /viewBox="0 -960 960 960"/);
expect(html, /class="material-symbols-rounded ms-home"/);
expect(html, /<path d=/);
expect(html, /width="32"/);

const html2 = render(h(MsHomeOutlined));
expect(html2, /class="material-symbols-outlined/);

console.log('OK');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
