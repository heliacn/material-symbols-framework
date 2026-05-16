import path from 'node:path';

const PKG = process.cwd();
const { MsSvgIconComponent, registerIcon } = await import(path.join(PKG, 'dist/fesm2022/index.mjs'));
const { default: home } = await import(path.join(PKG, 'dist/icons/rounded/home.mjs'));

registerIcon(home);

const inst = new MsSvgIconComponent();
inst.icon = 'home';
inst.variant = 'rounded';
inst.size = 32;
inst.color = 'red';
inst.fill = true;

if (!/material-symbols-rounded/.test(inst.classes)) throw new Error(`bad classes: ${inst.classes}`);
if (!/ms-home/.test(inst.classes)) throw new Error(`missing ms-home: ${inst.classes}`);
if (!inst.dPath) throw new Error('dPath empty after register');

console.log('OK');
