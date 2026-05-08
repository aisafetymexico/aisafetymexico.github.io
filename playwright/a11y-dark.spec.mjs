// Dark-mode subtle accessibility audit using @axe-core/playwright
// Runs axe against all 12 production routes and writes a JSON summary.
// Output: playwright/a11y-dark-results.json
//
// Usage:
//   A11Y_PORT=5082 node playwright/a11y-dark.spec.mjs
//
// Assumes `astro preview` is serving `dist/` on PORT (default 5082).

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.A11Y_PORT || '5082';
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/research', name: 'research' },
  { path: '/programs', name: 'programs' },
  { path: '/projects', name: 'projects' },
  { path: '/projects/vigia', name: 'projects-vigia' },
  { path: '/projects/ai-safety-connect', name: 'projects-ai-safety-connect' },
  { path: '/team', name: 'team' },
  { path: '/activities', name: 'activities' },
  { path: '/get-involved', name: 'get-involved' },
  { path: '/contact', name: 'contact' },
  { path: '/global-south-challenge', name: 'global-south-challenge' },
];

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 800 },
  { label: 'desktop', width: 1440, height: 900 },
];

function severityOf(impact) {
  // axe impact: minor | moderate | serious | critical
  return impact || 'unknown';
}

async function auditRoute(browser, route, viewport) {
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await ctx.newPage();
  const url = `${BASE}${route.path}`;
  const result = {
    route: route.path,
    name: route.name,
    viewport: viewport.label,
    url,
    httpStatus: null,
    error: null,
    violations: [],
    passes: 0,
    incomplete: 0,
    inapplicable: 0,
  };
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    result.httpStatus = resp ? resp.status() : null;
    // Allow JS / fonts to settle
    await page.waitForTimeout(800);
    const axe = new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']);
    const r = await axe.analyze();
    result.violations = r.violations.map((v) => ({
      id: v.id,
      impact: severityOf(v.impact),
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodeCount: v.nodes.length,
      sampleNodes: v.nodes.slice(0, 3).map((n) => ({
        target: n.target,
        html: n.html ? n.html.slice(0, 240) : '',
        failureSummary: n.failureSummary,
      })),
    }));
    result.passes = r.passes.length;
    result.incomplete = r.incomplete.length;
    result.inapplicable = r.inapplicable.length;
  } catch (err) {
    result.error = String(err && err.message ? err.message : err);
  } finally {
    await ctx.close();
  }
  return result;
}

async function main() {
  const browser = await chromium.launch();
  const all = [];
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      process.stdout.write(`axe ${route.path} (${vp.label})... `);
      const r = await auditRoute(browser, route, vp);
      const crit = r.violations.filter((v) => v.impact === 'critical').length;
      const ser = r.violations.filter((v) => v.impact === 'serious').length;
      const mod = r.violations.filter((v) => v.impact === 'moderate').length;
      const min = r.violations.filter((v) => v.impact === 'minor').length;
      console.log(
        r.error
          ? `ERROR: ${r.error}`
          : `status=${r.httpStatus} viol=${r.violations.length} (crit=${crit} ser=${ser} mod=${mod} min=${min})`,
      );
      all.push(r);
    }
  }
  await browser.close();

  // Aggregate
  const summary = {
    base: BASE,
    timestamp: new Date().toISOString(),
    routeCount: ROUTES.length,
    viewports: VIEWPORTS.map((v) => v.label),
    totals: {
      violations: all.reduce((a, r) => a + r.violations.length, 0),
      critical: all.reduce(
        (a, r) => a + r.violations.filter((v) => v.impact === 'critical').length,
        0,
      ),
      serious: all.reduce(
        (a, r) => a + r.violations.filter((v) => v.impact === 'serious').length,
        0,
      ),
      moderate: all.reduce(
        (a, r) => a + r.violations.filter((v) => v.impact === 'moderate').length,
        0,
      ),
      minor: all.reduce(
        (a, r) => a + r.violations.filter((v) => v.impact === 'minor').length,
        0,
      ),
    },
    results: all,
  };

  const outDir = resolve(__dirname);
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, 'a11y-dark-results.json');
  await writeFile(outFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\nWrote ${outFile}`);
  console.log(
    `TOTAL violations: ${summary.totals.violations} (crit=${summary.totals.critical} ser=${summary.totals.serious} mod=${summary.totals.moderate} min=${summary.totals.minor})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
