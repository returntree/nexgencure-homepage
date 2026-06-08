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
  ['Info navigation label', publicCopy.includes('>Info</a>') && !/>Certification<\/a>|>Materials<\/a>/.test(publicCopy)],
  ['Homepage visual slider', home.includes('data-hero-slider') && home.includes('data-slide-index="2"')],
  ['Customer-facing brand positioning', /뷰티·헬스케어 기업|헬스케어 브랜드|제품 라인업/.test(publicCopy)],
  ['Customer value language', /일상 관리|건강한 생활|제품 경험|고객 문의|브랜드 안내/.test(publicCopy)],
  ['Company business overview', company.includes('class="business-overview"') && company.includes('사업영역과 핵심역량')],
  ['Company business overview images', ['business-overview.webp', 'manufacturing-base.webp', 'product-lineup.webp', 'research-development.webp'].every(asset => company.includes(`assets/img/company/${asset}`))],
  ['Company customer standard', company.includes('class="standard-band"') && company.includes('일상에서 신뢰할 수 있는 제품 경험')],
  ['Technology roadmap', technology.includes('class="technology-roadmap"') && technology.includes('제품화 프로세스') && technology.includes('Brand Reliability')],
  ['Technology process images', ['product-planning.webp', 'manufacturing-base.webp', 'research-link.webp', 'brand-reliability.webp'].every(asset => technology.includes(`assets/img/technology/${asset}`))],
  ['Technology roadmap images', ['roadmap-planning.webp', 'roadmap-manufacturing.webp', 'roadmap-research.webp', 'roadmap-guidance.webp'].every(asset => technology.includes(`assets/img/technology/${asset}`))],
  ['Product lineup copy', products.includes('주요 제품 라인업') && products.includes('class="product-points"') && products.includes('편안한 사용 경험')],
  ['Info page copy', certification.includes('넥스젠큐어의 브랜드와 제품을 안내합니다') && certification.includes('<p class="eyebrow">Info</p>')],
  ['Contact guide copy', contact.includes('class="contact-guide"') && contact.includes('제품·브랜드 문의') && contact.includes('문의 내용을 확인한 뒤')],
  ['Subpage hero cues', [company, technology, products, certification, contact].every(page => page.includes('class="hero-tags"')) && products.includes('Daily Care') && contact.includes('Customer Care') && css.includes('.hero-tags')],
  ['No sourcing language', !/나디온|Nadyon|nadyon|제품 목록 출처|등록 제품|등록명/.test(publicCopy)],
  ['No internal-review language', !/B2B|검토|정부지원사업|쇼핑몰형|자료화|구성했습니다|파트너가|거래처|기관|제작 의뢰|제휴 검토|검토용|자료 구조/.test(publicCopy)],
  ['No temporary product tone', !/현재 개발 상품|개발품입니다|임시|샘플|placeholder/i.test(publicCopy)],
  ['No ecommerce cart', !/장바구니|결제|checkout|cart/i.test(home + products)],
  ['Premium clinical style tokens', css.includes('--champagne:') && css.includes('--panel:')],
  ['New section styles', css.includes('.business-overview') && css.includes('.business-overview-visual') && css.includes('.technology-roadmap') && css.includes('.process-list article img') && css.includes('.roadmap-list li img') && css.includes('.contact-guide')]
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  console.error('Static verification failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('Static verification passed.');
console.log(`Open ${resolve('index.html')} in a browser for visual QA.`);
