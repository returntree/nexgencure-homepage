# Home Hero Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current static homepage hero with a large visual slider inspired by the referenced premium skincare homepage, adapted for NexGenCure.

**Architecture:** Keep the site as static HTML/CSS/JS. `index.html` owns the slide content, `assets/css/styles.css` owns the full-width visual treatment and responsive layout, and `assets/js/site.js` owns lightweight slider behavior using data attributes.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node test runner.

---

### Task 1: Lock Slider Requirements With A Failing Test

**Files:**
- Modify: `tests/site-content.test.mjs`

- [ ] **Step 1: Write the failing test**

Add a test that requires a homepage hero slider with three slides, product visuals, controls, and JavaScript initialization:

```js
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
  assert.match(css, /\.slide-visual/);
  assert.match(js, /data-hero-slider/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/*.test.mjs`

Expected: FAIL because the current homepage uses a static `.home-hero` and the slider attributes/classes do not exist.

### Task 2: Implement The Homepage Slider

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`
- Modify: `assets/js/site.js`

- [ ] **Step 1: Replace static hero markup**

Change the existing homepage hero to:

```html
<section class="home-hero hero-slider" data-hero-slider aria-label="넥스젠큐어 메인 비주얼">
  <article class="hero-slide is-active" data-hero-slide data-slide-index="0">...</article>
  <article class="hero-slide" data-hero-slide data-slide-index="1">...</article>
  <article class="hero-slide" data-hero-slide data-slide-index="2">...</article>
  <div class="slider-controls">...</div>
</section>
```

Use slide 1 for the NexGenCure brand, slide 2 for BS407, and slide 3 for MYONGMUNHWAN/명문염.

- [ ] **Step 2: Add slider visual CSS**

Add CSS for `.hero-slider`, `.hero-slide`, `.slide-content`, `.slide-visual`, `.slide-product`, `.slider-controls`, and mobile behavior. The slider must use strong blue/clinical visuals without copying the reference site assets.

- [ ] **Step 3: Add slider JavaScript**

In `site.js`, initialize `[data-hero-slider]`, switch active slides on previous/next buttons and dots, update `aria-current`, and auto-advance on a timer.

### Task 3: Verify And Commit

**Files:**
- Test: `tests/site-content.test.mjs`
- Test: `scripts/verify-site.mjs`

- [ ] **Step 1: Run automated checks**

Run:

```powershell
node --test tests/*.test.mjs
node scripts/verify-site.mjs
```

Expected: all tests pass and static verification passes.

- [ ] **Step 2: Browser QA**

Open `http://127.0.0.1:4173/index.html` and verify:
- desktop hero shows a large slider with a visual-led first screen
- next/previous buttons change slides
- mobile has no horizontal overflow
- product images load

- [ ] **Step 3: Commit**

```powershell
git add index.html assets/css/styles.css assets/js/site.js tests/site-content.test.mjs docs/superpowers/plans/2026-05-13-home-hero-slider.md
git commit -m "Add homepage visual hero slider"
```
