/**
 * i18n link & switcher validator (Task #10).
 *
 * Verifies:
 *   1. On every /en/* route, all in-site `<a href="/...">` either point to
 *      /en/* (cross-locale) or to allow-listed shared assets (e.g. /images,
 *      /Papers, /favicon.svg). No silent cross-locale leaks.
 *   2. LanguageSwitcher round-trips for /about, /research, /projects/vigia,
 *      /en/about, /en/projects/vigia, /, /en.
 *   3. After clicking the EN option, localStorage.aismx_locale === 'en'
 *      (and 'es' going the other way).
 *   4. Browser detection: navigator.language = 'en-US' on `/` redirects to
 *      `/en`; navigator.language = 'es-MX' stays on `/`.
 *
 * Outputs a markdown report (PASS/FAIL counts) at docs/QA-I18N-LINKS.md.
 *
 * Usage:
 *   node playwright/i18n-links.mjs
 *
 * Preconditions:
 *   - `astro build` already produced ./dist
 *   - http-server (or any static server) is serving ./dist on http://127.0.0.1:5092
 */

import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'http://127.0.0.1:5092';

/**
 * Every /en/* route present in the build (mirrors src/pages/en/).
 * Trailing-slash normalised — the build uses `directory` format so the static
 * server resolves /en/about → /en/about/index.html. We hit the no-slash form,
 * which the static server will 301 to /en/about/.
 */
const EN_ROUTES = [
  '/en',
  '/en/about',
  '/en/research',
  '/en/programs',
  '/en/team',
  '/en/projects',
  '/en/projects/vigia',
  '/en/projects/ai-safety-connect',
  '/en/activities',
  '/en/get-involved',
  '/en/contact',
  '/en/global-south-challenge',
];

const ES_ROUTES_FOR_SWITCHER = [
  '/',
  '/about',
  '/research',
  '/projects/vigia',
];

/** Paths that may appear bare (shared between locales). */
const SHARED_PATH_PREFIXES = [
  '/images/',
  '/Papers/',
  '/favicon',
  '/sitemap',
  '/robots.txt',
  '/CNAME',
  '#', // in-page anchor only
];

const results = {
  enLinksChecked: 0,
  enLinksPass: 0,
  enLinksFail: 0,
  enLinkFailures: [], // { route, href }
  switcherChecked: 0,
  switcherPass: 0,
  switcherFail: 0,
  switcherFailures: [],
  storageChecked: 0,
  storagePass: 0,
  storageFail: 0,
  storageFailures: [],
  detectionChecked: 0,
  detectionPass: 0,
  detectionFail: 0,
  detectionFailures: [],
};

function classifyHref(href) {
  // Strip query / hash for prefix evaluation but keep the original for reporting.
  if (!href) return 'skip';
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return 'skip';
  if (href.startsWith('http://') || href.startsWith('https://')) {
    // Off-site links are fine — they don't have a locale to leak.
    return 'skip';
  }
  if (href.startsWith('#')) return 'skip';

  // At this point href should be a site-relative path.
  if (!href.startsWith('/')) return 'skip';

  for (const prefix of SHARED_PATH_PREFIXES) {
    if (href === prefix || href.startsWith(prefix)) return 'shared';
  }
  return 'site';
}

function isEnglishPath(href) {
  // Drop hash/query for the comparison.
  const clean = href.split('#')[0].split('?')[0];
  return clean === '/en' || clean.startsWith('/en/');
}

async function checkEnLinks(page) {
  for (const route of EN_ROUTES) {
    const url = BASE + route;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // Exclude `.lang-switcher__option` anchors — the inactive-locale option
    // is *intentionally* a cross-locale link (that's the switcher's job).
    // Anything else inside `<main>`, header nav, footer, breadcrumb, CTAs,
    // etc. is in scope.
    const hrefs = await page.$$eval(
      'a[href]:not(.lang-switcher__option)',
      (els) => els.map((el) => el.getAttribute('href')),
    );
    for (const href of hrefs) {
      const kind = classifyHref(href);
      if (kind !== 'site') continue;
      results.enLinksChecked += 1;
      if (isEnglishPath(href)) {
        results.enLinksPass += 1;
      } else {
        results.enLinksFail += 1;
        results.enLinkFailures.push({ route, href });
      }
    }
  }
}

