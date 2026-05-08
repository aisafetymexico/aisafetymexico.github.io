// Lightweight perf audit via Playwright — measures FCP, LCP, CLS, transferred bytes
// for each route. Approximates Lighthouse perf scoring (heuristic, not a substitute).
import { chromium } from 'playwright';

const ROUTES = [
  '/', '/about', '/research', '/programs', '/projects',
  '/projects/vigia', '/projects/ai-safety-connect',
  '/team', '/activities', '/get-involved', '/contact',
];
const BASE = 'http://localhost:4321';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1366, height: 768 },
  userAgent: 'Mozilla/5.0 PerfAudit',
});

const results = [];
for (const route of ROUTES) {
  const page = await context.newPage();
  let transferBytes = 0;
  page.on('response', async (resp) => {
    try {
      const buf = await resp.body();
      transferBytes += buf.length;
    } catch {}
  });
  const url = BASE + route;
  const t0 = Date.now();
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  const status = resp ? resp.status() : 0;
  // Wait briefly for late-loading observers
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const fcp = paints.find(p => p.name === 'first-contentful-paint')?.startTime ?? null;
    const lcp = (window.__lcpObserved ?? null);
    const cls = (window.__clsValue ?? 0);
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
      load: nav?.loadEventEnd ?? null,
      ttfb: nav?.responseStart ?? null,
      fcp,
      lcp,
      cls,
      transferSize: nav?.transferSize ?? null,
      encodedSize: nav?.encodedBodySize ?? null,
      decodedSize: nav?.decodedBodySize ?? null,
      resourceCount: performance.getEntriesByType('resource').length,
      domNodes: document.querySelectorAll('*').length,
    };
  });
  // We didn't preregister observers above — re-measure with a second pass that does.
  await page.close();

  // Second pass: full LCP/CLS via observer.
  const page2 = await context.newPage();
  await page2.addInitScript(() => {
    window.__lcpObserved = 0;
    window.__clsValue = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcpObserved = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__clsValue += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  let bytes2 = 0;
  page2.on('response', async (resp) => { try { bytes2 += (await resp.body()).length; } catch {} });
  await page2.goto(url, { waitUntil: 'load', timeout: 20000 });
  await page2.waitForTimeout(1500);
  const m2 = await page2.evaluate(() => ({
    lcp: window.__lcpObserved,
    cls: window.__clsValue,
    fcp: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime ?? null,
    domNodes: document.querySelectorAll('*').length,
    resourceCount: performance.getEntriesByType('resource').length,
  }));
  await page2.close();

  results.push({
    route,
    status,
    bytes: bytes2,
    fcp: Math.round(m2.fcp ?? 0),
    lcp: Math.round(m2.lcp ?? 0),
    cls: +(m2.cls ?? 0).toFixed(3),
    domNodes: m2.domNodes,
    resourceCount: m2.resourceCount,
    elapsed: Date.now() - t0,
  });
  console.log(JSON.stringify(results.at(-1)));
}
await browser.close();
console.log('---SUMMARY---');
console.log(JSON.stringify(results, null, 2));
