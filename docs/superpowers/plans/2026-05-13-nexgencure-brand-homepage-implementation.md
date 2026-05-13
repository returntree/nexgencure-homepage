# NexGenCure Brand Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive one-page NexGenCure company branding homepage focused on company credibility, technology, selected device products, selected salt products, certification materials, and contact conversion.

**Architecture:** Use a dependency-free static site so the result can be opened directly from `index.html` or served by a small local static server. Keep content in semantic HTML, visual presentation in one focused CSS file, and small interactions in one JavaScript file. Add lightweight Node tests that read the generated files and guard the approved scope: no ecommerce UI, only device and salt product categories, and all required sections.

**Tech Stack:** Static HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, generated bitmap assets.

---

## File Structure

- Create: `package.json`
  - Defines `npm test` and `npm run verify` scripts using Node only.
- Create: `index.html`
  - Semantic one-page homepage with sections: Hero, Company, Technology, Products, Certification, Contact.
- Create: `assets/css/styles.css`
  - Visual system, layout, responsive behavior, cards, navigation, form states.
- Create: `assets/js/site.js`
  - Mobile navigation, smooth section navigation, contact form validation, footer year.
- Create: `assets/img/nexgencure-hero.png`
  - Premium clinical beauty and healthcare technology hero image.
- Create: `assets/img/device-showcase.png`
  - Device category visual.
- Create: `assets/img/salt-care.png`
  - Salt care product category visual.
- Create: `tests/site-content.test.mjs`
  - Verifies required content, section IDs, product category constraints, and absence of ecommerce UI.
- Create: `scripts/verify-site.mjs`
  - Performs final static file checks and prints the local file path for browser QA.

---

### Task 1: Project Tooling And Scope Tests

**Files:**
- Create: `package.json`
- Create: `tests/site-content.test.mjs`

- [ ] **Step 1: Create the failing content test**

Create `tests/site-content.test.mjs`:

```js
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '');

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
```

- [ ] **Step 2: Create the package scripts**

Create `package.json`:

