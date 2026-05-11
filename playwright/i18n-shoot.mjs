// Visual QA Playwright spec for AI Safety Mexico i18n rollout.
// Captures full-page screenshots @ 1440px for 12 routes × 2 locales = 24 PNGs.
// Also extracts visible-body text per route for vision-light heuristic checks.
//
// Run with: node playwright/i18n-shoot.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5091';
const OUT_ROOT = path.resolve('playwright/i18n');

const routes = [
  { slug: 'home', path: '' },
  { slug: 'about', path: '/about' },
  { slug: 'research', path: '/research' },
  { slug: 'programs', path: '/programs' },
  { slug: 'projects', path: '/projects' },
  { slug: 'projects-vigia', path: '/projects/vigia' },
  { slug: 'projects-ai-safety-connect', path: '/projects/ai-safety-connect' },
  { slug: 'team', path: '/team' },
  { slug: 'activities', path: '/activities' },
  { slug: 'get-involved', path: '/get-involved' },
  { slug: 'contact', path: '/contact' },
  { slug: 'global-south-challenge', path: '/global-south-challenge' },
];

const locales = ['es', 'en'];

function urlFor(locale, p) {
  // Spanish at root; English under /en.
  if (locale === 'es') return BASE_URL + (p || '/');
  return BASE_URL + '/en' + (p || '');
}

async function main() {
  await fs.mkdir(OUT_ROOT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const locale of locales) {
    const dir = path.join(OUT_ROOT, locale);
    await fs.mkdir(dir, { recursive: true });

    // Per-locale context: send a matching Accept-Language so the
    // browser-language detection on `/` doesn't redirect ES → /en.
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      locale: locale === 'es' ? 'es-MX' : 'en-US',
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = urlFor(locale, route.path);
      const file = path.join(dir, `${route.slug}-1440.png`);
      const entry = {
        locale,
        slug: route.slug,
        url,
        file: path.relative(process.cwd(), file),
      };
      try {
        const resp = await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 25000,
        });
        await page.waitForTimeout(400);
        entry.status = resp?.status() ?? 0;

        // Capture title, html lang attribute, and visible body text.
        entry.htmlLang = await page
          .locator('html')
          .getAttribute('lang')
          .catch(() => null);
        entry.title = await page.title().catch(() => '');

        // Visible nav/header/footer text — helps spot un-translated chrome.
        entry.headerText = (
          await page
            .locator('header')
            .first()
            .innerText()
            .catch(() => '')
        ).slice(0, 800);
        entry.footerText = (
          await page
            .locator('footer')
            .first()
            .innerText()
            .catch(() => '')
        ).slice(0, 800);

        // Main body text — first ~4000 chars is enough to spot stray Spanish.
        entry.bodyText = (
          await page
            .locator('main')
            .first()
            .innerText()
            .catch(() => '')
        ).slice(0, 6000);

        // LanguageSwitcher presence: any element with data-language-switcher or visible ES/EN buttons.
        entry.switcherCount = await page
          .locator('[data-language-switcher], .language-switcher, a[hreflang]')
          .count()
          .catch(() => 0);

        // hreflang alternate link tags in <head>.
        entry.hreflangLinks = await page
          .locator('link[rel="alternate"][hreflang]')
          .evaluateAll((els) =>
            els.map((e) => ({
              hreflang: e.getAttribute('hreflang'),
              href: e.getAttribute('href'),
            })),
          )
          .catch(() => []);

        await page.screenshot({ path: file, fullPage: true });
        console.log(
          `OK  ${locale} ${route.slug.padEnd(28)}  ${entry.status}  -> ${file}`,
        );
      } catch (err) {
        entry.status = 'ERR';
        entry.error = err.message;
        console.log(`ERR ${locale} ${route.slug}  ${err.message}`);
      }
      results.push(entry);
    }
    await context.close();
  }

  await browser.close();
  await fs.writeFile(
    path.join(OUT_ROOT, 'index.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(`\nWrote ${results.length} screenshots to ${OUT_ROOT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
