// Captures screenshots of inspiration sites at multiple viewports.
// Output: docs/inspiration/{site}-{viewport}.png
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'docs', 'inspiration');

const SITES = [
  { name: 'rand', url: 'https://www.rand.org/' },
  { name: 'coefficient-giving', url: 'https://www.coefficientgiving.org/' },
  { name: 'anthropic', url: 'https://www.anthropic.com/' },
  { name: 'futureoflife', url: 'https://futureoflife.org/' },
  { name: 'gov-uk', url: 'https://www.gov.uk/' },
];

const VIEWPORTS = [
  { label: '375', width: 375, height: 800 },
  { label: '768', width: 768, height: 1024 },
  { label: '1440', width: 1440, height: 900 },
];

async function captureSite(browser, site) {
  const results = [];
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      deviceScaleFactor: 1,
      locale: 'en-US',
    });
    const page = await context.newPage();
    const target = resolve(OUT_DIR, `${site.name}-${vp.label}.png`);
    try {
      await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // Allow lazy assets / fonts to settle a bit.
      await page.waitForTimeout(3500);
      // Capture viewport-level "above the fold" screenshot for layout patterns.
      await page.screenshot({ path: target, fullPage: false });
      results.push({ site: site.name, vp: vp.label, ok: true, path: target });
      console.log(`OK   ${site.name} @ ${vp.label} -> ${target}`);
    } catch (err) {
      results.push({ site: site.name, vp: vp.label, ok: false, error: String(err.message || err) });
      console.warn(`FAIL ${site.name} @ ${vp.label}: ${err.message || err}`);
    } finally {
      await context.close();
    }
  }
  return results;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const all = [];
  try {
    for (const site of SITES) {
      const r = await captureSite(browser, site);
      all.push(...r);
    }
  } finally {
    await browser.close();
  }
  const okCount = all.filter((r) => r.ok).length;
  const failCount = all.length - okCount;
  console.log(`\nDone. ${okCount} ok, ${failCount} failed.`);
  if (failCount > 0) {
    console.log('\nFailures:');
    all.filter((r) => !r.ok).forEach((r) => console.log(` - ${r.site}@${r.vp}: ${r.error}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
