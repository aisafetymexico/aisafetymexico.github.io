// Direct HTML audit for chrome-leak bugs not visible to body text extraction.
// Curls each route, greps for hardcoded strings and missing tags.
import fs from 'node:fs/promises';

const BASE = 'http://127.0.0.1:5091';
const routes = [
  '', '/about', '/research', '/programs', '/projects',
  '/projects/vigia', '/projects/ai-safety-connect', '/team',
  '/activities', '/get-involved', '/contact', '/global-south-challenge',
];

const out = [];

for (const locale of ['es', 'en']) {
  for (const p of routes) {
    const url = locale === 'es' ? BASE + (p || '/') : BASE + '/en' + (p || '');
    const html = await fetch(url).then((r) => r.text());

    const langAttr = html.match(/<html[^>]+lang="([^"]+)"/)?.[1];
    const skip = html.match(/class="skip-link"[^>]*>([^<]+)</)?.[1];
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
    const ogLocale = html.match(/og:locale" content="([^"]+)"/)?.[1];
    const hrefLangCount = (html.match(/rel="alternate"[^>]+hreflang/g) || []).length;
    const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];

    // Look for raw Spanish chrome words on EN pages
    const enBodyOnly = html.replace(/<head[\s\S]*?<\/head>/i, '');
    const esLeakChromeRaw = [];
    if (locale === 'en') {
      for (const [word, label] of [
        ['Saltar al contenido', 'skip-link'],
        ['Sobre nosotros', 'nav About'],
        ['Investigación', 'nav Research'],
        ['Colabora', 'nav Get-involved'],
        ['Volver al inicio', 'cta Back home'],
        ['Saber más', 'cta Learn more'],
        ['Leer más', 'cta Read more'],
        ['Inicio', 'nav Home (could be brand-safe)'],
        ['Investigación, educación y gobernanza', 'footer tagline'],
        ['Todos los derechos reservados', 'copyright'],
        ['Migas de pan', 'breadcrumb aria'],
        ['Atrás', 'breadcrumb Back'],
        ['Abrir menú', 'mobile open'],
        ['Cerrar menú', 'mobile close'],
        ['Navegación principal', 'nav aria'],
      ]) {
        if (enBodyOnly.includes(word)) esLeakChromeRaw.push(label + ': "' + word + '"');
      }
    }
    const enLeakChromeRaw = [];
    if (locale === 'es') {
      for (const [word, label] of [
        ['Skip to content', 'skip-link'],
        ['About us', 'nav About'],
        ['Get involved', 'nav Get-involved'],
        ['Back to home', 'cta Back home'],
        ['Learn more', 'cta Learn more'],
        ['Read more', 'cta Read more'],
        ['All rights reserved', 'copyright'],
        ['Open main menu', 'mobile open'],
        ['Close main menu', 'mobile close'],
        ['Primary navigation', 'nav aria'],
        ['Breadcrumb', 'breadcrumb aria'],
      ]) {
        // Allow JS literals for fallback labels
        const idx = enBodyOnly.indexOf(word);
        if (idx >= 0) {
          // Crude: ignore matches inside <script> blocks (mobile-menu JS contains fallback strings).
          const before = enBodyOnly.slice(Math.max(0, idx - 200), idx);
          if (!/<script[^>]*>[^<]*$/.test(before))
            enLeakChromeRaw.push(label + ': "' + word + '"');
        }
      }
    }

    out.push({
      locale, route: p || '/', url,
      langAttr, skipLink: skip,
      title, desc, ogLocale,
      hrefLangCount, canonical,
      enLeakChromeRaw, esLeakChromeRaw,
    });
  }
}

await fs.writeFile('playwright/i18n/html-audit.json', JSON.stringify(out, null, 2));

// pretty-print
console.log('locale route                              lang   skipLink                  hreflang ogLocale  issues');
for (const o of out) {
  const issues = [];
  const expected = o.locale;
  if (o.langAttr !== expected) issues.push(`lang=${o.langAttr}`);
  if (o.locale === 'en' && o.skipLink !== 'Skip to content') issues.push(`skipLink="${o.skipLink}"`);
  if (o.locale === 'es' && o.skipLink !== 'Saltar al contenido') issues.push(`skipLink="${o.skipLink}"`);
  if (o.hrefLangCount === 0) issues.push('no hreflang in head');
  if (o.locale === 'en' && o.ogLocale !== 'en_US') issues.push(`og:locale=${o.ogLocale}`);
  if (o.locale === 'es' && o.ogLocale !== 'es_MX') issues.push(`og:locale=${o.ogLocale}`);
  if (o.enLeakChromeRaw?.length) issues.push('EN-on-ES: ' + o.enLeakChromeRaw.join('; '));
  if (o.esLeakChromeRaw?.length) issues.push('ES-on-EN: ' + o.esLeakChromeRaw.join('; '));
  console.log(
    `${o.locale.padEnd(6)} ${o.route.padEnd(34)} ${(o.langAttr||'').padEnd(6)} ${(o.skipLink||'').padEnd(26)} ${String(o.hrefLangCount).padEnd(8)} ${(o.ogLocale||'').padEnd(8)}  ${issues.join(' | ') || '—'}`
  );
}

const total = out.length;
const withIssues = out.filter((o) => {
  if (o.langAttr !== o.locale) return true;
  if (o.locale === 'en' && o.skipLink !== 'Skip to content') return true;
  if (o.locale === 'es' && o.skipLink !== 'Saltar al contenido') return true;
  if (o.hrefLangCount === 0) return true;
  if (o.locale === 'en' && o.ogLocale !== 'en_US') return true;
  if (o.locale === 'es' && o.ogLocale !== 'es_MX') return true;
  if (o.enLeakChromeRaw?.length || o.esLeakChromeRaw?.length) return true;
  return false;
}).length;
console.log(`\n${withIssues}/${total} routes with issues`);
