// Manual a11y heuristic checks across all routes.
// Inspects DOM via Playwright (not axe) to verify:
//   - Skip-to-content link present + targets #main / a real <main>
//   - <main>, <nav>, <footer>, <header> landmarks present
//   - h1 unique per page; no skipped heading levels
//   - Every <img> has an alt attribute (empty alt allowed for decorative)
//   - Every focusable element has a visible :focus-visible outline (sampled)
//   - TAB order: count focusable controls and verify first stop is the skip-link
//
// Output: playwright/a11y-dark-manual-results.json

import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.A11Y_PORT || '5082';
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/', '/about', '/research', '/programs', '/projects',
  '/projects/vigia', '/projects/ai-safety-connect',
  '/team', '/activities', '/get-involved', '/contact',
  '/global-south-challenge',
];

async function checkRoute(page, route) {
  const url = `${BASE}${route}`;
  const out = { route, url, issues: [], info: {} };
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(400);

  // ---- Landmarks
  const landmarks = await page.evaluate(() => {
    const get = (sel) => Array.from(document.querySelectorAll(sel));
    return {
      header: get('header').length,
      nav: get('nav').length,
      main: get('main').length,
      footer: get('footer').length,
      skipLink:
        Array.from(document.querySelectorAll('a')).filter((a) => {
          const href = a.getAttribute('href') || '';
          const t = (a.textContent || '').toLowerCase();
          return href.startsWith('#') && /salt|skip|contenido|content/i.test(t);
        }).map((a) => ({
          href: a.getAttribute('href'),
          text: (a.textContent || '').trim(),
          firstFocusable: a === document.querySelector(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        }))[0] || null,
      mainId: document.querySelector('main') ? document.querySelector('main').id : null,
    };
  });
  out.info.landmarks = landmarks;
  if (landmarks.main !== 1) out.issues.push({ rule: 'landmark.main', severity: 'serious', detail: `expected 1 <main>, found ${landmarks.main}` });
  if (landmarks.nav < 1) out.issues.push({ rule: 'landmark.nav', severity: 'moderate', detail: 'no <nav> on page' });
  if (landmarks.footer !== 1) out.issues.push({ rule: 'landmark.footer', severity: 'moderate', detail: `expected 1 <footer>, found ${landmarks.footer}` });
  if (landmarks.header < 1) out.issues.push({ rule: 'landmark.header', severity: 'moderate', detail: 'no <header> on page' });
  if (!landmarks.skipLink) {
    out.issues.push({ rule: 'skip-link.present', severity: 'serious', detail: 'no skip-to-content link found' });
  } else {
    if (!landmarks.skipLink.firstFocusable) {
      out.issues.push({ rule: 'skip-link.first', severity: 'moderate', detail: 'skip link is not the first focusable element' });
    }
    const targetId = landmarks.skipLink.href.replace(/^#/, '');
    if (targetId && targetId !== landmarks.mainId) {
      // Skip link could target another container; flag if no element exists.
      const exists = await page.$(`#${CSS.escape ? CSS.escape(targetId) : targetId}`).catch(() => null);
      if (!exists) out.issues.push({ rule: 'skip-link.target', severity: 'serious', detail: `skip link target #${targetId} not found in DOM` });
    }
  }

  // ---- Headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => ({
      level: parseInt(h.tagName.slice(1), 10),
      text: (h.textContent || '').trim().slice(0, 80),
    }));
  });
  out.info.headings = headings;
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) out.issues.push({ rule: 'heading.h1-unique', severity: 'serious', detail: `expected 1 h1, found ${h1s.length}` });
  // Detect level skips (e.g. h2 -> h4)
  let prev = null;
  for (const h of headings) {
    if (prev !== null && h.level > prev + 1) {
      out.issues.push({ rule: 'heading.no-skip', severity: 'moderate', detail: `heading jumps from h${prev} to h${h.level}: "${h.text}"` });
    }
    prev = h.level;
  }

  // ---- Images: alt attribute presence
  const imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map((i) => ({
      src: i.getAttribute('src') || '',
      hasAlt: i.hasAttribute('alt'),
      alt: i.getAttribute('alt'),
      role: i.getAttribute('role'),
      ariaHidden: i.getAttribute('aria-hidden'),
    }));
  });
  out.info.imgCount = imgs.length;
  const missingAlt = imgs.filter((i) => !i.hasAlt && i.role !== 'presentation' && i.ariaHidden !== 'true');
  if (missingAlt.length) {
    out.issues.push({
      rule: 'img.alt',
      severity: 'serious',
      detail: `${missingAlt.length} <img> missing alt`,
      samples: missingAlt.slice(0, 3),
    });
  }

  // ---- Focus visible (sample-check on first 10 focusables)
  const focusable = await page.$$eval(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    (els) => els.length,
  );
  out.info.focusableCount = focusable;

  const sample = Math.min(8, focusable);
  let withVisibleFocus = 0;
  for (let i = 0; i < sample; i++) {
    await page.keyboard.press('Tab');
    const visible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const ring = (cs.boxShadow || '').includes('rgb');
      const borderChange = parseFloat(cs.borderWidth) > 0;
      return { tag: el.tagName, outline, ring, borderChange };
    });
    if (visible && (visible.outline || visible.ring)) withVisibleFocus++;
  }
  out.info.focusSample = { sample, withVisibleFocus };
  if (sample > 0 && withVisibleFocus / sample < 0.6) {
    out.issues.push({
      rule: 'focus.visible',
      severity: 'serious',
      detail: `only ${withVisibleFocus}/${sample} sampled focusables show a visible focus ring`,
    });
  }
  // Reset focus
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());

  // ---- Lang attribute
  const lang = await page.evaluate(() => document.documentElement.lang || null);
  out.info.lang = lang;
  if (!lang) out.issues.push({ rule: 'html.lang', severity: 'serious', detail: '<html> missing lang attribute' });

  // ---- Page title
  const title = await page.title();
  out.info.title = title;
  if (!title || title.trim().length < 4) out.issues.push({ rule: 'title.present', severity: 'serious', detail: 'page title missing or too short' });

  return out;
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const all = [];
  for (const route of ROUTES) {
    process.stdout.write(`manual ${route}... `);
    try {
      const r = await checkRoute(page, route);
      console.log(`issues=${r.issues.length}`);
      all.push(r);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      all.push({ route, error: String(err) });
    }
  }
  await browser.close();

  const summary = {
    base: BASE,
    timestamp: new Date().toISOString(),
    routeCount: ROUTES.length,
    totals: {
      issues: all.reduce((a, r) => a + (r.issues ? r.issues.length : 0), 0),
      serious: all.reduce(
        (a, r) => a + (r.issues || []).filter((i) => i.severity === 'serious').length,
        0,
      ),
      moderate: all.reduce(
        (a, r) => a + (r.issues || []).filter((i) => i.severity === 'moderate').length,
        0,
      ),
    },
    results: all,
  };

  const outFile = resolve(__dirname, 'a11y-dark-manual-results.json');
  await writeFile(outFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\nWrote ${outFile}`);
  console.log(`TOTAL manual issues: ${summary.totals.issues} (ser=${summary.totals.serious} mod=${summary.totals.moderate})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
