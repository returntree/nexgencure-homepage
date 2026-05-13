import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const requiredFiles = [
  'index.html',
  'assets/css/styles.css',
  'assets/js/site.js',
  'assets/img/nexgencure-hero.png',
  'assets/img/device-showcase.png',
  'assets/img/salt-care.png'
];

for (const file of requiredFiles) {
  await access(resolve(file));
}

const html = await readFile('index.html', 'utf8');
const checks = [
  ['Hero CTA', html.includes('제품 문의')],
  ['Company section', html.includes('id="company"')],
  ['Technology section', html.includes('id="technology"')],
  ['Products section', html.includes('id="products"')],
  ['Certification section', html.includes('id="certification"')],
  ['Contact section', html.includes('id="contact"')],
  ['No ecommerce cart', !/장바구니|결제|checkout|cart/i.test(html)]
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  console.error('Static verification failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('Static verification passed.');
console.log(`Open ${resolve('index.html')} in a browser for visual QA.`);
