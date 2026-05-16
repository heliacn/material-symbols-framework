// Run from packages/react cwd. Pkg dir = process.cwd().
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const PKG = process.cwd();
const { MsHome } = await import(path.join(PKG, 'dist/esm/icons/MsHome.js'));
const { Ms } = await import(path.join(PKG, 'dist/esm/Ms.js'));

const html1 = renderToStaticMarkup(createElement(MsHome, { variant: 'outlined', size: 32, fill: true, color: 'red' }));
expect(html1, /material-symbols-outlined/);
expect(html1, /ms-home/);
expect(html1, />home</);
expect(html1, /font-size:32px/);
expect(html1, /color:red/);
expect(html1, /FILL.*1/);

const html2 = renderToStaticMarkup(createElement(Ms, { code: 'e88a' }));
expect(html2, /class="material-symbols-rounded"/);

const html3 = renderToStaticMarkup(createElement(MsHome, { 'aria-label': 'home' }));
if (html3.includes('aria-hidden')) throw new Error('aria-hidden should not be present');

console.log('OK 3 cases');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
