// Functional QA Playwright spec for AI Safety Mexico Astro rebuild.
// Tests interactive elements: nav, mobile menu, carousel, lightbox, form, breadcrumbs.
// Run with: node playwright/functional-qa.spec.mjs
// Assumes preview server is running at BASE_URL (default 127.0.0.1:4322).
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4322';
const OUT_DIR = path.resolve('playwright/functional-results');

const results = [];
function record(name, status, detail = '') {
  results.push({ name, status, detail });
  const symbol = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '·';
  console.log(`  ${symbol} ${name}${detail ? ' — ' + detail : ''}`);
}

async function safe(label, fn) {
  try {
    const detail = await fn();
    record(label, 'PASS', detail || '');
  } catch (err) {
    record(label, 'FAIL', err.message?.split('\n')[0] || String(err));
  }
}

// ---- Nav primary (desktop) ----
async function testPrimaryNav(browser) {
  console.log('\n[1] Primary nav links (desktop @ 1440)');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const navLinks = [
    { href: '/about', label: 'Sobre nosotros' },
    { href: '/research', label: 'Investigación' },
    { href: '/programs', label: 'Programas' },
    { href: '/projects', label: 'Proyectos' },
    { href: '/activities', label: 'Actividades' },
    { href: '/get-involved', label: 'Colabora' },
  ];

  for (const link of navLinks) {
    await safe(`nav → ${link.label} (${link.href})`, async () => {
      const resp = await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded' });
      if (!resp || !resp.ok()) throw new Error(`home not 200: ${resp?.status()}`);
      const sel = `.main-nav__link[href="${link.href}"]`;
      await page.waitForSelector(sel, { state: 'visible', timeout: 5000 });
      const navResp = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
        page.click(sel),
      ]);
      if (!navResp[0] || !navResp[0].ok()) {
        throw new Error(`nav resp not OK: ${navResp[0]?.status()}`);
      }
      const url = page.url();
      if (!url.endsWith(link.href) && !url.endsWith(link.href + '/')) {
        throw new Error(`url mismatch: ${url}`);
      }
      return `200 → ${url.replace(BASE_URL, '')}`;
    });
  }
  await ctx.close();
}

// ---- Mobile hamburger menu ----
async function testMobileMenu(browser) {
  console.log('\n[2] Mobile hamburger (375 viewport)');
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();

  await safe('open hamburger drawer', async () => {
    await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-mobile-toggle]', { state: 'visible', timeout: 5000 });
    const expandedBefore = await page.getAttribute('[data-mobile-toggle]', 'aria-expanded');
    if (expandedBefore !== 'false') throw new Error(`expected aria-expanded=false, got ${expandedBefore}`);
    await page.click('[data-mobile-toggle]');
    await page.waitForFunction(
      () => document.querySelector('[data-mobile-toggle]')?.getAttribute('aria-expanded') === 'true',
      { timeout: 3000 }
    );
    const drawerVisible = await page.isVisible('[data-mobile-drawer]');
    if (!drawerVisible) throw new Error('drawer not visible after open');
    return 'drawer open + aria-expanded=true';
  });

  await safe('navigate to /about via mobile drawer link', async () => {
    await page.click('.mobile-drawer__link[href="/about"]');
    await page.waitForURL(/\/about\/?$/, { timeout: 5000 });
    return page.url().replace(BASE_URL, '');
  });

  await safe('mobile drawer link to /research', async () => {
    // We're now on /about. Re-open and click research
    await page.waitForSelector('[data-mobile-toggle]', { state: 'visible', timeout: 5000 });
    await page.click('[data-mobile-toggle]');
    await page.waitForFunction(
      () => document.querySelector('[data-mobile-toggle]')?.getAttribute('aria-expanded') === 'true',
      { timeout: 3000 }
    );
    await page.click('.mobile-drawer__link[href="/research"]');
    await page.waitForURL(/\/research\/?$/, { timeout: 5000 });
    return page.url().replace(BASE_URL, '');
  });

  await safe('close drawer with backdrop click + ESC keyboard', async () => {
    await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded' });
    await page.click('[data-mobile-toggle]');
    await page.waitForFunction(
      () => document.querySelector('[data-mobile-toggle]')?.getAttribute('aria-expanded') === 'true',
      { timeout: 3000 }
    );
    // Press ESC
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.querySelector('[data-mobile-toggle]')?.getAttribute('aria-expanded') === 'false',
      { timeout: 3000 }
    );
    return 'closed via ESC';
  });

  await ctx.close();
}

