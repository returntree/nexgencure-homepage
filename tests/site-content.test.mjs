import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '');
const css = await readFile(new URL('../assets/css/styles.css', import.meta.url), 'utf8').catch(() => '');
const js = await readFile(new URL('../assets/js/site.js', import.meta.url), 'utf8').catch(() => '');
const products = await readFile(new URL('../products.html', import.meta.url), 'utf8').catch(() => '');
const company = await readFile(new URL('../company.html', import.meta.url), 'utf8').catch(() => '');

const requiredPages = [
  '../index.html',
  '../company.html',
  '../technology.html',
  '../products.html',
  '../certification.html',
  '../contact.html'
];

test('site uses separate pages instead of single-page landing anchors', async () => {
  for (const page of requiredPages) {
    await access(new URL(page, import.meta.url));
  }
  assert.match(html, /href="company\.html"/);
  assert.match(html, /href="technology\.html"/);
  assert.match(html, /href="products\.html"/);
  assert.doesNotMatch(html, /href="#company"|href="#technology"|href="#products"/);
});

test('homepage positions NexGenCure as a branding and technology company', () => {
  assert.match(html, /NexGenCure|넥스젠큐어/);
  assert.match(html, /Beauty & Healthcare Technology|뷰티·헬스케어/);
  assert.match(html, /기술력|Technology/);
});

test('homepage uses a premium visual hero slider', () => {
  assert.match(html, /class="home-hero hero-slider"/);
  assert.match(html, /data-hero-slider/);
  assert.match(html, /data-slide-index="0"/);
  assert.match(html, /data-slide-index="1"/);
  assert.match(html, /data-slide-index="2"/);
  assert.match(html, /BS407/);
  assert.match(html, /MYONGMUNHWAN|명문염/);
  assert.match(html, /aria-label="이전 슬라이드"/);
  assert.match(html, /aria-label="다음 슬라이드"/);
  assert.match(css, /\.hero-slide/);
  assert.match(css, /\.slide-bg/);
  assert.match(js, /data-hero-slider/);
});

test('homepage hero uses newly generated campaign images instead of reused product photos', () => {
  assert.match(html, /assets\/img\/hero\/nexgencure-brand-hero\.png/);
  assert.match(html, /assets\/img\/hero\/nexgencure-device-hero\.png/);
  assert.match(html, /assets\/img\/hero\/nexgencure-salt-hero\.png/);

  const heroMarkup = html.match(/<section class="home-hero hero-slider"[\s\S]*?<\/section>/)?.[0] || '';
  assert.doesNotMatch(heroMarkup, /assets\/img\/company-hero\.png/);
  assert.doesNotMatch(heroMarkup, /assets\/img\/products\/bs407\.png/);
  assert.doesNotMatch(heroMarkup, /assets\/img\/products\/myongmunhwan\.jpg/);
});

test('products page uses selected Nadyon electronic and salt products', () => {
  assert.match(products, /BS407/);
  assert.match(products, /MYONGMUNHWAN|명문염/);
  assert.match(products, /nadyon\.com/);
  assert.match(products, /assets\/img\/products\/bs407\.png/);
  assert.match(products, /assets\/img\/products\/myongmunhwan\.jpg/);
  assert.doesNotMatch(products, /cart|장바구니|checkout|결제|order|주문조회/i);
});

test('contact section includes the approved business address', () => {
  assert.match(html + company, /인천광역시 부평구 무네미로448번길 56/);
  assert.match(html + company, /한국폴리텍대학 인천캠퍼스/);
});

test('stylesheet defines Oxygenceuticals-inspired responsive page and product layout', () => {
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.product-grid/);
  assert.match(css, /\.brand-visual/);
  assert.match(css, /\.announcement-bar/);
});

test('stylesheet applies a premium clinical brand design system', () => {
  assert.match(css, /--champagne:/);
  assert.match(css, /--panel:/);
  assert.match(css, /--shadow-soft:/);
  assert.match(css, /body::before/);
  assert.match(css, /\.site-header::after/);
  assert.match(css, /\.page-hero::before/);
  assert.match(css, /\.quick-menu a::before/);
  assert.match(css, /\.product-card::before/);
  assert.match(css, /\.button:hover/);
  assert.match(css, /box-shadow:\s*var\(--shadow-soft\)/);
});

test('javascript implements navigation, page transitions, and non-sending form validation', () => {
  assert.match(js, /data-nav-toggle/);
  assert.match(js, /data-contact-form/);
  assert.match(js, /preventDefault/);
  assert.match(js, /문의 내용이 접수되었습니다/);
});

test('copy is final company copy, not sample placeholders', () => {
  const allCopy = [html, company, products].join('\n');
  assert.doesNotMatch(allCopy, /샘플|임시|placeholder|확인 후 반영|준비 중/i);
  assert.match(company, /넥스젠큐어는 미용기기와 헬스케어 제품을 중심으로/);
});

test('company page moves company facts to footer area and uses greeting visuals', () => {
  assert.match(company, /assets\/img\/hero\/nexgencure-company-hero\.png/);
  assert.match(company, /assets\/img\/company-greeting\.png/);
  assert.match(company, /class="greeting-panel"/);
  assert.match(company, /class="footer-profile"/);
  assert.ok(company.indexOf('class="greeting-panel"') < company.indexOf('class="footer-profile"'));

  const companyHeroMarkup = company.match(/<section class="page-hero split-hero company-intro-hero"[\s\S]*?<\/section>/)?.[0] || '';
  assert.doesNotMatch(companyHeroMarkup, /assets\/img\/company-hero\.png/);
});
