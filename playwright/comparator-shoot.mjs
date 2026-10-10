// Comparator screenshot script — captures our routes at 1440px (above-fold + full).
// Run with: node playwright/comparator-shoot.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5050';
const OUT_DIR = path.resolve('playwright/comparator/ours');

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
  { url: '/global-south-challenge', slug: 'global-south-challenge' },
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const route of routes) {
    const url = BASE_URL + route.url;
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(500);
      // Above-fold (viewport)
      await page.screenshot({
        path: path.join(OUT_DIR, `${route.slug}-1440.png`),
        fullPage: false,
      });
      // Full-page
      await page.screenshot({
        path: path.join(OUT_DIR, `${route.slug}-1440-full.png`),
        fullPage: true,
      });
      console.log(`OK  ${route.url.padEnd(40)} ${resp?.status() ?? 'noresp'}`);
    } catch (err) {
      console.log(`ERR ${route.url}  ${err.message}`);
    }
  }
  await context.close();
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