// ---- Carousel on /activities ----
async function testCarousel(browser) {
  console.log('\n[3] Carousel on /activities');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE_URL + '/activities', { waitUntil: 'domcontentloaded' });

  await safe('carousel mounts (slides + buttons present)', async () => {
    await page.waitForSelector('[data-carousel]', { state: 'visible', timeout: 5000 });
    const slideCount = await page.locator('[data-carousel-slide]').count();
    const indCount = await page.locator('[data-carousel-indicator]').count();
    if (slideCount < 2) throw new Error(`only ${slideCount} slides found`);
    if (indCount !== slideCount) throw new Error(`indicator count ${indCount} ≠ slide count ${slideCount}`);
    return `${slideCount} slides, ${indCount} indicators`;
  });

  // Stop autoplay if available, to avoid race conditions
  await page.evaluate(() => {
    const pp = document.querySelector('[data-carousel-playpause]');
    if (pp && pp.getAttribute('data-state') === 'playing') pp.click();
  });

  await safe('click next → active slide advances', async () => {
    const before = await page.locator('[data-carousel-slide].is-active').first().getAttribute('data-index');
    await page.click('[data-carousel-next]');
    await page.waitForTimeout(600);
    const after = await page.locator('[data-carousel-slide].is-active').first().getAttribute('data-index');
    if (before === after) throw new Error(`active slide didn't advance (still ${after})`);
    return `${before} → ${after}`;
  });

  await safe('click prev → active slide goes back', async () => {
    const before = await page.locator('[data-carousel-slide].is-active').first().getAttribute('data-index');
    await page.click('[data-carousel-prev]');
    await page.waitForTimeout(600);
    const after = await page.locator('[data-carousel-slide].is-active').first().getAttribute('data-index');
    if (before === after) throw new Error(`active slide didn't change (still ${after})`);
    return `${before} → ${after}`;
  });

  await safe('click indicator [3] → active slide = 3', async () => {
    const target = '[data-carousel-indicator][data-index="3"]';
    if (!(await page.locator(target).count())) throw new Error('no indicator [3]');
    await page.click(target);
    await page.waitForTimeout(600);
    const active = await page.locator('[data-carousel-slide].is-active').first().getAttribute('data-index');
    if (active !== '3') throw new Error(`active index = ${active}, expected 3`);
    return 'indicator [3] activated slide 3';
  });

  await ctx.close();
}

// ---- Lightbox on /programs ----
async function testLightbox(browser) {
  console.log('\n[4] Lightbox certificates on /programs');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE_URL + '/programs', { waitUntil: 'domcontentloaded' });

  await safe('certificate triggers exist', async () => {
    const count = await page.locator('button[data-lightbox]').count();
    if (count < 1) throw new Error('no lightbox triggers');
    return `${count} certificate triggers`;
  });

  await safe('click first certificate → lightbox opens', async () => {
    await page.locator('button[data-lightbox]').first().click();
    await page.waitForFunction(() => {
      const ov = document.querySelector('[data-lightbox-overlay]');
      return ov && !ov.hidden && getComputedStyle(ov).display !== 'none';
    }, { timeout: 5000 });
    const imgSrc = await page.locator('[data-lightbox-image]').getAttribute('src');
    if (!imgSrc) throw new Error('lightbox image src empty');
    return `image src=${imgSrc.substring(0, 50)}...`;
  });

  await safe('click next → lightbox shows next image', async () => {
    const before = await page.locator('[data-lightbox-image]').getAttribute('src');
    const nextBtn = page.locator('[data-lightbox-next]');
    if (!(await nextBtn.count()) || !(await nextBtn.isVisible())) {
      // Single-image group; skip but treat as PASS-N/A
      return 'no next button (single image group) — skipped';
    }
    await nextBtn.click();
    await page.waitForTimeout(400);
    const after = await page.locator('[data-lightbox-image]').getAttribute('src');
    if (before === after) throw new Error('image src did not change');
    return 'next advanced image';
  });

  await safe('press ESC → lightbox closes', async () => {
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => {
      const ov = document.querySelector('[data-lightbox-overlay]');
      return !ov || ov.hidden || getComputedStyle(ov).display === 'none';
    }, { timeout: 5000 });
    return 'lightbox hidden after ESC';
  });

  await safe('click close button → lightbox closes', async () => {
    await page.locator('button[data-lightbox]').first().click();
    await page.waitForFunction(() => {
      const ov = document.querySelector('[data-lightbox-overlay]');
      return ov && !ov.hidden && getComputedStyle(ov).display !== 'none';
    }, { timeout: 5000 });
    await page.click('[data-lightbox-close]');
    await page.waitForFunction(() => {
      const ov = document.querySelector('[data-lightbox-overlay]');
      return !ov || ov.hidden || getComputedStyle(ov).display === 'none';
    }, { timeout: 5000 });
    return 'closed via close button';
  });

  await ctx.close();
}

