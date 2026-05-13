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
  'assets/img/hero/nexgencure-brand-hero.png',
  'assets/img/hero/nexgencure-company-hero.png',
  'assets/img/hero/nexgencure-device-hero.png',
  'assets/img/hero/nexgencure-salt-hero.png',
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
const technology = await readFile('technology.html', 'utf8');
const certification = await readFile('certification.html', 'utf8');
const contact = await readFile('contact.html', 'utf8');
const css = await readFile('assets/css/styles.css', 'utf8');
const publicCopy = [home, company, technology, products, certification, contact].join('\n');
const checks = [
  ['Separate company page link', home.includes('href="company.html"')],
  ['Separate products page link', home.includes('href="products.html"')],
  ['Homepage visual slider', home.includes('data-hero-slider') && home.includes('data-slide-index="2"')],
  ['Company copy', company.includes('넥스젠큐어는 미용기기와 헬스케어 제품을 중심으로')],
  ['Company hero image', company.includes('assets/img/hero/nexgencure-company-hero.png')],
  ['Company greeting image', company.includes('assets/img/company-greeting.png')],
  ['Company facts footer area', company.includes('class="footer-profile"')],
  ['BS407 product', products.includes('BS407')],
  ['MYONGMUNHWAN product', /MYONGMUNHWAN|명문염/.test(products)],
  ['Current development product positioning', products.includes('현재 개발 상품') && products.includes('헬스케어 디바이스') && products.includes('건강식품 개발품')],
  ['No Nadyon sourcing language', !/나디온|Nadyon|nadyon|제품 목록 출처|등록 제품|등록명/.test(publicCopy)],
  ['No narrow selected product language', !/전자제품과 소금제품만|전자제품, 소금제품|전자제품 BS407|소금제품 MYONGMUNHWAN|선별했습니다|선별해|선별된|선별 제품군|선별 제품/.test(publicCopy)],
  ['Healthcare and functional food positioning', /헬스케어/.test(publicCopy) && /건강식품/.test(publicCopy)],
  ['No ecommerce cart', !/장바구니|결제|checkout|cart/i.test(home + products)],
  ['Premium clinical style tokens', css.includes('--champagne:') && css.includes('--panel:')],
  ['Premium page hero styling', css.includes('.page-hero::before')],
  ['Premium product card styling', css.includes('.product-card::before')]
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  console.error('Static verification failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('Static verification passed.');
console.log(`Open ${resolve('index.html')} in a browser for visual QA.`);
