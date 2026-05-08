// Captures detailed RAND.org screenshots for aesthetic research.
// Output: docs/inspiration/rand-detailed/{slug}-1440.png
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'docs', 'inspiration', 'rand-detailed');

const PAGES = [
  { slug: 'home', url: 'https://www.rand.org/' },
  { slug: 'about', url: 'https://www.rand.org/about.html' },
  { slug: 'research', url: 'https://www.rand.org/research.html' },
  { slug: 'topics', url: 'https://www.rand.org/topics.html' },
  // a research/publication page
  { slug: 'publication', url: 'https://www.rand.org/pubs/research_reports/RRA3056-1.html' },
];

async function captureFull(browser, p) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    deviceScaleFactor: 1,
    locale: 'en-US',
  });
  const page = await context.newPage();
  // Above-the-fold viewport
  const targetTop = resolve(OUT_DIR, `${p.slug}-1440.png`);
  // Full page (for sections)
  const targetFull = resolve(OUT_DIR, `${p.slug}-1440-full.png`);
  try {
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: targetTop, fullPage: false });
    await page.screenshot({ path: targetFull, fullPage: true });
    console.log(`OK ${p.slug} -> ${targetTop} & ${targetFull}`);
  } catch (err) {
    console.warn(`FAIL ${p.slug}: ${err.message || err}`);
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const p of PAGES) {
      await captureFull(browser, p);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
