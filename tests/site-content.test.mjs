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

test('site uses separate pages and consistent navigation', async () => {
  for (const page of requiredPages) {
    await access(new URL(page, import.meta.url));
  }

  assert.match(html, /href="company\.html"/);
  assert.match(html, /href="technology\.html"/);
  assert.match(html, /href="products\.html"/);
  assert.match(publicHtml, />Materials<\/a>/);
  assert.doesNotMatch(publicHtml, />Certification<\/a>/);
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

test('public copy reads like a corporate brand homepage', () => {
  assert.doesNotMatch(publicCopy, /현재 개발 상품|개발품을 중심으로|개발품입니다|임시|샘플|placeholder/i);
  assert.doesNotMatch(publicCopy, /나디온|Nadyon|nadyon|제품 목록 출처|등록 제품|등록명/);
  assert.doesNotMatch(publicCopy, /전자제품과 소금제품만|전자제품, 소금제품|선별했습니다|선별해|선별된|선별 제품/);
  assert.match(publicCopy, /뷰티·헬스케어 기업|헬스케어 브랜드|제품 라인업/);
  assert.match(publicCopy, /제조|연구개발|사업영역/);
});

test('company page includes business overview and operating standards', () => {
  assert.match(company, /사업영역/);
  assert.match(company, /핵심역량/);
  assert.match(company, /운영 기준/);
  assert.match(company, /제조 기반/);
  assert.match(company, /연구개발/);
  assert.match(company, /class="business-overview"/);
  assert.match(company, /class="standard-band"/);
});

test('technology page explains practical productization process', () => {
  assert.match(technology, /제품화 프로세스/);
  assert.match(technology, /기획/);
  assert.match(technology, /제조/);
  assert.match(technology, /자료화/);
  assert.match(technology, /파트너 검토/);
  assert.match(technology, /class="technology-roadmap"/);
});

test('products page uses lineup language and product details', () => {
  assert.match(products, /주요 제품 라인업/);
  assert.match(products, /헬스케어 디바이스/);
  assert.match(products, /건강식품 라인업/);
  assert.match(products, /class="product-points"/);
  assert.match(products, /B2B 제휴 검토용 정보 구성/);
  assert.doesNotMatch(products, /현재 개발 상품|개발품입니다/);
  assert.match(products, /assets\/img\/products\/bs407\.png/);
  assert.match(products, /assets\/img\/products\/myongmunhwan\.jpg/);
});

test('materials page naming matches available content', () => {
  assert.match(certification, /자료 안내|검토 자료|사업자 정보/);
  assert.match(certification, /사업 검토에 필요한 자료를 정리합니다/);
  assert.match(certification, /<p class="eyebrow">Materials<\/p>/);
});

test('subpage heroes expose concise page cues', () => {
  for (const page of [company, technology, products, certification, contact]) {
    assert.match(page, /class="hero-tags"/);
  }

  assert.match(company, /Manufacturing Base/);
  assert.match(technology, /Product Planning/);
  assert.match(products, /B2B Review/);
  assert.match(certification, /Business Info/);
  assert.match(contact, /Partnership/);
  assert.match(css, /\.hero-tags/);
});

test('contact page explains inquiry flow and consultation scope', () => {
  assert.match(contact, /상담 범위/);
  assert.match(contact, /접수 후 확인/);
  assert.match(contact, /제품 라인업 상담/);
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
  assert.match(css, /\.insight-grid/);
  assert.match(css, /\.technology-roadmap/);
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
