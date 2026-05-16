import path from 'node:path';
import { Window } from 'happy-dom';

const PKG = process.cwd();

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;

const { defineMsIcon } = await import(path.join(PKG, 'packages/vanilla/dist/esm/index.js'));
defineMsIcon();

document.body.innerHTML = '<ms-icon icon="home" variant="outlined" size="32" color="red" fill></ms-icon>';
const el = document.body.firstElementChild;
if (typeof el.connectedCallback === 'function' && !el.classList.length) {
    el.connectedCallback();
}
const html = el.outerHTML;
expect(html, /material-symbols-outlined/);
expect(html, /ms-home/);
expect(html, />home</);
expect(html, /font-size: 32px/);
expect(html, /color: red/);
expect(html, /'FILL' 1/);

document.body.innerHTML = '<ms-icon code="e88a"></ms-icon>';
const el2 = document.body.firstElementChild;
if (typeof el2.connectedCallback === 'function' && !el2.classList.length) {
    el2.connectedCallback();
}
expect(el2.outerHTML, /material-symbols-rounded/);

console.log('OK');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