```json
{
  "name": "nexgencure-brand-homepage",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "verify": "node scripts/verify-site.mjs"
  }
}
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because `index.html` does not exist yet and required section assertions fail.

- [ ] **Step 4: Commit tooling and failing tests**

Run:

```bash
git add package.json tests/site-content.test.mjs
git commit -m "test: add homepage scope checks"
```

---

### Task 2: Semantic Homepage Markup

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create the homepage markup**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>넥스젠큐어 | NexGenCure</title>
    <meta name="description" content="넥스젠큐어는 미용기기와 헬스케어 제품을 기반으로 기술력과 품질 신뢰를 쌓아가는 뷰티·헬스케어 제조 기업입니다.">
    <link rel="stylesheet" href="assets/css/styles.css">
  </head>
  <body>
    <header class="site-header" data-header>
      <a class="brand" href="#top" aria-label="NexGenCure home">
        <span class="brand-mark">N</span>
        <span>NexGenCure</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" data-nav-toggle>
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" data-nav>
        <a href="#company">Company</a>
        <a href="#technology">Technology</a>
        <a href="#products">Products</a>
        <a href="#certification">Certification</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero section-band">
        <div class="hero-copy">
          <p class="eyebrow">Beauty & Healthcare Technology</p>
          <h1>Next-generation care through science and trust</h1>
          <p class="hero-lead">넥스젠큐어는 미용기기와 헬스케어 제품을 기반으로, 기술력과 품질 신뢰를 쌓아가는 뷰티·헬스케어 제조 기업입니다.</p>
          <div class="hero-actions">
            <a class="button primary" href="#contact">제품 문의</a>
            <a class="button secondary" href="#company">회사소개</a>
          </div>
        </div>
        <figure class="hero-media">
          <img src="assets/img/nexgencure-hero.png" alt="클리니컬 뷰티와 헬스케어 기술을 표현한 넥스젠큐어 브랜드 이미지">
        </figure>
      </section>

      <section class="section-band company" id="company">
        <div class="section-heading">
          <p class="eyebrow">Company</p>
          <h2>기술 기반 뷰티·헬스케어 제조 기업</h2>
          <p>넥스젠큐어 주식회사(NexGenCure Co., Ltd.)는 미용기기, 마사지기, 헬스케어 제품 영역에서 제품 개발과 품질 신뢰를 중심으로 성장하는 기업입니다.</p>
        </div>
        <div class="info-grid">
          <article>
            <span>01</span>
            <h3>Manufacturing</h3>
            <p>미용기기와 마사지기 제조 영역을 기반으로 제품 신뢰와 사용 경험을 설계합니다.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Healthcare</h3>
            <p>생활 속 건강과 관리를 위한 제품군을 선별해 브랜드 포트폴리오를 구축합니다.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Research</h3>
            <p>물리·화학·생물학 연구개발 기반의 기술적 가능성을 제품 가치로 연결합니다.</p>
          </article>
        </div>
      </section>

      <section class="section-band technology" id="technology">
        <div class="section-heading">
          <p class="eyebrow">Technology</p>
          <h2>제품 개발, 제조 기반, 품질 신뢰</h2>
          <p>넥스젠큐어는 확인 가능한 기술과 자료를 바탕으로 제품의 완성도와 기업 신뢰를 전달합니다.</p>
        </div>
        <div class="feature-list">
          <div>
            <h3>Device Development</h3>
            <p>미용기기와 마사지기 제품의 사용 목적, 안전성, 편의성을 고려한 개발 방향을 제시합니다.</p>
          </div>
          <div>
            <h3>Quality Narrative</h3>
            <p>제품 사진, 인증 자료, 시험성적서가 제공되면 해당 근거를 중심으로 품질 메시지를 강화합니다.</p>
          </div>
          <div>
            <h3>Brand Credibility</h3>
            <p>정부지원사업, 제휴 검토, 거래처 상담에서 활용하기 쉬운 신뢰형 회사 정보를 구성합니다.</p>
          </div>
        </div>
      </section>

      <section class="section-band products" id="products">
        <div class="section-heading">
          <p class="eyebrow">Products</p>
          <h2>선별 제품군</h2>
          <p>요청 범위에 맞춰 기계제품과 소금제품만 소개하며, 가격과 구매 기능은 노출하지 않습니다.</p>
        </div>
        <div class="product-grid">
          <article class="product-card">
            <img src="assets/img/device-showcase.png" alt="미용기기와 마사지기 제품군 이미지">
            <div>
              <p class="eyebrow">Device</p>
              <h3>기계제품</h3>
              <p>미용기기와 마사지기 중심의 제품군을 브랜드 신뢰를 보강하는 방식으로 소개합니다.</p>
              <ul>
                <li>Beauty device category</li>
                <li>Massage and care device</li>
                <li>Inquiry-based product introduction</li>
              </ul>
            </div>
          </article>
          <article class="product-card">
            <img src="assets/img/salt-care.png" alt="소금 기반 헬스케어 제품 이미지">
            <div>
              <p class="eyebrow">Salt Care</p>
              <h3>소금제품</h3>
              <p>소금 기반 제품은 자연성과 헬스케어 이미지를 살려 차분하고 신뢰감 있게 구성합니다.</p>
              <ul>
                <li>Salt-based wellness product</li>
                <li>Clean care positioning</li>
                <li>Brand story focused presentation</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="section-band certification" id="certification">
        <div class="section-heading">
          <p class="eyebrow">Certification</p>
          <h2>자료와 인증으로 보강하는 기업 신뢰</h2>
          <p>특허, 인증현황, 제조/품목허가증, 브로슈어, 제품설명서는 제공 가능한 항목만 선별해 노출합니다.</p>
        </div>
        <div class="document-grid">
          <article><h3>특허 및 인증현황</h3><p>보유 자료가 확인되는 항목만 표시합니다.</p></article>
          <article><h3>제조/품목허가증</h3><p>심사와 제휴 검토에 필요한 자료를 정리합니다.</p></article>
          <article><h3>브로슈어</h3><p>회사 및 제품 소개 자료를 다운로드형 카드로 확장할 수 있습니다.</p></article>
        </div>
      </section>

      <section class="section-band contact" id="contact">
        <div class="section-heading">
          <p class="eyebrow">Contact</p>
          <h2>제품 및 제휴 문의</h2>
          <p>제품 도입, 제휴, 자료 요청은 아래 정보를 통해 문의할 수 있습니다.</p>
        </div>
        <div class="contact-layout">
          <div class="contact-card">
            <h3>Office</h3>
            <p>인천광역시 부평구 무네미로448번길 56, 산학협력관 에스210호<br>구산동, 한국폴리텍대학 인천캠퍼스</p>
            <p class="muted">대표 전화와 공개 이메일은 확인 후 반영합니다.</p>
          </div>
          <form class="contact-form" data-contact-form novalidate>
            <label>이름<input name="name" autocomplete="name" required></label>
            <label>연락처<input name="phone" autocomplete="tel" required></label>
            <label>이메일<input name="email" type="email" autocomplete="email" required></label>
            <label>문의 유형
              <select name="type" required>
                <option value="">선택</option>
                <option>제품 문의</option>
                <option>제휴 문의</option>
                <option>자료 요청</option>
              </select>
            </label>
            <label>문의 내용<textarea name="message" rows="5" required></textarea></label>
            <label class="consent"><input type="checkbox" name="privacy" required> 개인정보 수집 및 이용에 동의합니다.</label>
            <p class="form-message" data-form-message></p>
            <button class="button primary" type="submit">문의 남기기</button>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© <span data-year></span> NexGenCure Co., Ltd. All rights reserved.</p>
    </footer>

    <script src="assets/js/site.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Run tests to verify markup passes scope checks**

Run:

```bash
npm test
```

Expected: PASS for `tests/site-content.test.mjs`.

- [ ] **Step 3: Commit semantic markup**

Run:

```bash
git add index.html
git commit -m "feat: add NexGenCure homepage markup"
```

---

### Task 3: Visual Assets

**Files:**
- Create: `assets/img/nexgencure-hero.png`
- Create: `assets/img/device-showcase.png`
- Create: `assets/img/salt-care.png`

- [ ] **Step 1: Generate the hero bitmap asset**

Use the image generation skill or image generation tool to create `assets/img/nexgencure-hero.png` with this prompt:

```text
Premium clinical beauty and healthcare technology brand image for NexGenCure, clean bright Korean medical aesthetic mood, elegant white and soft blue laboratory surface, abstract beauty device silhouette, glass vials, refined wellness technology, realistic product photography style, no text, no logo, horizontal composition, high-end skincare clinic lighting.
```

Expected: A real bitmap image, not SVG, with no readable text and a bright clinical premium mood.

- [ ] **Step 2: Generate the device category bitmap asset**

Create `assets/img/device-showcase.png` with this prompt:

```text
Premium beauty device and massage care product category image, clean white background, soft blue accents, modern handheld aesthetic device silhouette, subtle metallic details, clinical skincare equipment mood, realistic product photography style, no text, no logo, horizontal card composition.
```

Expected: A real bitmap image suitable for the Device product card.

- [ ] **Step 3: Generate the salt care bitmap asset**

Create `assets/img/salt-care.png` with this prompt:

```text
Premium salt-based wellness care product category image, clean white ceramic bowl with refined mineral salt crystals, soft blue and silver clinical beauty mood, gentle spa healthcare atmosphere, realistic product photography style, no text, no logo, horizontal card composition.
```

Expected: A real bitmap image suitable for the Salt Care product card.

- [ ] **Step 4: Confirm assets exist**

Run:

```bash
dir assets\img
```

Expected: `nexgencure-hero.png`, `device-showcase.png`, and `salt-care.png` are listed.

- [ ] **Step 5: Commit visual assets**

Run:

```bash
git add assets/img/nexgencure-hero.png assets/img/device-showcase.png assets/img/salt-care.png
git commit -m "feat: add NexGenCure visual assets"
```

---

### Task 4: Responsive Styling

**Files:**
- Create: `assets/css/styles.css`

- [ ] **Step 1: Add a CSS presence test**

Modify `tests/site-content.test.mjs` by appending:

```js
const css = await readFile(new URL('../assets/css/styles.css', import.meta.url), 'utf8').catch(() => '');

