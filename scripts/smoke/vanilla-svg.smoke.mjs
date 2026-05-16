import path from 'node:path';
import { Window } from 'happy-dom';

const PKG = process.cwd();

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.customElements = window.customElements;

const { defineMsSvgIcon, registerIcon } = await import(path.join(PKG, 'packages/vanilla-svg/dist/esm/index.js'));
const { default: home } = await import(path.join(PKG, 'packages/vanilla-svg/dist/esm/icons/rounded/home.js'));

defineMsSvgIcon();
registerIcon(home);

document.body.innerHTML = '<ms-svg-icon icon="home" size="32" color="red" fill></ms-svg-icon>';
const el = document.body.firstElementChild;
if (typeof el.connectedCallback === 'function' && !el.classList.length) {
    el.connectedCallback();
}
const html = el.outerHTML;
expect(html, /material-symbols-rounded/);
expect(html, /ms-home/);
expect(html, /<svg/);
expect(html, /viewBox="0 -960 960 960"/);
expect(html, /<path/);

console.log('OK');

function expect(actual, regex) {
    if (!regex.test(actual)) throw new Error(`Expected ${regex} in:\n${actual}`);
}