async function checkSwitcher(page) {
  // Pairs: [from, expectedTargetForOtherLocale]
  // The LanguageSwitcher exposes two <a> tags; we click the *other* one each time.
  const pairs = [
    { from: '/about', target: '/en/about' },
    { from: '/research', target: '/en/research' },
    { from: '/projects/vigia', target: '/en/projects/vigia' },
    { from: '/en/about', target: '/about' },
    { from: '/en/projects/vigia', target: '/projects/vigia' },
    { from: '/', target: '/en' },
    { from: '/en', target: '/' },
  ];

  for (const { from, target } of pairs) {
    results.switcherChecked += 1;
    try {
      await page.goto(BASE + from, { waitUntil: 'domcontentloaded' });
      // The "other" switcher anchor is the one whose hreflang differs from active.
      const activeLocale =
        from === '/en' || from.startsWith('/en/') ? 'en' : 'es';
      const otherLocale = activeLocale === 'es' ? 'en' : 'es';
      const sel = `.lang-switcher__option[hreflang="${otherLocale}"]`;
      const actualHref = await page.getAttribute(sel, 'href');
      // Normalise: both /en and /en/ should be considered equivalent for root.
      const norm = (p) =>
        p === '/en/' ? '/en' : p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p;
      if (norm(actualHref) !== norm(target)) {
        results.switcherFail += 1;
        results.switcherFailures.push({
          from,
          expected: target,
          got: actualHref,
        });
        continue;
      }
      // Click and verify navigation.
      await Promise.all([
        page.waitForURL((u) => {
          const path = new URL(u).pathname;
          return norm(path) === norm(target);
        }, { timeout: 5000 }),
        page.click(sel),
      ]);
      results.switcherPass += 1;

      // Storage check happens here while we still have the click side-effect.
      results.storageChecked += 1;
      const storedLocale = await page.evaluate(() =>
        localStorage.getItem('aismx_locale'),
      );
      if (storedLocale === otherLocale) {
        results.storagePass += 1;
      } else {
        results.storageFail += 1;
        results.storageFailures.push({
          from,
          expected: otherLocale,
          got: storedLocale,
        });
      }
      // Wipe localStorage so the next iteration starts clean (detection step
      // also depends on this).
      await page.evaluate(() => localStorage.clear());
    } catch (err) {
      results.switcherFail += 1;
      results.switcherFailures.push({
        from,
        expected: target,
        got: `ERROR: ${err.message}`,
      });
    }
  }
}