test('stylesheet defines responsive navigation and product layout', () => {
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.product-grid/);
  assert.match(css, /\.hero-media img/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because `assets/css/styles.css` does not exist yet.

- [ ] **Step 3: Create the stylesheet**

Create `assets/css/styles.css`:

```css
:root {
  --ink: #101828;
  --muted: #667085;
  --line: #e4e7ec;
  --soft: #f5f9fc;
  --blue: #2563eb;
  --blue-dark: #1d4ed8;
  --silver: #eef2f6;
  --white: #ffffff;
  --shadow: 0 18px 50px rgba(16, 24, 40, 0.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Segoe UI", sans-serif;
  color: var(--ink);
  background: var(--white);
  line-height: 1.65;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 5vw;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(228, 231, 236, 0.9);
  backdrop-filter: blur(16px);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 0;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: var(--white);
  background: var(--blue);
}
.site-nav {
  display: flex;
  align-items: center;
  gap: 26px;
  font-size: 14px;
  color: #344054;
}
.site-nav a:hover { color: var(--blue); }
.nav-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--white);
}
.nav-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 4px auto;
  background: var(--ink);
}

.section-band {
  padding: 92px 5vw;
}
.hero {
  min-height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.86fr);
  gap: 5vw;
  align-items: center;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 72%);
}
.hero h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(42px, 6vw, 78px);
  line-height: 1.05;
  letter-spacing: 0;
}
.eyebrow {
  margin: 0 0 12px;
  color: var(--blue);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}
.hero-lead {
  max-width: 650px;
  margin: 22px 0 30px;
  color: var(--muted);
  font-size: 18px;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid var(--line);
  font-weight: 800;
}
.button.primary {
  color: var(--white);
  background: var(--blue);
  border-color: var(--blue);
}
.button.primary:hover { background: var(--blue-dark); }
.button.secondary {
  background: var(--white);
  color: #344054;
}
.hero-media {
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
  background: var(--silver);
}
.hero-media img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.section-heading {
  max-width: 820px;
  margin: 0 0 34px;
}
.section-heading h2 {
  margin: 0;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.16;
  letter-spacing: 0;
}
.section-heading p:not(.eyebrow) {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 17px;
}
.company, .products { background: var(--soft); }
.info-grid, .document-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.info-grid article, .document-grid article, .feature-list div, .contact-card {
  padding: 26px;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.04);
}
.info-grid span {
  color: var(--blue);
  font-weight: 900;
}
h3 { margin: 8px 0 10px; font-size: 21px; line-height: 1.25; }
p { margin: 0; }
.feature-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  max-width: 980px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}
.product-card {
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
}
.product-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--silver);
}
.product-card div { padding: 24px; }
.product-card ul {
  margin: 18px 0 0;
  padding-left: 20px;
  color: var(--muted);
}
.contact-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 22px;
  align-items: start;
}
.muted { color: var(--muted); margin-top: 14px; }
.contact-form {
  display: grid;
  gap: 14px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--white);
  box-shadow: var(--shadow);
}
.contact-form label {
  display: grid;
  gap: 7px;
  color: #344054;
  font-weight: 800;
}
.contact-form input, .contact-form select, .contact-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px 13px;
  font: inherit;
  color: var(--ink);
  background: var(--white);
}
.contact-form textarea { resize: vertical; }
.consent {
  display: flex !important;
  grid-template-columns: none !important;
  align-items: center;
  gap: 10px !important;
  font-weight: 700 !important;
}
.consent input { width: 18px; height: 18px; }
.form-message {
  min-height: 24px;
  color: var(--blue-dark);
  font-weight: 800;
}
.form-message.error { color: #b42318; }
.site-footer {
  padding: 28px 5vw;
  color: var(--muted);
  border-top: 1px solid var(--line);
}

@media (max-width: 920px) {
  .hero, .contact-layout, .product-grid {
    grid-template-columns: 1fr;
  }
  .hero {
    padding-top: 62px;
  }
  .hero-media img {
    aspect-ratio: 16 / 10;
  }
  .info-grid, .document-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .site-header {
    min-height: 64px;
  }
  .nav-toggle {
    display: block;
  }
  .site-nav {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 10px 5vw 18px;
    background: var(--white);
    border-bottom: 1px solid var(--line);
  }
  .site-nav.is-open {
    display: flex;
  }
  .site-nav a {
    padding: 13px 0;
  }
  .section-band {
    padding: 68px 5vw;
  }
  .hero h1 {
    font-size: 42px;
  }
  .hero-lead {
    font-size: 16px;
  }
  .button {
    width: 100%;
  }
}
```

- [ ] **Step 4: Run tests to verify CSS passes**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit responsive styling**

Run:

```bash
git add assets/css/styles.css tests/site-content.test.mjs
git commit -m "feat: style NexGenCure homepage"
```

---

### Task 5: Interactions And Form Validation

**Files:**
- Create: `assets/js/site.js`

- [ ] **Step 1: Add JavaScript behavior test**

Modify `tests/site-content.test.mjs` by appending:

```js
const js = await readFile(new URL('../assets/js/site.js', import.meta.url), 'utf8').catch(() => '');

test('javascript implements navigation and non-sending form validation', () => {
  assert.match(js, /data-nav-toggle/);
  assert.match(js, /data-contact-form/);
  assert.match(js, /preventDefault/);
  assert.match(js, /실제 전송 기능은 공개용 이메일 확정 후 연결됩니다/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL because `assets/js/site.js` does not exist yet.

- [ ] **Step 3: Create interaction script**

Create `assets/js/site.js`:

```js
(function () {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const message = document.querySelector('[data-form-message]');
  const form = document.querySelector('[data-contact-form]');
  const year = document.querySelector('[data-year]');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }

  if (form && message) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      message.classList.remove('error');

      const formData = new FormData(form);
      const requiredValues = ['name', 'phone', 'email', 'type', 'message'];
      const missing = requiredValues.some((key) => !String(formData.get(key) || '').trim());
      const privacy = formData.get('privacy') === 'on';
      const email = String(formData.get('email') || '').trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (missing) {
        message.textContent = '필수 항목을 모두 입력해주세요.';
        message.classList.add('error');
        return;
      }

      if (!emailValid) {
        message.textContent = '이메일 형식을 확인해주세요.';
        message.classList.add('error');
        return;
      }

      if (!privacy) {
        message.textContent = '개인정보 수집 및 이용 동의가 필요합니다.';
        message.classList.add('error');
        return;
      }

      message.textContent = '문의 내용이 확인되었습니다. 실제 전송 기능은 공개용 이메일 확정 후 연결됩니다.';
      form.reset();
    });
  }
})();
```

- [ ] **Step 4: Run tests to verify JavaScript passes**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit interactions**

Run:

```bash
git add assets/js/site.js tests/site-content.test.mjs
git commit -m "feat: add homepage interactions"
```

---

### Task 6: Static Verification Script

**Files:**
- Create: `scripts/verify-site.mjs`

- [ ] **Step 1: Create verification script**

Create `scripts/verify-site.mjs`:

```js
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
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run verify
```

Expected:

```text
PASS from node --test
Static verification passed.
Open <absolute path to index.html> in a browser for visual QA.
```

- [ ] **Step 3: Commit verification script**

Run:

```bash
git add scripts/verify-site.mjs
git commit -m "test: add static homepage verification"
```

---

### Task 7: Browser QA And Final Polish

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `assets/css/styles.css`
- Modify if needed: `assets/js/site.js`

- [ ] **Step 1: Open the homepage in the browser**

Open `index.html` directly in the browser or serve the folder with:

```bash
python -m http.server 4173
```

Expected: The site is available at `http://localhost:4173`.

