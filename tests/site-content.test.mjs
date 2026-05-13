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
