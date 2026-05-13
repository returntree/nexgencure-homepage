import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '');
const css = await readFile(new URL('../assets/css/styles.css', import.meta.url), 'utf8').catch(() => '');
const js = await readFile(new URL('../assets/js/site.js', import.meta.url), 'utf8').catch(() => '');

test('homepage exposes the approved primary sections', () => {
  for (const id of ['company', 'technology', 'products', 'certification', 'contact']) {
    assert.match(html, new RegExp(`id="${id}"`), `Missing section #${id}`);
  }
});

test('homepage positions NexGenCure as a branding and technology company', () => {
  assert.match(html, /NexGenCure|넥스젠큐어/);
  assert.match(html, /Beauty & Healthcare Technology|뷰티·헬스케어/);
  assert.match(html, /기술력|Technology/);
});

test('product scope is limited to device and salt categories', () => {
  assert.match(html, /Device/);
  assert.match(html, /Salt Care/);
  assert.doesNotMatch(html, /cart|장바구니|checkout|결제|order|주문조회/i);
});

test('contact section includes the approved business address', () => {
  assert.match(html, /인천광역시 부평구 무네미로448번길 56/);
  assert.match(html, /한국폴리텍대학 인천캠퍼스/);
});

test('stylesheet defines responsive navigation and product layout', () => {
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.product-grid/);
  assert.match(css, /\.hero-media img/);
});

test('javascript implements navigation and non-sending form validation', () => {
  assert.match(js, /data-nav-toggle/);
  assert.match(js, /data-contact-form/);
  assert.match(js, /preventDefault/);
  assert.match(js, /실제 전송 기능은 공개용 이메일 확정 후 연결됩니다/);
});
