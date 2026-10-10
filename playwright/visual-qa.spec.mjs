// Visual QA Playwright spec for AI Safety Mexico Astro rebuild.
// Captures full-page screenshots of every route in 3 viewports.
// Run with: node playwright/visual-qa.spec.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4323';
const OUT_DIR = path.resolve('playwright/screenshots');

const routes = [
  { url: '/', slug: 'home' },
  { url: '/about', slug: 'about' },
  { url: '/research', slug: 'research' },
  { url: '/programs', slug: 'programs' },
  { url: '/projects', slug: 'projects' },
  { url: '/projects/vigia', slug: 'projects-vigia' },
  { url: '/projects/ai-safety-connect', slug: 'projects-ai-safety-connect' },
  { url: '/team', slug: 'team' },
  { url: '/activities', slug: 'activities' },
  { url: '/get-involved', slug: 'get-involved' },
  { url: '/contact', slug: 'contact' },
];

const viewports = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const dir = path.join(OUT_DIR, route.slug);
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, `${vp.name}.png`);
      const url = BASE_URL + route.url;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        // Wait briefly for fonts and images.
        await page.waitForTimeout(400);
        await page.screenshot({ path: file, fullPage: true });
        results.push({ route: route.url, viewport: vp.name, status: resp?.status() ?? 'noresp', file });
        console.log(`OK  ${vp.name.padEnd(4)}  ${route.url.padEnd(30)}  -> ${file}`);
      } catch (err) {
        results.push({ route: route.url, viewport: vp.name, status: 'ERR', error: err.message, file });
        console.log(`ERR ${vp.name.padEnd(4)}  ${route.url.padEnd(30)}  ${err.message}`);
      }
    }

    await context.close();
  }
  await browser.close();
  await fs.writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} screenshots`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
