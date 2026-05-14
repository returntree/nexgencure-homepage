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
  ['Materials navigation label', publicCopy.includes('>Materials</a>') && !publicCopy.includes('>Certification</a>')],
  ['Homepage visual slider', home.includes('data-hero-slider') && home.includes('data-slide-index="2"')],
  ['Corporate positioning', /뷰티·헬스케어 기업|헬스케어 브랜드|제품 라인업/.test(publicCopy)],
  ['Company business overview', company.includes('class="business-overview"') && company.includes('사업영역과 핵심역량')],
  ['Company operating standard', company.includes('class="standard-band"') && company.includes('운영 기준')],
  ['Technology roadmap', technology.includes('class="technology-roadmap"') && technology.includes('제품화 프로세스')],
  ['Product lineup copy', products.includes('주요 제품 라인업') && products.includes('class="product-points"')],
  ['Materials page copy', certification.includes('사업 검토에 필요한 자료를 정리합니다') && certification.includes('Materials')],
  ['Contact guide copy', contact.includes('class="contact-guide"') && contact.includes('상담 범위')],
  ['No sourcing language', !/나디온|Nadyon|nadyon|제품 목록 출처|등록 제품|등록명/.test(publicCopy)],
  ['No temporary product tone', !/현재 개발 상품|개발품입니다|임시|샘플|placeholder/i.test(publicCopy)],
  ['No ecommerce cart', !/장바구니|결제|checkout|cart/i.test(home + products)],
  ['Premium clinical style tokens', css.includes('--champagne:') && css.includes('--panel:')],
  ['New section styles', css.includes('.business-overview') && css.includes('.technology-roadmap') && css.includes('.contact-guide')]
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  console.error('Static verification failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('Static verification passed.');
console.log(`Open ${resolve('index.html')} in a browser for visual QA.`);