- [ ] **Step 2: Desktop visual QA**

Check at a desktop width around 1440px:

- Hero image is visible and not blank.
- H1 is visible in the first viewport.
- Header navigation does not overlap the brand.
- Product cards show only Device and Salt Care.
- Contact section shows the approved address.

- [ ] **Step 3: Mobile visual QA**

Check at a mobile width around 390px:

- Header brand fits on one line.
- Menu button opens and closes the navigation.
- Hero text does not overlap the image.
- Buttons stack cleanly.
- Contact form fields fit within the viewport.

- [ ] **Step 4: Form validation QA**

In the browser:

- Submit an empty form.
- Expected message: `필수 항목을 모두 입력해주세요.`
- Fill an invalid email.
- Expected message: `이메일 형식을 확인해주세요.`
- Fill all fields without privacy consent.
- Expected message: `개인정보 수집 및 이용 동의가 필요합니다.`
- Fill all fields with consent.
- Expected message: `문의 내용이 확인되었습니다. 실제 전송 기능은 공개용 이메일 확정 후 연결됩니다.`

- [ ] **Step 5: Run final verification**

Run:

```bash
npm test
npm run verify
git status --short
```

Expected: tests pass, static verification passes, and only intentional final polish files are modified.

- [ ] **Step 6: Commit final polish**

If QA required changes, run:

```bash
git add index.html assets/css/styles.css assets/js/site.js
git commit -m "fix: polish NexGenCure homepage QA issues"
```

If QA required no changes, do not create an empty commit.

---

## Self-Review

- Spec coverage: The plan covers Hero, Company, Technology, Products, Certification, Contact, selected products only, no ecommerce UI, responsive behavior, contact validation, and browser QA.
- Placeholder scan: The plan contains no empty markers or vague implementation instructions. Public phone and email are intentionally not invented; the implemented copy states they will be reflected after confirmation.
- Type consistency: Section IDs match the tests and navigation links: `company`, `technology`, `products`, `certification`, `contact`. JavaScript selectors match the HTML attributes: `data-nav`, `data-nav-toggle`, `data-contact-form`, `data-form-message`, `data-year`.