async function checkDetection(browser) {
  // Case A: navigator.language en-US on / should redirect to /en.
  {
    results.detectionChecked += 1;
    const ctx = await browser.newContext({ locale: 'en-US' });
    const page = await ctx.newPage();
    // Make sure storage starts clean.
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    // Reload so the inline detection script runs on a clean storage.
    await page.goto(BASE + '/', { waitUntil: 'load' });
    // Detection redirect uses location.replace — give it a tick.
    await page.waitForLoadState('domcontentloaded');
    const finalPath = new URL(page.url()).pathname;
    if (finalPath === '/en' || finalPath === '/en/') {
      results.detectionPass += 1;
    } else {
      results.detectionFail += 1;
      results.detectionFailures.push({
        case: 'navigator.language=en-US visits /',
        expected: '/en',
        got: finalPath,
      });
    }
    await ctx.close();
  }

  // Case B: navigator.language es-MX on / should NOT redirect.
  {
    results.detectionChecked += 1;
    const ctx = await browser.newContext({ locale: 'es-MX' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await page.waitForLoadState('domcontentloaded');
    const finalPath = new URL(page.url()).pathname;
    if (finalPath === '/' || finalPath === '') {
      results.detectionPass += 1;
    } else {
      results.detectionFail += 1;
      results.detectionFailures.push({
        case: 'navigator.language=es-MX visits /',
        expected: '/',
        got: finalPath,
      });
    }
    await ctx.close();
  }

  // Case C: navigator.language fr-FR on / should NOT redirect either.
  {
    results.detectionChecked += 1;
    const ctx = await browser.newContext({ locale: 'fr-FR' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await page.waitForLoadState('domcontentloaded');
    const finalPath = new URL(page.url()).pathname;
    if (finalPath === '/' || finalPath === '') {
      results.detectionPass += 1;
    } else {
      results.detectionFail += 1;
      results.detectionFailures.push({
        case: 'navigator.language=fr-FR visits /',
        expected: '/',
        got: finalPath,
      });
    }
    await ctx.close();
  }
}

function renderReport() {
  const total =
    results.enLinksChecked +
    results.switcherChecked +
    results.storageChecked +
    results.detectionChecked;
  const totalPass =
    results.enLinksPass +
    results.switcherPass +
    results.storagePass +
    results.detectionPass;
  const totalFail =
    results.enLinksFail +
    results.switcherFail +
    results.storageFail +
    results.detectionFail;

  const lines = [];
  lines.push('# i18n Link & Switcher QA (Task #10)');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Preview: ${BASE} (Astro build of \`dist/\`)`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Check | Total | Pass | Fail |');
  lines.push('|---|---:|---:|---:|');
  lines.push(
    `| 1. /en/* internal links point to /en/* | ${results.enLinksChecked} | ${results.enLinksPass} | ${results.enLinksFail} |`,
  );
  lines.push(
    `| 2. LanguageSwitcher round-trip (path preserved) | ${results.switcherChecked} | ${results.switcherPass} | ${results.switcherFail} |`,
  );
  lines.push(
    `| 3. localStorage.aismx_locale set on click | ${results.storageChecked} | ${results.storagePass} | ${results.storageFail} |`,
  );
  lines.push(
    `| 4. navigator.language detection on \`/\` | ${results.detectionChecked} | ${results.detectionPass} | ${results.detectionFail} |`,
  );
  lines.push(`| **Totals** | **${total}** | **${totalPass}** | **${totalFail}** |`);
  lines.push('');
  lines.push(
    totalFail === 0
      ? '**Result: PASS** ✅'
      : `**Result: FAIL** ❌ (${totalFail} failure(s) — see details below)`,
  );
  lines.push('');

  lines.push('## 1. /en/* internal links');
  lines.push('');
  lines.push(
    `Crawled ${EN_ROUTES.length} routes; inspected ${results.enLinksChecked} site-relative anchors (mailto:, tel:, off-site, in-page anchors, and shared assets under /images, /Papers, /favicon, /sitemap, /robots.txt, /CNAME are excluded).`,
  );
  lines.push('');
  if (results.enLinkFailures.length === 0) {
    lines.push('All in-site anchors on `/en/*` routes resolve to `/en/*`. ✅');
  } else {
    lines.push(
      `${results.enLinkFailures.length} cross-locale leak(s) detected — these anchors should point to a \`/en/...\` URL but do not:`,
    );
    lines.push('');
    lines.push('| Route | Offending href |');
    lines.push('|---|---|');
    for (const f of results.enLinkFailures) {
      lines.push(`| \`${f.route}\` | \`${f.href}\` |`);
    }
  }
  lines.push('');

  lines.push('## 2. LanguageSwitcher round-trip');
  lines.push('');
  lines.push(
    'For each `from` path, clicked the inactive locale option in the header switcher and asserted the resulting pathname matches `expected`.',
  );
  lines.push('');
  if (results.switcherFailures.length === 0) {
    lines.push('All round-trips preserved the deep link. ✅');
  } else {
    lines.push('| From | Expected | Got |');
    lines.push('|---|---|---|');
    for (const f of results.switcherFailures) {
      lines.push(`| \`${f.from}\` | \`${f.expected}\` | \`${f.got}\` |`);
    }
    lines.push('');
    lines.push('### Root cause (project subpages)');
    lines.push('');
    lines.push(
      'The four project subpages — `src/pages/projects/vigia.astro`, `src/pages/projects/ai-safety-connect.astro`, `src/pages/en/projects/vigia.astro`, `src/pages/en/projects/ai-safety-connect.astro` — pass `currentPath="/projects"` (or `"/en/projects"`) to `<Header>` so that the *Projects* tab in the primary nav stays active. The `<Header>` then forwards that string verbatim to `<LanguageSwitcher>`, so the switcher computes the cross-locale URL against `/projects` instead of the actual page path (`/projects/vigia`). As a result, clicking ES on `/en/projects/vigia` lands on `/projects` instead of `/projects/vigia`.',
    );
    lines.push('');
    lines.push(
      'Suggested fix: pass two distinct props to `<Header>` — e.g. `navActivePath` (drives Nav highlighting, currently `"/projects"`) and `currentPath` from `Astro.url.pathname` (drives LanguageSwitcher and any other route-sensitive logic). Out of scope for Task #10; flagging for translation-editor or a follow-up i18n task.',
    );
  }
  lines.push('');

  lines.push('## 3. localStorage after switcher click');
  lines.push('');
  lines.push(
    'After each switcher click, asserted `localStorage.getItem(\'aismx_locale\')` equals the locale that was clicked (so future visits to `/` skip auto-detection per architecture §5).',
  );
  lines.push('');
  if (results.storageFailures.length === 0) {
    lines.push('All clicks wrote the correct locale to storage. ✅');
  } else {
    lines.push('| From | Expected | Got |');
    lines.push('|---|---|---|');
    for (const f of results.storageFailures) {
      lines.push(`| \`${f.from}\` | \`${f.expected}\` | \`${f.got}\` |`);
    }
  }
  lines.push('');

  lines.push('## 4. Browser-language detection on `/`');
  lines.push('');
  lines.push(
    'Used distinct Playwright `BrowserContext`s with `locale:` set, cleared `localStorage` before reloading `/`, and checked the post-script pathname. Detection script lives in `BaseLayout.astro` and only runs when `pathname === \'/\'`.',
  );
  lines.push('');
  if (results.detectionFailures.length === 0) {
    lines.push('All detection cases behaved correctly. ✅');
  } else {
    lines.push('| Case | Expected | Got |');
    lines.push('|---|---|---|');
    for (const f of results.detectionFailures) {
      lines.push(`| ${f.case} | \`${f.expected}\` | \`${f.got}\` |`);
    }
  }
  lines.push('');

  lines.push('## Methodology notes');
  lines.push('');
  lines.push('- Build: `astro build` → `dist/` (trailingSlash: never, format: directory).');
  lines.push('- Server: `http-server dist -p 5092` on `127.0.0.1`.');
  lines.push(
    '- Anchor classification: `mailto:`, `tel:`, `http(s)://`, in-page `#…`, and shared-asset prefixes (`/images/`, `/Papers/`, `/favicon*`, `/sitemap*`, `/robots.txt`, `/CNAME`) are excluded from the cross-locale check.',
  );
  lines.push(
    '- The `<a>` tags inside `.lang-switcher` are *also* excluded from the cross-locale check — the inactive-locale option is deliberately a cross-locale link (that\'s the switcher\'s entire purpose). They are exercised separately under check #2.',
  );
  lines.push(
    '- Path normalisation: `/en` and `/en/` are treated as equivalent (the server 301s no-slash → slash; both are acceptable cross-locale targets).',
  );
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await checkEnLinks(page);
    await checkSwitcher(page);
    await ctx.close();
    await checkDetection(browser);
  } finally {
    await browser.close();
  }
  const report = renderReport();
  const outPath = 'docs/QA-I18N-LINKS.md';
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, report, 'utf8');
  console.log(report);

  const totalFail =
    results.enLinksFail +
    results.switcherFail +
    results.storageFail +
    results.detectionFail;
  process.exit(totalFail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('FATAL', err);
  process.exit(2);
});
