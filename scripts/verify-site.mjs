import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const requiredFiles = [
  'index.html',
  'company.html',
  'technology.html',
  'products.html',
  'certification.html',
  'contact.html',
  'assets/css/styles.css',
  'assets/js/site.js',
  'assets/img/company-hero.png',
  'assets/img/company-greeting.png',
  'assets/img/products/bs407.png',
  'assets/img/products/myongmunhwan.jpg'
];

for (const file of requiredFiles) {
  await access(resolve(file));
}

const home = await readFile('index.html', 'utf8');
const products = await readFile('products.html', 'utf8');
const company = await readFile('company.html', 'utf8');
const checks = [
  ['Separate company page link', home.includes('href="company.html"')],
  ['Separate products page link', home.includes('href="products.html"')],
  ['Homepage visual slider', home.includes('data-hero-slider') && home.includes('data-slide-index="2"')],
  ['Company copy', company.includes('넥스젠큐어는 미용기기와 헬스케어 제품을 중심으로')],
  ['Company hero image', company.includes('assets/img/company-hero.png')],
  ['Company greeting image', company.includes('assets/img/company-greeting.png')],
  ['Company facts footer area', company.includes('class="footer-profile"')],
  ['BS407 product', products.includes('BS407')],
  ['MYONGMUNHWAN product', /MYONGMUNHWAN|명문염/.test(products)],
  ['Nadyon source', products.includes('nadyon.com')],
  ['No ecommerce cart', !/장바구니|결제|checkout|cart/i.test(home + products)]
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  console.error('Static verification failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('Static verification passed.');
console.log(`Open ${resolve('index.html')} in a browser for visual QA.`);