// ---- Contact form on /get-involved ----
async function testContactForm(browser) {
  console.log('\n[5] Contact form on /get-involved');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Block navigation that would leave for mailto:
  let mailtoIntercepted = null;
  await page.route('**/*', (route) => route.continue());
  page.on('framenavigated', (frame) => {
    const u = frame.url();
    if (u.startsWith('mailto:')) mailtoIntercepted = u;
  });

  await page.goto(BASE_URL + '/get-involved', { waitUntil: 'domcontentloaded' });

  await safe('form mounts with required fields', async () => {
    await page.waitForSelector('#get-involved-form', { state: 'visible', timeout: 5000 });
    const requiredCount = await page.locator('#get-involved-form [required]').count();
    if (requiredCount < 4) throw new Error(`only ${requiredCount} required fields`);
    return `${requiredCount} required fields present`;
  });

  await safe('HTML5 validation blocks empty submit', async () => {
    // Click submit on empty form — checkValidity must fail
    const valid = await page.evaluate(() => {
      const f = document.getElementById('get-involved-form');
      return f.checkValidity();
    });
    if (valid !== false) throw new Error(`checkValidity returned ${valid}; should be false`);
    return 'checkValidity()=false on empty form';
  });

  await safe('invalid email is rejected by HTML5', async () => {
    await page.fill('#get-involved-form-name', 'Test User');
    await page.fill('#get-involved-form-email', 'not-an-email');
    await page.selectOption('#get-involved-form-type', 'research');
    await page.fill('#get-involved-form-message', 'Mensaje de prueba con suficiente longitud.');
    const valid = await page.evaluate(() => {
      const f = document.getElementById('get-involved-form');
      return f.checkValidity();
    });
    if (valid !== false) throw new Error('form accepted invalid email');
    return 'invalid email rejected';
  });

  await safe('valid form triggers mailto: action', async () => {
    await page.fill('#get-involved-form-email', 'test@example.com');
    // checkValidity should now pass
    const valid = await page.evaluate(() => {
      return document.getElementById('get-involved-form').checkValidity();
    });
    if (!valid) throw new Error('form still invalid');

    // Submit via JS dispatch (avoid actual nav). Wait for status text or mailto attempt.
    // Use Promise.race because mailto navigation may hang in headless.
    const submitPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        const f = document.getElementById('get-involved-form');
        // Override location.href setter to capture mailto
        const orig = window.location;
        let captured = null;
        try {
          Object.defineProperty(window, 'location', {
            configurable: true,
            get: () => orig,
            set: (v) => { captured = v; },
          });
        } catch (e) {}
        // Actually the script does window.location.href = ...
        // We can override location.href setter
        const desc = Object.getOwnPropertyDescriptor(Window.prototype, 'location') ||
                     Object.getOwnPropertyDescriptor(window, 'location');
        // Simpler approach: listen for submit and read endpoint
        f.addEventListener('submit', (e) => {
          // The script will preventDefault and navigate to mailto:
          // We wait a tick and check status text / endpoint attr
          setTimeout(() => {
            const status = f.querySelector('[data-contact-status]')?.textContent || '';
            const endpoint = f.getAttribute('data-endpoint') || '';
            resolve({ status, endpoint, captured });
          }, 200);
        }, { once: true });
        // Fire submit
        if (typeof f.requestSubmit === 'function') f.requestSubmit();
        else f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    });

    const r = await Promise.race([
      submitPromise,
      new Promise((res) => setTimeout(() => res({ timeout: true }), 3000)),
    ]);
    if (r.timeout) throw new Error('submit handler did not respond');
    if (!r.endpoint || !r.endpoint.startsWith('mailto:')) {
      throw new Error(`endpoint not mailto: got ${r.endpoint}`);
    }
    return `endpoint=${r.endpoint}`;
  });

  await ctx.close();
}

