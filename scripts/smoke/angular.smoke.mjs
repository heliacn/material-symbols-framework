import path from 'node:path';

const PKG = process.cwd();
const { MsIconComponent } = await import(path.join(PKG, 'dist/fesm2022/index.mjs'));

const inst = new MsIconComponent();
inst.icon = 'home';
inst.variant = 'outlined';
inst.size = 32;
inst.color = 'red';
inst.fill = true;
inst.grad = -25;

if (!/material-symbols-outlined/.test(inst.classes)) throw new Error(`bad classes: ${inst.classes}`);
if (!/ms-home/.test(inst.classes)) throw new Error(`missing ms-home: ${inst.classes}`);
if (inst.fontSize !== '32px') throw new Error(`bad fontSize: ${inst.fontSize}`);
if (!String(inst.fvs).includes("'FILL' 1")) throw new Error(`bad fvs: ${inst.fvs}`);
if (!String(inst.fvs).includes("'GRAD' -25")) throw new Error(`bad fvs grad: ${inst.fvs}`);
if (inst.display !== 'home') throw new Error(`bad display: ${inst.display}`);

console.log('OK');
