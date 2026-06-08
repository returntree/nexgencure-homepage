import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '');
const css = await readFile(new URL('../assets/css/styles.css', import.meta.url), 'utf8').catch(() => '');
const js = await readFile(new URL('../assets/js/site.js', import.meta.url), 'utf8').catch(() => '');
const products = await readFile(new URL('../products.html', import.meta.url), 'utf8').catch(() => '');
const company = await readFile(new URL('../company.html', import.meta.url), 'utf8').catch(() => '');
const technology = await readFile(new URL('../technology.html', import.meta.url), 'utf8').catch(() => '');
const certification = await readFile(new URL('../certification.html', import.meta.url), 'utf8').catch(() => '');
const contact = await readFile(new URL('../contact.html', import.meta.url), 'utf8').catch(() => '');

const requiredPages = [
  '../index.html',
  '../company.html',
  '../technology.html',
  '../products.html',
  '../certification.html',
  '../contact.html'
];

const publicCopy = [html, company, technology, products, certification, contact].join('\n');
const publicHtml = publicCopy;

test('site uses separate pages and customer-facing navigation', async () => {
  for (const page of requiredPages) {
    await access(new URL(page, import.meta.url));
  }

  assert.match(html, /href="company\.html"/);
  assert.match(html, /href="technology\.html"/);
  assert.match(html, /href="products\.html"/);
  assert.match(publicHtml, />Info<\/a>/);
  assert.doesNotMatch(publicHtml, />Certification<\/a>|>Materials<\/a>/);
  assert.doesNotMatch(html, /href="#company"|href="#technology"|href="#products"/);
});

test('homepage uses premium generated visual slider assets', () => {
  assert.match(html, /class="home-hero hero-slider"/);
  assert.match(html, /data-hero-slider/);
  assert.match(html, /data-slide-index="0"/);
  assert.match(html, /data-slide-index="1"/);
  assert.match(html, /data-slide-index="2"/);
  assert.match(html, /assets\/img\/hero\/nexgencure-brand-hero\.png/);
  assert.match(html, /assets\/img\/hero\/nexgencure-device-hero\.png/);
  assert.match(html, /assets\/img\/hero\/nexgencure-salt-hero\.png/);
  assert.match(js, /data-hero-slider/);
});

test('public copy reads like a customer-facing brand homepage', () => {
  assert.doesNotMatch(publicCopy, /현재 개발 상품|개발품을 중심으로|개발품입니다|임시|샘플|placeholder/i);
  assert.doesNotMatch(publicCopy, /나디온|Nadyon|nadyon|제품 목록 출처|등록 제품|등록명/);
  assert.doesNotMatch(publicCopy, /전자제품과 소금제품만|전자제품, 소금제품|선별했습니다|선별한|선별 제품/);
  assert.doesNotMatch(publicCopy, /B2B|검토|정부지원사업|쇼핑몰형|자료화|구성했습니다|파트너가|거래처|기관|제작 의뢰|제휴 검토|검토용|자료 구조/);
  assert.match(publicCopy, /뷰티·헬스케어 기업|헬스케어 브랜드|제품 라인업/);
  assert.match(publicCopy, /일상 관리|건강한 생활|제품 경험|고객 문의|브랜드 안내/);
});

test('company page explains the brand for customers', () => {
  assert.match(company, /사업영역/);
  assert.match(company, /핵심역량/);
  assert.match(company, /운영 기준/);
  assert.match(company, /제조 기반/);
  assert.match(company, /연구개발/);
  assert.match(company, /고객이 경험할 수 있는 신뢰/);
  assert.match(company, /class="business-overview"/);
  assert.match(company, /business-overview\.webp/);
  assert.match(company, /manufacturing-base\.webp/);
  assert.match(company, /product-lineup\.webp/);
  assert.match(company, /research-development\.webp/);
  assert.match(company, /class="standard-band"/);
});

test('technology page explains customer value and productization process', () => {
  assert.match(technology, /제품화 프로세스/);
  assert.match(technology, /기획/);
  assert.match(technology, /제조/);
  assert.match(technology, /안내/);
  assert.match(technology, /고객 경험/);
  assert.match(technology, /Brand Reliability/);
  assert.match(technology, /product-planning\.webp/);
  assert.match(technology, /manufacturing-base\.webp/);
  assert.match(technology, /research-link\.webp/);
  assert.match(technology, /brand-reliability\.webp/);
  assert.match(technology, /class="technology-roadmap"/);
});

test('products page uses customer-friendly lineup language', () => {
  assert.match(products, /주요 제품 라인업/);
  assert.match(products, /헬스케어 디바이스/);
  assert.match(products, /건강식품 라인업/);
  assert.match(products, /class="product-points"/);
  assert.match(products, /편안한 사용 경험/);
  assert.match(products, /건강한 생활 경험|일상 속 건강 관리/);
  assert.doesNotMatch(products, /현재 개발 상품|개발품입니다|B2B|검토용|자료/);
  assert.match(products, /assets\/img\/products\/bs407\.png/);
  assert.match(products, /assets\/img\/products\/myongmunhwan\.jpg/);
});

test('info page naming matches customer-facing brand content', () => {
  assert.match(certification, /브랜드 안내|제품 안내|고객 문의/);
  assert.match(certification, /넥스젠큐어의 브랜드와 제품을 안내합니다/);
  assert.match(certification, /<p class="eyebrow">Info<\/p>/);
});

test('subpage heroes expose concise customer-facing cues', () => {
  for (const page of [company, technology, products, certification, contact]) {
    assert.match(page, /class="hero-tags"/);
  }

  assert.match(company, /Manufacturing Base/);
  assert.match(technology, /Product Planning/);
  assert.match(products, /Daily Care/);
  assert.match(certification, /Brand Story/);
  assert.match(contact, /Partnership/);
  assert.match(contact, /Customer Care/);
  assert.match(css, /\.hero-tags/);
});

test('contact page explains customer inquiry flow and consultation scope', () => {
  assert.match(contact, /상담 범위/);
  assert.match(contact, /문의 내용을 확인한 뒤/);
  assert.match(contact, /제품·브랜드 문의/);
  assert.match(contact, /고객 문의/);
  assert.match(contact, /class="contact-guide"/);
});

test('contact section includes the approved business address', () => {
  assert.match(publicCopy, /인천광역시 부평구 무네미로448번길 56/);
  assert.match(publicCopy, /한국폴리텍대학 인천캠퍼스/);
});

test('stylesheet supports premium responsive corporate sections', () => {
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /--champagne:/);
  assert.match(css, /--panel:/);
  assert.match(css, /--shadow-soft:/);
  assert.match(css, /\.business-overview/);
  assert.match(css, /\.business-overview-intro/);
  assert.match(css, /\.business-overview-visual/);
  assert.match(css, /\.insight-grid/);
  assert.match(css, /\.technology-roadmap/);
  assert.match(css, /\.process-list article img/);
  assert.match(css, /\.roadmap-list/);
  assert.match(css, /\.product-points/);
  assert.match(css, /\.contact-guide/);
});

test('javascript implements navigation, page transitions, and non-sending form validation', () => {
  assert.match(js, /data-nav-toggle/);
  assert.match(js, /data-contact-form/);
  assert.match(js, /preventDefault/);
  assert.match(js, /문의 내용이 접수되었습니다/);
});