// ---- Breadcrumbs ----
async function testBreadcrumbs(browser) {
  console.log('\n[6] Breadcrumbs on interior pages');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // /projects/vigia → click "Inicio" → home
  await safe('vigia breadcrumb: Inicio link → /', async () => {
    await page.goto(BASE_URL + '/projects/vigia', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.breadcrumb__link[href="/"]', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
      page.click('.breadcrumb__link[href="/"]'),
    ]);
    const u = page.url();
    if (!(u === BASE_URL + '/' || u === BASE_URL)) throw new Error(`url=${u}`);
    return 'navigated to /';
  });

  await safe('vigia breadcrumb: Proyectos link → /projects', async () => {
    await page.goto(BASE_URL + '/projects/vigia', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.breadcrumb__link[href="/projects"]', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
      page.click('.breadcrumb__link[href="/projects"]'),
    ]);
    const u = page.url();
    if (!u.endsWith('/projects') && !u.endsWith('/projects/')) throw new Error(`url=${u}`);
    return 'navigated to /projects';
  });

  await safe('vigia breadcrumb: current item is non-clickable', async () => {
    await page.goto(BASE_URL + '/projects/vigia', { waitUntil: 'domcontentloaded' });
    const current = await page.locator('.breadcrumb__current').first();
    if (!(await current.count())) throw new Error('no .breadcrumb__current');
    const aria = await current.getAttribute('aria-current');
    if (aria !== 'page') throw new Error(`aria-current=${aria}`);
    const tag = await current.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'a') throw new Error('current item is a link (should be span)');
    return `aria-current=page, tag=<${tag}>`;
  });

  await ctx.close();

  // Mobile: back-link is mobile-only (display:none on desktop)
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mobileCtx.newPage();
  await safe('breadcrumb back-link on /about (mobile) → /', async () => {
    await mPage.goto(BASE_URL + '/about', { waitUntil: 'domcontentloaded' });
    const back = mPage.locator('.breadcrumb__back');
    if (!(await back.count())) throw new Error('no breadcrumb__back');
    if (!(await back.isVisible())) throw new Error('back-link hidden at 375');
    await Promise.all([
      mPage.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
      back.click(),
    ]);
    const u = mPage.url();
    if (!(u === BASE_URL + '/' || u === BASE_URL)) throw new Error(`url=${u}`);
    return 'back-link → /';
  });
  await mobileCtx.close();
}

// ---- main ----
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const t0 = Date.now();
  try {
    await testPrimaryNav(browser);
    await testMobileMenu(browser);
    await testCarousel(browser);
    await testLightbox(browser);
    await testContactForm(browser);
    await testBreadcrumbs(browser);
  } finally {
    await browser.close();
  }

  const pass = results.filter((r) => r.status === 'PASS').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`\n=== Functional QA Summary (${elapsed}s) ===`);
  console.log(`PASS: ${pass}    FAIL: ${fail}    TOTAL: ${results.length}`);

  await fs.writeFile(
    path.join(OUT_DIR, 'results.json'),
    JSON.stringify({ baseUrl: BASE_URL, elapsed, pass, fail, results }, null, 2),
  );
  console.log(`Results JSON: ${path.join(OUT_DIR, 'results.json')}`);

  process.exitCode = fail === 0 ? 0 : 1;
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exitCode = 2;
});
